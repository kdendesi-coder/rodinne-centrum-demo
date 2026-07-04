useEffect(() => {
    if (isOpen) {
      setFile(initialValue?.[0] || "");
    }
  }, [initialValue, isOpen]);

  const handleFile = async (selectedFile?: File) => {
    if (!selectedFile) return;

    const base64 = await fileToBase64(selectedFile);
    setFile(base64);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px] animate-scale-in">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

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

          {file && (
            <div className="mt-4 w-48 h-48 mx-auto border rounded overflow-hidden">
              {file.startsWith("data:application/pdf") ? (
                <embed src={file} type="application/pdf" width="100%" height="100%" />
              ) : (
                <img src={file} alt="Preview" className="w-full h-full object-contain" />
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (file) onSave([file]);
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