-- Drop the old check constraint
ALTER TABLE public.properties DROP CONSTRAINT IF EXISTS properties_status_check;

-- Create new check constraint that includes 'available'
ALTER TABLE public.properties ADD CONSTRAINT properties_status_check 
CHECK (status = ANY (ARRAY['active'::text, 'pending'::text, 'sold'::text, 'inactive'::text, 'available'::text]));

-- Update the default to 'active' for consistency
ALTER TABLE public.properties ALTER COLUMN status SET DEFAULT 'active';