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
  const [file, setFile] = useState<string>(initialValue[0] || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // načítanie zo storage pri mount
  useEffect(() => {
    const savedFile = localStorage.getItem(localStorageKey);
    if (savedFile) setFile(savedFile);
    else setFile(initialValue[0] || "");
  }, [initialValue, isOpen, localStorageKey]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      const url = URL.createObjectURL(droppedFile);
      setFile(url);
      localStorage.setItem(localStorageKey, url); 
    }
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

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
            onChange={(e) => {
              const newFile = e.target.files?.[0];
              if (newFile) {
                const url = URL.createObjectURL(newFile);
                setFile(url);
                localStorage.setItem(localStorageKey, url); 
              }
            }}
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
                onSave([file]);
                localStorage.setItem(localStorageKey, file); // uloženie pri save
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