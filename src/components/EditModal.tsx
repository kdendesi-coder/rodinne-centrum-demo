import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface FileWithPreview {
  file: File;
  preview: string;
}

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  type: "file" | "image";
  initialValue: FileWithPreview[]; // pole objektov pre viac súborov
  onSave: (files: FileWithPreview[]) => void;
}

const EditModal = ({
  isOpen,
  onClose,
  title,
  type,
  initialValue,
  onSave,
}: EditModalProps) => {
  const [files, setFiles] = useState<FileWithPreview[]>(initialValue || []);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Synchronizuj initialValue vždy keď sa modal otvorí
  useEffect(() => {
    setFiles(initialValue || []);
  }, [initialValue]);

  // Drag & Drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles: FileWithPreview[] = Array.from(e.dataTransfer.files).map(
      (f) => ({ file: f, preview: URL.createObjectURL(f) })
    );
    setFiles((prev) => [...prev, ...droppedFiles]);
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  // Cleanup blob URLs pri zatváraní
  const handleClose = () => {
    files.forEach((f) => URL.revokeObjectURL(f.preview));
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
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
              const newFiles: FileWithPreview[] = e.target.files
                ? Array.from(e.target.files).map((f) => ({
                    file: f,
                    preview: URL.createObjectURL(f),
                  }))
                : [];
              setFiles((prev) => [...prev, ...newFiles]);
            }}
          />
          <p className="text-sm text-gray-500 mt-2">
            Presuň súbory sem alebo klikni pre výber
          </p>

          {/* Preview súborov */}
          {files.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              {files.map((f, i) => (
                <div
                  key={i}
                  className="w-32 h-32 border rounded overflow-hidden relative"
                >
                  {f.file.type === "application/pdf" ? (
                    <embed
                      src={f.preview}
                      type="application/pdf"
                      width="100%"
                      height="100%"
                    />
                  ) : (
                    <img
                      src={f.preview}
                      alt={`Preview ${i}`}
                      className="w-full h-full object-contain"
                    />
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFiles((prev) => prev.filter((_, index) => index !== i));
                      URL.revokeObjectURL(f.preview);
                    }}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onSave(files);
              handleClose();
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