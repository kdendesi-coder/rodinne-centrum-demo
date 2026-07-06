import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit2 } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useState } from "react";
import EditModal from "@/components/EditModal";
import { useAuth } from "@/contexts/AuthContext";
import { useParagraph } from "@/hooks/useParagraph";

const ProgramPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuth();
  const canEdit = isAuthenticated && role === "Admin";

  const { text: backendProgramFile, setText: setBackendProgramFile } =
    useParagraph("program_image");

  const [isEditing, setIsEditing] = useState(false);

  const programFile =
    backendProgramFile && backendProgramFile.trim() !== ""
      ? backendProgramFile
      : "/program.jpg";

  const isPdf =
    programFile.startsWith("data:application/pdf") ||
    programFile.toLowerCase().endsWith(".pdf");

  const handleSaveProgram = async (newFiles: string[]) => {
    if (!newFiles[0]) return;

    await setBackendProgramFile(newFiles[0]);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen">
      <Navigation />

      <main className="pt-24">
        <div className="w-full max-w-[1400px] mx-auto py-12 md:py-20 px-4 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/#activities")}
            className="mb-8 text-base md:text-lg"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Späť na hlavnú stránku
          </Button>

          <h1 className="text-center text-4xl md:text-5xl font-bold mb-12">
            Program
          </h1>

          <div className="relative flex justify-center items-center p-4 sm:p-6 overflow-hidden lg:overflow-visible">
            <div className="relative z-10 bg-muted rounded-[1.5rem] overflow-hidden border-[6px] sm:border-[10px] w-full max-w-[768px] min-h-[300px] flex items-center justify-center">
              {isPdf ? (
                <embed
                  src={programFile}
                  type="application/pdf"
                  className="w-full h-[80vh]"
                />
              ) : (
                <img
                  src={programFile}
                  alt="Program"
                  className="w-full h-auto object-contain"
                />
              )}

              {canEdit && (
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

            {isEditing && (
              <EditModal
                isOpen={true}
                onClose={() => setIsEditing(false)}
                title="Upraviť program"
                type="file"
                initialValue={[programFile]}
                onSave={handleSaveProgram}
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