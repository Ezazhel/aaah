import Link from "next/link"
import { Fragment } from "react"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

type Crumb = { label: string; href?: string }

/**
 * Breadcrumb trail. The last item is the current page (no link).
 * `tone="light"` is for gradient backgrounds.
 */
export function Breadcrumb({ items, tone = "dark", className }: { items: Crumb[]; tone?: "dark" | "light"; className?: string }) {
  return (
    <nav aria-label="Fil d'Ariane" className={cn("text-sm", tone === "light" ? "text-white/75" : "text-gray-500", className)}>
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, index) => (
          <Fragment key={item.label}>
            {index > 0 && <ChevronRight className="size-4" aria-hidden />}
            <li className="min-w-0 truncate">
              {item.href ? (
                <Link href={item.href} className={cn("font-semibold hover:underline", tone === "light" ? "text-white" : "text-primary")}>
                  {item.label}
                </Link>
              ) : (
                <span aria-current="page">{item.label}</span>
              )}
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  )
}
