-- Drop the incorrect foreign key constraint
ALTER TABLE public.properties DROP CONSTRAINT IF EXISTS properties_agent_id_fkey;

-- Create the correct foreign key constraint pointing to profiles.user_id
ALTER TABLE public.properties 
ADD CONSTRAINT properties_agent_id_fkey 
FOREIGN KEY (agent_id) REFERENCES public.profiles(user_id) ON DELETE SET NULL;