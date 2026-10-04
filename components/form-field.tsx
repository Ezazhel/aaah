import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

type FormFieldProps = {
  /** Id of the control, used for the label and the error message. */
  id: string
  label: React.ReactNode
  error?: string
  hint?: React.ReactNode
  className?: string
  children: React.ReactNode
}

/**
 * Label + control + error message. The control must use `id` and
 * `aria-describedby={errorId(id)}` to be linked to the error.
 */
export function FormField({ id, label, error, hint, className, children }: FormFieldProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Label htmlFor={id}>{label}</Label>
      {children}
      {hint && !error && <p className="text-xs text-gray-500">{hint}</p>}
      {error && <p id={errorId(id)} role="alert" className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

export const errorId = (id: string) => `${id}-error`
