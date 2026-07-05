import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus, Trash2, Edit2 } from "lucide-react";
import EditModal from "./EditModal";
import { useAuth } from "@/contexts/AuthContext";
import { useParagraph } from "@/hooks/useParagraph";

const defaultImages = [
  "01_gallery.jpg",
  "02_gallery.jpg",
  "03_gallery.jpg",
  "04_gallery.jpg",
  "05_gallery.jpg",
  "06_gallery.jpg",
  "07_gallery.jpg",
  "08_gallery.jpg",
  "09_gallery.jpg",
];

const defaultIntroText =
  "Zachytili sme okamihy radosti, spoločného rastu a priestor, v ktorom sa stretávame. Prezrite si fotografie z našich aktivít v herni a Átriu, ktoré hovoria o živote nášho centra. Každý obraz je príbehom našej komunity.";

const safeJsonParse = <T,>(value: string | null | undefined, fallback: T): T => {
  if (!value) return fallback;

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

const GallerySection = () => {
  const { isAuthenticated, role } = useAuth();
  const canEdit = isAuthenticated && role === "Admin";

  const { text: galleryIntroText, setText: setGalleryIntroText } =
    useParagraph("gallery_intro_text");

  const { text: galleryImagesData, setText: setGalleryImagesData } =
    useParagraph("gallery_images_data");

  const [images, setImages] = useState<string[]>(defaultImages);
  const [introText, setIntroText] = useState(defaultIntroText);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isEditingIntro, setIsEditingIntro] = useState(false);
  const [isAddingImage, setIsAddingImage] = useState(false);

  const imagesPerView = 2;
  const totalPages = Math.max(1, Math.ceil(images.length / imagesPerView));

  useEffect(() => {
    if (galleryIntroText && galleryIntroText.trim() !== "") {
      setIntroText(galleryIntroText);
    } else {
      setIntroText(defaultIntroText);
    }
  }, [galleryIntroText]);

  useEffect(() => {
    const parsedImages = safeJsonParse<string[]>(
      galleryImagesData,
      defaultImages
    );

    setImages(parsedImages.length > 0 ? parsedImages : defaultImages);
  }, [galleryImagesData]);

  useEffect(() => {
    if (totalPages <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % totalPages);
    }, 4000);

    return () => clearInterval(interval);
  }, [totalPages]);

  const saveImages = async (newImages: string[]) => {
    setImages(newImages);
    await setGalleryImagesData(JSON.stringify(newImages));
  };

  const handleSaveIntro = async (newIntroText: string) => {
    setIntroText(newIntroText);
    await setGalleryIntroText(newIntroText);
  };

  const handleDeleteImage = async (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newTotalPages = Math.max(1, Math.ceil(newImages.length / imagesPerView));

    await saveImages(newImages);

    if (currentImageIndex >= newTotalPages) {
      setCurrentImageIndex(Math.max(0, newTotalPages - 1));
    }
  };

  const handleEditImage = async (index: number, url: string) => {
    const newImages = [...images];
    newImages[index] = url;

    await saveImages(newImages);
  };

  const handleAddImage = async (url: string) => {
    await saveImages([...images, url]);
    setCurrentImageIndex(Math.floor(images.length / imagesPerView));
  };

  const scrollPrev = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  };

  const scrollNext = () => {
    setCurrentImageIndex((prev) => (prev === totalPages - 1 ? 0 : prev + 1));
  };

  return (
    <section id="gallery" className="py-12 md:py-20 px-4 overflow-hidden">
      <div className="w-full max-w-[1650px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold">
            Galéria
          </h2>
        </div>

        <div className="relative group mb-12">
          <p className="text-base md:text-lg xl:text-xl leading-[1.8] text-muted-foreground whitespace-pre-line">
            {introText}
          </p>

          {canEdit && (
            <Button
              size="icon"
              variant="secondary"
              className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7"
              onClick={() => setIsEditingIntro(true)}
            >
              <Edit2 className="h-3 w-3" />
            </Button>
          )}
        </div>

        <div className="relative mb-8 lg:mb-10">
          <div className="overflow-hidden rounded-2xl">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentImageIndex * 100}%)`,
              }}
            >
              {Array.from({ length: totalPages }).map((_, pageIndex) => (
                <div
                  key={pageIndex}
                  className="min-w-full grid grid-cols-1 md:grid-cols-2 md:gap-6 lg:gap-8"
                >
                  {images
                    .slice(
                      pageIndex * imagesPerView,
                      pageIndex * imagesPerView + imagesPerView
                    )
                    .map((image, index) => (
                      <div
                        key={`${pageIndex}-${index}`}
                        className="bg-muted rounded-2xl aspect-[4/3] md:aspect-[3/2] flex items-center justify-center overflow-hidden"
                      >
                        <img
                          src={image}
                          alt={`Gallery ${
                            pageIndex * imagesPerView + index + 1
                          }`}
                          className="w-full h-full object-cover"
                          loading={pageIndex <= 1 ? "eager" : "lazy"}
                          decoding="async"
                        />
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 mb-8">
          <div className="flex gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentImageIndex(i)}
                className={`w-3 h-3 md:w-4 md:h-4 rounded-full transition-all ${
                  i === currentImageIndex ? "bg-black" : "bg-gray-300"
                }`}
              />
            ))}
          </div>

          <div className="flex gap-2">
            <Button
              size="icon"
              variant="secondary"
              className="rounded-full h-10 w-10 md:h-12 md:w-12"
              onClick={scrollPrev}
            >
              <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
            </Button>

            <Button
              size="icon"
              variant="secondary"
              className="rounded-full h-10 w-10 md:h-12 md:w-12"
              onClick={scrollNext}
            >
              <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
            </Button>
          </div>
        </div>

        {canEdit && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-8 mb-8">
            {images.map((image, index) => (
              <div
                key={index}
                className="relative group bg-muted rounded-2xl overflow-hidden aspect-[4/3] flex items-center justify-center cursor-pointer"
                onClick={() =>
                  setCurrentImageIndex(Math.floor(index / imagesPerView))
                }
              >
                {image ? (
                  <img
                    src={image}
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
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
        )}

        {canEdit && (
          <div className="flex justify-center">
            <Button
              onClick={() => setIsAddingImage(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Pridať obrázok
            </Button>
          </div>
        )}
      </div>

      <EditModal
        isOpen={isEditingIntro}
        onClose={() => setIsEditingIntro(false)}
        title="Upraviť text galérie"
        type="text"
        initialValue={introText}
        onSave={async (value) => {
          await handleSaveIntro(value);
          setIsEditingIntro(false);
        }}
      />

      {editingIndex !== null && (
        <EditModal
          isOpen={true}
          onClose={() => setEditingIndex(null)}
          title="Upraviť obrázok"
          type="image"
          initialValue={[images[editingIndex] || ""]}
          onSave={async (files) => {
            if (files[0]) {
              await handleEditImage(editingIndex, files[0]);
            }

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
          initialValue={[""]}
          onSave={async (files) => {
            if (files[0]) {
              await handleAddImage(files[0]);
            }

            setIsAddingImage(false);
          }}
        />
      )}
    </section>
  );
};

export default GallerySection;