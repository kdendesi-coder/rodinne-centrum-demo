import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit2, ChevronLeft, ChevronRight } from "lucide-react";
import EditModal from "./EditModal";

const GallerySection = () => {
  const [images, setImages] = useState(["", "", ""]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isEditingIntro, setIsEditingIntro] = useState(false);
  
  const [introText, setIntroText] = useState(
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor."
  );

  const handleSaveImage = (index: number, url: string) => {
    const newImages = [...images];
    newImages[index] = url;
    setImages(newImages);
  };

  return (
    <section id="gallery" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Image Gallery</h2>
        
        <div className="relative group/intro mb-12">
          <p className="text-muted-foreground">{introText}</p>
          <Button
            size="icon"
            variant="secondary"
            className="absolute top-0 right-0 opacity-0 group-hover/intro:opacity-100 transition-opacity h-7 w-7"
            onClick={() => setIsEditingIntro(true)}
          >
            <Edit2 className="h-3 w-3" />
          </Button>
        </div>

        {/* First row - 2 images */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {images.slice(0, 2).map((image, index) => (
            <div
              key={index}
              className="relative group bg-muted rounded-lg overflow-hidden aspect-video flex items-center justify-center"
            >
              {image ? (
                <img src={image} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
              ) : (
                <svg
                  className="w-20 h-20 text-muted-foreground"
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
              <Button
                size="icon"
                variant="secondary"
                className="edit-button"
                onClick={() => setEditingIndex(index)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* Navigation dots */}
        <div className="flex justify-center gap-2 mb-6">
          <button className="w-2 h-2 rounded-full bg-primary" />
          <button className="w-2 h-2 rounded-full bg-muted" />
          <button className="w-2 h-2 rounded-full bg-muted" />
        </div>

        {/* Second row - 1 full width image */}
        <div className="relative mb-6">
          <p className="text-muted-foreground mb-4">{introText}</p>
        </div>

        <div className="relative group bg-muted rounded-lg overflow-hidden aspect-[21/9] flex items-center justify-center">
          {images[2] ? (
            <img src={images[2]} alt="Gallery 3" className="w-full h-full object-cover" />
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
          <Button
            size="icon"
            variant="secondary"
            className="edit-button"
            onClick={() => setEditingIndex(2)}
          >
            <Edit2 className="h-4 w-4" />
          </Button>

          {/* Navigation arrows */}
          <Button
            size="icon"
            variant="secondary"
            className="absolute left-4 top-1/2 -translate-y-1/2"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="absolute right-4 top-1/2 -translate-y-1/2"
          >
            <ChevronRight className="h-5 w-5" />
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
          title={`Edit Gallery Image ${editingIndex + 1}`}
          type="image"
          initialValue={images[editingIndex]}
          onSave={(url) => handleSaveImage(editingIndex, url)}
        />
      )}
    </section>
  );
};

export default GallerySection;
