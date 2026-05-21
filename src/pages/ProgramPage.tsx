import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import programImage from "@/assets/program.jpg";

const ProgramPage = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-background px-4 py-10 md:py-16">
      <div className="w-full max-w-[1650px] mx-auto px-4 sm:px-6 lg:px-8">
        <Button
          variant="secondary"
          onClick={() => navigate("/")}
          className="mb-8 rounded-xl px-6 py-3 text-base md:text-lg"
        >
          Späť na hlavnú stránku
        </Button>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-10 text-[#5E7322]">
          Program
        </h1>

        <div className="relative flex justify-center items-center p-4 sm:p-6 overflow-hidden lg:overflow-visible">
          <div className="absolute top-4 left-4 w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 border-[2.5px] border-sky-400 rounded-full -translate-x-1/4 -translate-y-1/4 flex items-center justify-center -z-10">
            <div className="w-[85%] h-[85%] bg-[#DEE2D2] rounded-full"></div>
          </div>

          <div
            className="absolute bottom-4 right-4 w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32 border-[3px] border-amber-900 rounded-full translate-x-1/4 translate-y-1/4"
            style={{ clipPath: "inset(0 0 0 0)" }}
          ></div>

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
  );
};

export default ProgramPage;