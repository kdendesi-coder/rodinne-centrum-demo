import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";
import EditModal from "./EditModal";
import { useAuth } from "@/contexts/AuthContext";

const ABOUT_IMAGE_KEY = "about_image";
const ABOUT_TEXT_KEY = "about_text";

const AboutSection = () => {
  const { isAuthenticated, role } = useAuth();
  const [isEditingText, setIsEditingText] = useState(false);
  const [isEditingImage, setIsEditingImage] = useState(false);

  const [image, setImage] = useState<string>(() => {
    return localStorage.getItem(ABOUT_IMAGE_KEY) || "/01_IMGP3994.jpg";
  });

  const [text, setText] = useState<string>(() => {
    return localStorage.getItem(ABOUT_TEXT_KEY) || "Text zatiaľ nie je uložený.";
  });

  const handleSaveImage = (file: string) => {
    setImage(file);
    localStorage.setItem(ABOUT_IMAGE_KEY, file);
  };

  const handleSaveText = (newText: string) => {
    setText(newText);
    localStorage.setItem(ABOUT_TEXT_KEY, newText);
  };

  return (
    <section id="about" className="py-12 md:py-20 px-4">
      <div className="w-full max-w-[1650px] mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8">O nás</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="relative group">
            <p className="text-lg md:text-xl xl:text-2xl space-y-5 md:space-y-6 leading-[1.8] whitespace-pre-line">
              {text}
            </p>
            {isAuthenticated && role === "Admin" && (
              <Button
                size="icon"
                variant="secondary"
                className="edit-button"
                onClick={() => setIsEditingText(true)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="relative p-4 sm:p-6 flex justify-center items-center overflow-hidden lg:overflow-visible">
            <div className="relative z-10 group bg-muted rounded-[1.5rem] overflow-hidden border-[4px] sm:border-[10px] w-full max-w-[750px] aspect-[3/2]">
              <img src={image} alt="About" className="w-full h-full object-cover" />
              {isAuthenticated && role === "Admin" && (
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute top-6 right-6 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
                  onClick={() => setIsEditingImage(true)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <EditModal
        isOpen={isEditingText}
        onClose={() => setIsEditingText(false)}
        title="Upraviť text"
        type="file"
        localStorageKey={ABOUT_TEXT_KEY}
        initialValue={text}
        onSave={(file) => handleSaveText(file)}
      />

      <EditModal
        isOpen={isEditingImage}
        onClose={() => setIsEditingImage(false)}
        title="Upraviť obrázok"
        type="image"
        localStorageKey={ABOUT_IMAGE_KEY}
        initialValue={image}
        onSave={handleSaveImage}
      />
    </section>
  );
};

export default AboutSection;