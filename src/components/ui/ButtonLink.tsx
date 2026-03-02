import Link from "next/link"
import type { ReactNode } from "react"

type Variant = "primary" | "secondary" | "ghost"

export function ButtonLink({
  href,
  children,
  className = "",
  variant = "primary"
}: {
  href: string
  children: ReactNode
  className?: string
  variant?: Variant
}) {
  const base =
    "inline-flex w-full items-center justify-center rounded-lg px-4 py-[14px] text-body font-medium min-h-12 transition-colors focus:outline-none focus:ring-2 focus:ring-accent-green/30 focus:ring-offset-2 focus:ring-offset-background"
  const styles: Record<Variant, string> = {
    primary: "bg-accent-green text-[#041008] hover:bg-[#1fb555]",
    secondary: "bg-card text-primary border border-border hover:bg-surface",
    ghost: "bg-transparent text-primary hover:bg-surface"
  }

  return (
    <Link href={href} className={[base, styles[variant], className].join(" ")}>
      {children}
    </Link>
  )
}

