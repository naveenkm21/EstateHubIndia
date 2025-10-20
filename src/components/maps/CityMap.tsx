import React, { useMemo } from "react";
import { MapPin } from "lucide-react";

// City places with popular locations
const cityPlaces: Record<string, Array<{ name: string; coords: [number, number] }>> = {
  delhi: [
    { name: "Connaught Place", coords: [28.6315, 77.2167] },
    { name: "India Gate", coords: [28.6129, 77.2295] },
    { name: "Hauz Khas", coords: [28.5494, 77.2001] },
    { name: "Red Fort", coords: [28.6562, 77.2410] },
    { name: "Qutub Minar", coords: [28.5245, 77.1855] },
  ],
  mumbai: [
    { name: "Gateway of India", coords: [18.9220, 72.8347] },
    { name: "Marine Drive", coords: [18.9432, 72.8236] },
    { name: "Bandra", coords: [19.0596, 72.8295] },
    { name: "Juhu Beach", coords: [19.0968, 72.8265] },
    { name: "Colaba", coords: [18.9067, 72.8147] },
  ],
  bangalore: [
    { name: "MG Road", coords: [12.9756, 77.6059] },
    { name: "Koramangala", coords: [12.9352, 77.6245] },
    { name: "Indiranagar", coords: [12.9716, 77.6412] },
    { name: "Whitefield", coords: [12.9698, 77.7499] },
    { name: "HSR Layout", coords: [12.9082, 77.6476] },
  ],
  pune: [
    { name: "Shivajinagar", coords: [18.5304, 73.8567] },
    { name: "Koregaon Park", coords: [18.5362, 73.8958] },
    { name: "Viman Nagar", coords: [18.5679, 73.9143] },
    { name: "Baner", coords: [18.5590, 73.7793] },
    { name: "Kothrud", coords: [18.5074, 73.8077] },
  ],
  hyderabad: [
    { name: "Charminar", coords: [17.3616, 78.4747] },
    { name: "Hitech City", coords: [17.4435, 78.3772] },
    { name: "Banjara Hills", coords: [17.4239, 78.4738] },
    { name: "Jubilee Hills", coords: [17.4239, 78.4199] },
    { name: "Gachibowli", coords: [17.4399, 78.3487] },
  ],
  chennai: [
    { name: "Marina Beach", coords: [13.0499, 80.2824] },
    { name: "T Nagar", coords: [13.0418, 80.2341] },
    { name: "Anna Nagar", coords: [13.0878, 80.2087] },
    { name: "Adyar", coords: [13.0067, 80.2572] },
    { name: "Velachery", coords: [12.9750, 80.2212] },
  ],
};

interface CityMapProps {
  city?: string;
  address?: string;
  latitude?: number | null;
  longitude?: number | null;
  className?: string;
}

const CityMap = ({ city, address, latitude, longitude, className = "" }: CityMapProps) => {
  const { coordinates, locationName, useRandomPlace } = useMemo(() => {
    // If we have exact coordinates, use them
    if (latitude && longitude) {
      return {
        coordinates: [latitude, longitude] as [number, number],
        locationName: address || "Property Location",
        useRandomPlace: false
      };
    }
    
    // Otherwise, fall back to random popular place in the city
    const normalizedCity = city?.toLowerCase() || "delhi";
    const places = cityPlaces[normalizedCity] || cityPlaces.delhi;
    const randomPlace = places[Math.floor(Math.random() * places.length)];
    
    return {
      coordinates: randomPlace.coords,
      locationName: randomPlace.name,
      useRandomPlace: true
    };
  }, [city, address, latitude, longitude]);

  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${coordinates[1]-0.01},${coordinates[0]-0.01},${coordinates[1]+0.01},${coordinates[0]+0.01}&layer=mapnik&marker=${coordinates[0]},${coordinates[1]}`;

  return (
    <div className={`w-full rounded-xl overflow-hidden bg-muted/50 ${className}`}>
      <iframe
        width="100%"
        height="100%"
        frameBorder="0"
        scrolling="no"
        marginHeight={0}
        marginWidth={0}
        src={mapUrl}
        style={{ border: 0, minHeight: '400px' }}
        title={`Map of ${locationName}`}
      />
      <div className="p-4 bg-background/95 backdrop-blur">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          <div>
            <p className="font-semibold">{locationName}</p>
            <p className="text-sm text-muted-foreground">
              {useRandomPlace ? `Popular location in ${city}` : `${city}`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CityMap;
