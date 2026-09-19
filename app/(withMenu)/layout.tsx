function Header() {
  return (<header> 
    <nav className="flex flex-1 min-w-0 gap-4">
      <a href="./">Accueil</a>
      <a href="./authors">Auteur.ices</a>
      <a href="./games">Jeux</a>
  </nav>
  </header>)
}

export default function WithMenuLayout({children}:React.ComponentProps<'div'>) {
    return <>
    <Header/>
    {children}
    </>
}