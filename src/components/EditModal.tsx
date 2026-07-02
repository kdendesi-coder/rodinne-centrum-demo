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
  initialValue?: string; // jeden súbor
  onSave: (file: string) => void;
}

const compressImage = (file: File, maxWidth = 1200, quality = 0.7): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const img = new Image();
      img.src = reader.result as string;
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
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });

const EditModal = ({
  isOpen,
  onClose,
  title,
  type,
  initialValue = "",
  localStorageKey,
  onSave,
}: EditModalProps) => {
  const [file, setFile] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Načíta súbor zo storage alebo z initialValue pri otvorení modalu
  useEffect(() => {
    if (!isOpen) return;
    const saved = localStorage.getItem(localStorageKey);
    setFile(saved || initialValue);
  }, [isOpen, initialValue, localStorageKey]);

  // Zmena súboru z input alebo drag&drop
  const handleFileChange = async (selectedFile?: File) => {
    if (!selectedFile) return;

    // PDF súbory
    if (selectedFile.type === "application/pdf" || selectedFile.name.endsWith(".pdf")) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setFile(result);
        localStorage.setItem(localStorageKey, result);
      };
      reader.readAsDataURL(selectedFile);
      return;
    }

    // Obrázky
    try {
      const compressed = await compressImage(selectedFile);
      setFile(compressed);
      localStorage.setItem(localStorageKey, compressed);
    } catch (err) {
      console.error(err);
      alert("Nepodarilo sa spracovať obrázok.");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFileChange(e.dataTransfer.files[0]);
  };

  const handleSave = () => {
    if (file) {
      onSave(file);
      localStorage.setItem(localStorageKey, file);
    }
    onClose();
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
          <p className="text-sm text-gray-500 mt-2">Presuň súbor sem alebo klikni pre výber</p>

          {file && (
            <div className="mt-4 w-48 h-48 mx-auto border rounded overflow-hidden flex items-center justify-center bg-gray-100">
              {file.startsWith("data:application/pdf") ? (
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
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditModal;