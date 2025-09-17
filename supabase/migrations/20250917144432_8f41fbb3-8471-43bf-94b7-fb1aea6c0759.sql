-- Fix remaining function search path security issues
-- Update functions to have immutable search_path to prevent SQL injection

-- Fix has_role function
CREATE OR REPLACE FUNCTION public.has_role(user_id uuid, role_name app_role)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.user_roles 
    WHERE user_roles.user_id = has_role.user_id 
    AND user_roles.role = has_role.role_name
  );
END;
$function$;

-- Fix update_user_vip_status function
CREATE OR REPLACE FUNCTION public.update_user_vip_status(user_id uuid, is_vip boolean, subscription_start timestamp with time zone DEFAULT NULL::timestamp with time zone, subscription_end timestamp with time zone DEFAULT NULL::timestamp with time zone, subscription_tier text DEFAULT NULL::text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
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
$function$;