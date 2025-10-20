import { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ChatBot from '@/components/chatbot/ChatBot';
import PropertyCard from '@/components/properties/PropertyCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Property, SearchFilters } from '@/types/property';
import { Search, Filter, Grid, List, SlidersHorizontal } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import PageTransition from '@/components/transitions/PageTransition';
import FadeIn from '@/components/transitions/FadeIn';

const Properties = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'newest' | 'oldest'>('newest');
  const [favorites, setFavorites] = useState<string[]>([]);

  // Read URL parameters and set filters on mount
  useEffect(() => {
    const location = searchParams.get('location');
    const propertyType = searchParams.get('propertyType');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    const urlFilters: SearchFilters = {};
    if (location) urlFilters.location = location;
    if (propertyType) urlFilters.propertyType = propertyType;
    if (minPrice) urlFilters.minPrice = parseInt(minPrice);
    if (maxPrice) urlFilters.maxPrice = parseInt(maxPrice);

    if (Object.keys(urlFilters).length > 0) {
      setSearchFilters(urlFilters);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProperties();
      fetchFavorites();
    }
  }, [user]);

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          profiles (
            full_name,
            phone
          )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('property_id')
        .eq('user_id', user.id);

      if (error) throw error;
      setFavorites(data?.map(f => f.property_id) || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const filteredAndSortedProperties = useMemo(() => {
    let filtered = properties.filter((property) => {
      // Location filter
      if (searchFilters.location) {
        const location = searchFilters.location.toLowerCase();
        const matchesLocation = 
          property.city.toLowerCase().includes(location) ||
          property.state.toLowerCase().includes(location) ||
          property.address.toLowerCase().includes(location);
        if (!matchesLocation) return false;
      }

      // Price filters
      if (searchFilters.minPrice && property.price < searchFilters.minPrice) return false;
      if (searchFilters.maxPrice && property.price > searchFilters.maxPrice) return false;

      // Property type filter
      if (searchFilters.propertyType && property.property_type !== searchFilters.propertyType) return false;

      // Bedrooms filter
      if (searchFilters.minBedrooms && (!property.bedrooms || property.bedrooms < searchFilters.minBedrooms)) return false;

      // Bathrooms filter
      if (searchFilters.minBathrooms && (!property.bathrooms || property.bathrooms < searchFilters.minBathrooms)) return false;

      return true;
    });

    // Sort properties
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'newest':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

    return filtered;
  }, [properties, searchFilters, sortBy]);

  const handleFavorite = async (propertyId: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save favorites",
      });
      navigate('/auth');
      return;
    }

    try {
      const isFavorited = favorites.includes(propertyId);
      
      if (isFavorited) {
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('property_id', propertyId);
        
        setFavorites(prev => prev.filter(id => id !== propertyId));
        toast({ title: "Removed from favorites" });
      } else {
        await supabase
          .from('favorites')
          .insert([{
            user_id: user.id,
            property_id: propertyId,
          }]);
        
        setFavorites(prev => [...prev, propertyId]);
        toast({ title: "Added to favorites" });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update favorites",
      });
    }
  };

  const clearFilters = () => {
    setSearchFilters({});
  };

  const activeFiltersCount = Object.values(searchFilters).filter(Boolean).length;

  if (authLoading || loading || !user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="h-96 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container px-4 py-8">
          {/* Page Header */}
          <FadeIn>
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-4">Properties for Sale</h1>
              <p className="text-xl text-muted-foreground">
                Discover {filteredAndSortedProperties.length} exceptional properties
              </p>
            </div>
          </FadeIn>

        {/* Filters Section */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-4">
              <div className="lg:col-span-2">
                <Input
                  placeholder="Search by location (Mumbai, Delhi, Bangalore...)"
                  value={searchFilters.location || ''}
                  onChange={(e) => setSearchFilters(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full"
                />
              </div>
              
              <Select 
                value={searchFilters.propertyType || ''} 
                onValueChange={(value) => setSearchFilters(prev => ({ ...prev, propertyType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Property Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="House">House</SelectItem>
                  <SelectItem value="Condo">Condo</SelectItem>
                  <SelectItem value="Apartment">Apartment</SelectItem>
                  <SelectItem value="Townhouse">Townhouse</SelectItem>
                </SelectContent>
              </Select>

              <Select 
                value={searchFilters.minBedrooms?.toString() || ''} 
                onValueChange={(value) => setSearchFilters(prev => ({ ...prev, minBedrooms: value ? parseInt(value) : undefined }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Min Bedrooms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1+ Bedrooms</SelectItem>
                  <SelectItem value="2">2+ Bedrooms</SelectItem>
                  <SelectItem value="3">3+ Bedrooms</SelectItem>
                  <SelectItem value="4">4+ Bedrooms</SelectItem>
                  <SelectItem value="5">5+ Bedrooms</SelectItem>
                </SelectContent>
              </Select>

              <Select 
                value={
                  searchFilters.minPrice && searchFilters.maxPrice 
                    ? `${searchFilters.minPrice}-${searchFilters.maxPrice}`
                    : ''
                } 
                onValueChange={(value) => {
                  if (value) {
                    const [min, max] = value.split('-').map(Number);
                    setSearchFilters(prev => ({ ...prev, minPrice: min, maxPrice: max }));
                  } else {
                    setSearchFilters(prev => ({ ...prev, minPrice: undefined, maxPrice: undefined }));
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-500000">Under $500K</SelectItem>
                  <SelectItem value="500000-1000000">$500K - $1M</SelectItem>
                  <SelectItem value="1000000-2000000">$1M - $2M</SelectItem>
                  <SelectItem value="2000000-999999999">$2M+</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={clearFilters} className="w-full">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Clear Filters
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="text-lg">
            Showing {filteredAndSortedProperties.length} properties
          </div>
          
          <div className="flex items-center space-x-4">
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center border rounded-md">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        <div className={`grid gap-8 mb-16 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1'
        }`}>
          {filteredAndSortedProperties.map((property, index) => (
            <FadeIn key={property.id} delay={index * 0.05} direction="up">
              <Link to={`/property/${property.id}`}>
                <PropertyCard 
                  property={property} 
                  onFavorite={handleFavorite}
                  isFavorited={favorites.includes(property.id)}
                />
              </Link>
            </FadeIn>
          ))}
        </div>

        {/* No Results */}
        {filteredAndSortedProperties.length === 0 && (
          <div className="text-center py-16">
            <Search className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-2xl font-semibold mb-2">No properties found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search filters to find more properties.
            </p>
            <Button onClick={clearFilters}>Clear All Filters</Button>
          </div>
        )}
      </main>

      <Footer />
      </div>
    </PageTransition>
  );
};

export default Properties;