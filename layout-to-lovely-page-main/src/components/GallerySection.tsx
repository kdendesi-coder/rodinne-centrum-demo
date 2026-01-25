import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus, Trash2, Edit2 } from "lucide-react";
import EditModal from "./EditModal";

const GallerySection = () => {
  const [images, setImages] = useState(["", "", ""]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isEditingIntro, setIsEditingIntro] = useState(false);
  const [isAddingImage, setIsAddingImage] = useState(false);
  
  const [introText, setIntroText] = useState(
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor."
  );

  // Auto-cycle through images every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length]);

  const handleDeleteImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    // Adjust current index if needed
    if (currentImageIndex >= newImages.length) {
      setCurrentImageIndex(Math.max(0, newImages.length - 1));
    }
  };

  const handleEditImage = (index: number, url: string) => {
    const newImages = [...images];
    newImages[index] = url;
    setImages(newImages);
  };

  const handleAddImage = (url: string) => {
    setImages([...images, url]);
  };

  const scrollPrev = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const scrollNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <section id="gallery" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl md:text-4xl font-bold">Image Gallery</h2>
        </div>
        
        <div className="relative group mb-12">
          <p className="text-muted-foreground">{introText}</p>
          <Button
            size="icon"
            variant="secondary"
            className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7"
            onClick={() => setIsEditingIntro(true)}
          >
            <Edit2 className="h-3 w-3" />
          </Button>
        </div>

        {/* Big preview image with arrow buttons */}
        <div className="relative mb-8 group">
          <div className="relative bg-muted rounded-lg overflow-hidden aspect-[21/9]">
            <div className="relative w-full h-full flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}>
              {images.map((image, index) => (
                <div key={index} className="min-w-full h-full flex items-center justify-center">
                  {image ? (
                    <img 
                      src={image} 
                      alt={`Gallery preview ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg
                      className="w-24 h-24 text-muted-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Arrow buttons on the big image */}
          <Button
            size="icon"
            variant="secondary"
            onClick={scrollPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            onClick={scrollNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Grid of small images - 3 per row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {images.map((image, index) => (
            <div 
              key={index} 
              className="relative group bg-muted rounded-lg overflow-hidden aspect-video flex items-center justify-center cursor-pointer"
              onClick={() => setCurrentImageIndex(index)}
            >
              {image ? (
                <img src={image} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
              ) : (
                <svg
                  className="w-12 h-12 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              )}
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingIndex(index);
                  }}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="destructive"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteImage(index);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Add image button */}
        <div className="flex justify-center">
          <Button
            onClick={() => setIsAddingImage(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Pridať obrázok
          </Button>
        </div>
      </div>

      <EditModal
        isOpen={isEditingIntro}
        onClose={() => setIsEditingIntro(false)}
        title="Edit Gallery Introduction"
        type="text"
        initialValue={introText}
        onSave={setIntroText}
      />
      
      {editingIndex !== null && (
        <EditModal
          isOpen={true}
          onClose={() => setEditingIndex(null)}
          title="Upraviť obrázok"
          type="image"
          initialValue={images[editingIndex]}
          onSave={(url) => {
            handleEditImage(editingIndex, url);
            setEditingIndex(null);
          }}
        />
      )}
      
      {isAddingImage && (
        <EditModal
          isOpen={true}
          onClose={() => setIsAddingImage(false)}
          title="Pridať nový obrázok"
          type="image"
          initialValue=""
          onSave={(url) => {
            handleAddImage(url);
            setIsAddingImage(false);
          }}
        />
      )}
    </section>
  );
};

export default GallerySection;
