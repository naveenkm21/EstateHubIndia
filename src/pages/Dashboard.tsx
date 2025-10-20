import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Property } from '@/types/property';
import PropertyCard from '@/components/properties/PropertyCard';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Plus, Home, Heart, BarChart3, Users, MapPin } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

interface DashboardStats {
  totalListings: number;
  favoriteProperties: number;
  activeListings: number;
  viewsThisMonth: number;
}

const Dashboard = () => {
  const { user, loading } = useAuth();
  const [userRole, setUserRole] = useState<string>('');
  const [properties, setProperties] = useState<Property[]>([]);
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalListings: 0,
    favoriteProperties: 0,
    activeListings: 0,
    viewsThisMonth: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    document.title = 'Dashboard - PropertyHub India';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Manage your property listings and favorites on PropertyHub India');
    }
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      // Get user role
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user?.id)
        .single();

      setUserRole(roleData?.role || 'buyer_seller');

      // Get user's properties
      const { data: propertiesData } = await supabase
        .from('properties')
        .select(`
          *,
          profiles:agent_id (
            full_name,
            phone
          )
        `)
        .eq('agent_id', user?.id);

      setProperties(propertiesData || []);

      // Get user's favorites
      const { data: favoritesData } = await supabase
        .from('favorites')
        .select(`
          *,
          properties (
            *,
            profiles:agent_id (
              full_name,
              phone
            )
          )
        `)
        .eq('user_id', user?.id);

      const favoriteProperties = favoritesData?.map(f => f.properties).filter(Boolean) || [];
      setFavorites(favoriteProperties as Property[]);

      // Calculate stats
      setStats({
        totalListings: propertiesData?.length || 0,
        favoriteProperties: favoriteProperties.length,
        activeListings: propertiesData?.filter(p => p.status === 'available').length || 0,
        viewsThisMonth: Math.floor(Math.random() * 500) + 100 // Mock data
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFavorite = async (propertyId: string) => {
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user?.id)
        .eq('property_id', propertyId);

      if (error) throw error;

      setFavorites(prev => prev.filter(p => p.id !== propertyId));
      setStats(prev => ({ ...prev, favoriteProperties: prev.favoriteProperties - 1 }));

      toast({
        title: "Success",
        description: "Property removed from favorites",
      });
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast({
        title: "Error",
        description: "Failed to remove favorite",
        variant: "destructive",
      });
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your property activity.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
              <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalListings}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeListings}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saved Favorites</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.favoriteProperties}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Views This Month</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.viewsThisMonth}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="listings" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="listings">My Listings</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
              {userRole === 'agent' && (
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              )}
            </TabsList>
            
            {(userRole === 'agent' || userRole === 'buyer_seller') && (
              <Button asChild>
                <Link to="/sell">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Property
                </Link>
              </Button>
            )}
          </div>

          <TabsContent value="listings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Property Listings</CardTitle>
                <CardDescription>
                  Manage and track your property listings
                </CardDescription>
              </CardHeader>
              <CardContent>
                {properties.length === 0 ? (
                  <div className="text-center py-8">
                    <Home className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Properties Listed</h3>
                    <p className="text-muted-foreground mb-4">
                      Start by adding your first property listing
                    </p>
                    <Button asChild>
                      <Link to="/sell">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Property
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties.map((property) => (
                      <div key={property.id} className="relative">
                        <PropertyCard property={property} />
                        <Badge 
                          variant={property.status === 'available' ? 'default' : 'secondary'}
                          className="absolute top-2 right-2"
                        >
                          {property.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="favorites" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Saved Properties</CardTitle>
                <CardDescription>
                  Properties you've marked as favorites
                </CardDescription>
              </CardHeader>
              <CardContent>
                {favorites.length === 0 ? (
                  <div className="text-center py-8">
                    <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Saved Properties</h3>
                    <p className="text-muted-foreground mb-4">
                      Browse properties and save the ones you like
                    </p>
                    <Button asChild>
                      <Link to="/properties">
                        <MapPin className="w-4 h-4 mr-2" />
                        Browse Properties
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favorites.map((property) => (
                      <PropertyCard
                        key={property.id}
                        property={property}
                        isFavorited={true}
                        onFavorite={() => handleRemoveFavorite(property.id)}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {userRole === 'agent' && (
            <TabsContent value="analytics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Analytics Overview</CardTitle>
                  <CardDescription>
                    Track your property performance and leads
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Analytics Coming Soon</h3>
                    <p className="text-muted-foreground">
                      Detailed analytics and insights will be available soon
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;