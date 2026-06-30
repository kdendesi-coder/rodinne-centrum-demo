import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  type: "image" | "file";
  localStorageKey: string;
  initialValue?: string[];
  onSave: (files: string[]) => void;
}

const EditModal = ({ isOpen, onClose, title, type, localStorageKey, initialValue = [], onSave }: EditModalProps) => {
  const [file, setFile] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Načítanie zo storage alebo initialValue pri otvorení modalu
  useEffect(() => {
    if (isOpen) {
      const savedFile = localStorage.getItem(localStorageKey);
      if (savedFile) {
        setFile(savedFile);
      } else {
        setFile(initialValue[0] || "");
      }
    }
  }, [isOpen, localStorageKey, initialValue]);

  const convertToBase64 = (selectedFile: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileChange = async (selectedFile: File | undefined) => {
    if (!selectedFile) return;

    // KONTROLA VEĽKOSTI: Ak má súbor viac ako 3 MB, radšej ho nepusti ďalej
    if (selectedFile.size > 3 * 1024 * 1024) {
      alert("Súbor je príliš veľký! Vyber si obrázok menší ako 3 MB, inak ho Local Storage neuloží.");
      return;
    }

    try {
      const base64String = await convertToBase64(selectedFile);
      setFile(base64String); // Zmena v reálnom čase v modale
    } catch (error) {
      console.error("Chyba pri čítaní súboru:", error);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFileChange(e.dataTransfer.files[0]);
  };

  const handleSave = () => {
    if (!file) {
      onClose();
      return;
    }

    try {
      // 1. Pokus o zápis do Local Storage
      localStorage.setItem(localStorageKey, file);
      console.log("Úspešne uložené do Local Storage pod kľúčom:", localStorageKey);

      // 2. Odoslanie do rodiča (zabezpečí zmenu na stránke v reálnom čase)
      onSave([file]);
      
      // 3. Zatvorenie modalu až po úspešnom uložení
      onClose();
    } catch (error: any) {
      console.error("CRITICAL ERROR pri ukladaní do Local Storage:", error);
      
      if (error.name === "QuotaExceededError" || error.code === 22) {
        alert("Chyba: Local Storage je plný! Tento obrázok má príliš veľké rozlíšenie/veľkosť.");
      } else {
        alert("Nepodarilo sa uložiť súbor: " + error.message);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept={type === "image" ? "image/*" : ".pdf"}
            onChange={(e) => handleFileChange(e.target.files?.[0])}
          />
          <p className="text-sm text-gray-500 mt-2">
            Presuň súbor sem alebo klikni pre výber
          </p>

          {file && (
            <div className="mt-4 w-48 h-48 mx-auto border rounded overflow-hidden flex items-center justify-center bg-gray-100">
              {file.startsWith("data:application/pdf") || file.endsWith(".pdf") ? (
                <embed src={file} type="application/pdf" width="100%" height="100%" />
              ) : (
                <img src={file} alt="Preview" className="w-full h-full object-contain" />
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditModal;