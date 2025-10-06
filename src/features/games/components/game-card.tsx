import { cva, type VariantProps } from "class-variance-authority"
import { Link } from "react-router-dom"
import slugify from "slugify"
import { cn } from "@/lib/utils"
import type { Game } from "@/types"
import { CategoryBadge } from "@/components/category-badge"

const gameCardVariants = cva(
  "block bg-white rounded-xl border shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary",
  {
    variants: {
      variant: {
        // Card verticale (grille de jeux)
        default: [
          "flex flex-col w-full max-w-sm mx-auto",
          "hover:shadow-2xl hover:-translate-y-2",
          "border-gray-200",
        ],
        // Card avec mise en avant
        featured: [
          "flex flex-col w-full",
          "border-2 border-brand-primary",
          "shadow-lg hover:shadow-2xl hover:-translate-y-2",
        ],
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const gameCardImageVariants = cva(
  "rounded-t-xl overflow-hidden flex items-center justify-center",
  {
    variants: {
      variant: {
        default: "w-full h-[200px] bg-gradient-to-br from-primary-orange-light to-primary-blue-secondary",
        featured: "w-full h-[250px] bg-gradient-to-br from-primary-orange-light to-primary-blue-secondary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface GameCardProps extends VariantProps<typeof gameCardVariants> {
  game: Game
  hideAuthor?: boolean
  className?: string
}

export function GameCard({ 
  game, 
  variant = "default", 
  hideAuthor = false,
  className 
}: GameCardProps) {
  const {
    id,
    name,
    authorNames,
    description,
    minPlayers,
    maxPlayers,
    duration,
    category,
    imageUrl,
  } = game

  const authorName = authorNames?.length 
    ? authorNames.join(", ") 
    : "Auteur inconnu"

  const slug = slugify(name, { lower: true, strict: true });

  return (
    <Link
      to={`/prototypes/${id}/${slug}`}
      className={cn(gameCardVariants({ variant }), className)}
      aria-label={`Voir la fiche du jeu ${name}`}
    >
      {/* Image */}
      <div className={cn(gameCardImageVariants({ variant }), "relative")}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="object-cover w-full h-full rounded-t-xl"
            loading="lazy"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full font-bold select-none text-5xl text-white opacity-60 rounded-t-xl">
            {"🎲"}
          </div>
        )}
      </div>

      {/* Content */}
      <div className={cn(
        "flex flex-col flex-1",
        "p-4"
      )}>
        {/* Title */}
        <h2 className="font-bold text-brand-dark mb-1 text-lg md:text-xl truncate">
          {name}
        </h2>

        {/* Author */}
        {!hideAuthor && (
          <div className="text-brand-primary mb-2 text-sm truncate">
            {authorName}
          </div>
        )}

        {/* Description */}
        {description && (
          <p className="text-gray-700 text-sm mb-3 line-clamp-2">
            {description}
          </p>
        )}

        {/* Tags/Info */}
        <div className="flex flex-wrap items-center gap-2 mt-auto">
          {/* Players */}
          <span className="flex items-center rounded text-xs text-gray-600 bg-gray-100 px-2 py-0.5">
            <span role="img" aria-label="Joueurs">
              {"🎲"}
            </span>
            <span>
              {minPlayers === maxPlayers
                ? `${minPlayers} joueur${minPlayers > 1 ? "s" : ""}`
                : `${minPlayers}-${maxPlayers} joueurs`}
            </span>
          </span>

          {/* Duration */}
          <span className="flex items-center rounded text-xs text-gray-600 bg-gray-100 px-2 py-0.5">
            <span role="img" aria-label="Durée">⏱️</span>
            <span>
              {duration} min
            </span>
          </span>

          {/* Category badge */}
          <CategoryBadge category={category} />
        </div>
      </div>
    </Link>
  )
}