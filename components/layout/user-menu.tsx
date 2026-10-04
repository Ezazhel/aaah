'use client'

import Link from "next/link"
import { type User } from "@supabase/supabase-js"
import { LogOut, Plus, ShieldCheck, UserRound } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

/**
 * Connection status: login link, or an avatar opening the account menu.
 */
export function UserMenu({ user, isAdmin = false }: { user: User | null; isAdmin?: boolean }) {
  if (!user) {
    return (
      <Link href="/auth/login" className="rounded-lg border border-white px-4 py-1.5 text-sm font-semibold hover:bg-white hover:text-brand-dark">
        Connexion
      </Link>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center rounded-lg p-1.5 outline-none hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white" aria-label="Menu du compte">
        <span className="flex size-8 items-center justify-center rounded-full bg-white text-sm font-bold uppercase text-brand-dark">
          {user.email?.[0] ?? "?"}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="truncate font-normal text-gray-500">{user.email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/account"><UserRound /> Mon profil</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/games/new"><Plus /> Nouveau jeu</Link>
        </DropdownMenuItem>
        {isAdmin && (
          <DropdownMenuItem asChild>
            <Link href="/admin"><ShieldCheck /> Administration</Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild variant="destructive">
          <a href="/auth/sign-out"><LogOut /> Déconnexion</a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
