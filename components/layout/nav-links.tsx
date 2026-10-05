'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

const links = [
  { href: "/", label: "Accueil" },
  { href: "/authors", label: "Auteur·ices" },
  { href: "/games", label: "Jeux" },
  { href: "/contact", label: "Contact" },
]

const isActive = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`)

/**
 * Main navigation: inline links on desktop, hamburger panel on mobile.
 */
export function NavLinks() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const linkClass = (href: string) =>
    cn("font-medium underline-offset-8 decoration-2 hover:underline", isActive(pathname, href) && "underline")

  return (
    <>
      <ul className="hidden items-center gap-6 md:flex">
        {links.map(({ href, label }) => (
          <li key={href}>
            <Link href={href} className={linkClass(href)} aria-current={isActive(pathname, href) ? "page" : undefined}>
              {label}
            </Link>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="rounded-lg p-2 hover:bg-white/10 md:hidden"
        aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {open ? <X className="size-6" /> : <Menu className="size-6" />}
      </button>

      {open && (
        <ul className="absolute inset-x-0 top-full flex flex-col gap-1 border-t border-white/10 bg-brand-dark px-4 pt-2 pb-4 shadow md:hidden">
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link href={href} className={cn("block py-2", linkClass(href))} onClick={() => setOpen(false)}>
                {label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
