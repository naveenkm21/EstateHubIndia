import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckCircle2, Shield, TrendingUp, Users, Award, Briefcase } from 'lucide-react';
import PageTransition from '@/components/transitions/PageTransition';
import FadeIn from '@/components/transitions/FadeIn';

const AgentTerms = () => {
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (agreed) {
      navigate('/sell');
    }
  };

  const perks = [
    {
      icon: TrendingUp,
      title: "Competitive Commission",
      description: "Earn attractive commissions on every successful transaction with transparent payment terms"
    },
    {
      icon: Users,
      title: "Qualified Leads",
      description: "Access to our extensive database of verified buyers and sellers actively looking for properties"
    },
    {
      icon: Award,
      title: "Professional Training",
      description: "Ongoing training programs and certifications to enhance your skills and market knowledge"
    },
    {
      icon: Briefcase,
      title: "Marketing Support",
      description: "Professional photography, virtual tours, and comprehensive marketing materials for your listings"
    }
  ];

  const responsibilities = [
    "Maintain professional conduct and ethical standards in all client interactions",
    "Provide accurate property information and honest market assessments",
    "Respond to client inquiries promptly within 24 hours",
    "Maintain valid real estate license and required certifications",
    "Complete mandatory continuing education requirements",
    "Adhere to all local, state, and federal real estate regulations",
    "Maintain confidentiality of client information and transactions",
    "Use company-approved marketing materials and branding guidelines"
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container px-4 py-12 max-w-5xl mx-auto">
          <FadeIn>
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Agent Partnership Terms</h1>
              <p className="text-xl text-muted-foreground">
                Join our network of professional real estate agents
              </p>
            </div>
          </FadeIn>

          {/* Perks Section */}
          <FadeIn delay={0.1}>
            <Card className="mb-8 hover:shadow-medium smooth-transition">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                  Benefits of Joining Our Network
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {perks.map((perk, index) => (
                    <FadeIn key={index} delay={0.15 + index * 0.05} direction="left">
                      <div className="flex gap-4 hover-lift">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                            <perk.icon className="h-6 w-6 text-primary" />
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">{perk.title}</h3>
                          <p className="text-sm text-muted-foreground">{perk.description}</p>
                        </div>
                      </div>
                    </FadeIn>
                  ))}
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          {/* Responsibilities Section */}
          <FadeIn delay={0.2}>
            <Card className="mb-8 hover:shadow-medium smooth-transition">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Shield className="h-6 w-6 text-primary" />
                  Agent Responsibilities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {responsibilities.map((responsibility, index) => (
                    <FadeIn key={index} delay={0.25 + index * 0.03} direction="right">
                      <li className="flex gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{responsibility}</span>
                      </li>
                    </FadeIn>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </FadeIn>

        {/* Terms & Conditions */}
        <FadeIn delay={0.3}>
          <Card className="mb-8 hover:shadow-medium smooth-transition">
            <CardHeader>
              <CardTitle className="text-2xl">Terms & Conditions</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <div className="space-y-4 text-muted-foreground">
                <section>
                  <h3 className="text-lg font-semibold text-foreground mb-2">1. Agreement Overview</h3>
                  <p>
                    This Agent Partnership Agreement ("Agreement") is entered into between the property owner/platform operator 
                    ("Company") and the real estate agent ("Agent"). By accepting these terms, the Agent agrees to act as an 
                    independent contractor and not as an employee of the Company.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-foreground mb-2">2. Commission Structure</h3>
                  <p>
                    The Agent shall receive commission payments based on successful property transactions as outlined in the 
                    commission schedule provided separately. All commissions are subject to applicable taxes and regulatory 
                    compliance requirements. Payment terms typically range from 30-45 days post-transaction closure.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-foreground mb-2">3. Professional Standards</h3>
                  <p>
                    The Agent agrees to maintain the highest standards of professional conduct, including adherence to all 
                    applicable real estate laws, fair housing regulations, and ethical guidelines established by relevant 
                    professional associations. Any violations may result in immediate termination of this Agreement.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-foreground mb-2">4. Licensing & Insurance</h3>
                  <p>
                    The Agent must maintain valid real estate licensing as required by state/local regulations and carry 
                    appropriate errors and omissions (E&O) insurance. Proof of current licensing and insurance must be 
                    provided upon request and updated annually.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-foreground mb-2">5. Confidentiality</h3>
                  <p>
                    The Agent agrees to maintain strict confidentiality regarding all client information, transaction details, 
                    and proprietary business information obtained during the course of this partnership. This obligation 
                    continues even after termination of the Agreement.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-foreground mb-2">6. Termination</h3>
                  <p>
                    Either party may terminate this Agreement with 30 days written notice. The Company reserves the right to 
                    terminate immediately for cause, including but not limited to: violation of terms, unethical conduct, 
                    loss of required licensing, or failure to meet performance standards.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-foreground mb-2">7. Dispute Resolution</h3>
                  <p>
                    Any disputes arising from this Agreement shall be resolved through binding arbitration in accordance 
                    with applicable arbitration rules. Both parties agree to make good faith efforts to resolve disputes 
                    amicably before pursuing formal arbitration proceedings.
                  </p>
                </section>
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        {/* Agreement Checkbox and Button */}
        <FadeIn delay={0.4}>
          <Card className="hover:shadow-medium smooth-transition">
            <CardContent className="p-8">
              <div className="flex items-start gap-3 mb-6">
                <Checkbox 
                  id="agree-terms" 
                  checked={agreed}
                  onCheckedChange={(checked) => setAgreed(checked === true)}
                  className="mt-1"
                />
                <label 
                  htmlFor="agree-terms" 
                  className="text-sm leading-relaxed cursor-pointer"
                >
                  I have read, understood, and agree to abide by all the terms and conditions outlined above. 
                  I understand that this Agreement establishes an independent contractor relationship and I am 
                  responsible for maintaining all required licenses, insurance, and professional standards.
                </label>
              </div>
              <Button 
                size="lg" 
                className="w-full hover-lift"
                disabled={!agreed}
                onClick={handleGetStarted}
              >
                Get Started - List Your First Property
              </Button>
              {!agreed && (
                <p className="text-sm text-muted-foreground text-center mt-3">
                  Please agree to the terms and conditions to continue
                </p>
              )}
            </CardContent>
          </Card>
        </FadeIn>
      </main>
      <Footer />
    </div>
  </PageTransition>
  );
};

export default AgentTerms;
