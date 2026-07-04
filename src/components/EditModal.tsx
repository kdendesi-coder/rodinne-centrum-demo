import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  type: "text" | "image" | "file";
  initialValue?: string | string[];
  onSave: (value: string | string[]) => void;
  backendId?: string;
}

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const EditModal = ({
  isOpen,
  onClose,
  title,
  type,
  initialValue = "",
  onSave,
}: EditModalProps) => {
  const getInitial = () => {
    if (Array.isArray(initialValue)) return initialValue[0] || "";
    return initialValue || "";
  };

  const [value, setValue] = useState<string>(getInitial());
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setValue(getInitial());
    }
  }, [isOpen, initialValue]);

  const handleFile = async (file?: File) => {
    if (!file) return;

    const base64 = await fileToBase64(file);
    setValue(base64);
  };

  const handleSave = () => {
    if (type === "text") {
      onSave(value);
    } else {
      if (!value) return;
      onSave([value]);
    }

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px] animate-scale-in">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {type === "text" ? (
            <Textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              rows={7}
              className="w-full"
              placeholder="Napíš text..."
            />
          ) : (
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer"
              onDrop={(e) => {
                e.preventDefault();
                handleFile(e.dataTransfer.files[0]);
              }}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept={type === "image" ? "image/*" : ".pdf,image/*"}
                onChange={(e) => handleFile(e.target.files?.[0])}
              />

              <p className="text-sm text-gray-500 mt-2">
                Presuň súbor sem alebo klikni pre výber
              </p>

              {value && (
                <div className="mt-4 w-48 h-48 mx-auto border rounded overflow-hidden">
                  {value.startsWith("data:application/pdf") || value.endsWith(".pdf") ? (
                    <embed src={value} type="application/pdf" width="100%" height="100%" />
                  ) : (
                    <img
                      src={value}
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
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