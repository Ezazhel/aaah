import { cn } from "@/lib/utils"
import { categoryStyle } from "@/app/model/category"

/**
 * Category of a game, in its color.
 */
export function CategoryBadge({ name, color, className }: { name: string; color: string; className?: string }) {
  return (
    <span
      style={categoryStyle(color)}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-(--category) bg-[color-mix(in_oklch,var(--category)_14%,white)] px-2.5 py-0.5 text-xs font-semibold text-[color-mix(in_oklch,var(--category)_70%,black)]",
        className,
      )}
    >
      <span className="size-2 rounded-full bg-(--category)" aria-hidden />
      {name}
    </span>
  )
}
