import { useState } from "react";
import { useCategories } from "../api/get-categories";
import { type Category } from "@/types";
import { Plus, X } from "lucide-react";

type CategoriesSelectProps = {
  selectedCategories: Category[];
  onChange: (categories: Category[]) => void;
};

export function CategoriesSelect({ selectedCategories, onChange }: CategoriesSelectProps) {
  const { data: categoriesData, isLoading } = useCategories();
  const categories = categoriesData?.data || [];
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  const addCategory = () => {
    if (selectedCategoryId) {
      const category = categories.find((c) => c.id === selectedCategoryId);
      if (category && !selectedCategories.find((c) => c.id === category.id)) {
        onChange([...selectedCategories, category]);
        setSelectedCategoryId(null);
      }
    }
  };

  const removeCategory = (categoryId: number) => {
    onChange(selectedCategories.filter((c) => c.id !== categoryId));
  };

  if (isLoading) {
    return <p className="text-gray-500">Chargement des catégories...</p>;
  }

  const availableCategories = categories.filter(
    (c) => !selectedCategories.find((sc) => sc.id === c.id)
  );

  return (
    <div>
      <label className="block font-semibold text-gray-700 mb-2">Catégories</label>
      <div className="flex gap-2 mb-2">
        <select
          value={selectedCategoryId || ""}
          onChange={(e) => setSelectedCategoryId(Number(e.target.value) || null)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">Sélectionner une catégorie</option>
          {availableCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={addCategory}
          disabled={!selectedCategoryId}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Plus size={16} /> Ajouter
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {selectedCategories.map((category) => (
          <span
            key={category.id}
            className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 rounded-full px-3 py-1 text-xs font-medium"
          >
            {category.name}
            <button
              type="button"
              onClick={() => removeCategory(category.id)}
              className="hover:text-purple-900"
            >
              <X size={14} />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
