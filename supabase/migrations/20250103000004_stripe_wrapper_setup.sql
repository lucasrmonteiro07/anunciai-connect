-- Setup for Stripe Wrapper extension
-- This assumes you have the Stripe Wrapper extension installed

-- Create a function to handle subscription updates using Stripe Wrapper
CREATE OR REPLACE FUNCTION public.handle_stripe_webhook()
RETURNS TRIGGER AS $func$
DECLARE
  user_email TEXT;
  user_id UUID;
  is_active BOOLEAN;
  subscription_end TIMESTAMP WITH TIME ZONE;
  subscription_start TIMESTAMP WITH TIME ZONE;
  subscription_tier TEXT;
BEGIN
  -- Get user email from Stripe customer
  SELECT email INTO user_email
  FROM stripe.customers
  WHERE id = NEW.customer_id;
  
  -- Find user in auth.users
  SELECT id INTO user_id
  FROM auth.users
  WHERE email = user_email;
  
  IF user_id IS NULL THEN
    RAISE NOTICE 'User not found for email: %', user_email;
    RETURN NEW;
  END IF;
  
  -- Determine subscription status and details
  is_active := (NEW.status = 'active');
  
  IF is_active THEN
    subscription_start := to_timestamp(NEW.current_period_start);
    subscription_end := to_timestamp(NEW.current_period_end);
    
    -- Determine tier based on price
    IF NEW.amount <= 1490 THEN
      subscription_tier := 'VIP';
    ELSE
      subscription_tier := 'VIP Premium';
    END IF;
  ELSE
    subscription_start := NULL;
    subscription_end := NULL;
    subscription_tier := NULL;
  END IF;
  
  -- Update user VIP status
  PERFORM public.update_user_vip_status(
    user_id,
    is_active,
    subscription_start,
    subscription_end,
    subscription_tier
  );
  
  RAISE NOTICE 'Updated VIP status for user %: %', user_email, is_active;
  
  RETURN NEW;
END;
$func$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for subscription changes
DROP TRIGGER IF EXISTS stripe_subscription_trigger ON stripe.subscriptions;
CREATE TRIGGER stripe_subscription_trigger
  AFTER INSERT OR UPDATE ON stripe.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_stripe_webhook();

-- Create a simple webhook handler function
CREATE OR REPLACE FUNCTION public.stripe_webhook_handler(event_data JSONB)
RETURNS JSONB AS $func$
DECLARE
  event_type TEXT;
  subscription_data JSONB;
  customer_data JSONB;
  user_email TEXT;
  user_id UUID;
  is_active BOOLEAN;
  subscription_end TIMESTAMP WITH TIME ZONE;
  subscription_start TIMESTAMP WITH TIME ZONE;
  subscription_tier TEXT;
BEGIN
  event_type := event_data->>'type';
  
  RAISE NOTICE 'Processing Stripe webhook event: %', event_type;
  
  CASE event_type
    WHEN 'customer.subscription.created', 'customer.subscription.updated' THEN
      subscription_data := event_data->'data'->'object';
      
      -- Get customer email
      SELECT email INTO user_email
      FROM stripe.customers
      WHERE id = (subscription_data->>'customer');
      
      -- Find user
      SELECT id INTO user_id
      FROM auth.users
      WHERE email = user_email;
      
      IF user_id IS NOT NULL THEN
        is_active := (subscription_data->>'status' = 'active');
        
        IF is_active THEN
          subscription_start := to_timestamp((subscription_data->>'current_period_start')::bigint);
          subscription_end := to_timestamp((subscription_data->>'current_period_end')::bigint);
          
          -- Determine tier (simplified)
          subscription_tier := 'VIP';
        ELSE
          subscription_start := NULL;
          subscription_end := NULL;
          subscription_tier := NULL;
        END IF;
        
        -- Update VIP status
        PERFORM public.update_user_vip_status(
          user_id,
          is_active,
          subscription_start,
          subscription_end,
          subscription_tier
        );
        
        RAISE NOTICE 'Updated VIP status for user %: %', user_email, is_active;
      END IF;
      
    WHEN 'customer.subscription.deleted' THEN
      subscription_data := event_data->'data'->'object';
      
      -- Get customer email
      SELECT email INTO user_email
      FROM stripe.customers
      WHERE id = (subscription_data->>'customer');
      
      -- Find user and remove VIP status
      SELECT id INTO user_id
      FROM auth.users
      WHERE email = user_email;
      
      IF user_id IS NOT NULL THEN
        PERFORM public.update_user_vip_status(
          user_id,
          false,
          NULL,
          NULL,
          NULL
        );
        
        RAISE NOTICE 'Removed VIP status for user %', user_email;
      END IF;
      
    ELSE
      RAISE NOTICE 'Unhandled event type: %', event_type;
  END CASE;
  
  RETURN jsonb_build_object('status', 'success', 'event_type', event_type);
END;
$func$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
