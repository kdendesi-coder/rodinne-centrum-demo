import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ProgramPage = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-background px-4 py-10">
      <div className="w-full max-w-[1200px] mx-auto">
        <Button
          variant="secondary"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          Späť na hlavnú stránku
        </Button>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8 text-[#5E7322]">
          Program
        </h1>

        <div className="w-full flex justify-center">
          <img
            src="RC-Sirotar-herna-program_2026-05-768x1086.jpg"
            alt="Program"
            className="w-full max-w-[768px] h-auto object-contain rounded-3xl shadow-lg"
          />
        </div>
      </div>
    </main>
  );
};

export default ProgramPage;