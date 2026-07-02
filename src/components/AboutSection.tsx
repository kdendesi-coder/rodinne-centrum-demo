import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";
import EditModal from "./EditModal";
import { useParagraph } from "@/hooks/useParagraph";
import { useAuth } from "@/contexts/AuthContext";

const AboutSection = () => {
  const [isEditingText, setIsEditingText] = useState(false);
  const [isEditingImage, setIsEditingImage] = useState(false);

  const { text, isLoading, error, setText } = useParagraph("about");
  const { text: image, setText: setImage } = useParagraph("about_image");

  const { isAuthenticated, role } = useAuth();

  const handleSaveImage = (files: string[]) => {
    if (files && files[0]) setImage(files[0]);
  };

  return (
    <section id="about" className="py-12 md:py-20 px-4">
      <div className="w-full max-w-[1650px] mx-auto relative">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8 z-20 relative">
          O nás
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center relative">
          {/* Text */}
          <div className="relative group z-20">
            <div className="text-lg md:text-xl xl:text-2xl space-y-5 md:space-y-6 leading-[1.8] whitespace-pre-line max-w-[700px]">
              {isLoading ? (
                <p className="text-muted-foreground">Načítavam obsah z backendu...</p>
              ) : error ? (
                <div className="text-red-500">{error}</div>
              ) : (
                <p className="text-muted-foreground leading-relaxed">
                  {text || "Text zatiaľ nie je uložený v backende."}
                </p>
              )}
            </div>

            {isAuthenticated && role === "Admin" && (
              <Button
                size="icon"
                variant="secondary"
                className="edit-button absolute top-0 right-0"
                onClick={() => setIsEditingText(true)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Image */}
          <div className="relative w-full flex justify-center items-center">
            {/* Modrý kruh */}
            <div className="absolute top-2 left-2 w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 border-[2.5px] border-sky-400 rounded-full -translate-x-1/4 -translate-y-1/4 z-10">
              <div className="w-[85%] h-[85%] bg-[#DEE2D2] rounded-full"></div>
            </div>

            {/* Hnedý oblúk */}
            <div className="absolute bottom-2 right-2 w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32 border-[3px] border-amber-900 rounded-full translate-x-1/4 translate-y-1/4 z-10" />

            {/* Obrázok */}
            <div className="relative z-20 group bg-muted rounded-[1.5rem] overflow-hidden border-[4px] sm:border-[10px] w-full max-w-[750px] aspect-[3/2] shadow-lg">
              {image ? (
                <>
                  <img
                    src={image || "/01_gallery.jpg"}
                    alt="About"
                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105 will-change-transform"
                  />
                  <div className="absolute inset-0 rounded-[3rem] pointer-events-none opacity-10 transition-opacity duration-300 group-hover:opacity-0"
                    style={{ backgroundColor: "#B0C9D6" }}
                  />
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  Žiadny obrázok
                </div>
              )}

              {isAuthenticated && role === "Admin" && (
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute top-4 right-4 z-30 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
                  onClick={() => setIsEditingImage(true)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit modals */}
      <EditModal
        isOpen={isEditingText}
        onClose={() => setIsEditingText(false)}
        title="Edit About Text"
        type="text"
        initialValue={text || ""}
        onSave={(val) => setText(val)}
      />
      <EditModal
        isOpen={isEditingImage}
        onClose={() => setIsEditingImage(false)}
        title="Edit About Image"
        type="image"
        initialValue={image || ""}
        onSave={handleSaveImage}
      />
    </section>
  );
};

export default AboutSection;