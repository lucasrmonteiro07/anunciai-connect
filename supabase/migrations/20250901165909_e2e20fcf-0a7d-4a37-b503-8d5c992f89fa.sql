-- Insert the admin user manually (this will be the specific admin account)
-- We need to create the user through auth, but we can prepare the profile entry
-- The user anunciai@anunciai.app.br with password 2864lljJ@@ needs to be created manually through signup
-- After signup, we'll update their role to admin

-- Create a function to make a user admin
CREATE OR REPLACE FUNCTION public.make_user_admin(user_email TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  target_user_id UUID;
BEGIN
  -- Get user ID from auth.users table
  SELECT id INTO target_user_id
  FROM auth.users
  WHERE email = user_email;
  
  IF target_user_id IS NOT NULL THEN
    -- Remove existing user role
    DELETE FROM public.user_roles WHERE user_id = target_user_id AND role = 'user';
    
    -- Add admin role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (target_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
    
    -- Update profile to be VIP
    UPDATE public.profiles
    SET is_vip = true
    WHERE id = target_user_id;
  END IF;
END;
$$;