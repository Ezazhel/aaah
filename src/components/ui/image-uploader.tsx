import { useRef, useState, useEffect, type DragEvent } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  onFileSelect: (file: File | null) => void;
  currentImageUrl?: string;
  className?: string;
  label?: string;
  description?: string;
  error?: string | null;
}

export const ImageUploader = ({
  onFileSelect,
  currentImageUrl,
  className = '',
  label = 'Image',
  description = 'Glissez-déposez une image ou cliquez pour sélectionner (max 10MB)',
  error,
}: ImageUploaderProps) => {
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mettre à jour la preview quand currentImageUrl change (lors de l'édition)
  useEffect(() => {
    if (currentImageUrl && !selectedFile) {
      setPreview(currentImageUrl);
    }
  }, [currentImageUrl, selectedFile]);

  const validateFile = (file: File): string | null => {
    // Vérifier le type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return 'Format non supporté. Utilisez JPG, PNG, GIF ou WEBP.';
    }

    // Vérifier la taille (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return 'Le fichier est trop volumineux. Taille maximale : 10MB.';
    }

    return null;
  };

  const handleFileSelect = (file: File) => {
    // Valider le fichier
    const validationError = validateFile(file);
    if (validationError) {
      console.error(validationError);
      onFileSelect(null);
      return;
    }

    // Créer une prévisualisation locale
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setSelectedFile(file);

    // Notifier le parent
    onFileSelect(file);
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFileSelect(file);
    }
  };

  const handleRemoveImage = () => {
    // Révoquer l'URL d'objet si elle existe
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview);
    }

    setPreview(null);
    setSelectedFile(null);
    onFileSelect(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  // Nettoyer l'URL d'objet lors du démontage
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      {preview ? (
        <div className="relative rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-50">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-contain"
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            aria-label="Supprimer l'image"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div
          onClick={handleClickUpload}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            transition-colors duration-200
            ${isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
            }
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleFileInputChange}
            className="hidden"
          />

          <div className="flex flex-col items-center space-y-3">
            {isDragging ? (
              <Upload className="text-blue-500" size={40} />
            ) : (
              <ImageIcon className="text-gray-400" size={40} />
            )}
            <div>
              <p className="text-sm text-gray-600 font-medium">
                {isDragging ? 'Déposez votre image ici' : 'Cliquez ou glissez-déposez'}
              </p>
              {description && (
                <p className="text-xs text-gray-500 mt-1">{description}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600 flex items-center gap-2">
          <span>⚠️</span>
          {error}
        </p>
      )}
    </div>
  );
};
