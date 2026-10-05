import { ASSOCIATION_NAME } from "@/lib/association"
import { Container } from "./container"

export function SiteFooter() {
  return (
    <footer className="mt-12 border-t border-gray-200 py-6 text-center text-sm text-gray-500">
      <Container>
        &copy; {new Date().getFullYear()} {ASSOCIATION_NAME}. Tous droits réservés.
      </Container>
    </footer>
  )
}
