// Indian city coordinates for geocoding
const INDIAN_CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  // Major Cities
  'mumbai': { lat: 19.0760, lng: 72.8777 },
  'delhi': { lat: 28.7041, lng: 77.1025 },
  'bangalore': { lat: 12.9716, lng: 77.5946 },
  'bengaluru': { lat: 12.9716, lng: 77.5946 },
  'hyderabad': { lat: 17.3850, lng: 78.4867 },
  'chennai': { lat: 13.0827, lng: 80.2707 },
  'kolkata': { lat: 22.5726, lng: 88.3639 },
  'pune': { lat: 18.5204, lng: 73.8567 },
  'ahmedabad': { lat: 23.0225, lng: 72.5714 },
  'jaipur': { lat: 26.9124, lng: 75.7873 },
  'surat': { lat: 21.1702, lng: 72.8311 },
  'lucknow': { lat: 26.8467, lng: 80.9462 },
  'kanpur': { lat: 26.4499, lng: 80.3319 },
  'nagpur': { lat: 21.1458, lng: 79.0882 },
  'indore': { lat: 22.7196, lng: 75.8577 },
  'thane': { lat: 19.2183, lng: 72.9781 },
  'bhopal': { lat: 23.2599, lng: 77.4126 },
  'visakhapatnam': { lat: 17.6868, lng: 83.2185 },
  'pimpri-chinchwad': { lat: 18.6298, lng: 73.7997 },
  'patna': { lat: 25.5941, lng: 85.1376 },
  'vadodara': { lat: 22.3072, lng: 73.1812 },
  'ghaziabad': { lat: 28.6692, lng: 77.4538 },
  'ludhiana': { lat: 30.9010, lng: 75.8573 },
  'agra': { lat: 27.1767, lng: 78.0081 },
  'nashik': { lat: 19.9975, lng: 73.7898 },
  'faridabad': { lat: 28.4089, lng: 77.3178 },
  'meerut': { lat: 28.9845, lng: 77.7064 },
  'rajkot': { lat: 22.3039, lng: 70.8022 },
  'kalyan-dombivli': { lat: 19.2403, lng: 73.1305 },
  'vasai-virar': { lat: 19.4612, lng: 72.7985 },
  'varanasi': { lat: 25.3176, lng: 82.9739 },
  'srinagar': { lat: 34.0837, lng: 74.7973 },
  'aurangabad': { lat: 19.8762, lng: 75.3433 },
  'dhanbad': { lat: 23.7957, lng: 86.4304 },
  'amritsar': { lat: 31.6340, lng: 74.8723 },
  'navi mumbai': { lat: 19.0330, lng: 73.0297 },
  'allahabad': { lat: 25.4358, lng: 81.8463 },
  'prayagraj': { lat: 25.4358, lng: 81.8463 },
  'ranchi': { lat: 23.3441, lng: 85.3096 },
  'howrah': { lat: 22.5958, lng: 88.2636 },
  'coimbatore': { lat: 11.0168, lng: 76.9558 },
  'jabalpur': { lat: 23.1815, lng: 79.9864 },
  'gwalior': { lat: 26.2183, lng: 78.1828 },
  'vijayawada': { lat: 16.5062, lng: 80.6480 },
  'jodhpur': { lat: 26.2389, lng: 73.0243 },
  'madurai': { lat: 9.9252, lng: 78.1198 },
  'raipur': { lat: 21.2514, lng: 81.6296 },
  'kota': { lat: 25.2138, lng: 75.8648 },
  'chandigarh': { lat: 30.7333, lng: 76.7794 },
  'guwahati': { lat: 26.1445, lng: 91.7362 },
  
  // NCR Cities
  'noida': { lat: 28.5355, lng: 77.3910 },
  'greater noida': { lat: 28.4744, lng: 77.5040 },
  'gurugram': { lat: 28.4595, lng: 77.0266 },
  'gurgaon': { lat: 28.4595, lng: 77.0266 },
  
  // Other important cities
  'mysore': { lat: 12.2958, lng: 76.6394 },
  'mysuru': { lat: 12.2958, lng: 76.6394 },
  'dehradun': { lat: 30.3165, lng: 78.0322 },
  'kochi': { lat: 9.9312, lng: 76.2673 },
  'cochin': { lat: 9.9312, lng: 76.2673 },
  'thiruvananthapuram': { lat: 8.5241, lng: 76.9366 },
  'trivandrum': { lat: 8.5241, lng: 76.9366 },
  'bhubaneswar': { lat: 20.2961, lng: 85.8245 },
  'mangalore': { lat: 12.9141, lng: 74.8560 },
  'mangaluru': { lat: 12.9141, lng: 74.8560 },
  'shimla': { lat: 31.1048, lng: 77.1734 },
  'udaipur': { lat: 24.5854, lng: 73.7125 },
};

export interface Coordinates {
  lat: number;
  lng: number;
}

/**
 * Get coordinates for a given city name
 * @param city - City name to geocode
 * @returns Coordinates if found, null otherwise
 */
export const getCityCoordinates = (city: string): Coordinates | null => {
  if (!city) return null;
  
  const normalizedCity = city.toLowerCase().trim();
  return INDIAN_CITY_COORDINATES[normalizedCity] || null;
};

/**
 * Get coordinates from property data
 * Priority: 1) Existing lat/lng, 2) Geocode from city
 * @param latitude - Existing latitude
 * @param longitude - Existing longitude
 * @param city - City name for geocoding
 * @returns Coordinates if available, null otherwise
 */
export const getPropertyCoordinates = (
  latitude?: number | null,
  longitude?: number | null,
  city?: string
): Coordinates | null => {
  // If we have valid coordinates, use them
  if (latitude && longitude) {
    return { lat: latitude, lng: longitude };
  }
  
  // Otherwise, try to geocode from city
  if (city) {
    return getCityCoordinates(city);
  }
  
  return null;
};

/**
 * Format full address for display
 */
export const formatFullAddress = (
  address?: string,
  city?: string,
  state?: string,
  zipCode?: string
): string => {
  const parts = [address, city, state, zipCode].filter(Boolean);
  return parts.join(', ');
};
