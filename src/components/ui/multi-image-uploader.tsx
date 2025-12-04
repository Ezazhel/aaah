import { useRef, useState, useMemo, type DragEvent } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface MultiImageUploaderProps {
  onFilesSelect: (files: File[]) => void;
  existingUrls?: string[];
  onRemoveExisting?: (url: string) => void;
  pendingFiles?: File[];
  onRemovePending?: (index: number) => void;
  label?: string;
  description?: string;
  className?: string;
}

export const MultiImageUploader = ({
  onFilesSelect,
  existingUrls = [],
  onRemoveExisting,
  pendingFiles = [],
  onRemovePending,
  label = 'Images',
  description = 'Glissez-déposez des images ou cliquez pour sélectionner (max 10MB par image)',
  className = '',
}: MultiImageUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const pendingPreviews = useMemo(() => {
    return pendingFiles.map((file) => URL.createObjectURL(file));
  }, [pendingFiles]);

  const validateFile = (file: File): string | null => {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return 'Format non supporté. Utilisez JPG, PNG, GIF ou WEBP.';
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return 'Le fichier est trop volumineux. Taille maximale : 10MB.';
    }

    return null;
  };

  const handleFilesSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const validFiles: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const error = validateFile(file);
      if (error) {
        console.error(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    }

    if (validFiles.length > 0) {
      onFilesSelect(validFiles);
    }
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFilesSelect(event.target.files);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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
    handleFilesSelect(e.dataTransfer.files);
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  const totalImages = existingUrls.length + pendingFiles.length;

  return (
    <div className={`space-y-4 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div
        onClick={handleClickUpload}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
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
          multiple
          className="hidden"
        />

        <div className="flex flex-col items-center space-y-2">
          {isDragging ? (
            <Upload className="text-blue-500" size={32} />
          ) : (
            <ImageIcon className="text-gray-400" size={32} />
          )}
          <div>
            <p className="text-sm text-gray-600 font-medium">
              {isDragging ? 'Déposez vos images ici' : 'Cliquez ou glissez-déposez'}
            </p>
            {description && (
              <p className="text-xs text-gray-500 mt-1">{description}</p>
            )}
          </div>
        </div>
      </div>

      {totalImages > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">
            {totalImages} image{totalImages > 1 ? 's' : ''} sélectionnée{totalImages > 1 ? 's' : ''}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {existingUrls.map((url, idx) => (
              <div key={`existing-${idx}`} className="relative group">
                <img
                  src={url}
                  alt={`Image ${idx + 1}`}
                  className="w-full h-24 object-cover rounded-lg border border-gray-200"
                />
                <div className="absolute top-1 left-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded">
                  En ligne
                </div>
                {onRemoveExisting && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveExisting(url);
                    }}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    aria-label="Supprimer l'image"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            ))}

            {pendingPreviews.map((preview, idx) => (
              <div key={`pending-${idx}`} className="relative group">
                <img
                  src={preview}
                  alt={`Nouvelle image ${idx + 1}`}
                  className="w-full h-24 object-cover rounded-lg border-2 border-dashed border-blue-300"
                />
                <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded">
                  En attente
                </div>
                {onRemovePending && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemovePending(idx);
                    }}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    aria-label="Supprimer l'image"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
