import { cva, type VariantProps } from "class-variance-authority"
import { CircleAlert, CircleCheck } from "lucide-react"
import { cn } from "@/lib/utils"

const alertVariants = cva("flex items-start gap-3 rounded-lg border px-4 py-3 text-sm", {
  variants: {
    variant: {
      error: "border-red-200 bg-red-50 text-red-700",
      success: "border-green-200 bg-green-50 text-green-700",
    },
  },
  defaultVariants: { variant: "error" },
})

export function Alert({ variant, className, children }: VariantProps<typeof alertVariants> & { className?: string; children: React.ReactNode }) {
  const Icon = variant === "success" ? CircleCheck : CircleAlert
  return (
    <div role={variant === "success" ? "status" : "alert"} className={cn(alertVariants({ variant }), className)}>
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden />
      <div>{children}</div>
    </div>
  )
}
