-- Drop existing policy
DROP POLICY IF EXISTS "Public read access" ON public.services_public;

-- Create new policy allowing anonymous public read access
CREATE POLICY "Enable read access for all users"
ON public.services_public
FOR SELECT
TO anon, authenticated
USING (status = 'active');