-- Update existing properties to use Indian cities and locations

UPDATE public.properties 
SET 
  city = CASE 
    WHEN city = 'Metropolitan City' THEN 'Mumbai'
    WHEN city = 'Suburban Town' THEN 'Pune'
    WHEN city = 'Luxury District' THEN 'Gurgaon'
    ELSE city
  END,
  state = CASE 
    WHEN state = 'NY' THEN 'Maharashtra'
    WHEN state = 'CA' THEN 'Maharashtra'
    WHEN state = 'FL' THEN 'Haryana'
    ELSE state
  END,
  address = CASE 
    WHEN address = '123 Main St' THEN 'Plot 123, Bandra West'
    WHEN address = '456 Oak Ave' THEN 'Flat 456, Koregaon Park'
    WHEN address = '789 Elite Blvd' THEN 'Tower 789, DLF Cyber City'
    ELSE address
  END,
  zip_code = CASE 
    WHEN zip_code = '10001' THEN '400050'
    WHEN zip_code = '90210' THEN '411001'
    WHEN zip_code = '33101' THEN '122002'
    ELSE zip_code
  END,
  price = CASE 
    -- Convert USD to approximate INR (multiply by ~83 and round appropriately)
    WHEN price = 485000 THEN 4850000
    WHEN price = 675000 THEN 6750000  
    WHEN price = 1250000 THEN 12500000
    ELSE price
  END
WHERE city IN ('Metropolitan City', 'Suburban Town', 'Luxury District') 
   OR state IN ('NY', 'CA', 'FL');