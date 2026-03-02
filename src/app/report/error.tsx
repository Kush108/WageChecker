"use client"

import Link from "next/link"
import { useEffect } from "react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <Card className="p-6">
      <div className="text-body font-semibold text-primary">Report failed to load.</div>
      <div className="mt-2 text-body text-muted">
        Please try again. If you just paid, wait a few seconds and refresh.
      </div>
      <div className="mt-6 grid gap-3">
        <Button onClick={reset}>Try again</Button>
        <Link href="/results" className="text-center text-body font-medium underline">
          Back to results
        </Link>
      </div>
    </Card>
  )
}

