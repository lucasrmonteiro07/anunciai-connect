-- Add subscription start and end dates to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS subscription_start TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS subscription_end TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS subscription_tier TEXT;

-- Update the check-subscription function to handle subscription dates
CREATE OR REPLACE FUNCTION public.update_user_vip_status(
  user_id UUID,
  is_vip BOOLEAN,
  subscription_start TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  subscription_end TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  subscription_tier TEXT DEFAULT NULL
)
RETURNS VOID AS $func$
BEGIN
  UPDATE public.profiles 
  SET 
    is_vip = is_vip,
    subscription_start = subscription_start,
    subscription_end = subscription_end,
    subscription_tier = subscription_tier,
    updated_at = NOW()
  WHERE id = user_id;
  
  -- If no profile exists, create one
  IF NOT FOUND THEN
    INSERT INTO public.profiles (
      id, 
      is_vip, 
      subscription_start, 
      subscription_end, 
      subscription_tier,
      created_at,
      updated_at
    ) VALUES (
      user_id, 
      is_vip, 
      subscription_start, 
      subscription_end, 
      subscription_tier,
      NOW(),
      NOW()
    );
  END IF;
END;
$func$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create a function to check if subscription is still valid
CREATE OR REPLACE FUNCTION public.is_subscription_active(user_id UUID)
RETURNS BOOLEAN AS $func2$
DECLARE
  subscription_end_date TIMESTAMP WITH TIME ZONE;
  is_vip_status BOOLEAN;
BEGIN
  SELECT subscription_end, is_vip 
  INTO subscription_end_date, is_vip_status
  FROM public.profiles 
  WHERE id = user_id;
  
  -- If no profile or not VIP, return false
  IF NOT FOUND OR NOT is_vip_status THEN
    RETURN FALSE;
  END IF;
  
  -- If no end date, assume it's active (for manual VIP users)
  IF subscription_end_date IS NULL THEN
    RETURN TRUE;
  END IF;
  
  -- Check if subscription has expired
  RETURN subscription_end_date > NOW();
END;
$func2$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://wkchztcfbwnbukpqejix.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)