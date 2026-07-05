import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type EditModalProps =
  | {
      isOpen: boolean;
      onClose: () => void;
      title: string;
      type: "text";
      initialValue: string;
      onSave: (value: string) => Promise<void> | void;
    }
  | {
      isOpen: boolean;
      onClose: () => void;
      title: string;
      type: "image" | "file";
      initialValue: string[];
      onSave: (files: string[]) => Promise<void> | void;
    };

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;

    reader.readAsDataURL(file);
  });

const imageToBase64Compressed = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxWidth = 800;

        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) return reject("Canvas error");

        ctx.drawImage(img, 0, 0, width, height);

        const compressed = canvas.toDataURL("image/jpeg", 0.7);
        resolve(compressed);
      };

      img.onerror = reject;
      img.src = reader.result as string;
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const EditModal = (props: EditModalProps) => {
  const { isOpen, onClose, title, type, initialValue } = props;

  const getInitialValue = () => {
    if (type === "text") return initialValue || "";
    return initialValue?.[0] || "";
  };

  const [value, setValue] = useState<string>(getInitialValue());
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setValue(getInitialValue());
    }
  }, [isOpen, initialValue, type]);

  const handleFile = async (selectedFile?: File) => {
    if (!selectedFile) return;

    const base64 =
      selectedFile.type.startsWith("image/")
        ? await imageToBase64Compressed(selectedFile)
        : await fileToBase64(selectedFile);

    setValue(base64);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSave = async () => {
    if (type === "text") {
      await props.onSave(value);
    } else {
      await props.onSave(value ? [value] : []);
    }

    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="sm:max-w-[525px] animate-scale-in">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {type === "text" ? (
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="min-h-[220px] w-full rounded-md border border-gray-300 p-3 text-sm outline-none focus:ring-2 focus:ring-primary"
            placeholder="Napíš text..."
          />
        ) : (
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer"
            onDrop={handleDrop}
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
                {value.startsWith("data:application/pdf") ? (
                  <embed
                    src={value}
                    type="application/pdf"
                    width="100%"
                    height="100%"
                  />
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