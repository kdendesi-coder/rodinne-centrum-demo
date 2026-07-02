import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";
import EditModal from "./EditModal";
import { useAuth } from "@/contexts/AuthContext";

const HERO_KEY = "hero_image";

const HeroSection = () => {
  const { isAuthenticated, role } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  // Obrázok s lokálnym storage
  const [heroImage, setHeroImage] = useState<string>(() => {
    return localStorage.getItem(HERO_KEY) || "/ContainerLargeEdit2.jpg";
  });

  // Text na hero sekciu
  const titlePart1 = "Rodinné centrum";
  const titlePart2 = "Sirotár";

  const handleSave = (file: string) => {
    setHeroImage(file);
    localStorage.setItem(HERO_KEY, file);
  };

  return (
    <div className="w-full max-w-[1867px] mx-auto px-4 sm:px-6 lg:px-8 my-8 md:my-12">
      <div className="relative w-full h-[560px] md:h-[680px] lg:h-[760px] rounded-3xl overflow-hidden group shadow-lg">
        
        {/* Obrázok */}
        <img
          src={heroImage}
          alt="Hero background"
          className="w-full h-full object-cover object-center"
        />

        {/* Text nad obrázkom */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <h1
            className="text-center font-bold text-[#95C11F] uppercase"
            style={{
              fontFamily: "Cormorant Garamond",
              fontWeight: 700,
              fontSize: "clamp(2rem, 7vw, 80px)",
              lineHeight: 1.1
            }}
          >
            <span className="block">{titlePart1}</span>
            <span className="block">{titlePart2}</span>
          </h1>
        </div>

        {/* Tlačidlo na úpravu obrázku */}
        {isAuthenticated && role === "Admin" && (
          <Button
            size="icon"
            variant="secondary"
            className="absolute top-4 right-4 z-20"
            onClick={() => setIsEditing(true)}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        )}

        {/* Edit modal */}
        <EditModal
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
          title="Upraviť Hero Background"
          type="image"
          localStorageKey={HERO_KEY}
          initialValue={heroImage}
          onSave={handleSave}
        />
      </div>
    </div>
  );
};

export default HeroSection;