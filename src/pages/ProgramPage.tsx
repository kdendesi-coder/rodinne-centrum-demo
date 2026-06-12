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

  // pole súborov (fotky alebo PDF)
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
            Späť na aktivity
          </Button>

          {/* Header */}
          <h1 className="text-center text-4xl md:text-5xl font-bold mb-12">
            Program
          </h1>

          {/* Grid pre všetky programy */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programFiles.map((file, idx) => (
              <div
                key={idx}
                className="relative bg-muted rounded-2xl overflow-hidden border-[6px] sm:border-[10px]"
              >
                <img
                  src={file}
                  alt={`Program ${idx + 1}`}
                  className="w-full h-auto object-contain"
                />

                {/* Admin edit button */}
                {isAuthenticated && role === "Admin" && (
                  <div className="absolute top-4 right-4 z-20">
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
            ))}
          </div>

          {/* Edit modal pre admina (drag & drop) */}
          {isEditing && isAuthenticated && role === "Admin" && (
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
      </main>

      <Footer />
    </div>
  );
};

export default ProgramPage;