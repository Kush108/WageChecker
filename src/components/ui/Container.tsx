import type { ReactNode } from "react"

export function Container({
  children,
  className = ""
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`mx-auto w-full max-w-[1100px] px-5 ${className}`}>
      {children}
    </div>
  )
}

