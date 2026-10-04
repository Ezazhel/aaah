import { cn } from "@/lib/utils"

/**
 * Small gray chip for game metadata (players, duration, age).
 */
export function MetaChip({ icon: Icon, className, children }: { icon: React.ElementType; className?: string; children: React.ReactNode }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700", className)}>
      <Icon className="size-3.5 text-brand-secondary" aria-hidden />
      {children}
    </span>
  )
}
