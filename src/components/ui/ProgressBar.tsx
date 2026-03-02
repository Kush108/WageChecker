export function ProgressBar({ value }: { value: number }) {
  const v = Math.max(0, Math.min(100, value))
  return (
    <div className="h-1 w-full rounded-full bg-border/80">
      <div
        className="h-1 rounded-full bg-accent-green"
        style={{ width: `${v}%` }}
      />
    </div>
  )
}

