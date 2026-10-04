import Image from "next/image"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Container } from "./container"
import { NavLinks } from "./nav-links"
import { UserMenu } from "./user-menu"

export async function SiteHeader() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()

  return (
    <header className="sticky top-0 z-30 bg-brand-dark text-white shadow">
      <Container className="relative flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex shrink-0 items-center gap-3 font-bold">
          <Image src="/aaah_logo.png" alt="AAAH!" width={929} height={385} className="h-12 w-auto drop-shadow" loading="eager" />
          <span className="hidden lg:inline">Association Auteurs Autrices de Jeux</span>
        </Link>
        <nav className="flex items-center gap-4">
          <NavLinks />
          <UserMenu user={data.user} />
        </nav>
      </Container>
    </header>
  )
}
