import React, { useState, useEffect } from 'react';
import { User, MapPin, Mail, Globe, Award, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';
import { useUpdateAuthor } from '@/features/authors/api/update-author';
import { useAuthor } from '@/features/authors/api/get-author';
import { useAuth } from '@/lib/auth';
import { Link } from 'react-router-dom';
import { ImageUploader } from '@/components/ui/image-uploader';
import { useAvatarPrepare } from '@/hooks/use-avatar-prepare';

export const EditAuthorForm: React.FC = () => {
  const { user } = useAuth();
  const authorId = user?.authorId;

  // Fetch current author data
  const { data: author, isLoading } = useAuthor({
    authorId: String(authorId),
    queryConfig: {
      enabled: !!authorId,
    },
  });

  const [formData, setFormData] = useState({
    name: '',
    photoUrl: '',
    region: '',
    bio: '',
    specialties: [] as string[],
    contactEmail: '',
    achievements: [] as string[],
    website: '',
    twitterUrl: '',
    instagramUrl: '',
    bggUrl: '',
  });

  const [specialtyInput, setSpecialtyInput] = useState('');
  const [achievementInput, setAchievementInput] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const updateMutation = useUpdateAuthor();

  // Hook pour préparer l'avatar (compression + renommage)
  const { prepareAvatar, isPreparing, error: prepareError } = useAvatarPrepare({
    authorName: formData.name,
  });

  // Initialize form with author data
  useEffect(() => {
    if (author) {
      setFormData({
        name: author.name || '',
        photoUrl: author.photoUrl || '',
        region: author.region || '',
        bio: author.bio || '',
        specialties: author.specialties || [],
        contactEmail: author.contactEmail || '',
        achievements: author.achievements || [],
        website: author.website || '',
        twitterUrl: author.twitterUrl || '',
        instagramUrl: author.instagramUrl || '',
        bggUrl: author.bggUrl || '',
      });
    }
  }, [author]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Gére la sélection d'un fichier avatar
  const handleAvatarSelect = async (file: File | null) => {
    if (file) {
      const preparedFile = await prepareAvatar(file);
      setAvatarFile(preparedFile);
    } else {
      setAvatarFile(null);
    }
  };

  const addSpecialty = () => {
    if (specialtyInput.trim() && !formData.specialties.includes(specialtyInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        specialties: [...prev.specialties, specialtyInput.trim()],
      }));
      setSpecialtyInput('');
    }
  };

  const removeSpecialty = (specialty: string) => {
    setFormData((prev) => ({
      ...prev,
      specialties: prev.specialties.filter((s) => s !== specialty),
    }));
  };

  const addAchievement = () => {
    if (achievementInput.trim() && !formData.achievements.includes(achievementInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        achievements: [...prev.achievements, achievementInput.trim()],
      }));
      setAchievementInput('');
    }
  };

  const removeAchievement = (achievement: string) => {
    setFormData((prev) => ({
      ...prev,
      achievements: prev.achievements.filter((a) => a !== achievement),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!authorId) {
      setError('Aucun profil auteur associé à votre compte.');
      return;
    }

    try {
      // Créer FormData pour envoyer les données + le fichier
      const submitFormData = new FormData();

      // Ajouter les données JSON
      submitFormData.append('name', formData.name);
      submitFormData.append('region', formData.region || '');
      submitFormData.append('bio', formData.bio || '');
      submitFormData.append('contactEmail', formData.contactEmail || '');
      submitFormData.append('website', formData.website || '');
      submitFormData.append('twitterUrl', formData.twitterUrl || '');
      submitFormData.append('instagramUrl', formData.instagramUrl || '');
      submitFormData.append('bggUrl', formData.bggUrl || '');
      submitFormData.append('specialties', JSON.stringify(formData.specialties));
      submitFormData.append('achievements', JSON.stringify(formData.achievements));

      // Ajouter le fichier avatar si un nouveau fichier a été sélectionné
      if (avatarFile) {
        submitFormData.append('photo', avatarFile);
      }

      await updateMutation.mutateAsync({
        authorId,
        data: submitFormData,
      });

      setSuccess(true);
      setAvatarFile(null); // Réinitialiser après succès
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(
        error.response?.data?.message ||
        'Une erreur est survenue lors de la mise à jour du profil auteur.'
      );
    }
  };

  if (!authorId) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg flex items-start gap-3">
        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-medium">Aucun profil auteur associé</p>
          <p className="mt-1">Votre compte n'est pas encore lié à un profil d'auteur. Contactez un administrateur pour créer votre profil.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-8 text-gray-500">
        Chargement de votre profil auteur...
      </div>
    );
  }

  return (
    <div>
      {author && (
        <div className="mb-4">
          <Link
            to={`/auteurs/${author.id}`}
            className="inline-flex items-center gap-2 text-sm text-[oklch(69%_0.19_41)] hover:underline"
          >
            <ExternalLink className="w-4 h-4" />
            Voir ma page publique
          </Link>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start gap-3">
            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span className="text-sm">Profil auteur mis à jour avec succès !</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Avatar Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Photo de profil
          </label>
          <div className="flex items-start gap-6">
            {/* Current Avatar Preview */}
            <div className="flex-shrink-0">
              {formData.photoUrl ? (
                <img
                  src={formData.photoUrl}
                  alt={formData.name}
                  className="w-[120px] h-[120px] rounded-full object-cover border-4 border-[oklch(69%_0.19_41)] shadow"
                />
              ) : (
                <div className="w-[120px] h-[120px] rounded-full flex items-center justify-center bg-gray-100 border-4 border-[oklch(69%_0.19_41)] text-5xl text-gray-400">
                  <span>👤</span>
                </div>
              )}
            </div>

            {/* Image Uploader */}
            <div className="flex-1">
              <ImageUploader
                onFileSelect={handleAvatarSelect}
                currentImageUrl={formData.photoUrl}
                error={prepareError}
              />
              <p className="mt-2 text-xs text-gray-500">
                L'image sera automatiquement redimensionnée en 200×200px et renommée avec votre nom d'auteur lors de la sauvegarde.
              </p>
              {isPreparing && (
                <p className="mt-2 text-xs text-blue-600">Préparation de l'image...</p>
              )}
              {avatarFile && (
                <p className="mt-2 text-xs text-green-600">✓ Nouvelle image prête à être envoyée</p>
              )}
            </div>
          </div>
        </div>

        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Nom d'auteur
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[oklch(69%_0.19_41)] focus:border-transparent outline-none transition"
            />
          </div>
        </div>

        {/* Region */}
        <div>
          <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-2">
            Région
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="region"
              name="region"
              type="text"
              value={formData.region}
              onChange={handleChange}
              placeholder="Ex: Île-de-France, Auvergne-Rhône-Alpes..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[oklch(69%_0.19_41)] focus:border-transparent outline-none transition"
            />
          </div>
        </div>

        {/* Bio */}
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
            Biographie
          </label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={4}
            placeholder="Présentez-vous en quelques mots..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[oklch(69%_0.19_41)] focus:border-transparent outline-none transition resize-none"
          />
        </div>

        {/* Specialties */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Spécialités
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={specialtyInput}
              onChange={(e) => setSpecialtyInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addSpecialty();
                }
              }}
              placeholder="Ex: stratégie, familial, coopératif..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[oklch(69%_0.19_41)] focus:border-transparent outline-none transition"
            />
            <button
              type="button"
              onClick={addSpecialty}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              Ajouter
            </button>
          </div>
          {formData.specialties.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.specialties.map((specialty) => (
                <span
                  key={specialty}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-[oklch(90%_0.05_41)] text-[oklch(45%_0.19_41)] rounded-full text-sm"
                >
                  {specialty}
                  <button
                    type="button"
                    onClick={() => removeSpecialty(specialty)}
                    className="ml-1 hover:text-red-600"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Achievements */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Award className="inline w-4 h-4 mr-1" />
            Réalisations et prix
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={achievementInput}
              onChange={(e) => setAchievementInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addAchievement();
                }
              }}
              placeholder="Ex: As d'Or 2023, Spiel des Jahres nominee..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[oklch(69%_0.19_41)] focus:border-transparent outline-none transition"
            />
            <button
              type="button"
              onClick={addAchievement}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              Ajouter
            </button>
          </div>
          {formData.achievements.length > 0 && (
            <ul className="space-y-1">
              {formData.achievements.map((achievement, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="flex-1">{achievement}</span>
                  <button
                    type="button"
                    onClick={() => removeAchievement(achievement)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Supprimer
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Contact Email */}
        <div>
          <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-2">
            Email de contact public (optionnel)
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="contactEmail"
              name="contactEmail"
              type="email"
              value={formData.contactEmail}
              onChange={handleChange}
              placeholder="contact@exemple.com"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[oklch(69%_0.19_41)] focus:border-transparent outline-none transition"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">Cet email sera visible sur votre page publique</p>
        </div>

        {/* Website */}
        <div>
          <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
            Site web personnel
          </label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="website"
              name="website"
              type="url"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://votre-site.com"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[oklch(69%_0.19_41)] focus:border-transparent outline-none transition"
            />
          </div>
        </div>

        {/* Social Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="twitterUrl" className="block text-sm font-medium text-gray-700 mb-2">
              Twitter / X
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="twitterUrl"
                name="twitterUrl"
                type="url"
                value={formData.twitterUrl}
                onChange={handleChange}
                placeholder="https://twitter.com/votre-compte"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[oklch(69%_0.19_41)] focus:border-transparent outline-none transition"
              />
            </div>
          </div>

          <div>
            <label htmlFor="instagramUrl" className="block text-sm font-medium text-gray-700 mb-2">
              Instagram
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="instagramUrl"
                name="instagramUrl"
                type="url"
                value={formData.instagramUrl}
                onChange={handleChange}
                placeholder="https://instagram.com/votre-compte"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[oklch(69%_0.19_41)] focus:border-transparent outline-none transition"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="bggUrl" className="block text-sm font-medium text-gray-700 mb-2">
              BoardGameGeek
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="bggUrl"
                name="bggUrl"
                type="url"
                value={formData.bggUrl}
                onChange={handleChange}
                placeholder="https://boardgamegeek.com/user/votre-compte"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[oklch(69%_0.19_41)] focus:border-transparent outline-none transition"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={updateMutation.isPending}
          className="w-full bg-[oklch(69%_0.19_41)] text-white py-2.5 px-4 rounded-lg font-medium hover:bg-[oklch(65%_0.19_41)] transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {updateMutation.isPending ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </button>
      </form>
    </div>
  );
};
