import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Home, MapPin, DollarSign, Bed, Bath, Ruler, Image as ImageIcon } from "lucide-react";

const propertySchema = z.object({
  title: z.string().trim().min(5, "Title must be at least 5 characters").max(200),
  address: z.string().trim().min(10, "Address must be at least 10 characters").max(300),
  city: z.string().trim().min(2, "City is required").max(100),
  state: z.string().trim().min(2, "State is required").max(100),
  zip_code: z.string().trim().regex(/^\d{6}$/, "Enter valid 6-digit PIN code").optional().or(z.literal('')),
  price: z.coerce.number().min(100000, "Price must be at least ₹1,00,000").max(10000000000, "Price is too high"),
  property_type: z.enum(["house", "condo", "apartment", "townhouse"]),
  bedrooms: z.coerce.number().int().min(0).max(50).optional().or(z.literal('')),
  bathrooms: z.coerce.number().min(0).max(50).optional().or(z.literal('')),
  square_feet: z.coerce.number().int().min(100).max(1000000).optional().or(z.literal('')),
  description: z.string().trim().max(2000, "Description must be less than 2000 characters").optional().or(z.literal('')),
  images: z.string().trim().max(5000, "Image URLs are too long").optional().or(z.literal('')),
});

interface FormValues {
  title: string;
  address: string;
  city: string;
  state: string;
  zip_code?: string;
  price: number | string;
  property_type: string;
  bedrooms?: number | string;
  bathrooms?: number | string;
  square_feet?: number | string;
  description?: string;
  images?: string; // comma-separated URLs
}

const Sell = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting }, reset } = useForm<FormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      state: "",
      property_type: "house",
    }
  });

  // SEO
  useEffect(() => {
    document.title = "Sell Property - EstateHub";
    const desc = "List your home on EstateHub. Fast, secure property submission for agents.";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", desc);

    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = window.location.href;
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to list a property",
      });
      navigate("/auth");
    }
  }, [authLoading, user, navigate, toast]);

  // Fetch property data if editing
  useEffect(() => {
    if (editId && user) {
      fetchPropertyData(editId);
    }
  }, [editId, user]);

  const fetchPropertyData = async (id: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("id", id)
      .eq("agent_id", user?.id) // Security: ensure user owns this property
      .single();

    if (error || !data) {
      toast({
        title: "Error",
        description: "Property not found or you don't have permission to edit it",
        variant: "destructive",
      });
      navigate("/manage-listings");
      return;
    }

    // Populate form with existing data
    reset({
      title: data.title,
      address: data.address,
      city: data.city,
      state: data.state,
      zip_code: data.zip_code || "",
      price: data.price,
      property_type: data.property_type,
      bedrooms: data.bedrooms || "",
      bathrooms: data.bathrooms || "",
      square_feet: data.square_feet || "",
      description: data.description || "",
      images: data.images?.join(", ") || "",
    });
    setLoading(false);
  };

  const onSubmit = async (values: FormValues) => {
    if (!user) return;

    const payload = {
      title: values.title,
      address: values.address,
      city: values.city,
      state: values.state,
      zip_code: values.zip_code || null,
      price: Number(values.price),
      property_type: values.property_type,
      bedrooms: values.bedrooms ? Number(values.bedrooms) : null,
      bathrooms: values.bathrooms ? Number(values.bathrooms) : null,
      square_feet: values.square_feet ? Number(values.square_feet) : null,
      description: values.description || null,
      images: values.images
        ? values.images.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
    };

    if (editId) {
      // Update existing property
      const { error } = await supabase
        .from("properties")
        .update(payload)
        .eq("id", editId)
        .eq("agent_id", user.id); // Security: ensure user owns this property

      if (error) {
        toast({ title: "Failed to update listing", description: error.message, variant: "destructive" });
        return;
      }

      toast({ title: "Listing updated", description: "Your property has been updated successfully." });
      navigate(`/property/${editId}`);
    } else {
      // Create new property
      const { data, error } = await supabase
        .from("properties")
        .insert({ ...payload, agent_id: user.id })
        .select("id")
        .single();

      if (error) {
        toast({ title: "Failed to create listing", description: error.message, variant: "destructive" });
        return;
      }

      toast({ title: "Listing created", description: "Your property has been submitted." });
      if (data?.id) {
        navigate(`/property/${data.id}`);
      } else {
        navigate("/properties");
      }
    }
  };

  if (authLoading || !user || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-96 bg-muted rounded-lg"></div>
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
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            {editId ? "Edit Property Listing" : "List Your Property"}
          </h1>
          <p className="text-xl text-muted-foreground">
            {editId
              ? "Update your property information"
              : "Create a new listing and reach thousands of potential buyers"}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-primary text-primary-foreground">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary-foreground/10 rounded-lg">
                  <Home className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Property Details</CardTitle>
                  <CardDescription className="text-primary-foreground/80">
                    Fill in the information about your property
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Basic Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Home className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">Basic Information</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="title">Property Title *</Label>
                      <Input 
                        id="title" 
                        placeholder="e.g., Luxurious 3BHK Apartment in Mumbai" 
                        {...register("title", { required: true })} 
                      />
                      {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="property_type">Property Type *</Label>
                      <Select onValueChange={(v) => setValue("property_type", v)} defaultValue="house">
                        <SelectTrigger id="property_type">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="house">House</SelectItem>
                          <SelectItem value="condo">Condo</SelectItem>
                          <SelectItem value="apartment">Apartment</SelectItem>
                          <SelectItem value="townhouse">Townhouse</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="price" className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Price (INR) *
                      </Label>
                      <Input 
                        id="price" 
                        type="number" 
                        min={0} 
                        step="100000" 
                        placeholder="75,00,000" 
                        {...register("price", { required: true })} 
                      />
                      {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
                    </div>
                  </div>
                </div>

                {/* Location Details */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">Location Details</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address">Street Address *</Label>
                      <Input 
                        id="address" 
                        placeholder="Plot 123, Sector 15, Dwarka" 
                        {...register("address", { required: true })} 
                      />
                      {errors.address && <p className="text-sm text-destructive">{errors.address.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input 
                        id="city" 
                        placeholder="Mumbai" 
                        {...register("city", { required: true })} 
                      />
                      {errors.city && <p className="text-sm text-destructive">{errors.city.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Input 
                        id="state" 
                        placeholder="Maharashtra" 
                        {...register("state", { required: true })} 
                      />
                      {errors.state && <p className="text-sm text-destructive">{errors.state.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="zip_code">PIN Code</Label>
                      <Input 
                        id="zip_code" 
                        placeholder="400001" 
                        {...register("zip_code")} 
                      />
                      {errors.zip_code && <p className="text-sm text-destructive">{errors.zip_code.message}</p>}
                    </div>
                  </div>
                </div>

                {/* Property Features */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Ruler className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">Property Features</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="bedrooms" className="flex items-center gap-2">
                        <Bed className="h-4 w-4" />
                        Bedrooms
                      </Label>
                      <Input 
                        id="bedrooms" 
                        type="number" 
                        min={0} 
                        step="1" 
                        placeholder="3" 
                        {...register("bedrooms")} 
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bathrooms" className="flex items-center gap-2">
                        <Bath className="h-4 w-4" />
                        Bathrooms
                      </Label>
                      <Input 
                        id="bathrooms" 
                        type="number" 
                        min={0} 
                        step="0.5" 
                        placeholder="2" 
                        {...register("bathrooms")} 
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="square_feet">Square Feet</Label>
                      <Input 
                        id="square_feet" 
                        type="number" 
                        min={0} 
                        step="10" 
                        placeholder="1500" 
                        {...register("square_feet")} 
                      />
                    </div>
                  </div>
                </div>

                {/* Images and Description */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <ImageIcon className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">Media & Description</h3>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="images">Image URLs</Label>
                      <Input 
                        id="images" 
                        placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg" 
                        {...register("images")} 
                      />
                      <p className="text-sm text-muted-foreground">
                        Enter multiple image URLs separated by commas
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Property Description</Label>
                      <Textarea 
                        id="description" 
                        placeholder="Describe your property, its features, nearby amenities, etc." 
                        rows={6}
                        {...register("description")} 
                      />
                      {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t">
                  <p className="text-sm text-muted-foreground">
                    * Required fields
                  </p>
                  <div className="flex gap-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => navigate("/properties")}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="min-w-[150px]"
                    >
                      {isSubmitting 
                        ? (editId ? "Updating..." : "Creating...") 
                        : (editId ? "Update Listing" : "Create Listing")}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Sell;
