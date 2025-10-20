-- Create visits table for booking property visits
CREATE TABLE public.visits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  property_id UUID NOT NULL,
  visitor_name TEXT NOT NULL,
  visitor_phone TEXT NOT NULL,
  visit_date DATE NOT NULL,
  visit_time TEXT NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;

-- Create policies for visits
CREATE POLICY "Users can view their own visits" 
ON public.visits 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own visits" 
ON public.visits 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own visits" 
ON public.visits 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own visits" 
ON public.visits 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_visits_updated_at
BEFORE UPDATE ON public.visits
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();