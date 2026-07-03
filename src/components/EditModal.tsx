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
  initialValue: string; // len jeden súbor
  onSave: (file: string) => Promise<void>; // async pre cloud save
}

const EditModal = ({ isOpen, onClose, title, type, initialValue, onSave }: EditModalProps) => {
  const [file, setFile] = useState<string>(initialValue);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) setFile(initialValue);
  }, [isOpen, initialValue]);

  const handleFileChange = async (selectedFile?: File) => {
    if (!selectedFile) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const result = reader.result as string;
      setFile(result);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleSave = async () => {
    if (file) {
      await onSave(file); // uloží na server/cloud
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
              {file.endsWith(".pdf") ? (
                <embed src={file} type="application/pdf" width="100%" height="100%" />
              ) : (
                <img src={file} alt="Preview" className="w-full h-full object-contain" />
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditModal;