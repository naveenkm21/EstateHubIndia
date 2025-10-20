-- Drop the restrictive agent-only policy
DROP POLICY IF EXISTS "Agents can insert properties" ON public.properties;

-- Create a new policy that allows any authenticated user to insert properties
CREATE POLICY "Authenticated users can insert their own properties"
ON public.properties
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = agent_id);