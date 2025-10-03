-- First, drop ALL existing policies on services_public
DROP POLICY IF EXISTS "Only service owners and admins can access services_public" ON public.services_public;
DROP POLICY IF EXISTS "No public writes to services_public" ON public.services_public;

-- Grant SELECT permission on the view to anon and authenticated users
GRANT SELECT ON public.services_public_safe TO anon, authenticated;

-- Create a new policy on services_public that allows public read for active services
CREATE POLICY "Public can view active services"
  ON public.services_public
  FOR SELECT
  USING (status = 'active');

-- Create policies to block all writes (correct syntax for each operation)
CREATE POLICY "Block all inserts to services_public"
  ON public.services_public
  FOR INSERT
  WITH CHECK (false);

CREATE POLICY "Block all updates to services_public"
  ON public.services_public
  FOR UPDATE
  USING (false);

CREATE POLICY "Block all deletes to services_public"
  ON public.services_public
  FOR DELETE
  USING (false);