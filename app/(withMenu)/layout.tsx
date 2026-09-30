import { User } from "@/components/user"
import { requireUserSetup } from "@/lib/route_requires";
import { createClient } from "@/lib/supabase/server"

async function Header() {
  const supabase = await createClient();
  const { data:user, error } = await supabase.auth.getUser();
  return (<header> 
    <nav className="flex flex-1 min-w-0 gap-4">
      <a href="/">Accueil</a>
      <a href="/authors">Auteur.ices</a>
      <a href="/games">Jeux</a>
      <User user={user.user}/>
  </nav>
  </header>)
}

export default async function WithMenuLayout({children}:React.ComponentProps<'div'>) {
    return <>
    <Header/>
    {children}
    </>
}