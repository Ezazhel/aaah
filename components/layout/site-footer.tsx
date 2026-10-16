import Link from "next/link"
import { ASSOCIATION_NAME } from "@/lib/association"
import { Container } from "./container"

export function SiteFooter() {
  return (
    <footer className="mt-12 border-t border-gray-200 py-6 text-center text-sm text-gray-500">
      <Container className="flex flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-4">
        <span>&copy; {new Date().getFullYear()} {ASSOCIATION_NAME}. Tous droits réservés.</span>
        <Link href="/legal" className="underline-offset-4 hover:text-gray-700 hover:underline">
          Mentions légales
        </Link>
      </Container>
    </footer>
  )
}
