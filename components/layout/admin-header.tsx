import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { GetPendingCount } from "@/app/(admin)/admin/lib/get-pending-count"
import { GetPendingMechanicsCount } from "@/app/(admin)/admin/tags/lib/get-tags"
import { Container } from "./container"
import { AdminNavLinks } from "./admin-nav-links"
import { UserMenu } from "./user-menu"

/**
 * Header of the admin pages: admin navigation instead of the site menu.
 */
export async function AdminHeader() {
  const supabase = await createClient()
  const [{ data }, pendingCount, pendingMechanicsCount] = await Promise.all([supabase.auth.getUser(), GetPendingCount(), GetPendingMechanicsCount()])

  return (
    <header className="sticky top-0 z-30 bg-brand-dark text-white shadow">
      <Container className="flex min-h-16 flex-wrap items-center justify-between gap-x-6 gap-y-2 py-2">
        <Link href="/admin" className="flex shrink-0 items-center gap-3 font-bold">
          <Image src="/aaah_logo.png" alt="AAAH!" width={929} height={385} className="h-10 w-auto drop-shadow" loading="eager" />
          <span>Administration</span>
        </Link>
        <nav className="flex items-center gap-4 sm:gap-6">
          <AdminNavLinks pendingCount={pendingCount} pendingMechanicsCount={pendingMechanicsCount} />
          <Link href="/" className="hidden items-center gap-1 text-sm text-white/80 hover:text-white md:inline-flex">
            <ArrowLeft className="size-4" aria-hidden /> Retour au site
          </Link>
          <UserMenu user={data.user} isAdmin />
        </nav>
      </Container>
    </header>
  )
}
