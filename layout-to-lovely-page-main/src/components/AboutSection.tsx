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

  const { text, isLoading, error, setText } = useParagraph('about');

  const { isAuthenticated, role } = useAuth();
  

  return (
    <section id="about" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-12">O nás</h2>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative group">
            {isLoading ? (
              <div className="text-muted-foreground">Loading...</div>
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : (
            <p className="text-muted-foreground leading-relaxed">{text}</p>
            )}

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

          <div className="relative group bg-muted rounded-lg overflow-hidden aspect-video flex items-center justify-center">
            {image ? (
              <img src={image} alt="About" className="w-full h-full object-cover" />
            ) : (
              <div className="text-muted-foreground">
                <svg
                  className="w-24 h-24"
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

            {/* Show edit button only for Admin users */}
            {isAuthenticated && role === "Admin" && (
              <Button
                size="icon"
                variant="secondary"
                className="edit-button"
                onClick={() => setIsEditingImage(true)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
             )}

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
