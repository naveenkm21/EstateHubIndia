import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PropertyCard from '@/components/properties/PropertyCard';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Property } from '@/types/property';
import { Heart, ArrowRight } from 'lucide-react';

const Favorites = () => {
  const { user, loading: authLoading } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (user) {
        fetchFavorites();
      } else {
        setLoading(false);
      }
    }
  }, [user, authLoading]);

  const fetchFavorites = async () => {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          properties (
            id,
            title,
            description,
            price,
            property_type,
            bedrooms,
            bathrooms,
            square_feet,
            address,
            city,
            state,
            images,
            status,
            profiles (
              full_name
            )
          )
        `)
        .eq('user_id', user?.id);

      if (error) throw error;

      const favoriteProperties = data
        .map(item => item.properties)
        .filter(Boolean) as Property[];
      
      setProperties(favoriteProperties);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (propertyId: string) => {
    if (!user) return;

    try {
      await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('property_id', propertyId);

      setProperties(prev => prev.filter(p => p.id !== propertyId));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-96 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-3xl font-bold mb-4">Sign In to View Favorites</h1>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Create an account or sign in to save your favorite properties and view them here.
            </p>
            <Button asChild>
              <Link to="/auth">
                Sign In
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Favorites</h1>
          <p className="text-muted-foreground">
            {properties.length === 0 
              ? "You haven't saved any favorites yet." 
              : `You have ${properties.length} favorite ${properties.length === 1 ? 'property' : 'properties'}.`
            }
          </p>
        </div>

        {properties.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-semibold mb-4">No favorites yet</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Start browsing properties and save your favorites by clicking the heart icon.
            </p>
            <Button asChild>
              <Link to="/properties">
                Browse Properties
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <div key={property.id} className="relative">
                <Link to={`/property/${property.id}`}>
                  <PropertyCard 
                    property={property}
                    isFavorited={true}
                    onFavorite={() => handleRemoveFavorite(property.id)}
                  />
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Favorites;