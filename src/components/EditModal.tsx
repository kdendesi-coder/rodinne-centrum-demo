import { useState } from "react";
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
        const response = await fetch(`http://localhost:5058/text/${backendId}`, {
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
        
        if (typeof value === 'string'){
          onSave(value);
        }else{
          onSave(value[0]);
        }
      onClose();
    
    } else {
      // Pre text
      onSave(value);
      onClose();
    }
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
            <Input
              type="text"
              value={type === "image" ? value : ""}
              onChange={(e) => setValue(e.target.value)}
              className="w-full"
              placeholder="Enter image URL..."
            />
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Ukladá sa..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditModal;