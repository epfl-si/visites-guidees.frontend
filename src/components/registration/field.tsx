import type { ReactNode } from "react"
import { Label } from "@/components/ui/label"

export const FieldLabel = ({
  children,
  required = false,
}: {
  children: ReactNode
  required?: boolean
}) => (
  <Label>
    {children} {required && <span className="text-destructive">*</span>}
  </Label>
)

export const FieldError = ({ message }: { message?: string }) => {
  if (!message) return null
  return <p className="text-sm text-destructive">{message}</p>
}
