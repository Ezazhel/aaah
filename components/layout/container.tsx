import { cn } from "@/lib/utils"

/**
 * Centers the content and caps it at 1440px, with responsive side padding.
 */
export function Container({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("mx-auto w-full max-w-360 px-4 sm:px-6 lg:px-8", className)} {...props} />
}
