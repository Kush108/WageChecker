export default function Loading() {
  return (
    <div className="grid place-items-center py-14">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 rounded-full border-2 border-border border-t-primary animate-spin" />
        <div className="mt-5 text-body font-semibold text-primary">
          Generating your report...
        </div>
        <div className="mt-2 text-body text-muted">This takes about 15 seconds</div>
      </div>
    </div>
  )
}

