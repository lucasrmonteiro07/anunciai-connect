-- Drop existing policy
DROP POLICY IF EXISTS "Enable read access for all users" ON services_public;

-- Recreate policy with proper permissions
CREATE POLICY "Enable read access for all users" 
ON services_public 
FOR SELECT 
TO anon, authenticated
USING (status = 'active');

-- Grant SELECT permission to anon and authenticated roles
GRANT SELECT ON services_public TO anon;
GRANT SELECT ON services_public TO authenticated;