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
  type: "image" | "file" | "text"; // Pridal som aj "text" pre istotu kvôli About sekcii
  localStorageKey: string;
  initialValue?: string[];
  onSave: (files: string[]) => void;
  backendId?: string;
}

const compressImage = (selectedFile: File, maxWidth = 1200, quality = 0.7): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        const compressedBase64 = canvas.toDataURL("image/jpeg", quality);
        resolve(compressedBase64);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

const convertToBase64 = (selectedFile: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

const EditModal = ({ isOpen, onClose, title, type, localStorageKey, initialValue = [], onSave }: EditModalProps) => {
  const [file, setFile] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

 
  useEffect(() => {
    if (isOpen) {
      const savedFile = localStorage.getItem(localStorageKey);
      if (savedFile) {
        setFile(savedFile);
      } else {
        setFile(initialValue[0] || "");
      }
    }

  }, [isOpen, localStorageKey]);

  const handleFileChange = async (selectedFile: File | undefined) => {
    if (!selectedFile) return;

    if (selectedFile.type === "application/pdf" || selectedFile.name.endsWith(".pdf")) {
      if (selectedFile.size > 3 * 1024 * 1024) {
        alert("PDF súbor je príliš veľký! Maximum pre PDF je 3 MB.");
        return;
      }
      try {
        const base64String = await convertToBase64(selectedFile);
        setFile(base64String);
      } catch (error) {
        console.error("Chyba pri čítaní PDF:", error);
      }
      return;
    }

    try {
      
      const compressedBase64 = await compressImage(selectedFile, 1200, 0.7);
      setFile(compressedBase64); 
    } catch (error) {
      console.error("Chyba pri kompresii obrázka:", error);
      alert("Nepodarilo sa spracovať obrázok.");
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
      localStorage.setItem(localStorageKey, file);

      onSave([file]);
      
      onClose();
    } catch (error: any) {
      console.error("Chyba pri ukladaní:", error);
      if (error.name === "QuotaExceededError" || error.code === 22) {
        alert("Chyba: Úložisko je plné. Vyber iný obrázok.");
      } else {
        alert("Nepodarilo sa uložiť: " + error.message);
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