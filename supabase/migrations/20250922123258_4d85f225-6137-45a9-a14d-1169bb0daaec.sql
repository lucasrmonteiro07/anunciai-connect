-- Security Fix: Secure services_public table and ensure contact info protection
-- The services_public table should not be publicly accessible since it contains sensitive contact information

-- Update RLS policy on services_public to prevent any public access
-- Only the sync trigger should be able to write to this table
DROP POLICY IF EXISTS "Owners and admins can view services_public" ON public.services_public;

-- Create a more restrictive policy - only allow access to service owners and admins
-- This prevents any unauthorized public access to contact information
CREATE POLICY "Only service owners and admins can access services_public" 
ON public.services_public 
FOR SELECT 
USING (
  -- Only allow access if user is authenticated AND (is the owner OR is admin)
  auth.uid() IS NOT NULL AND 
  (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role))
);

-- Ensure no public insert/update/delete access to services_public
CREATE POLICY "No public writes to services_public" 
ON public.services_public 
FOR ALL 
USING (false) 
WITH CHECK (false);

-- Make sure the services_public_safe view is the only way to access public service data
-- Grant specific permissions
REVOKE ALL ON public.services_public FROM anon;
REVOKE ALL ON public.services_public FROM authenticated;

-- Only grant select on the safe view to public users
GRANT SELECT ON public.services_public_safe TO anon;
GRANT SELECT ON public.services_public_safe TO authenticated;

-- Add security comment
COMMENT ON TABLE public.services_public IS 'Internal table containing sensitive contact information. Access restricted to service owners and admins only. Public access should use services_public_safe view instead.';