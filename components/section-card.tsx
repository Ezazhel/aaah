import { cn } from "@/lib/utils"

type SectionCardProps = Omit<React.ComponentProps<"section">, "title"> & {
  title?: React.ReactNode
}

/**
 * White content block with an optional navy title.
 */
export function SectionCard({ title, className, children, ...props }: SectionCardProps) {
  return (
    <section className={cn("rounded-xl bg-white/90 p-6 shadow", className)} {...props}>
      {title && <h2 className="mb-4 text-2xl font-bold text-brand-dark">{title}</h2>}
      {children}
    </section>
  )
}
