import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { Loader2Icon } from "lucide-react"

// Icons taken verbatim from EPFL Elements
const EpflSuccessIcon = () => (
  <svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
    <g fill="none" fillRule="evenodd">
      <circle fill="#7ED321" cx="18" cy="18" r="18" />
      <path stroke="#FFF" strokeWidth="3" d="M10 16.976L16 23l10-10" />
    </g>
  </svg>
)

const EpflInfoIcon = () => (
  <svg viewBox="0 0 34 34" xmlns="http://www.w3.org/2000/svg">
    <g fill="none" fillRule="evenodd">
      <rect fill="#4A90E2" width="34" height="34" rx="4" />
      <path d="M17 25V15M17 13V9" stroke="#FFF" strokeWidth="4" />
    </g>
  </svg>
)

const EpflWarningIcon = () => (
  <svg viewBox="0 0 36 32" xmlns="http://www.w3.org/2000/svg">
    <g fill="none" fillRule="evenodd">
      <path
        fill="#FFC107"
        d="M19.746 1.124l15.591 27.9A2 2 0 0 1 33.591 32H2.41a2 2 0 0 1-1.746-2.976l15.591-27.9a2 2 0 0 1 3.492 0z"
      />
      <path d="M18 12v10M18 24v2" stroke="#FFF" strokeWidth="2" />
    </g>
  </svg>
)

const EpflErrorIcon = () => (
  <svg viewBox="0 0 34 34" xmlns="http://www.w3.org/2000/svg">
    <g fill="none" fillRule="evenodd">
      <path
        fill="#FF0000"
        d="M24.042 0L34 9.958v14.084L24.042 34H9.958L0 24.042V9.958L9.958 0z"
      />
      <g stroke="#FFF" strokeWidth="4">
        <path d="M17 9v10M17 21v4" />
      </g>
    </g>
  </svg>
)

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      richColors
      className="toaster group"
      icons={{
        success: <EpflSuccessIcon />,
        info: <EpflInfoIcon />,
        warning: <EpflWarningIcon />,
        error: <EpflErrorIcon />,
        loading: <Loader2Icon className="size-full animate-spin" />,
      }}
      style={
        {
          "--border-radius": "0px",

          "--normal-bg": "var(--epfl-alert-bg)",
          "--normal-text": "var(--epfl-alert-text)",
          "--normal-border": "var(--epfl-alert-text)",

          "--success-bg": "var(--epfl-alert-bg)",
          "--success-text": "var(--epfl-alert-text)",
          "--success-border": "var(--epfl-alert-success)",

          "--info-bg": "var(--epfl-alert-bg)",
          "--info-text": "var(--epfl-alert-text)",
          "--info-border": "var(--epfl-alert-info)",

          "--warning-bg": "var(--epfl-alert-bg)",
          "--warning-text": "var(--epfl-alert-text)",
          "--warning-border": "var(--epfl-alert-warning)",

          "--error-bg": "var(--epfl-alert-bg)",
          "--error-text": "var(--epfl-alert-text)",
          "--error-border": "var(--epfl-alert-danger)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
