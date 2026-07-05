import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit2, Plus, Trash2 } from "lucide-react";
import EditModal from "./EditModal";
import { useAuth } from "@/contexts/AuthContext";
import { useParagraph } from "@/hooks/useParagraph";

interface TeamMember {
  name: string;
  role: string;
  image: string;
}

const defaultMembers: TeamMember[] = [
  {
    name: "Miroslav Uhrina",
    role: "Koordinátor Rodinného centra",
    image: "/Miroslav-Uhrina.jpg",
  },
  {
    name: "Katarína Sopková",
    role: "Zodpovedná za herňu",
    image: "/Katarína-Sopková.jpg",
  },
  {
    name: "Mária Sroková",
    role: "Zodpovedná za Átrium",
    image: "/Mária-Sroková.jpg",
  },
  {
    name: "Magdaléna Uhrinová Brezániová",
    role: "Dobrovoľníčka v herni",
    image: "/Magdaléna-Uhrinová-Brezániová.jpg",
  },
];

const defaultIntroText =
  "Náš tím tvoria nadšení ľudia, ktorí láskou a odbornosťou pripravujú každú aktivitu.";

const safeJsonParse = <T,>(value: string | null | undefined, fallback: T): T => {
  if (!value) return fallback;

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

const imageToBase64Compressed = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxWidth = 900;

        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) return reject("Canvas error");

        ctx.drawImage(img, 0, 0, width, height);

        resolve(canvas.toDataURL("image/jpeg", 0.75));
      };

      img.onerror = reject;
      img.src = reader.result as string;
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const TeamSection = () => {
  const { isAuthenticated, role } = useAuth();
  const canEdit = isAuthenticated && role === "Admin";

  const { text: backendTeamMembers, setText: setBackendTeamMembers } =
    useParagraph("team_members_data");

  const { text: backendTeamIntro, setText: setBackendTeamIntro } =
    useParagraph("team_intro_text");

  const [members, setMembers] = useState<TeamMember[]>(defaultMembers);
  const [introText, setIntroText] = useState<string>(defaultIntroText);

  const [editingMember, setEditingMember] = useState<number | null>(null);
  const [editingField, setEditingField] = useState<
    "name" | "role" | "image" | null
  >(null);

  const [isEditingIntro, setIsEditingIntro] = useState(false);
  const [isAddingMember, setIsAddingMember] = useState(false);

  const [newMember, setNewMember] = useState<TeamMember>({
    name: "",
    role: "",
    image: "",
  });

  useEffect(() => {
    const parsedMembers = safeJsonParse<TeamMember[]>(
      backendTeamMembers,
      defaultMembers
    );

    setMembers(parsedMembers.length > 0 ? parsedMembers : defaultMembers);
  }, [backendTeamMembers]);

  useEffect(() => {
    if (backendTeamIntro && backendTeamIntro.trim() !== "") {
      setIntroText(backendTeamIntro);
    } else {
      setIntroText(defaultIntroText);
    }
  }, [backendTeamIntro]);

  const saveMembers = async (updatedMembers: TeamMember[]) => {
    setMembers(updatedMembers);
    await setBackendTeamMembers(JSON.stringify(updatedMembers));
  };

  const handleSaveIntro = async (value: string) => {
    setIntroText(value);
    await setBackendTeamIntro(value);
  };

  const handleSaveMember = async (
    index: number,
    field: "name" | "role" | "image",
    value: string
  ) => {
    const updatedMembers = [...members];

    updatedMembers[index] = {
      ...updatedMembers[index],
      [field]: value,
    };

    await saveMembers(updatedMembers);
  };

  const handleImageFile = async (
    file: File,
    callback: (imageData: string) => void
  ) => {
    if (!file.type.startsWith("image/")) {
      alert("Vyber iba obrázok.");
      return;
    }

    const compressedImage = await imageToBase64Compressed(file);
    callback(compressedImage);
  };

  const handleAddMember = async () => {
    if (
      !newMember.name.trim() ||
      !newMember.role.trim() ||
      !newMember.image.trim()
    ) {
      return;
    }

    const updatedMembers = [...members, newMember];

    await saveMembers(updatedMembers);

    setNewMember({
      name: "",
      role: "",
      image: "",
    });

    setIsAddingMember(false);
  };

  const handleDeleteMember = async (index: number) => {
    const updatedMembers = members.filter((_, i) => i !== index);
    await saveMembers(updatedMembers);
  };

  return (
    <section
      id="team"
      className="py-12 md:py-20 px-4 bg-muted/30 overflow-hidden"
    >
      <div className="w-full max-w-[1650px] mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8">
          Náš tím
        </h2>

        <div className="relative group/intro mb-12">
          <p className="text-base md:text-lg xl:text-xl leading-[1.8] text-muted-foreground">
            {introText}
          </p>

          {canEdit && (
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

        {canEdit && (
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
            <div key={index} className="group/member text-center">
              <div className="relative mb-4 inline-block">
                <div className="w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 xl:w-80 xl:h-80 rounded-3xl bg-muted mx-auto flex justify-center overflow-hidden">
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover/member:scale-110"
                    />
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

                {canEdit && (
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

                {canEdit && (
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
                <h3 className="text-xl md:text-2xl xl:text-3xl font-semibold text-[#5E7322]">
                  {member.name}
                </h3>

                {canEdit && (
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
                <p className="text-base md:text-lg xl:text-xl text-muted-foreground mt-2">
                  {member.role}
                </p>

                {canEdit && (
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
        title="Upraviť text tímu"
        type="text"
        initialValue={introText}
        onSave={async (value) => {
          await handleSaveIntro(value);
          setIsEditingIntro(false);
        }}
      />

      {editingMember !== null &&
        editingField &&
        editingField !== "image" && (
          <EditModal
            isOpen={true}
            onClose={() => {
              setEditingMember(null);
              setEditingField(null);
            }}
            title={`Upraviť ${editingField === "name" ? "meno" : "rolu"}`}
            type="text"
            initialValue={members[editingMember][editingField]}
            onSave={async (value) => {
              await handleSaveMember(editingMember, editingField, value);
              setEditingMember(null);
              setEditingField(null);
            }}
          />
        )}

      {editingMember !== null && editingField === "image" && (
        <EditModal
          isOpen={true}
          onClose={() => {
            setEditingMember(null);
            setEditingField(null);
          }}
          title="Upraviť fotku člena tímu"
          type="image"
          initialValue={[members[editingMember]?.image || ""]}
          onSave={async (files) => {
            if (files[0]) {
              await handleSaveMember(editingMember, "image", files[0]);
            }

            setEditingMember(null);
            setEditingField(null);
          }}
        />
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
                    setNewMember((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
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
                    setNewMember((prev) => ({
                      ...prev,
                      role: e.target.value,
                    }))
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
                    setNewMember((prev) => ({
                      ...prev,
                      image: imageData,
                    }));
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
                      setNewMember((prev) => ({
                        ...prev,
                        image: imageData,
                      }));
                    });
                  }}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => {
                  setNewMember({
                    name: "",
                    role: "",
                    image: "",
                  });
                  setIsAddingMember(false);
                }}
              >
                Zrušiť
              </Button>

              <Button onClick={handleAddMember}>Pridať</Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default TeamSection;