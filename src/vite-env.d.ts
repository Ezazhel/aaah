/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string
    // Ajouter d'autres variables ici au fur et à mesure
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }