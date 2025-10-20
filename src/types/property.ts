export interface Property {
  id: string;
  title: string;
  description: string | null;
  price: number;
  property_type: string;
  bedrooms: number | null;
  bathrooms: number | null;
  square_feet: number | null;
  address: string;
  city: string;
  state: string;
  zip_code: string | null;
  latitude: number | null;
  longitude: number | null;
  images: string[];
  status: string;
  is_featured: boolean;
  agent_id: string | null;
  created_at: string;
  updated_at: string;
  property_category?: string;
  listing_type?: string;
  furnishing_status?: string;
  floor_number?: number;
  total_floors?: number;
  parking_spaces?: number;
  amenities?: string[];
  profiles?: {
    full_name: string | null;
    phone: string | null;
    business_name?: string | null;
    years_experience?: number | null;
  };
}

export interface SearchFilters {
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  propertyType?: string;
  minBedrooms?: number;
  minBathrooms?: number;
  minSquareFeet?: number;
  maxSquareFeet?: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'agent' | 'buyer_seller';
  avatar?: string;
  phone?: string;
  bio?: string;
  business_name?: string;
  license_number?: string;
  years_experience?: number;
  specializations?: string[];
  service_areas?: string[];
  createdAt: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: 'agent' | 'buyer_seller';
  created_at: string;
  updated_at: string;
}