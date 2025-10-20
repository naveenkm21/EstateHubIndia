import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Home, User } from 'lucide-react';
import FadeIn from '@/components/transitions/FadeIn';

const CTASection = () => {
  return (
    <section className="py-20 bg-gradient-primary text-primary-foreground">
      <div className="container px-4">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Whether you're buying, selling, or renting, we're here to help you 
              every step of the way. Join thousands of satisfied clients.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <FadeIn delay={0.1} direction="left">
            <Card className="border-0 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 hover:-translate-y-2 h-full">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-6">
                  <Home className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-white">Sell Your Property</h3>
                <p className="text-white/80 mb-6 leading-relaxed">
                  List your property with us and reach thousands of potential buyers. 
                  Our expert agents will help you get the best price.
                </p>
                <Button 
                  variant="secondary" 
                  size="lg" 
                  className="bg-white text-primary hover:bg-white/90 hover-lift"
                  asChild
                >
                  <Link to="/sell">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </FadeIn>

          <FadeIn delay={0.2} direction="right">
            <Card className="border-0 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 hover:-translate-y-2 h-full">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-6">
                  <User className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-white">Become an Agent</h3>
                <p className="text-white/80 mb-6 leading-relaxed">
                  Join our network of professional real estate agents and grow your 
                  business with our comprehensive support and tools.
                </p>
                <Button 
                  variant="secondary" 
                  size="lg" 
                  className="bg-white text-primary hover:bg-white/90 hover-lift"
                  asChild
                >
                  <Link to="/agents/join">
                    Learn More
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </FadeIn>
        </div>

        <FadeIn delay={0.3}>
          <div className="text-center mt-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="hover-scale">
                <div className="text-3xl font-bold text-white mb-2">50K+</div>
                <div className="text-white/80">Happy Clients</div>
              </div>
              <div className="hover-scale">
                <div className="text-3xl font-bold text-white mb-2">15K+</div>
                <div className="text-white/80">Properties Sold</div>
              </div>
              <div className="hover-scale">
                <div className="text-3xl font-bold text-white mb-2">500+</div>
                <div className="text-white/80">Expert Agents</div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default CTASection;