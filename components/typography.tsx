import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const typographyVariants = cva("", {
  variants: {
    variant: {
      h1: "text-3xl font-bold tracking-tight",
      h2: "text-2xl font-semibold tracking-tight",
      h3: "text-xl font-semibold",
      p: "leading-7",
      lead: "text-lg text-muted-foreground",
      muted: "text-sm text-muted-foreground",
      small: "text-sm font-medium",
    },
  },
  defaultVariants: {
    variant: "p",
  },
})

type Variant = NonNullable<VariantProps<typeof typographyVariants>["variant"]>

// Default HTML tag for each variant, can be overridden with `as`.
const defaultTags: Record<Variant, React.ElementType> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  p: "p",
  lead: "p",
  muted: "span",
  small: "small",
}

type TypographyProps = React.HTMLAttributes<HTMLElement> &
  VariantProps<typeof typographyVariants> & {
    as?: React.ElementType
  }

export function Typography({ variant, as, className, ...props }: TypographyProps) {
  const Comp = as ?? defaultTags[variant ?? "p"]
  return <Comp className={cn(typographyVariants({ variant }), className)} {...props} />
}

type HeadingProps = Omit<TypographyProps, "variant">

export const H1 = (props: HeadingProps) => <Typography variant="h1" {...props} />
export const H2 = (props: HeadingProps) => <Typography variant="h2" {...props} />
export const H3 = (props: HeadingProps) => <Typography variant="h3" {...props} />
export const P = (props: HeadingProps) => <Typography variant="p" {...props} />
export const Muted = (props: HeadingProps) => <Typography variant="muted" {...props} />

export { typographyVariants }
