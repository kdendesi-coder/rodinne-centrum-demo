import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";
import EditModal from "./EditModal";
import { useAuth } from "@/contexts/AuthContext";

const HeroSection = () => {
  const [isEditingImage, setIsEditingImage] = useState(false);

  // Rozdelil som nadpis na dve časti pre lepšiu kontrolu
  const titlePart1 = "Rodinné centrum";
  const titlePart2 = "Sirotár";

  const [backgroundImage, setBackgroundImage] = useState("ContainerLargeEdit2.jpg");
  const { isAuthenticated, role } = useAuth();

  return (
    <div className="w-full max-w-[1867px] mx-auto px-4 sm:px-6 lg:px-8 my-8 md:my-12">
      <div className="relative w-full h-[360px] sm:h-[420px] md:h-[560px] lg:h-[680px] xl:h-[760px] rounded-2xl md:rounded-3xl overflow-hidden group shadow-lg">
        
        <img
          src={backgroundImage}
          alt="Hero background"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {isAuthenticated && role === "Admin" && (
          <Button
            size="icon"
            variant="secondary"
            className="absolute top-4 right-4 z-20 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition"
            onClick={() => setIsEditingImage(true)}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        )}

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative z-10 text-center px-4 w-full max-w-4xl">
            <h1 className="font-bold text-[#95C11F] mb-4 text-center uppercase w-full flex flex-col items-center"
            style={{
              fontFamily: "Cormorant Garamond",
              fontWeight: "700",
              fontSize: "clamp(2.3rem, 7vw, 105px)", 
              margin: "0 auto",
              lineHeight: "1.1"
            }}>
              {/* Prva cast 2 slova */}
              <span className="block whitespace-nowrap">{titlePart1}</span>
              {/* Druha cast (1 slovo pod nimi) */}
              <span className="block">{titlePart2}</span>
            </h1>

            <div className="flex flex-wrap justify-center gap-2 md:gap-4 mt-6">
              <span className="px-3 py-1 md:px-4 md:py-2 rounded-full border border-[#5E7322] text-[#5E7322] text-sm md:text-base font-medium items-center justify-center">Komunita</span>
              <span className="px-3 py-1 md:px-4 md:py-2 rounded-full border border-[#C66812] text-[#C66812] text-sm md:text-base font-medium items-center justify-center">Rast</span>
              <span className="px-3 py-1 md:px-4 md:py-2 rounded-full border border-[#0C5E85] text-[#0C5E85] text-sm md:text-base font-medium items-center justify-center">Duchovné zázemie</span>
            </div>

            <Button
              size="lg"
              className="mt-6 bg-primary hover:bg-primary/90 rounded-full px-12 md:px-16 py-6 md:py-8 text-lg md:text-3xl font-semibold items-center justify-center"
              onClick={() => {
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Kontaktujte nás
            </Button>
          </div>
        </div>
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