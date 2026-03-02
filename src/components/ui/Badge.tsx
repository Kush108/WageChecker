import type { ReactNode } from "react"

export function Badge({
  children,
  tone = "neutral",
  className = ""
}: {
  children: ReactNode
  tone?: "neutral" | "success" | "warning" | "danger"
  className?: string
}) {
  const styles: Record<string, string> = {
    neutral: "bg-surface text-muted border-border",
    success: "bg-[rgba(34,197,94,0.10)] text-accent-green border-[rgba(34,197,94,0.22)]",
    warning: "bg-[rgba(245,158,11,0.12)] text-[#FBBF24] border-[rgba(245,158,11,0.20)]",
    danger: "bg-[rgba(239,68,68,0.10)] text-accent-red border-[rgba(239,68,68,0.22)]"
  }

  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[12px] leading-none font-medium",
        styles[tone],
        className
      ].join(" ")}
    >
      {children}
    </span>
  )
}

