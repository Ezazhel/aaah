import { useState } from "react";
import { useMechanics } from "../api/get-mechanics";
import { type Mechanic } from "@/types";
import { Plus, X } from "lucide-react";

type MechanicsSelectProps = {
  selectedMechanics: Mechanic[];
  onChange: (mechanics: Mechanic[]) => void;
};

export function MechanicsSelect({ selectedMechanics, onChange }: MechanicsSelectProps) {
  const { data: mechanicsData, isLoading } = useMechanics();
  const mechanics = mechanicsData?.data || [];
  const [selectedMechanicId, setSelectedMechanicId] = useState<number | null>(null);

  const addMechanic = () => {
    if (selectedMechanicId) {
      const mechanic = mechanics.find((m) => m.id === selectedMechanicId);
      if (mechanic && !selectedMechanics.find((m) => m.id === mechanic.id)) {
        onChange([...selectedMechanics, mechanic]);
        setSelectedMechanicId(null);
      }
    }
  };

  const removeMechanic = (mechanicId: number) => {
    onChange(selectedMechanics.filter((m) => m.id !== mechanicId));
  };

  if (isLoading) {
    return <p className="text-gray-500">Chargement des mécaniques...</p>;
  }

  const availableMechanics = mechanics.filter(
    (m) => !selectedMechanics.find((sm) => sm.id === m.id)
  );

  return (
    <div>
      <label className="block font-semibold text-gray-700 mb-2">Mécaniques</label>
      <div className="flex gap-2 mb-2">
        <select
          value={selectedMechanicId || ""}
          onChange={(e) => setSelectedMechanicId(Number(e.target.value) || null)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">Sélectionner une mécanique</option>
          {availableMechanics.map((mechanic) => (
            <option key={mechanic.id} value={mechanic.id}>
              {mechanic.name}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={addMechanic}
          disabled={!selectedMechanicId}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Plus size={16} /> Ajouter
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {selectedMechanics.map((mechanic) => (
          <span
            key={mechanic.id}
            className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-xs font-medium"
          >
            {mechanic.name}
            <button
              type="button"
              onClick={() => removeMechanic(mechanic.id)}
              className="hover:text-blue-900"
            >
              <X size={14} />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
