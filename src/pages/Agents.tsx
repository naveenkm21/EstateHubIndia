import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Search, Phone, MapPin, Building2 } from "lucide-react";

interface Profile {
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
}

const Agents = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to view agents",
      });
      navigate('/auth');
    }
  }, [user, authLoading, navigate, toast]);

  // SEO
  useEffect(() => {
    document.title = "Real Estate Agents - EstateHub";
    const desc = "Browse EstateHub agents. Find trusted realtors and view their listings.";
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
    const load = async () => {
      setLoading(true);
      try {
        const [profilesRes, propertiesRes] = await Promise.all([
          supabase.from("profiles").select("user_id, full_name, avatar_url, phone"),
          supabase.from("properties").select("id, agent_id"),
        ]);

        if (profilesRes.error) {
          console.error('Error fetching profiles:', profilesRes.error);
        } else if (profilesRes.data) {
          setProfiles(profilesRes.data as Profile[]);
        }

        if (propertiesRes.error) {
          console.error('Error fetching properties:', propertiesRes.error);
        } else if (propertiesRes.data) {
          const map: Record<string, number> = {};
          for (const row of propertiesRes.data as { id: string; agent_id: string | null }[]) {
            if (!row.agent_id) continue;
            map[row.agent_id] = (map[row.agent_id] || 0) + 1;
          }
          setCounts(map);
        }
      } catch (error) {
        console.error('Error loading agents data:', error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return profiles;
    return profiles.filter((p) =>
      (p.full_name || "").toLowerCase().includes(query) || (p.phone || "").toLowerCase().includes(query)
    );
  }, [profiles, q]);

  if (authLoading || loading || !user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
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
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Meet Our Agents</h1>
          <p className="text-xl text-muted-foreground">
            Connect with {filtered.length} experienced real estate professionals
          </p>
        </div>

        {/* Search Section */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                value={q} 
                onChange={(e) => setQ(e.target.value)} 
                placeholder="Search agents by name or phone..." 
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Agents Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filtered.map((p) => {
            const initials = (p.full_name || "Agent")
              .split(" ")
              .map((s) => s[0])
              .slice(0, 2)
              .join("")
              .toUpperCase();
            const count = counts[p.user_id] || 0;
            
            return (
              <Card key={p.user_id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16 border-2 border-primary/10">
                      <AvatarImage 
                        src={p.avatar_url || undefined} 
                        alt={`${p.full_name || "Agent"} avatar`} 
                      />
                      <AvatarFallback className="text-lg font-semibold bg-gradient-primary text-primary-foreground">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-xl mb-1">
                        {p.full_name || "Unnamed Agent"}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        <span>{p.phone || "No contact"}</span>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Building2 className="h-4 w-4" />
                      <span>Active Listings</span>
                    </div>
                    <Badge variant="secondary" className="font-semibold">
                      {count}
                    </Badge>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    onClick={() => navigate('/properties')}
                  >
                    View All Listings
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </section>

        {/* No Results */}
        {filtered.length === 0 && !loading && (
          <div className="text-center py-16">
            <Search className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-2xl font-semibold mb-2">
              {q ? "No agents found" : "No agents available yet"}
            </h3>
            <p className="text-muted-foreground mb-6">
              {q 
                ? "Try adjusting your search to find agents." 
                : "Agent profiles will appear here once users register as agents and list properties."}
            </p>
            {q ? (
              <Button onClick={() => setQ("")}>Clear Search</Button>
            ) : (
              <Button asChild>
                <Link to="/properties">Browse Properties</Link>
              </Button>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Agents;
