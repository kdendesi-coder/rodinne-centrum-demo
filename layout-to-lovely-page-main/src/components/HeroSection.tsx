import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";
import EditModal from "./EditModal";

const HeroSection = () => {
  const [isEditingImage, setIsEditingImage] = useState(false);
  
  const title = "Rodinné centrum Sirotár";
  const subtitle = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
  const [backgroundImage, setBackgroundImage] = useState("https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&auto=format&fit=crop");

  return (
    <div className="relative h-[600px] flex items-center justify-center overflow-hidden group">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className="absolute inset-0 bg-foreground/60" />
      
      <Button
        size="icon"
        variant="secondary"
        className="edit-button"
        onClick={() => setIsEditingImage(true)}
      >
        <Edit2 className="h-4 w-4" />
      </Button>

      <div className="relative z-10 text-center px-4 max-w-3xl">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
          {title}
        </h1>
        
        <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl">
          {subtitle}
        </p>

        <Button size="lg" className="bg-primary hover:bg-primary/90">
          Kontaktujte nás
        </Button>
      </div>

      <EditModal
        isOpen={isEditingImage}
        onClose={() => setIsEditingImage(false)}
        title="Edit Hero Background"
        type="image"
        initialValue={backgroundImage}
        onSave={setBackgroundImage}
      />
    </div>
  );
};

export default HeroSection;