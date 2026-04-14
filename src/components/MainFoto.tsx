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
    <div className="container mx-auto px-4 my-10">
      <div className="relative w-full h-[500px] rounded-2xl overflow-hidden group shadow-lg">
        <img
          src={heroImage}
          alt="Gallery large"
          className="w-full h-full object-cover"
        />

        {isAuthenticated && role === "Admin" && (
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
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