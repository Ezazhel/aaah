'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const isActive = (pathname: string, href: string) => pathname === href || pathname.startsWith(`${href}/`)

/**
 * Admin navigation: invite and validation links, with the number of games to validate.
 */
export function AdminNavLinks({ pendingCount, pendingMechanicsCount }: { pendingCount: number; pendingMechanicsCount: number }) {
  const pathname = usePathname()

  const links = [
    { href: "/admin/authors", label: "Auteur·ices", badge: 0 },
    { href: "/admin/invite", label: "Inviter auteur", badge: 0 },
    { href: "/admin/validation", label: "Validation", badge: pendingCount },
    { href: "/admin/tags", label: "Tags", badge: pendingMechanicsCount },
  ]

  return (
    <ul className="flex items-center gap-4 sm:gap-6">
      {links.map(({ href, label, badge }) => (
        <li key={href}>
          <Link
            href={href}
            aria-current={isActive(pathname, href) ? "page" : undefined}
            className={cn("inline-flex items-center gap-2 text-sm font-medium underline-offset-8 decoration-2 hover:underline sm:text-base", isActive(pathname, href) && "underline")}
          >
            {label}
            {badge > 0 && (
              <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-bold text-white" aria-label={`${badge} à valider`}>
                {badge}
              </span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  )
}
