import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";
import EditModal from "./EditModal";
import { useAuth } from "@/contexts/AuthContext";

const GalleryHero = () => {
  const { isAuthenticated, role } = useAuth();
  const [heroImage, setHeroImage] = useState<string>("/03_gallery.jpg");
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="w-full max-w-[1867px] mx-auto px-4 sm:px-6 lg:px-8 my-8 md:my-12">
      <div className="relative w-full h-[360px] sm:h-[420px] md:h-[560px] lg:h-[680px] xl:h[760px] rounded-2xl md:rounded-3xl overflow-hidden group shadow-lg">
        <img
          src={heroImage}
          alt="Gallery large"
          className="w-full h-full object-cover object-center"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />

        {isAuthenticated && role === "Admin" && (
          <div className="absolute top-3 right-3 md:top-4 md:right-4 opacity-100 lg:opacity-0 lg:group-hover-opacity transition-opacity">
            <Button
              size="icon"
              variant="secondary"
              onClick={() => setIsEditing(true)}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {isEditing && (
        <EditModal
          isOpen={true}
          onClose={() => setIsEditing(false)}
          title="Upraviť veľký obrázok"
          type="image"
          initialValue={heroImage}
          onSave={(url: string) => {
            setHeroImage(url);
            setIsEditing(false);
          }}
        />
      )}
    </div>
  );
};

export default GalleryHero;