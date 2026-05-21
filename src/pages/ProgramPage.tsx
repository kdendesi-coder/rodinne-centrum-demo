import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import programImage from "@/assets/program.jpg";

const ProgramPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-24">
        <div className="w-full max-w-[1200px] mx-auto py-12 md:py-20 px-4 sm:px-6 lg:px-8">
          
          {/* Back button */}
          <Button
            variant="ghost"
            onClick={() => navigate("/#activities")}
            className="mb-8 text-base md:text-lg text-[#5E7322] hover:text-[#5E7322] hover:bg-[#DEE2D2]"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Späť na aktivity
          </Button>

          {/* Header */}
          <h1 className="text-center text-4xl sm:text-5xl md:text-6xl font-bold mb-12 text-[#5E7322]">
            Program
          </h1>

          {/* Program image */}
          <div className="relative flex justify-center items-center p-4 sm:p-6 overflow-hidden lg:overflow-visible">
            
            {/* Hnedý oblúk */}
            <div
              className="absolute bottom-4 right-4 w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32 border-[3px] border-amber-900 rounded-full translate-x-1/4 translate-y-1/4"
              style={{ clipPath: "inset(0 0 0 0)" }}
            ></div>

            {/* Fotka programu */}
            <div
              className="relative z-10 bg-muted rounded-[1.5rem] overflow-hidden border-[6px] sm:border-[10px] w-full max-w-[768px]"
              style={{
                borderColor: "#B0C9D6",
                boxShadow: "10px 10px 0px #DBD4CE",
              }}
            >
              <img
                src={programImage}
                alt="Program"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProgramPage;