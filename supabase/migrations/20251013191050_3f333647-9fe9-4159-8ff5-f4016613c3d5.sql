-- Add DELETE policy so users can delete their own properties
CREATE POLICY "Users can delete their own properties"
ON public.properties
FOR DELETE
TO authenticated
USING (auth.uid() = agent_id);