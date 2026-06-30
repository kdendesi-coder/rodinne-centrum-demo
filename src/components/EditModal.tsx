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
  initialValue?: string;
  onSave: (file: string) => void;
}

const EditModal = ({
  isOpen,
  onClose,
  title,
  type,
  localStorageKey,
  initialValue = "",
  onSave,
}: EditModalProps) => {
  const [file, setFile] = useState<string>(initialValue);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // načítanie zo storage pri mount
  useEffect(() => {
    const savedFile = localStorage.getItem(localStorageKey);
    if (savedFile) setFile(savedFile);
    else setFile(initialValue);
  }, [initialValue, isOpen, localStorageKey]);

  // Konverzia súboru na Base64
  const fileToBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      const base64 = await fileToBase64(droppedFile);
      setFile(base64);
      localStorage.setItem(localStorageKey, base64);
    }
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFile = e.target.files?.[0];
    if (newFile) {
      const base64 = await fileToBase64(newFile);
      setFile(base64);
      localStorage.setItem(localStorageKey, base64);
    }
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
            onChange={handleFileChange}
          />
          <p className="text-sm text-gray-500 mt-2">
            Presuň súbor sem alebo klikni pre výber
          </p>

          {file && (
            <div className="mt-4 w-48 h-48 mx-auto border rounded overflow-hidden">
              {file.endsWith(".pdf") ? (
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
          <Button
            onClick={() => {
              if (file) {
                onSave(file);
                localStorage.setItem(localStorageKey, file);
              }
              onClose();
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditModal;