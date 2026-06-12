import { useState, useRef } from "react";
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
  initialValue: string[]; // teraz pole
  onSave: (files: string[]) => void;
}

const EditModal = ({ isOpen, onClose, title, type, initialValue, onSave }: EditModalProps) => {
  const [files, setFiles] = useState<string[]>(initialValue || []);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files).map(f => URL.createObjectURL(f));
    setFiles(prev => [...prev, ...droppedFiles]);
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
            multiple
            ref={fileInputRef}
            className="hidden"
            onChange={(e) => {
              const newFiles = e.target.files ? Array.from(e.target.files).map(f => URL.createObjectURL(f)) : [];
              setFiles(prev => [...prev, ...newFiles]);
            }}
          />
          <p className="text-sm text-gray-500 mt-2">
            Presuň súbory sem alebo klikni pre výber
          </p>

          {/* TU VLOŽÍŠ TEN BLOCK */}
          {files.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              {files.map((f, i) => (
                <div key={i} className="w-32 h-32 border rounded overflow-hidden">
                  {f.endsWith(".pdf") ? (
                    <embed src={f} type="application/pdf" width="100%" height="100%" />
                  ) : (
                    <img src={f} alt={`Preview ${i}`} className="w-full h-full object-contain" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onSave(files);
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