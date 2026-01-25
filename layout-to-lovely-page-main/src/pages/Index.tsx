import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ActivitiesSection from "@/components/ActivitiesSection";
import GallerySection from "@/components/GallerySection";
import TeamSection from "@/components/TeamSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
//pridane ---------------------------
import { useAuth } from "@/contexts/AuthContext";
//pridane ---------------------------

//pridane ---------------------------
const AuthDebug = () => {
  const { isAuthenticated, username } = useAuth();
  
  return (
    <div className="fixed top-20 right-4 bg-red-500 text-white p-4 rounded z-50">
      <div>DEBUG: isAuthenticated: {isAuthenticated.toString()}</div>
      <div>DEBUG: username: {username || 'null'}</div>
    </div>
  );
};
//pridane ---------------------------

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <AuthDebug />
      <main className="pt-16">
        <HeroSection />
        <AboutSection />
        <ActivitiesSection />
        <GallerySection />
        <TeamSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;