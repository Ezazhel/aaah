import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

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
  firstName: string | null
  lastName: string | null
  avatarUrl?: string | null
  className?: string
}

/**
 * Round author picture, falling back to the author's initials.
 */
export function AuthorAvatar({ firstName, lastName, avatarUrl, size, className }: AuthorAvatarProps) {
  const initials = `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`

  return (
    <div className={cn(avatarVariants({ size }), className)}>
      {avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- avatars are not uploaded yet, the source is unknown
        <img src={avatarUrl} alt="" className="size-full object-cover" />
      ) : (
        <span aria-hidden>{initials}</span>
      )}
    </div>
  )
}
