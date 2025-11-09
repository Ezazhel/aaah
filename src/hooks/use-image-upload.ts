import { useState } from 'react';
import axios from 'axios';
import { apiClient } from '@/lib/api-client';
import { compressImage } from '@/lib/image-compression';

export interface UploadResult {
  url: string;
  publicId: string;
  secureUrl: string;
  format: string;
  width: number;
  height: number;
}

export interface UploadResponse {
  success: boolean;
  data: UploadResult;
  message: string;
}

interface UseImageUploadOptions {
  onSuccess?: (result: UploadResult) => void;
  onError?: (error: Error) => void;
}

export const useImageUpload = (options?: UseImageUploadOptions) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (file: File, type: 'author' | 'game'): Promise<UploadResult> => {
    setIsUploading(true);
    setProgress(0);
    setError(null);

    try {
      // Validation de base
      const maxSize = 10 * 1024 * 1024; // 10MB
      const allowedFormats = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

      if (file.size > maxSize) {
        throw new Error('Le fichier est trop volumineux (max 10MB)');
      }

      if (!allowedFormats.includes(file.type)) {
        throw new Error('Format de fichier non supporté (jpg, png, gif, webp uniquement)');
      }

      // Compresser l'image avant upload pour économiser les crédits Cloudinary
      let fileToUpload = file;
      try {
        fileToUpload = await compressImage(file, {
          maxWidth: 1920,
          maxHeight: 1920,
          quality: 0.85,
          format: 'image/jpeg', // Convertir en JPEG pour une meilleure compression
        });
        console.log(`Image compressée : ${file.size} bytes → ${fileToUpload.size} bytes (${Math.round((1 - fileToUpload.size / file.size) * 100)}% de réduction)`);
      } catch (compressionError) {
        console.warn('Erreur de compression, upload de l\'image originale', compressionError);
        // En cas d'erreur de compression, on upload l'original
        fileToUpload = file;
      }

      // Préparer le FormData
      const formData = new FormData();
      formData.append('file', fileToUpload);

      // Endpoint selon le type (sans /api/v1 car apiClient ajoute déjà la baseURL)
      const endpoint = type === 'author'
        ? '/upload/author'
        : '/upload/game';

      // Upload vers l'API en utilisant apiClient
      const response = await apiClient.post<UploadResponse>(
        endpoint,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setProgress(percentCompleted);
            }
          },
        }
      );

      // apiClient retourne déjà response.data grâce à l'intercepteur
      const result = (response as any).data;

      // Callback de succès
      if (options?.onSuccess) {
        options.onSuccess(result);
      }

      setIsUploading(false);
      setProgress(100);

      return result;
    } catch (err) {
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : 'Erreur lors de l\'upload de l\'image';

      setError(errorMessage);
      setIsUploading(false);
      setProgress(0);

      // Callback d'erreur
      if (options?.onError) {
        options.onError(new Error(errorMessage));
      }

      throw new Error(errorMessage);
    }
  };

  const reset = () => {
    setIsUploading(false);
    setProgress(0);
    setError(null);
  };

  return {
    uploadImage,
    isUploading,
    progress,
    error,
    reset,
  };
};
