import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  type: "text" | "image" | "list";
  initialValue: string | string[];
  onSave: (value: string | string[]) => void;
  backendId?: string;
}

const EditModal = ({
  isOpen,
  onClose,
  title,
  type,
  initialValue,
  onSave,
  backendId,
}: EditModalProps) => {
  const [value, setValue] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(false);
  const { token, role } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSave = async () => {
    if (type === "text" && backendId) {
      if (!token) {
        toast({
          title: "Vyžaduje sa prihlásenie",
          description: "Pre úpravu textu sa musíte prihlásiť",
          variant: "destructive",
        });
        return;
      }

      if (role !== "Admin") {
        toast({
          title: "Prístup zamietnutý",
          description: "Iba administrátori môžu upravovať text",
          variant: "destructive",
        });
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/text/${backendId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ text: value }),
        });

        if (!response.ok) {
          throw new Error("Failed to update text");
        }

        toast({
          title: "Úspešne uložené",
          description: "Text bol aktualizovaný",
        });
        onSave(value);
        onClose();
      } catch (error) {
        toast({
          title: "Chyba",
          description: "Nepodarilo sa uložiť zmeny",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    } else if (type === "list") {
      if (Array.isArray(value)) {
        const cleanedList = value.filter((item) => item.trim() !== "");
        onSave(cleanedList); 
      } else {
        const cleanedList = [value.trim()].filter((item) => item !== "");
        onSave(cleanedList);
      }
      onClose();
    } else if (type === "image") {
      if (typeof value === "string") {
        onSave(value);
      } else {
        onSave(value[0]);
      }
      onClose();
    } else {
      onSave(value);
      onClose();
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!isAuthenticated || role !== "Admin") return;

    const file = e.dataTransfer.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setValue(url);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px] animate-scale-in">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {type === "text" || type === "list" ? (
            <Textarea
              value={Array.isArray(value) ? value.join("\n") : value}
              onChange={(e) => {
                const newValue = e.target.value;
                if (type === "list") {
                  setValue(newValue.split("\n").map((item) => item.trim()));
                } else {
                  setValue(newValue);
                }
              }}
              rows={6}
              className="w-full"
              placeholder="Enter text..."
            />
          ) : (
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                accept="image/*,application/pdf"
                ref={fileInputRef}
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const url = URL.createObjectURL(file);
                    setValue(url);
                  }
                }}
              />
              <p className="text-sm text-gray-500 mt-2">
                Presuň obrázok alebo PDF sem, alebo klikni pre výber súboru
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Zrušiť
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Ukladá sa..." : "Uložiť"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditModal;