import type { ReactNode } from "react"

export function Card({
  children,
  className = ""
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={[
        "rounded-card bg-card shadow-card border border-border",
        className
      ].join(" ")}
    >
      {children}
    </div>
  )
}

