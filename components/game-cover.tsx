import { cn } from "@/lib/utils"
import { gameCoverUrl, type GameCoverSize } from "@/lib/game-cover"

type GameCoverProps = {
  gameId?: string
  /** Null when the game has no cover. */
  coverUpdatedAt?: string | null
  /** Local picture shown instead of the stored one (game form preview). */
  previewUrl?: string | null
  size: GameCoverSize
  /** cover: fills the box, cropping the edges (cards). contain: whole picture (game page). */
  fit: "cover" | "contain"
  /** Sizes the box: the picture or the dice fill it. */
  className?: string
  /** Classes of the dice shown without a cover. */
  diceClassName?: string
  imageClassName?: string
}

/**
 * Game cover in a fixed box, falling back to a dice on the placeholder background.
 */
export function GameCover({ gameId, coverUpdatedAt = null, previewUrl, size, fit, className, diceClassName, imageClassName }: GameCoverProps) {
  const src = previewUrl ?? (gameId ? gameCoverUrl(gameId, coverUpdatedAt, size) : null)

  return (
    <div className={cn("flex items-center justify-center overflow-hidden bg-placeholder", className)}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element -- already resized at upload, served as is by Supabase Storage
        <img src={src} alt="" className={cn("size-full", fit === "cover" ? "object-cover" : "object-contain", imageClassName)} />
      ) : (
        <span aria-hidden className={cn("opacity-60", diceClassName)}>🎲</span>
      )}
    </div>
  )
}
