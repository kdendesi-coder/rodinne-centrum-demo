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
  // Stav pre aktuálne zobrazený súbor (môže byť Base64 string)
  const [file, setFile] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Načítanie zo storage alebo initialValue pri otvorení modalu alebo zmene kľúča
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

  // Pomocná funkcia na konverziu súboru do Base64 (DataURL)
  const convertToBase64 = (selectedFile: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Spracovanie vybraného súboru
  const handleFileChange = async (selectedFile: File | undefined) => {
    if (!selectedFile) return;

    try {
      // Skonvertujeme súbor do Base64 textu
      const base64String = await convertToBase64(selectedFile);
      // Okamžite zmeníme stav v reálnom čase (používateľ vidí zmenu preview)
      setFile(base64String);
    } catch (error) {
      console.error("Chyba pri čítaní súboru:", error);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    handleFileChange(droppedFile);
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleSave = () => {
    if (file) {
      // Uložíme permanentný Base64 string do LocalStorage
      localStorage.setItem(localStorageKey, file);
      // Odovzdáme ho rodičovskému komponentu
      onSave([file]);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px] animate-scale-in">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
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
            <div className="mt-4 w-48 h-48 mx-auto border rounded overflow-hidden">
              {/* Kontrola Base64 pre PDF alebo podľa typu */}
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