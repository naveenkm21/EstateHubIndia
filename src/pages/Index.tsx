import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import FeaturedProperties from '@/components/home/FeaturedProperties';
import ServicesSection from '@/components/home/ServicesSection';
import CTASection from '@/components/home/CTASection';
import ChatBot from '@/components/chatbot/ChatBot';
import PageTransition from '@/components/transitions/PageTransition';

const Index = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <HeroSection />
          <FeaturedProperties />
          <ServicesSection />
          <CTASection />
        </main>
        <Footer />
        <ChatBot />
      </div>
    </PageTransition>
  );
};

export default Index;
