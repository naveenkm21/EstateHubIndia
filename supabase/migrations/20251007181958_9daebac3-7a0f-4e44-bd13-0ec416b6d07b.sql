-- Update RLS policy to allow viewing all profiles with properties
-- Drop the restrictive policy
DROP POLICY IF EXISTS "Users can view agent profiles" ON public.profiles;

-- Create a more permissive policy that shows all profiles that have properties
CREATE POLICY "Anyone can view profiles with properties"
ON public.profiles
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.properties
    WHERE properties.agent_id = profiles.user_id
  )
);