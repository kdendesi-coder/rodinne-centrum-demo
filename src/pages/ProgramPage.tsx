import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit2 } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

import { useState } from "react";
import EditModal from "@/components/EditModal";
import { useAuth } from "@/contexts/AuthContext";

const ProgramPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuth();

  // Pole pre viac súborov
  const [programFiles, setProgramFiles] = useState<string[]>(["/program.jpg"]);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-24">
        <div className="w-full max-w-[1200px] mx-auto py-12 md:py-20 px-4 sm:px-6 lg:px-8">
          
          {/* Back button */}
          <Button 
            variant="ghost" 
            onClick={() => navigate("/#activities")}
            className="mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Späť na hlavnú stránku
          </Button>

          {/* Header */}
          <h1 className="text-center text-4xl md:text-5xl font-bold mb-12">
            Program
          </h1>

          {/* Program images */}
          <div className="relative flex flex-wrap justify-center items-start gap-6">
            {programFiles.map((file, index) => (
              <div
                key={index}
                className="relative z-10 bg-muted rounded-[1.5rem] overflow-hidden border-[6px] sm:border-[10px] w-full max-w-[768px]"
              >
                {file.endsWith(".pdf") ? (
                  <embed src={file} type="application/pdf" width="100%" height="500px" />
                ) : (
                  <img
                    src={file}
                    alt={`Program ${index}`}
                    className="w-full h-auto object-contain"
                  />
                )}

                {/* Admin edit button */}
                {isAuthenticated && role === "Admin" && index === 0 && (
                  <div className="absolute top-4 right-4 z-20">
                    <Button size="icon" variant="secondary" onClick={() => setIsEditing(true)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            ))}

            {/* Edit modal */}
            {isEditing && (
              <EditModal
                isOpen={true}
                onClose={() => setIsEditing(false)}
                title="Upraviť program"
                type="file"
                initialValue={programFiles}
                onSave={(newFiles: string[]) => {
                  setProgramFiles(newFiles);
                  setIsEditing(false);
                }}
              />
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProgramPage;