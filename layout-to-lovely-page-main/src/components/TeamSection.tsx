import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";
import EditModal from "./EditModal";
import { useAuth } from "@/contexts/AuthContext"; // Add this import


interface TeamMember {
  name: string;
  role: string;
  image: string;
}

const TeamSection = () => {
  const [members, setMembers] = useState<TeamMember[]>([
    { name: "Meno a Priezvisko", role: "Lorem ipsum dolor sit amet", image: "" },
    { name: "Meno a Priezvisko", role: "Lorem ipsum dolor sit amet", image: "" },
    { name: "Meno a Priezvisko", role: "Lorem ipsum dolor sit amet", image: "" },
    { name: "Meno a Priezvisko", role: "Lorem ipsum dolor sit amet", image: "" },
  ]);

  const [editingMember, setEditingMember] = useState<number | null>(null);
  const [editingField, setEditingField] = useState<"name" | "role" | "image" | null>(null);
  const [isEditingIntro, setIsEditingIntro] = useState(false);
  
  const [introText, setIntroText] = useState(
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
  );

  const handleSaveMember = (index: number, field: "name" | "role" | "image", value: string) => {
    const newMembers = [...members];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setMembers(newMembers);
  };

  // Add this to check authentication
  const { isAuthenticated, role } = useAuth();

  return (
    <section id="team" className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Our team</h2>
        
        <div className="relative group/intro mb-12">
          <p className="text-muted-foreground">{introText}</p>

          {/* Show edit button only for Admin users */}
          {isAuthenticated && role === "Admin" && (
            <Button
              size="icon"
              variant="secondary"
              className="absolute top-0 right-0 opacity-0 group-hover/intro:opacity-100 transition-opacity h-7 w-7"
              onClick={() => setIsEditingIntro(true)}
            >
              <Edit2 className="h-3 w-3" />
            </Button>
          )}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {members.map((member, index) => (
            <div key={index} className="text-center group/member">
              <div className="relative mb-4 inline-block">
                <div className="w-32 h-32 rounded-full bg-muted mx-auto flex items-center justify-center overflow-hidden">
                  {member.image ? (
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    <svg
                      className="w-16 h-16 text-muted-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  )}
                </div>

                {/* Show edit button only for Admin users */}
                {isAuthenticated && role === "Admin" && (
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute top-0 right-0 opacity-0 group-hover/member:opacity-100 transition-opacity h-7 w-7"
                    onClick={() => {
                      setEditingMember(index);
                      setEditingField("image");
                    }}
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                )}
              </div>

              <div className="relative group/name inline-block mb-2">
                <h3 className="font-semibold">{member.name}</h3>

                {/* Show edit button only for Admin users */}
                {isAuthenticated && role === "Admin" && (
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute -top-1 -right-8 opacity-0 group-hover/name:opacity-100 transition-opacity h-6 w-6"
                    onClick={() => {
                      setEditingMember(index);
                      setEditingField("name");
                    }}
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                )}
              </div>

              <div className="relative group/role inline-block">
                <p className="text-sm text-muted-foreground">{member.role}</p>

                {/* Show edit button only for Admin users */}
                {isAuthenticated && role === "Admin" && (
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute -top-1 -right-8 opacity-0 group-hover/role:opacity-100 transition-opacity h-6 w-6"
                    onClick={() => {
                      setEditingMember(index);
                      setEditingField("role");
                    }}
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                )}
                
              </div>
            </div>
          ))}
        </div>
      </div>

      <EditModal
        isOpen={isEditingIntro}
        onClose={() => setIsEditingIntro(false)}
        title="Edit Team Introduction"
        type="text"
        initialValue={introText}
        onSave={setIntroText}
      />
      {editingMember !== null && editingField && (
        <EditModal
          isOpen={true}
          onClose={() => {
            setEditingMember(null);
            setEditingField(null);
          }}
          title={`Edit ${editingField === "image" ? "Image" : editingField === "name" ? "Name" : "Role"}`}
          type={editingField === "image" ? "image" : "text"}
          initialValue={members[editingMember][editingField]}
          onSave={(value) => handleSaveMember(editingMember, editingField, value)}
        />
      )}
    </section>
  );
};

export default TeamSection;
