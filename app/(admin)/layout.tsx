import { AdminHeader } from "@/components/layout/admin-header"
import { requireAdmin } from "@/lib/route_requires"

export default async function AdminLayout({ children }: LayoutProps<"/">) {
  // Connected AND admin (also checked by the proxy, each page and each server action).
  await requireAdmin()

  return (
    <div className="flex min-h-screen flex-col bg-page">
      <AdminHeader />
      <main className="flex-1">{children}</main>
    </div>
  )
}
