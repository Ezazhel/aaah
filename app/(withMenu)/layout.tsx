import Link from "next/link";
import { User } from "@/components/user"
import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server"

async function Header() {
  const supabase = await createClient();
  const { data:user } = await supabase.auth.getUser();
  return (<header> 
    <nav className="flex flex-row flex-1 min-w-0 gap-4 h-16 border-b items-center">
      <a href="/">Accueil</a>
      <a href="/authors">Auteur.ices</a>
      <a href="/games">Jeux</a>
      {user.user ? <Link href="/games/new" className={buttonVariants({ size: "sm" })}>Nouveau jeu</Link> : null}
      <User user={user.user}/>
  </nav>
  </header>)
}

export default async function WithMenuLayout({children}:React.ComponentProps<'div'>) {
    return <>
    <Header/>
    <main className="mx-auto w-360 h-full">
    {children}
    </main>
    </>
}