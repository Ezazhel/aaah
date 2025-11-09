import { useState, useEffect } from "react";
import { GAME_CATEGORIES } from "@/constants/labels";
import { CategoryBadge } from "@/components/category-badge";
import { useAuthors } from "@/features/authors/api/get-authors";
import { MechanicsSelect } from "@/features/mechanics/components/mechanics-select";
import { useAuth } from "@/lib/auth";
import { type GameInput } from "@/types";
import { X, Plus } from "lucide-react";
import { ImageUploader } from "@/components/ui/image-uploader";

const PLACEHOLDER_IMAGE = "https://placehold.co/600x400/cccccc/222222?text=Ajouter+une+image";

type GameFormProps = {
  onSubmit: (data: GameInput) => void;
  initialData?: Partial<GameInput>;
  isSubmitting?: boolean;
};

export function GameForm({ onSubmit, initialData, isSubmitting = false }: GameFormProps) {
  const { user } = useAuth();
  const { data: authorsResponse, isLoading: authorsLoading } = useAuthors();
  const authors = authorsResponse?.data || [];

  // Form state
  const [formData, setFormData] = useState<GameInput>({
    name: initialData?.name || "",
    authorIds: initialData?.authorIds || [],
    description: initialData?.description || "",
    minPlayers: initialData?.minPlayers || 2,
    maxPlayers: initialData?.maxPlayers || 4,
    duration: initialData?.duration || 30,
    imageUrl: initialData?.imageUrl || "",
    category: initialData?.category || "familial",
    mechanics: initialData?.mechanics || [],
    images: initialData?.images || [],
    rulesUrl: initialData?.rulesUrl || "",
    videoRulesUrl: initialData?.videoRulesUrl || "",
    fullDescription: initialData?.fullDescription || "",
    publishedDate: initialData?.publishedDate || new Date().toISOString().split('T')[0],
    isDraft: initialData?.isDraft ?? true,
  });

  // Add current user's authorId by default when creating a new game
  useEffect(() => {
    if (!initialData && user?.authorId && !formData.authorIds.includes(user.authorId)) {
      setFormData(prev => ({
        ...prev,
        authorIds: [user.authorId as number]
      }));
    }
  }, [user?.authorId, initialData, formData.authorIds]);

  // Temporary state for adding authors
  const [selectedAuthorToAdd, setSelectedAuthorToAdd] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const updateField = <K extends keyof GameInput>(field: K, value: GameInput[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };


  const handleGalleryImageUpload = (url: string) => {
    if (url) {
      updateField("images", [...(formData.images || []), url]);
    }
  };

  const removeImage = (index: number) => {
    updateField(
      "images",
      formData.images?.filter((_, i) => i !== index) || []
    );
  };

  const selectedAuthors = authors.filter((a) => formData.authorIds.includes(a.id));

  return (
    <form onSubmit={handleSubmit} className="bg-gradient-to-br from-[oklch(96%_0.01_250)] to-[oklch(94%_0.04_250)] min-h-screen pb-12">
      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-4 pt-8 flex flex-col md:flex-row gap-8">
        {/* Image Preview */}
        <div className="md:w-1/2 w-full flex flex-col items-center">
          <div className="w-full">
            <ImageUploader
              onFileSelect={(file) => {
                // For now, just create a preview URL
                // In production, you would upload the file to the server here
                if (file) {
                  const objectUrl = URL.createObjectURL(file);
                  updateField("imageUrl", objectUrl);
                } else {
                  updateField("imageUrl", "");
                }
              }}
              currentImageUrl={formData.imageUrl}
              label="Image principale"
              description="Formats acceptés : JPG, PNG, GIF, WEBP (max 10MB)"
            />
          </div>
        </div>

        {/* Info Card */}
        <div className="md:w-1/2 w-full flex flex-col justify-center">
          <div className="bg-white/80 rounded-xl shadow-lg p-6 mb-4">
            {/* Game Name */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nom du jeu *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                required
                placeholder="Nom du prototype"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-3xl font-extrabold text-[oklch(36%_0.13_250)]"
              />
            </div>

            {/* Authors */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Auteur(s) *
              </label>
              {authorsLoading ? (
                <p className="text-gray-500">Chargement des auteurs...</p>
              ) : (
                <div className="flex gap-2">
                  <select
                    value={selectedAuthorToAdd || ""}
                    onChange={(e) => setSelectedAuthorToAdd(Number(e.target.value) || null)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Sélectionner un auteur à ajouter</option>
                    {authors
                      .filter(a => !formData.authorIds.includes(a.id))
                      .map((author) => (
                        <option key={author.id} value={author.id}>
                          {author.name}
                        </option>
                      ))
                    }
                  </select>
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedAuthorToAdd && !formData.authorIds.includes(selectedAuthorToAdd)) {
                        updateField("authorIds", [...formData.authorIds, selectedAuthorToAdd]);
                        setSelectedAuthorToAdd(null);
                      }
                    }}
                    disabled={!selectedAuthorToAdd}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Plus size={16} /> Ajouter
                  </button>
                </div>
              )}
              {selectedAuthors.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedAuthors.map((author) => (
                    <span
                      key={author.id}
                      className="inline-flex items-center gap-1 bg-orange-100 text-orange-800 rounded-full px-3 py-1 text-sm"
                    >
                      {author.name}
                      {author.id !== user?.authorId && (
                        <button
                          type="button"
                          onClick={() => updateField("authorIds", formData.authorIds.filter(id => id !== author.id))}
                          className="hover:text-orange-900"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Category */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Catégorie *
              </label>
              <select
                value={formData.category}
                onChange={(e) => updateField("category", e.target.value as GameInput['category'])}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                {Object.entries(GAME_CATEGORIES).map(([key, { label }]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
              <div className="mt-2">
                <CategoryBadge category={formData.category} />
              </div>
            </div>

            {/* Players, Duration, Date */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  👥 Joueurs min *
                </label>
                <input
                  type="number"
                  value={formData.minPlayers}
                  onChange={(e) => updateField("minPlayers", parseInt(e.target.value))}
                  required
                  min={1}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  👥 Joueurs max *
                </label>
                <input
                  type="number"
                  value={formData.maxPlayers}
                  onChange={(e) => updateField("maxPlayers", parseInt(e.target.value))}
                  required
                  min={formData.minPlayers}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  ⏱️ Durée (min) *
                </label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => updateField("duration", parseInt(e.target.value))}
                  required
                  min={1}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  📅 Date de création
                </label>
                <input
                  type="date"
                  value={formData.publishedDate}
                  onChange={(e) => updateField("publishedDate", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sections */}
      <section className="max-w-5xl mx-auto px-4 mt-8 space-y-10">
        {/* Description */}
        <div className="bg-white/90 rounded-xl shadow p-6">
          <h2 className="text-2xl font-bold text-[oklch(36%_0.13_250)] mb-3">Description</h2>
          <textarea
            value={formData.description}
            onChange={(e) => updateField("description", e.target.value)}
            required
            placeholder="Description courte du jeu"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
          <label className="block text-sm font-semibold text-gray-700 mb-2 mt-4">
            Description complète
          </label>
          <textarea
            value={formData.fullDescription}
            onChange={(e) => updateField("fullDescription", e.target.value)}
            placeholder="Description détaillée (optionnel)"
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Caractéristiques */}
        <div className="bg-white/90 rounded-xl shadow p-6">
          <h2 className="text-2xl font-bold text-[oklch(36%_0.13_250)] mb-3">Caractéristiques</h2>

          {/* Mechanics */}
          <MechanicsSelect
            selectedMechanics={formData.mechanics}
            onChange={(mechanics) => updateField("mechanics", mechanics)}
          />
        </div>

        {/* Galerie */}
        <div className="bg-white/90 rounded-xl shadow p-6">
          <h2 className="text-2xl font-bold text-[oklch(36%_0.13_250)] mb-3">Galerie d'images</h2>
          <p className="text-sm text-gray-600 mb-4">
            Ajoutez plusieurs images pour présenter votre prototype sous différents angles
          </p>

          <ImageUploader
            onFileSelect={(file) => {
              // For now, just create a preview URL for gallery
              // In production, you would upload the file to the server here
              if (file) {
                const objectUrl = URL.createObjectURL(file);
                handleGalleryImageUpload(objectUrl);
              }
            }}
            label="Ajouter une image à la galerie"
            description="Formats acceptés : JPG, PNG, GIF, WEBP (max 10MB)"
            className="mb-6"
          />

          {formData.images && formData.images.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">
                Images de la galerie ({formData.images.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {formData.images.map((img, idx) => (
                  <div key={idx} className="relative">
                    <img
                      src={img || PLACEHOLDER_IMAGE}
                      alt={`Image ${idx + 1}`}
                      className="rounded-lg shadow object-cover w-full h-40 md:h-48"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Règles et ressources */}
        <div className="bg-white/90 rounded-xl shadow p-6">
          <h2 className="text-2xl font-bold text-[oklch(36%_0.13_250)] mb-3">Règles et ressources</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📄 URL des règles (PDF)
              </label>
              <input
                type="url"
                value={formData.rulesUrl}
                onChange={(e) => updateField("rulesUrl", e.target.value)}
                placeholder="https://exemple.com/regles.pdf"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                🎥 URL de la vidéo des règles
              </label>
              <input
                type="url"
                value={formData.videoRulesUrl}
                onChange={(e) => updateField("videoRulesUrl", e.target.value)}
                placeholder="https://youtube.com/..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Draft/Publish Toggle */}
        <div className="bg-white/90 rounded-xl shadow p-6">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={!formData.isDraft}
              onChange={(e) => updateField("isDraft", !e.target.checked)}
              className="w-5 h-5"
            />
            <span className="font-semibold text-gray-700">
              Publier immédiatement (décocher pour enregistrer comme brouillon)
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-[oklch(69%_0.19_41)] text-white font-semibold rounded-lg shadow hover:bg-[oklch(69%_0.19_41)]/80 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Enregistrement..." : "Enregistrer le prototype"}
          </button>
        </div>
      </section>
    </form>
  );
}
