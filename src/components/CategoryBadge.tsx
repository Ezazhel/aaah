import React from "react";
import type { GameCategory } from "@/constants/labels";
import { GAME_CATEGORIES } from "@/constants/labels";

interface CategoryBadgeProps {
  category: GameCategory;
}

const categoryConfig: Record<GameCategory, {
  icon: React.ReactNode;
  className: string;
}> = {
  familial: {
    icon: (
      // Family icon (users)
      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 20 20">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 7a3 3 0 116 0 3 3 0 01-6 0zm-4 9a4 4 0 018-0m4 0a4 4 0 00-8 0" />
      </svg>
    ),
    className: "bg-[oklch(88%_0.12_145)] text-[oklch(42%_0.15_145)] border border-[oklch(55%_0.14_145)]",
  },
  initie: {
    icon: (
      // Lightbulb icon
      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 20 20">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 3a5 5 0 00-2 9.584V15a2 2 0 004 0v-2.416A5 5 0 0010 3z" />
      </svg>
    ),
    className: "bg-[oklch(88%_0.11_75)] text-[oklch(48%_0.15_65)] border border-[oklch(58%_0.14_70)]",
  },
  expert: {
    icon: (
      // Star icon
      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 20 20">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 3.5l2.09 4.24 4.68.68-3.39 3.3.8 4.66L10 14.77l-4.18 2.21.8-4.66-3.39-3.3 4.68-.68L10 3.5z" />
      </svg>
    ),
    className: "bg-[oklch(88%_0.11_320)] text-[oklch(42%_0.16_320)] border border-[oklch(52%_0.15_320)]",
  },
};

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category }) => {
  const { icon, className } = categoryConfig[category];
  const label = GAME_CATEGORIES[category]?.label ?? category;

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${className}`}
    >
      {icon}
      {label}
    </span>
  );
};
