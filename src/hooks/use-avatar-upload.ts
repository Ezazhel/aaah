import { compressImage } from '@/lib/image-compression';
import { generateSlug } from '@/lib/utils';
import { useImageUpload, type UploadResult } from './use-image-upload';

interface UseAvatarUploadOptions {
  authorName: string;
  onSuccess?: (result: UploadResult) => void;
  onError?: (error: Error) => void;
}

/**
 * Hook spécialisé pour l'upload d'avatars d'auteurs
 * - Redimensionne l'image à 200x200px (format carré)
 * - Renomme le fichier avec le slug du nom de l'auteur
 * - Utilise une qualité optimisée (90%) pour les avatars
 *
 * @example
 * const { uploadAvatar, isUploading, progress, error } = useAvatarUpload({
 *   authorName: "Jean-Pierre Martin",
 *   onSuccess: (result) => console.log("Avatar uploadé:", result.url),
 * });
 *
 * // Dans un handler
 * const handleFileSelect = async (file: File) => {
 *   const result = await uploadAvatar(file);
 *   setPhotoUrl(result.url);
 * };
 */
export const useAvatarUpload = (options: UseAvatarUploadOptions) => {
  const { authorName, onSuccess, onError } = options;

  const imageUpload = useImageUpload({
    onSuccess,
    onError,
  });

  const uploadAvatar = async (file: File): Promise<UploadResult> => {
    try {
      // Redimensionner l'image en 200x200px (format carré) avec qualité optimale
      const resizedFile = await compressImage(file, {
        maxWidth: 200,
        maxHeight: 200,
        quality: 0.90,
        format: 'image/jpeg',
        forceSquare: true,
      });

      // Générer le slug du nom de l'auteur pour le nom de fichier
      const slug = generateSlug(authorName);
      const extension = 'jpg'; // Toujours JPEG après compression

      // Créer un nouveau fichier avec le nom slugifié
      const renamedFile = new File([resizedFile], `${slug}.${extension}`, {
        type: 'image/jpeg',
        lastModified: Date.now(),
      });

      console.log(`Avatar redimensionné et renommé : ${file.name} → ${renamedFile.name}`);
      console.log(`Taille : ${file.size} bytes → ${renamedFile.size} bytes`);

      // Upload vers l'endpoint /upload/author
      return await imageUpload.uploadImage(renamedFile, 'author');
    } catch (error) {
      console.error('Erreur lors du traitement de l\'avatar:', error);
      throw error;
    }
  };

  return {
    uploadAvatar,
    isUploading: imageUpload.isUploading,
    progress: imageUpload.progress,
    error: imageUpload.error,
    reset: imageUpload.reset,
  };
};
