import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";
import EditModal from "./EditModal";
import { useParagraph } from "@/hooks/useParagraph";
import { useAuth } from "@/contexts/AuthContext"; 

const AboutSection = () => {
  const [isEditingText, setIsEditingText] = useState(false);
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [image, setImage] = useState("https://rcsirotar.sk/wp-content/uploads/2019/05/01_IMGP3994.jpg");

  // Use the custom hook - just one line!
  const { text, isLoading, error, setText } = useParagraph('about');

  // Add this to check authentication
  const { isAuthenticated, role } = useAuth();
  

  return (
    <section id="about" className="py-12 md:py-20 px-4">
      <div className="w-full max-w-[1650px] mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8">O nás</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

          <div className="relative group">
            <div className="text-lg md:text-xl xl:text-2xl space-y-5 md:space-y-6 leading-[1.8] whitespace-pre-line">

            {isLoading ? (
              <>
                <p>Rodinné centrum Sirotár pod sebou združuje rôzne aktivity. V rámci neho sme otvorili herňu Rodinného centra 
                a Átrium , ktoré sú určené mamičkám s menšími deťmi. </p>

                <p>Cieľom je vytvoriť priestor pre lepšie prežívanie materstva, osobný aj duchovný rozvoj a 
                sebarealizáciu mamičiek. Rovnako aj vytvoriť priestor pre zdravú socializáciu ich ratolestí.</p>
              </>
            
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : (
            <p className="text-muted-foreground leading-relaxed">{text}</p>
            )}
            </div>

            {/* Show edit button only for Admin users */}
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
          
          {/* Modrý kruh - posunutý tak, aby sedel k 600px šírke */}
          <div className="absolute top-2 left-2 w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 border-[2.5px] border-sky-400 rounded-full -translate-x-1/4 -translate-y-1/4 flex items-center justify-center -z-10">
            <div className="w-[85%] h-[85%] bg-[#DEE2D2] rounded-full"></div>
          </div>

          {/* Hnedý oblúk - posunutý k pravému dolnému rohu 600px obrazu */}
          <div 
            className="absolute bottom-2 right-2 w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32 border-[3px] border-amber-900 rounded-full translate-x-1/4 translate-y-1/4"
            style={{ clipPath: 'inset(0 0 0 0)' }}
          >
          </div>

          {/* HLAVNÝ OBRAZ: Nastavený na fixných 600x400px */}
          <div className="relative z-10 group bg-muted rounded-[1.5rem] overflow-hidden border-[6px] sm:border-[10px] w-full max-w-[750px] aspect-[3/2]"
          style={{borderColor: '#B0C9D6',
            boxShadow: '10px 10px 0px #DBD4CE'
          }}>
            {image ? (
              <>
              <img 
                src={image} 
                alt="About" 
                className="z-0 w-full h-full object-cover transition-transform duration-200 group-hover:scale-105" 
              />

              <div className="absolute inset-0 rounded-[3rem] pointer-events-none opacity-10 transition-opacity duration-300 group-hover:opacity-0"
              style={{backgroundColor: '#B0C9D6'
              }}>
              </div>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <svg className="w-24 h-24 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}

            {/* Admin tlačidlo */}
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
        initialValue={text}
        onSave={setText}
        backendId="about" // Pass the paragraph ID
      />
      <EditModal
        isOpen={isEditingImage}
        onClose={() => setIsEditingImage(false)}
        title="Edit About Image"
        type="image"
        initialValue={image}
        onSave={setImage}
      />
    </section>
  );
};

export default AboutSection;
