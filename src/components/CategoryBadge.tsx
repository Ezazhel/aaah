import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import type { GameCategory } from "@/constants/labels"
import { GAME_CATEGORIES } from "@/constants/labels"

const categoryBadgeVariants = cva(
  "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
  {
    variants: {
      category: {
        familial: "bg-category-familial-bg text-category-familial-text border-category-familial-border",
        initie: "bg-category-initie-bg text-category-initie-text border-category-initie-border",
        expert: "bg-category-expert-bg text-category-expert-text border-category-expert-border",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        md: "px-3 py-1 text-sm",
        lg: "px-4 py-1.5 text-base",
      },
    },
    defaultVariants: {
      size: "sm",
    },
  }
)

interface CategoryBadgeProps extends VariantProps<typeof categoryBadgeVariants> {
  category: GameCategory
  className?: string
  showIcon?: boolean
}

const categoryIcons = {
  familial: (
    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 20 20">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 7a3 3 0 116 0 3 3 0 01-6 0zm-4 9a4 4 0 018-0m4 0a4 4 0 00-8 0" />
    </svg>
  ),
  initie: (
    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 20 20">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 3a5 5 0 00-2 9.584V15a2 2 0 004 0v-2.416A5 5 0 0010 3z" />
    </svg>
  ),
  expert: (
    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 20 20">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 3.5l2.09 4.24 4.68.68-3.39 3.3.8 4.66L10 14.77l-4.18 2.21.8-4.66-3.39-3.3 4.68-.68L10 3.5z" />
    </svg>
  ),
}

export function CategoryBadge({ 
  category, 
  size, 
  className, 
  showIcon = true 
}: CategoryBadgeProps) {
  const label = GAME_CATEGORIES[category]?.label ?? category
  const icon = showIcon ? categoryIcons[category] : null

  return (
    <span className={cn(categoryBadgeVariants({ category, size }), className)}>
      {icon}
      {label}
    </span>
  )
}