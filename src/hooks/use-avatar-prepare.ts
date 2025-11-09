import { useState } from 'react';
import { compressImage } from '@/lib/image-compression';
import { generateSlug } from '@/lib/utils';

interface UseAvatarPrepareOptions {
  authorName: string;
}

/**
 * Hook pour préparer un avatar sans upload immédiat
 * - Redimensionne l'image à 200x200px (format carré)
 * - Renomme le fichier avec le slug du nom de l'auteur
 * - Retourne le File prêt à être uploadé lors du submit
 *
 * @example
 * const { prepareAvatar, isPreparing, error } = useAvatarPrepare({
 *   authorName: "Jean-Pierre Martin",
 * });
 *
 * // Dans un handler
 * const handleFileSelect = async (file: File) => {
 *   const preparedFile = await prepareAvatar(file);
 *   setAvatarFile(preparedFile);
 * };
 */
export const useAvatarPrepare = (options: UseAvatarPrepareOptions) => {
  const { authorName } = options;
  const [isPreparing, setIsPreparing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const prepareAvatar = async (file: File): Promise<File | null> => {
    setIsPreparing(true);
    setError(null);

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

      console.log(`Avatar préparé : ${file.name} → ${renamedFile.name}`);
      console.log(`Taille : ${file.size} bytes → ${renamedFile.size} bytes`);

      setIsPreparing(false);
      return renamedFile;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la préparation de l\'avatar';
      console.error('Erreur lors du traitement de l\'avatar:', err);
      setError(errorMessage);
      setIsPreparing(false);
      return null;
    }
  };

  return {
    prepareAvatar,
    isPreparing,
    error,
  };
};
