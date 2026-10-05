import Image from "next/image";
import Link from "next/link";
import { Check, ExternalLink, Handshake, Lightbulb, MapPin, Package, Sparkles, Tent, Users } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { ASSOCIATION_NAME, ASSOCIATION_SHORT_NAME, FOUNDING_YEAR, HELLOASSO_URL, PLACES, SAJ_URL, associationSeason } from "@/lib/association";
import { H2, Lead, P } from "@/components/typography";
import { GameCard } from "./games/components/game-card";
import { GetGames } from "./games/lib/get-games";

const missions = [
  { icon: Sparkles, title: "Améliorer ses jeux", text: "Des sessions de test et des retours d'autres auteur·ices pour faire progresser vos prototypes." },
  { icon: MapPin, title: "Des lieux pour présenter ses prototypes", text: "Des rendez-vous réguliers, Barak'AAAH! et CAAAH'STOR, pour faire jouer vos jeux à un vrai public." },
  { icon: Tent, title: "Accéder à des festivals", text: "L'association est invitée dans des festivals de la région et y fait découvrir les jeux de ses membres." },
  { icon: Handshake, title: "Rencontrer des éditeurs", text: "Un catalogue des jeux des membres, envoyé aux maisons d'édition intéressées, et des premières rencontres, souvent au festival de Cannes." },
  { icon: Users, title: "Rencontrer d'autres auteur·ices", text: "Un réseau d'autrices et d'auteurs pour échanger, collaborer et s'entraider." },
  { icon: Package, title: "Du matériel pour créer", text: "Du matériel de prototypage pour fabriquer et faire évoluer vos jeux." },
  { icon: Lightbulb, title: "Conseils et astuces", text: "Des conseils pour avancer à chaque étape : conception, prototypage, présentation à un éditeur." },
]

const joinReasons = [
  "Faire tester vos jeux à Barak'AAAH!, CAAAH'STOR et aux rendez-vous de l'association",
  "Être présenté·e dans les festivals où l'association est invitée",
  "Avoir votre fiche auteur·ice et vos jeux sur ce site",
  "Figurer dans le catalogue de l'association, envoyé aux maisons d'édition intéressées : souvent l'occasion de premières rencontres au festival de Cannes",
  "Rejoindre un réseau d'auteur·ices",
]

/**
 * Name of an event place, linking to Google Maps.
 */
const PlaceLink = ({ place }: { place: { name: string; url: string } }) => (
  <a
    href={place.url}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={`${place.name} (ouvre Google Maps)`}
    className="inline-flex items-center gap-1 font-semibold text-white underline decoration-2 underline-offset-4 hover:text-white/80"
  >
    <MapPin className="size-4" aria-hidden />{place.name}
  </a>
)

export default async function Home() {
  const games = await GetGames(3);

  return (
    <>
      <section className="bg-hero px-4 py-16 text-center text-white md:py-20">
        <div className="mx-auto flex max-w-3xl flex-col items-center">
          <h1 className="mb-4 text-3xl font-extrabold drop-shadow-lg md:text-5xl">Créateurs de Jeux Passionnés</h1>
          <p className="mb-8 text-lg font-medium md:text-2xl">
            Les auteur·ices de jeux de société autour et en Hérault, et leurs créations.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/games" className={buttonVariants({ size: "lg" })}>Découvrir les jeux</Link>
            <Link href="/authors" className={buttonVariants({ variant: "hero-outline", size: "lg" })}>Nos auteur·ices</Link>
          </div>
        </div>
      </section>

      <section aria-labelledby="presentation" className="bg-white py-16 md:py-20">
        <Container className="max-w-5xl">
          <article className="flex flex-col items-center gap-10 md:flex-row md:items-start md:gap-14">
            <Image src="/aaah_logo.png" alt="" width={929} height={385} className="w-56 shrink-0 drop-shadow md:mt-2 md:w-72" />
            <div className="flex flex-col gap-4">
              <H2 id="presentation" className="text-3xl md:text-4xl">Qui sommes-nous ?</H2>
              <P className="text-lg">
                La <strong>{ASSOCIATION_SHORT_NAME}</strong>, <em>{ASSOCIATION_NAME}</em>, rassemble les autrices et auteurs de jeux
                de société, édité·es ou non, de Montpellier et des régions alentour. Créée en {FOUNDING_YEAR}, l&apos;association
                vit sa {associationSeason()}<sup>e</sup> saison.
              </P>
              <P>
                On y partage nos prototypes, nos retours et nos expériences, à tous les stades d&apos;un projet : de la première
                idée griffonnée au jeu prêt à être présenté à un éditeur.
              </P>
              <P>
                Nous organisons des rendez-vous réguliers pour faire tester nos jeux, et l&apos;association est invitée dans divers
                festivals de la région pour faire découvrir les créations de ses membres.
              </P>
              <P>
                La {ASSOCIATION_SHORT_NAME} fait partie de la{' '}
                <a href={SAJ_URL} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary underline underline-offset-4 hover:text-primary/80">
                  Société des Auteurs de Jeux (SAJ)
                </a>
                , qui défend les droits des autrices et auteurs de jeux francophones.
              </P>
            </div>
          </article>
        </Container>
      </section>

      <section aria-labelledby="missions" className="py-16 md:py-20">
        <Container className="flex max-w-5xl flex-col gap-10">
          <div className="flex flex-col gap-3 text-center">
            <H2 id="missions" className="text-3xl md:text-4xl">Nos missions</H2>
            <Lead>Accompagner les auteur·ices à chaque étape de la création de leurs jeux.</Lead>
          </div>
          <ul className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {missions.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-4">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-white shadow" aria-hidden>
                  <Icon className="size-6" />
                </span>
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-bold text-brand-dark">{title}</h3>
                  <p className="text-gray-700">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section aria-labelledby="events" className="bg-hero py-16 text-white md:py-20">
        <Container className="flex max-w-5xl flex-col gap-12">
          <h2 id="events" className="text-center text-3xl font-extrabold drop-shadow-lg md:text-4xl">Nos rendez-vous</h2>

          <article className="flex flex-col items-center gap-10 md:flex-row md:justify-between md:gap-14">
            <div className="flex flex-col items-center gap-5 text-center md:items-start md:text-left">
              <p className="text-sm font-semibold tracking-widest text-white/80 uppercase">La journée proto</p>
              <h3 className="text-4xl font-extrabold drop-shadow-lg md:text-5xl">Barak&apos;AAAH!</h3>
              <p className="max-w-xl text-lg text-white/90 md:text-xl">
                Venez découvrir et tester les jeux de demain avec les auteur·ices de la région, autour de leurs prototypes.
                Une journée organisée avec <PlaceLink place={PLACES.baraka}/>.
              </p>
              <p className="rounded-full bg-primary px-5 py-2 text-lg font-bold shadow-lg">
                Tous les 1<sup>ers</sup> samedis du mois · 14h – 20h
              </p>
            </div>
            <Image
              src="/barakaaah.png"
              alt="Affiche Barak'AAAH! : la journée proto de la AAAH!, tous les premiers samedis du mois de 14h à 20h, organisée par Baraka Jeux et la AAAH!"
              width={3508}
              height={4961}
              sizes="(min-width: 768px) 320px, 80vw"
              className="w-full max-w-xs shrink-0 rounded-xl shadow-2xl"
            />
          </article>

          <article className="flex flex-col items-center gap-10 border-t border-white/20 pt-12 md:flex-row-reverse md:justify-between md:gap-14">
            <div className="flex flex-col items-center gap-5 text-center md:items-start md:text-left">
              <p className="text-sm font-semibold tracking-widest text-white/80 uppercase">La soirée proto</p>
              <h3 className="text-4xl font-extrabold drop-shadow-lg md:text-5xl">CAAAH&apos;STOR</h3>
              <p className="max-w-xl text-lg text-white/90 md:text-xl">
                Une soirée par mois au bar à jeux <PlaceLink place={PLACES.castors}/>, dans le centre-ville de Montpellier :
                l&apos;occasion de rencontrer un public passionné de jeux et de faire la promotion de la création ludique.
              </p>
              <p className="rounded-full bg-primary px-5 py-2 text-lg font-bold shadow-lg">
                Une soirée par mois · dès 19h
              </p>
            </div>
            <Image
              src="/castor_logo.jpg"
              alt="Logo du bar à jeux Les Castors"
              width={954}
              height={960}
              sizes="(min-width: 768px) 224px, 50vw"
              className="w-48 shrink-0 rounded-full shadow-2xl md:w-56"
            />
          </article>
        </Container>
      </section>

      <section aria-labelledby="join" className="bg-white py-16 md:py-20">
        <Container className="flex max-w-5xl flex-col gap-10">
          <div className="flex flex-col gap-10 md:flex-row md:gap-14">
            <div className="flex flex-col gap-6 md:w-3/5">
              <H2 id="join" className="text-3xl md:text-4xl">Pourquoi nous rejoindre ?</H2>
              <ul className="flex flex-col gap-4">
                {joinReasons.map((reason) => (
                  <li key={reason} className="flex gap-3">
                    <Check className="mt-1 size-5 shrink-0 text-primary" aria-hidden />
                    <span className="leading-7 text-gray-800">{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
            <aside className="flex flex-col gap-3 self-start rounded-xl bg-page p-6 md:w-2/5">
              <h3 className="text-xl font-bold text-brand-dark">À quoi sert votre adhésion ?</h3>
              <P>
                Les cotisations permettent d&apos;acheter du matériel réutilisable, partagé entre les membres pour fabriquer et
                tester les prototypes : dés, cartes, boîtes…
              </P>
            </aside>
          </div>
          <a href={HELLOASSO_URL} target="_blank" rel="noopener noreferrer" className={buttonVariants({ size: "lg", className: "self-center" })}>
            Adhérer sur HelloAsso <ExternalLink aria-hidden />
          </a>
        </Container>
      </section>

      <Container className="flex flex-col gap-12 py-16">
        {games.length > 0 && (
          <section className="flex flex-col gap-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <H2 className="text-3xl md:text-4xl">Quelques jeux</H2>
              <Link href="/games" className={buttonVariants({ variant: "outline" })}>Voir tous les jeux</Link>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {games.map(game => <GameCard key={game.id} game={game}/>)}
            </div>
          </section>
        )}
      </Container>
    </>
  );
}
