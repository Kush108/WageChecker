"use client"

import type { ReactNode } from "react"

export function SelectionCard({
  title,
  description,
  icon,
  selected,
  disabled,
  badge,
  onClick
}: {
  title: string
  description?: string
  icon?: ReactNode
  selected?: boolean
  disabled?: boolean
  badge?: string
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={[
        "w-full text-left rounded-lg border min-h-12 px-4 py-4 bg-card transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-accent-green/30 focus:ring-offset-2 focus:ring-offset-background",
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-surface",
        selected ? "border-accent-green ring-1 ring-accent-green/30" : "border-border"
      ].join(" ")}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 text-[18px] leading-none text-muted">{icon}</div>
        <div className="flex-1">
          <div className="flex items-center justify-between gap-3">
            <div className="text-body font-semibold text-primary">{title}</div>
            {badge ? (
              <span className="rounded-full border border-border bg-surface px-2 py-1 text-[12px] leading-none text-muted">
                {badge}
              </span>
            ) : null}
          </div>
          {description ? (
            <div className="mt-1 text-caption text-muted">{description}</div>
          ) : null}
        </div>
      </div>
    </button>
  )
}

