/**
 * Compresse une image avant upload pour économiser de la bande passante
 * et des crédits Cloudinary
 */

interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'image/jpeg' | 'image/png' | 'image/webp';
  /**
   * Force le redimensionnement en carré (pour les avatars)
   * La dimension la plus petite sera agrandie pour correspondre à la plus grande
   */
  forceSquare?: boolean;
}

export const compressImage = (
  file: File,
  options: CompressionOptions = {}
): Promise<File> => {
  const {
    maxWidth = 1920,
    maxHeight = 1920,
    quality: customQuality,
    format = 'image/jpeg',
    forceSquare = false,
  } = options;

  // Utiliser une meilleure qualité pour les petites images (avatars)
  const isSmallImage = maxWidth <= 500 && maxHeight <= 500;
  const quality = customQuality ?? (isSmallImage ? 0.90 : 0.85);

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        // Calculer les nouvelles dimensions en gardant le ratio
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.floor(width * ratio);
          height = Math.floor(height * ratio);
        }

        // Forcer un format carré si demandé (pour avatars)
        if (forceSquare) {
          const size = Math.min(width, height, maxWidth, maxHeight);
          width = size;
          height = size;
        }

        // Créer un canvas pour redimensionner l'image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Impossible de créer le contexte canvas'));
          return;
        }

        // Dessiner l'image redimensionnée
        ctx.drawImage(img, 0, 0, width, height);

        // Convertir en Blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Erreur lors de la compression'));
              return;
            }

            // Créer un nouveau File à partir du Blob
            const compressedFile = new File([blob], file.name, {
              type: format,
              lastModified: Date.now(),
            });

            resolve(compressedFile);
          },
          format,
          quality
        );
      };

      img.onerror = () => {
        reject(new Error('Erreur lors du chargement de l\'image'));
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('Erreur lors de la lecture du fichier'));
    };

    reader.readAsDataURL(file);
  });
};
