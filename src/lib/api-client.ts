import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

// Configuration de l'instance Axios
export const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/v1`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur de requête (pour ajouter le token JWT plus tard)
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Récupérer le token depuis le localStorage si disponible
    const token = localStorage.getItem('auth_token');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Intercepteur de réponse (gestion des erreurs globales)
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error: AxiosError) => {
    // Gestion des erreurs HTTP courantes
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Non autorisé - redirection vers login (à implémenter)
          console.error('Non autorisé - Token expiré ou invalide');
          localStorage.removeItem('auth_token');
          // window.location.href = '/login';
          break;
        case 403:
          console.error('Accès interdit');
          break;
        case 404:
          console.error('Ressource non trouvée');
          break;
        case 500:
          console.error('Erreur serveur');
          break;
        default:
          console.error('Erreur API:', error.response.status);
      }
    } else if (error.request) {
      // La requête a été faite mais pas de réponse
      console.error('Pas de réponse du serveur');
    } else {
      // Erreur lors de la configuration de la requête
      console.error('Erreur de configuration:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;