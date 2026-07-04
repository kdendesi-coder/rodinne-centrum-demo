import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";
import EditModal from "./EditModal";
import { useAuth } from "@/contexts/AuthContext";
import { useParagraph } from "@/hooks/useParagraph";

const GalleryHero = () => {
  const { isAuthenticated, role } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const { text: savedImage, setText: setSavedImage } =
    useParagraph("gallery_hero_image");

  const heroImage =
    savedImage && savedImage.startsWith("data:image")
      ? savedImage
      : "/03_gallery.jpg";

  const handleSaveImage = async (files: string[]) => {
    if (files && files[0]) {
      await setSavedImage(files[0]);
      setIsEditing(false);
    }
  };

  return (
    <div className="w-full max-w-[1867px] mx-auto px-4 sm:px-6 lg:px-8 my-8 md:my-12">
      <div className="relative w-full h-[360px] sm:h-[420px] md:h-[560px] lg:h-[680px] xl:h-[760px] rounded-2xl md:rounded-3xl overflow-hidden group shadow-lg">
        <img
          src={heroImage}
          alt="Gallery large"
          className="w-full h-full object-cover object-center bg-white"
          loading="eager"
          decoding="async"
        />

        {isAuthenticated && role === "Admin" && (
          <div className="absolute top-3 right-3 md:top-4 md:right-4 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
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

      <EditModal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        title="Upraviť veľký obrázok"
        type="image"
        initialValue={[heroImage]}
        onSave={handleSaveImage}
      />
    </div>
  );
};

export default GalleryHero;