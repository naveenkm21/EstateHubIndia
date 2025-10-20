import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { getPropertyCoordinates } from '@/utils/geocoding';

// Fix for default marker icon issue in React-Leaflet with Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface PropertyMapProps {
  latitude?: number | null;
  longitude?: number | null;
  city?: string;
  address?: string;
  className?: string;
}

const PropertyMap = ({ latitude, longitude, city, address, className = "" }: PropertyMapProps) => {
  // Get coordinates from lat/lng or geocode from city
  const coordinates = getPropertyCoordinates(latitude, longitude, city);

  if (!coordinates) {
    return (
      <div className={`rounded-lg bg-muted/50 flex items-center justify-center ${className}`}>
        <div className="text-center p-8">
          <p className="text-muted-foreground mb-2">📍 Location Map</p>
          <p className="text-sm text-muted-foreground">
            {city ? `Location data for ${city} not available` : 'Location not available'}
          </p>
        </div>
      </div>
    );
  }

  const displayAddress = address || 'Property address';
  const displayCity = city || 'City';

  return (
    <div className={`rounded-lg overflow-hidden ${className}`}>
      <MapContainer
        center={[coordinates.lat, coordinates.lng]}
        zoom={13}
        scrollWheelZoom={false}
        className="w-full h-full min-h-[400px]"
        style={{ zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[coordinates.lat, coordinates.lng]}>
          <Popup>
            <div className="p-2 min-w-[200px]">
              <strong className="block mb-1">Property Location</strong>
              <span className="text-sm text-muted-foreground block">{displayAddress}</span>
              <span className="text-xs text-muted-foreground block mt-1">📍 {displayCity}</span>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default PropertyMap;
