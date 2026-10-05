import { cn } from "@/lib/utils"

/**
 * Mechanic of a game: neutral badge (only categories are colored).
 */
export function MechanicBadge({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <span className={cn("inline-flex items-center rounded-full border border-gray-200 bg-white px-2.5 py-0.5 text-xs font-medium text-gray-700", className)}>
      {children}
    </span>
  )
}
