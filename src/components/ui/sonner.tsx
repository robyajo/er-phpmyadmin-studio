import { useEffect } from "react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps, toast } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  useEffect(() => {
    // Memungkinkan pengguna untuk menyalin pesan toast dengan klik dua kali (double click)
    const handleDoubleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      if (target?.closest("button")) return
      const descEl = target?.closest("[data-description]") || target?.closest("[data-sonner-toast]")
      if (descEl && descEl.textContent) {
        navigator.clipboard.writeText(descEl.textContent.trim())
        toast.info("Pesan berhasil disalin ke papan klip!", { duration: 2000 })
      }
    }

    document.addEventListener("dblclick", handleDoubleClick)
    return () => {
      document.removeEventListener("dblclick", handleDoubleClick)
    }
  }, [])

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group select-text"
      swipeDirections={[]}
      icons={{
        success: (
          <CircleCheckIcon className="size-4" />
        ),
        info: (
          <InfoIcon className="size-4" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4" />
        ),
        error: (
          <OctagonXIcon className="size-4" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast select-text",
          title: "select-text font-medium text-foreground",
          description: "select-text break-words select-all font-mono text-xs text-muted-foreground",
          actionButton: "cursor-pointer font-medium text-xs py-1 px-2.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors select-none",
          closeButton: "cursor-pointer select-none",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
