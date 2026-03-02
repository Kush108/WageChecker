"use client"

import type { InputHTMLAttributes } from "react"

export function Input({
  label,
  helperText,
  prefix,
  suffix,
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  helperText?: string
  prefix?: string
  suffix?: string
}) {
  return (
    <label className="block">
      {label ? (
        <div className="mb-2 text-body font-medium text-primary">{label}</div>
      ) : null}
      <div className="flex min-h-12 w-full items-center gap-2 rounded-lg border border-border bg-card px-4 py-[14px] transition-colors focus-within:border-accent-green/60 focus-within:ring-2 focus-within:ring-accent-green/20">
        {prefix ? <span className="text-muted">{prefix}</span> : null}
        <input
          className={[
            "w-full bg-transparent text-body text-primary outline-none placeholder:text-muted",
            className
          ].join(" ")}
          {...props}
        />
        {suffix ? <span className="text-muted">{suffix}</span> : null}
      </div>
      {helperText ? (
        <div className="mt-2 text-caption text-muted">{helperText}</div>
      ) : null}
    </label>
  )
}

