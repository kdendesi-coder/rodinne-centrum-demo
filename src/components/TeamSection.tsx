import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit2, Plus, Trash2 } from "lucide-react";
import EditModal from "./EditModal";
import { useAuth } from "@/contexts/AuthContext"; // Add this import


interface TeamMember {
  name: string;
  role: string;
  image: string;
}

const TeamSection = () => {
  const [members, setMembers] = useState<TeamMember[]>([
    { name: "Miroslav Uhrina  ", role: "Koordinátor Rodinného centra", image: "/Miroslav-Uhrina.jpg" },
    { name: "Katarína Sopková", role: "Zodpovedná za herňu", image: "/Katarína-Sopková.jpg" },
    { name: "Mária Sroková  ", role: "Zodpovedná za Átrium", image: "/Mária-Sroková.jpg" },
    { name: "Magdaléna Uhrinová Brezániová", role: "Dobrovoľníčka v herni", image: "/Magdaléna-Uhrinová-Brezániová.jpg" },
  ]);

  const [editingMember, setEditingMember] = useState<number | null>(null);
  const [editingField, setEditingField] = useState<"name" | "role" | "image" | null>(null);
  const [isEditingIntro, setIsEditingIntro] = useState(false);

  const [isAddingMember, setIsAddingMember] = useState(false);
  const [newMember, setNewMember] = useState<TeamMember>({ name: "", role: "", image: "" });
  
  const [introText, setIntroText] = useState<string>(
    "Náš tím tvoria nadšení ľudia, ktorí láskou a odbornosťou pripravujú každú aktivitu."
  );

  useEffect(() => {
  const savedMembers = localStorage.getItem("teamMembers");

  if (savedMembers) {
    setMembers(JSON.parse(savedMembers));
  }
  }, []);

  const handleSaveMember = (
    index: number,
    field: "name" | "role" | "image",
    value: string
  ) => {
    const newMembers = [...members];
    newMembers[index] = { ...newMembers[index], [field]: value };

    setMembers(newMembers);
    localStorage.setItem("teamMembers", JSON.stringify(newMembers));
  };

  const handleImageFile = (file: File, callback: (imageData: string) => void) => {
  if (!file.type.startsWith("image/")) {
    alert("Vyber iba obrázok.");
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    if (typeof reader.result === "string") {
      callback(reader.result);
    }
  };

  reader.readAsDataURL(file);
};

  const handleAddMember = () => {
  if (!newMember.name.trim() || !newMember.role.trim() || !newMember.image.trim()) {
    return;
  }

  const updatedMembers = [...members, newMember];

  setMembers(updatedMembers);
  localStorage.setItem("teamMembers", JSON.stringify(updatedMembers));

  setNewMember({ name: "", role: "", image: "" });
  setIsAddingMember(false);
  };

  const handleDeleteMember = (index: number) => {
  const updatedMembers = members.filter((_, i) => i !== index);

  setMembers(updatedMembers);
  localStorage.setItem("teamMembers", JSON.stringify(updatedMembers));
  };

  // Add this to check authentication
  const { isAuthenticated, role } = useAuth();

  return (
    <section id="team" className="py-12 md:py-20 px-4 bg-muted/30 overflow-hidden">
      <div className="w-full max-w-[1650px] mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8">Náš tím :)</h2>
        
        <div className="relative group/intro mb-12">
          <p className="text-base md:text-lg xl:text-xl leading-[1.8] text-muted-foreground">{introText}</p>

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

        {isAuthenticated && role === "Admin" && (
        <div className="mb-10 flex justify-center sm:justify-start">
          <Button
            onClick={() => setIsAddingMember(true)}
            className="flex items-center gap-2 rounded-xl px-5 py-3 text-base md:text-lg"
          >
            <Plus className="h-5 w-5" />
            Pridať člena tímu
          </Button>
        </div>
      )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10 xl:gap-12">
          {members.map((member, index) => (
            //text-center do className
            <div key={index} className="group/member">
              <div className="relative mb-4 inline-block">
                <div className="w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 xl:w-80 xl:h-80 rounded-3xl bg-muted mx-auto flex justify-center overflow-hidden">
                  {member.image ? (
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover transition-transform duration-300 group-hover/member:scale-110" />
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
                    className="absolute top-2 right-2 opacity-100 lg:opacity-0 lg:group-hover/member:opacity-100 transition-opacity h-8 w-8"
                    onClick={() => {
                      setEditingMember(index);
                      setEditingField("image");
                    }}
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                )}

                {isAuthenticated && role === "Admin" && (
                  <Button
                    size="icon"
                    variant="destructive"
                    className="absolute top-2 left-2 opacity-100 lg:opacity-0 lg:group-hover/member:opacity-100 transition-opacity h-8 w-8"
                    onClick={() => handleDeleteMember(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="relative group/name block">
                <h3 className="text-xl md:text-2xl xl:text-3xl font-semibold text-[#5E7322]">{member.name}</h3>

                {/* Show edit button only for Admin users */}
                {isAuthenticated && role === "Admin" && (
                  <Button
                    size="icon"
                    variant="secondary"
                    className="inline-flex ml-2 h-6 w-6 opacity-100 lg:opacity-0 lg:group-hover/name:opacity-100 transition-opacity align-middle"
                    onClick={() => {
                      setEditingMember(index);
                      setEditingField("name");
                    }}
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                )}
              </div>

              <div className="relative group/role block">
                <p className="text-base md:text-lg xl:text-xl text-muted-foreground mt-2">{member.role}</p>

                {/* Show edit button only for Admin users */}
                {isAuthenticated && role === "Admin" && (
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-6 w-6 opacity-100 lg:opacity-0 lg:group-hover/role:opacity-100 transition-opacity"
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
        onSave={(value) => setIntroText(value)}
      />
      {editingMember !== null && editingField && editingField !== "image" && (
  <EditModal
    isOpen={true}
    onClose={() => {
      setEditingMember(null);
      setEditingField(null);
    }}
    title={`Edit ${editingField === "name" ? "Name" : "Role"}`}
    type="text"
    initialValue={members[editingMember][editingField]}
    onSave={(value) => {
      handleSaveMember(editingMember, editingField, value);
      setEditingMember(null);
      setEditingField(null);
    }}
  />
)}

    {editingMember !== null && editingField === "image" && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
        <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
          <h3 className="text-2xl font-bold mb-5 text-[#5E7322]">
            Upraviť fotku člena tímu
          </h3>

          <div
            className="flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-4 text-center hover:bg-gray-100"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();

              const file = e.dataTransfer.files?.[0];
              if (!file) return;

              handleImageFile(file, (imageData) => {
                handleSaveMember(editingMember, "image", imageData);
              });
            }}
          >
            {members[editingMember].image ? (
              <img
                src={members[editingMember].image}
                alt="Náhľad fotky"
                className="h-48 w-48 rounded-2xl object-cover"
              />
            ) : (
              <p className="text-sm text-gray-600">
                Presuň sem obrázok alebo ho vyber z počítača
              </p>
            )}

            <input
              type="file"
              accept="image/*"
              className="mt-4 block text-sm"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                handleImageFile(file, (imageData) => {
                  handleSaveMember(editingMember, "image", imageData);
                });
              }}
            />
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                setEditingMember(null);
                setEditingField(null);
              }}
            >
              Zrušiť
            </Button>

            <Button
              onClick={() => {
                setEditingMember(null);
                setEditingField(null);
              }}
            >
              Hotovo
            </Button>
          </div>
        </div>
      </div>
    )}

  {isAddingMember && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
    <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
      <h3 className="text-2xl font-bold mb-5 text-[#5E7322]">
        Pridať člena tímu
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Meno</label>
          <input
            type="text"
            value={newMember.name}
            onChange={(e) =>
              setNewMember((prev) => ({ ...prev, name: e.target.value }))
            }
            className="w-full rounded-xl border px-4 py-2"
            placeholder="Zadaj meno"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Rola</label>
          <input
            type="text"
            value={newMember.role}
            onChange={(e) =>
              setNewMember((prev) => ({ ...prev, role: e.target.value }))
            }
            className="w-full rounded-xl border px-4 py-2"
            placeholder="Zadaj rolu"
          />
        </div>

        <div
          className="flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-4 text-center hover:bg-gray-100"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();

            const file = e.dataTransfer.files?.[0];
            if (!file) return;

            handleImageFile(file, (imageData) => {
              setNewMember((prev) => ({ ...prev, image: imageData }));
            });
          }}
        >
          {newMember.image ? (
            <img
              src={newMember.image}
              alt="Náhľad člena tímu"
              className="h-40 w-40 rounded-2xl object-cover"
            />
          ) : (
            <p className="text-sm text-gray-600">
              Presuň sem obrázok alebo ho vyber z počítača
            </p>
          )}

          <input
            type="file"
            accept="image/*"
            className="mt-4 block text-sm"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;

              handleImageFile(file, (imageData) => {
                setNewMember((prev) => ({ ...prev, image: imageData }));
              });
            }}
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <Button
          variant="secondary"
          onClick={() => setIsAddingMember(false)}
        >
          Zrušiť
        </Button>

        <Button onClick={handleAddMember}>
          Pridať
        </Button>
      </div>
    </div>
  </div>
)}

    </section>
  );
};

export default TeamSection;
