import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const programImages: Record<string, string> = {
  herna: "/program-herna.jpg",
  atrium: "/program-atrium.jpg",
  klubik: "/program-klubik.jpg",
};

const programTitles: Record<string, string> = {
  herna: "Program Herňa",
  atrium: "Program Átrium",
  klubik: "Program Klubík",
};

const ProgramPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const image = id ? programImages[id] : "";
  const title = id ? programTitles[id] : "Program";

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
          {title}
        </h1>

        {image ? (
          <div className="w-full rounded-3xl overflow-hidden shadow-lg bg-muted">
            <img
              src={image}
              alt={title}
              className="w-full h-auto object-contain"
            />
          </div>
        ) : (
          <p className="text-xl text-muted-foreground">
            Program pre túto aktivitu zatiaľ nie je dostupný.
          </p>
        )}
      </div>
    </main>
  );
};

export default ProgramPage;