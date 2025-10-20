import { Property } from '@/types/property';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Phone, 
  Mail,
  User
} from 'lucide-react';
import { useState } from 'react';

interface PropertyCardProps {
  property: Property;
  onFavorite?: (propertyId: string) => void;
  isFavorited?: boolean;
}

const PropertyCard = ({ property, onFavorite, isFavorited = false }: PropertyCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleImageNavigation = (direction: 'prev' | 'next', e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (direction === 'prev') {
      setCurrentImageIndex((prev) => 
        prev === 0 ? property.images.length - 1 : prev - 1
      );
    } else {
      setCurrentImageIndex((prev) => 
        prev === property.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onFavorite?.(property.id);
  };

  return (
    <Card className="group overflow-hidden hover:shadow-property transition-all duration-300 hover:-translate-y-1">
      {/* Image Carousel */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={property.images[currentImageIndex]}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Image Navigation */}
        {property.images.length > 1 && (
          <>
            <button
              onClick={(e) => handleImageNavigation('prev', e)}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-black/70"
            >
              ←
            </button>
            <button
              onClick={(e) => handleImageNavigation('next', e)}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-black/70"
            >
              →
            </button>
          </>
        )}

        {/* Image Indicators */}
        {property.images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
            {property.images.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}

        {/* Status Badge */}
        <Badge 
          className={`absolute top-3 left-3 ${
            property.status === 'for-sale' ? 'bg-success' : 'bg-primary'
          }`}
        >
          {property.status === 'for-sale' ? 'For Sale' : 'For Rent'}
        </Badge>

        {/* Featured Badge */}
        {property.is_featured && (
          <Badge className="absolute top-3 right-12 bg-accent text-accent-foreground">
            Featured
          </Badge>
        )}

        {/* Favorite Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleFavorite}
          className={`absolute top-3 right-3 w-8 h-8 p-0 rounded-full ${
            isFavorited ? 'bg-destructive text-destructive-foreground' : 'bg-black/50 text-white hover:bg-black/70'
          }`}
        >
          <Heart className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''}`} />
        </Button>

        {/* Views Counter - Removed since not in new schema */}
      </div>

      <CardContent className="p-6">
        {/* Price */}
        <div className="text-2xl font-bold text-primary mb-2">
          {formatPrice(property.price)}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
          {property.title}
        </h3>

        {/* Location */}
        <div className="flex items-center text-muted-foreground mb-4">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">
            {property.city}, {property.state}
          </span>
        </div>

        {/* Property Details */}
        <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Bed className="h-4 w-4 mr-1" />
              <span>{property.bedrooms}</span>
            </div>
            <div className="flex items-center">
              <Bath className="h-4 w-4 mr-1" />
              <span>{property.bathrooms}</span>
            </div>
            {property.square_feet && (
              <div className="flex items-center">
                <Square className="h-4 w-4 mr-1" />
                <span>{property.square_feet.toLocaleString()} sq ft</span>
              </div>
            )}
          </div>
        </div>

        {/* Agent Info */}
        {property.profiles && (
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="text-sm font-medium">{property.profiles.full_name || 'Agent'}</div>
              </div>
            </div>
          
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PropertyCard;