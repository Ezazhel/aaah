import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { avatarUrl } from "@/lib/avatar"

const avatarVariants = cva(
  "flex shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-primary bg-linear-to-br from-surface-light to-brand-light font-bold uppercase text-brand-dark",
  {
    variants: {
      size: {
        sm: "size-12 border-2 text-base",
        md: "size-24 text-3xl",
        lg: "size-30 text-4xl",
        xl: "size-40 text-5xl md:size-50 md:text-6xl",
      },
    },
    defaultVariants: { size: "md" },
  }
)

type AuthorAvatarProps = VariantProps<typeof avatarVariants> & {
  authorId: string
  firstName: string | null
  lastName: string | null
  /** Null when the author has no picture. */
  avatarUpdatedAt: string | null
  /** Local picture shown instead of the stored one (account form preview). */
  previewUrl?: string | null
  className?: string
}

/**
 * Round author picture, falling back to the author's initials.
 */
export function AuthorAvatar({ authorId, firstName, lastName, avatarUpdatedAt, previewUrl, size, className }: AuthorAvatarProps) {
  const initials = `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`
  // Only the author page needs the large file.
  const src = previewUrl ?? avatarUrl(authorId, avatarUpdatedAt, size === "xl" ? "lg" : "sm")

  return (
    <div className={cn(avatarVariants({ size }), className)}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element -- already resized at upload, served as is by Supabase Storage
        <img src={src} alt="" className="size-full object-cover" />
      ) : (
        <span aria-hidden>{initials}</span>
      )}
    </div>
  )
}
