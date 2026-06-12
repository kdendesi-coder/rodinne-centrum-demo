import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit2 } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

import { useState } from "react";

import EditModal from "@/components/EditModal";
import { useAuth } from "@/contexts/AuthContext";
//import programImage from "@/public/program.jpg";

const ProgramPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuth();

  const [programFile, setProgramFile] = useState<string>("/program.jpg");
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

          {/* Program image */}
          <div className="relative flex justify-center items-center p-4 sm:p-6 overflow-hidden lg:overflow-visible">
            
            {/* Fotka programu */}
            <div
              className="relative z-10 bg-muted rounded-[1.5rem] overflow-hidden border-[6px] sm:border-[10px] w-full max-w-[768px]"
            >
              <img
                src={programFile}
                alt="Program"
                className="w-full h-auto object-contain"
              />
              
              {isAuthenticated && role === "Admin" && (
                <div className="absolute top-4 right-4 z-20">
                  <Button size="icon" variant="secondary" onClick={() => setIsEditing(true)}>
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
                type="image"
                initialValue={programFile}
                onSave={(newFile: string) => {
                  setProgramFile(newFile);
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