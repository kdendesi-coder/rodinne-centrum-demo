import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";
import EditModal from "./EditModal";
import { useAuth } from "@/contexts/AuthContext";

// Firebase imports
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { app } from "@/lib/firebase"; // tvoja Firebase init

const HeroSection = () => {
  const { isAuthenticated, role } = useAuth();
  const [isEditingImage, setIsEditingImage] = useState(false);

  const [backgroundImage, setBackgroundImage] = useState("/ContainerLargeEdit2.jpg");

  const storage = getStorage(app);
  const firestore = getFirestore(app);

  const HERO_DOC = "hero_image_doc";

  // Načítanie obrázka zo servera pri mount
  useEffect(() => {
    const fetchImage = async () => {
      const docRef = doc(firestore, "heroImages", HERO_DOC);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setBackgroundImage(docSnap.data().url);
      }
    };
    fetchImage();
  }, []);

  const handleSaveImage = async (fileBase64: string) => {
    try {
      // prevedieme Base64 na blob
      const res = await fetch(fileBase64);
      const blob = await res.blob();

      // upload do Firebase Storage
      const storageRef = ref(storage, "hero_background.jpg");
      await uploadBytes(storageRef, blob);

      const downloadUrl = await getDownloadURL(storageRef);

      // uloženie URL do Firestore
      await setDoc(doc(firestore, "heroImages", HERO_DOC), { url: downloadUrl });

      // update state
      setBackgroundImage(downloadUrl);
    } catch (err) {
      console.error("Upload failed", err);
      alert("Nepodarilo sa uložiť obrázok na server");
    }
  };

  const titlePart1 = "Rodinné centrum";
  const titlePart2 = "Sirotár";

  return (
    <div className="w-full max-w-[1867px] mx-auto px-4 sm:px-6 lg:px-8 my-8 md:my-12">
      <div className="relative w-full h-[360px] sm:h-[420px] md:h-[560px] lg:h-[680px] xl:h-[760px] rounded-2xl md:rounded-3xl overflow-hidden group shadow-lg">
        <img
          src={backgroundImage}
          alt="Hero background"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {isAuthenticated && role === "Admin" && (
          <Button
            size="icon"
            variant="secondary"
            className="absolute top-4 right-4 z-20 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition"
            onClick={() => setIsEditingImage(true)}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        )}

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative z-10 text-center px-4 w-full max-w-4xl">
            <h1 className="font-bold text-[#95C11F] mb-4 text-center uppercase flex flex-col items-center">
              <span>{titlePart1}</span>
              <span>{titlePart2}</span>
            </h1>
          </div>
        </div>
      </div>

      <EditModal
        isOpen={isEditingImage}
        onClose={() => setIsEditingImage(false)}
        title="Edit Hero Background"
        type="image"
        initialValue={backgroundImage}
        onSave={handleSaveImage} // uložíme priamo do cloudu
      />
    </div>
  );
};

export default HeroSection;