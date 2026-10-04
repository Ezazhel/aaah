import { cn } from "@/lib/utils"
import { Container } from "./layout/container"

type PageHeaderProps = {
  title: React.ReactNode
  subtitle?: React.ReactNode
  /** Rendered above the title (breadcrumb, back link). */
  top?: React.ReactNode
  /** Rendered on the right of the title on desktop (buttons). */
  actions?: React.ReactNode
  className?: string
}

/**
 * Gradient title banner shown at the top of list and form pages.
 */
export function PageHeader({ title, subtitle, top, actions, className }: PageHeaderProps) {
  return (
    <section className={cn("bg-hero py-10 text-white md:py-14", className)}>
      <Container className="flex flex-col gap-3">
        {top}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-extrabold tracking-tight drop-shadow-lg md:text-5xl">{title}</h1>
            {subtitle && <p className="text-lg text-white/85 md:text-xl">{subtitle}</p>}
          </div>
          {actions && <div className="flex shrink-0 gap-3">{actions}</div>}
        </div>
      </Container>
    </section>
  )
}
