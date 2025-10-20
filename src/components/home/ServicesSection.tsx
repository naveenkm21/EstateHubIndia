import { Card, CardContent } from '@/components/ui/card';
import { 
  Search, 
  Home, 
  TrendingUp, 
  Shield, 
  Users, 
  Calculator 
} from 'lucide-react';
import FadeIn from '@/components/transitions/FadeIn';

const ServicesSection = () => {
  const services = [
    {
      icon: Search,
      title: 'Advanced Search',
      description: 'Find your perfect property with our powerful search and filtering system.',
      color: 'text-primary'
    },
    {
      icon: Home,
      title: 'Property Management',
      description: 'Comprehensive property management services for landlords and investors.',
      color: 'text-success'
    },
    {
      icon: TrendingUp,
      title: 'Market Analysis',
      description: 'Get detailed market insights and property valuation reports.',
      color: 'text-accent'
    },
    {
      icon: Shield,
      title: 'Secure Transactions',
      description: 'Safe and secure property transactions with legal protection.',
      color: 'text-warning'
    },
    {
      icon: Users,
      title: 'Expert Agents',
      description: 'Work with certified real estate professionals in your area.',
      color: 'text-primary'
    },
    {
      icon: Calculator,
      title: 'Mortgage Calculator',
      description: 'Calculate your mortgage payments and explore financing options.',
      color: 'text-success'
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container px-4">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Why Choose EstateHub?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We provide comprehensive real estate services to make your property 
              journey smooth, secure, and successful.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <FadeIn key={index} delay={index * 0.1} direction="up">
                <Card 
                  className="group hover:shadow-medium transition-all duration-300 hover:-translate-y-1 bg-gradient-card border-0 h-full"
                >
                  <CardContent className="p-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Icon className={`h-8 w-8 ${service.color}`} />
                    </div>
                    <h3 className="text-xl font-semibold mb-4">{service.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {service.description}
                    </p>
                  </CardContent>
                </Card>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;