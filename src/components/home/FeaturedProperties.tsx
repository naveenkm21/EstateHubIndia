import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import PropertyCard from '@/components/properties/PropertyCard';
import { supabase } from '@/integrations/supabase/client';
import { Property } from '@/types/property';
import { ArrowRight } from 'lucide-react';
import FadeIn from '@/components/transitions/FadeIn';

const FeaturedProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProperties();
  }, []);

  const fetchFeaturedProperties = async () => {
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
        .eq('is_featured', true)
        .eq('status', 'active')
        .limit(3);

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Error fetching featured properties:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 bg-muted/30">
      <div className="container px-4">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Featured Properties
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover our handpicked selection of exceptional properties, 
              carefully chosen for their unique features and prime locations.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-64 bg-muted rounded-lg mb-4"></div>
                <div className="h-6 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </div>
            ))
          ) : properties.length > 0 ? (
            properties.map((property, index) => (
              <FadeIn key={property.id} delay={index * 0.1} direction="up">
                <Link to={`/property/${property.id}`}>
                  <PropertyCard property={property} />
                </Link>
              </FadeIn>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-muted-foreground">No featured properties available</p>
            </div>
          )}
        </div>

        <FadeIn delay={0.3}>
          <div className="text-center">
            <Button size="lg" asChild className="hover-lift">
              <Link to="/properties">
                View All Properties
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default FeaturedProperties;