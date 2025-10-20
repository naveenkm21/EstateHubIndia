import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Edit, Trash2, Home, MapPin, DollarSign } from "lucide-react";
import type { Property } from "@/types/property";

const ManageListings = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Manage Listings - EstateHub";
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to manage your listings",
      });
      navigate("/auth");
    }
  }, [authLoading, user, navigate, toast]);

  useEffect(() => {
    if (user) {
      fetchUserProperties();
    }
  }, [user]);

  const fetchUserProperties = async () => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("agent_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error fetching properties",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setProperties(data || []);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from("properties")
      .delete()
      .eq("id", id)
      .eq("agent_id", user?.id); // Extra security check

    if (error) {
      toast({
        title: "Failed to delete property",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Property deleted",
        description: "Your listing has been removed successfully",
      });
      setProperties(properties.filter((p) => p.id !== id));
    }
    setDeleteId(null);
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Manage Your Listings</h1>
            <p className="text-xl text-muted-foreground">
              Edit or remove your property listings
            </p>
          </div>
          <Button asChild>
            <a href="/sell">
              <Home className="h-4 w-4 mr-2" />
              Add New Property
            </a>
          </Button>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-64 bg-muted rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : properties.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="flex flex-col items-center space-y-4">
              <Home className="h-16 w-16 text-muted-foreground" />
              <h2 className="text-2xl font-semibold">No listings yet</h2>
              <p className="text-muted-foreground">
                Create your first property listing to get started
              </p>
              <Button asChild className="mt-4">
                <a href="/sell">List Your Property</a>
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <Card key={property.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
                <div className="relative aspect-video overflow-hidden bg-muted">
                  {property.images && property.images.length > 0 ? (
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Home className="h-16 w-16 text-muted-foreground" />
                    </div>
                  )}
                  <Badge className="absolute top-2 right-2">
                    {property.status}
                  </Badge>
                </div>

                <CardHeader>
                  <CardTitle className="line-clamp-1">{property.title}</CardTitle>
                  <div className="flex items-center gap-2 text-2xl font-bold text-primary">
                    <DollarSign className="h-5 w-5" />
                    ₹{property.price.toLocaleString('en-IN')}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-2">
                      {property.address}, {property.city}, {property.state}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => navigate(`/sell?edit=${property.id}`)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="flex-1"
                      onClick={() => setDeleteId(property.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              property listing from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ManageListings;
