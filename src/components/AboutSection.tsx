import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";
import EditModal from "./EditModal";
import { useParagraph } from "@/hooks/useParagraph";
import { useAuth } from "@/contexts/AuthContext"; 

const AboutSection = () => {
  const [isEditingText, setIsEditingText] = useState(false);
  const [isEditingImage, setIsEditingImage] = useState(false);

  // Načítanie textu z backendu
  const { text, isLoading, error, setText } = useParagraph('about');
  
  // Načítanie obrázka z backendu
  const { text: image, setText: setImage } = useParagraph('about_image');

  const { isAuthenticated, role } = useAuth();
  
  const handleSaveImage = (files: string[]) => {
    if (files && files[0]) {
      setImage(files[0]); // Uloží na backend
    }
  };

  return (
    <section id="about" className="py-12 md:py-20 px-4">
      <div className="w-full max-w-[1650px] mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8">O nás</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

          <div className="relative group">
            <div className="text-lg md:text-xl xl:text-2xl space-y-5 md:space-y-6 leading-[1.8] whitespace-pre-line max-w-[700px]">

            {isLoading ? (
              <p className="text-muted-foreground">Načítavam obsah z backendu...</p>
            ) : error ? (
              <div className="text-red-500">
                {error}
              </div>
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
                className="edit-button"
                onClick={() => setIsEditingText(true)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            )}
          </div>


        <div className="relative p-4 sm:p-6 flex justify-center items-center overflow-hidden lg:overflow-visible">
          
          <div className="absolute top-2 left-2 w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 border-[2.5px] border-sky-400 rounded-full -translate-x-1/4 -translate-y-1/4 flex items-center justify-center -z-10">
            <div className="w-[85%] h-[85%] bg-[#DEE2D2] rounded-full"></div>
          </div>

          <div 
            className="absolute bottom-2 right-2 w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32 border-[3px] border-amber-900 rounded-full translate-x-1/4 translate-y-1/4"
            style={{ clipPath: 'inset(0 0 0 0)' }}
          >
          </div>

          <div className="relative z-10 group bg-muted rounded-[1.5rem] overflow-hidden border-[4px] sm:border-[10px] w-full max-w-[750px] aspect-[3/2]"
          style={{borderColor: '#B0C9D6',
            boxShadow: '10px 10px 0px #DBD4CE'
          }}>
            <img 
              src={image || "https://rcsirotar.sk/wp-content/uploads/2019/05/01_IMGP3994.jpg"} 
              alt="About" 
              className="z-0 w-full h-full object-cover transition-transform duration-200 group-hover:scale-105 will-change-transform" 
            />

            <div className="absolute inset-0 rounded-[3rem] pointer-events-none opacity-10 transition-opacity duration-300 group-hover:opacity-0"
            style={{backgroundColor: '#B0C9D6'
            }}>
            </div>

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
        title="Edit About Text"
        type="text"
        initialValue={[text || ""]}
        onSave={(files) => setText(files[0])}
        backendId="about"
      />
      
      <EditModal
        isOpen={isEditingImage}
        onClose={() => setIsEditingImage(false)}
        title="Edit About Image"
        type="image"
        initialValue={[image || "https://rcsirotar.sk/wp-content/uploads/2019/05/01_IMGP3994.jpg"]}
        onSave={handleSaveImage}
      />
    </section>
  );
};

export default AboutSection;