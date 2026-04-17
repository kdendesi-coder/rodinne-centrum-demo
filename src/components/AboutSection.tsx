import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";
import EditModal from "./EditModal";
import { useParagraph } from "@/hooks/useParagraph";
import { useAuth } from "@/contexts/AuthContext";

const AboutSection = () => {
  const [isEditingText, setIsEditingText] = useState(false);
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [image, setImage] = useState(
    "https://rcsirotar.sk/wp-content/uploads/2019/05/01_IMGP3994.jpg"
  );

  const fallbackText = `Rodinné centrum Sirotár pod sebou združuje rôzne aktivity. V rámci neho sme otvorili herňu Rodinného centra a Átrium, ktoré sú určené mamičkám s menšími deťmi.

Cieľom je vytvoriť priestor pre lepšie prežívanie materstva, osobný aj duchovný rozvoj a sebarealizáciu mamičiek. Rovnako aj vytvoriť priestor pre zdravú socializáciu ich ratolestí.`;

  const { text, isLoading, error, setText } = useParagraph("about");
  const { isAuthenticated, role } = useAuth();

  const displayedText =
    text && text.trim().length > 50 ? text : fallbackText;

  return (
    <section id="about" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-12">O nás</h2>

        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="relative group">
            <div className="text-lg leading-[1.8]">
              {isLoading ? (
                <p className="text-muted-foreground whitespace-pre-line">
                  {fallbackText}
                </p>
              ) : error ? (
                <p className="text-muted-foreground whitespace-pre-line">
                  {fallbackText}
                </p>
              ) : (
                <p className="text-muted-foreground whitespace-pre-line">
                  {displayedText}
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

          <div className="relative p-4 flex justify-center items-center">
            <div className="absolute top-0 left-0 w-40 h-40 border-[2.5px] border-sky-400 rounded-full -translate-x-1/4 -translate-y-1/4 flex items-center justify-center -z-20">
              <div className="w-[85%] h-[85%] bg-[#DEE2D2] rounded-full"></div>
            </div>

            <div
              className="absolute bottom-0 right-0 w-32 h-32 border-[3px] border-amber-900 rounded-full translate-x-1/4 translate-y-1/4"
              style={{ clipPath: "inset(0 0 0 0)" }}
            ></div>

            <div
              className="relative z-10 group bg-muted rounded-[1.5rem] overflow-hidden border-[10px]"
              style={{
                borderColor: "#B0C9D6",
                boxShadow: "16px 16px 0px #DBD4CE",
              }}
            >
              {image ? (
                <>
                  <img
                    src={image}
                    alt="About"
                    className="z-0 w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                  />

                  <div
                    className="absolute inset-0 rounded-[3rem] pointer-events-none opacity-10 transition-opacity duration-300 group-hover:opacity-0"
                    style={{ backgroundColor: "#B0C9D6" }}
                  ></div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <svg
                    className="w-74 h-74 opacity-20"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}

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
        initialValue={displayedText}
        onSave={(value) => typeof value === "string" ? setText(value) : undefined}
        backendId="about"
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