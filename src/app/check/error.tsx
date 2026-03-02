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
      <div className="text-body font-semibold text-primary">Checker failed to load.</div>
      <div className="mt-2 text-body text-muted">
        Please refresh and try again.
      </div>
      <div className="mt-6 grid gap-3">
        <Button onClick={reset}>Try again</Button>
        <Link href="/" className="text-center text-body font-medium underline">
          Back to home
        </Link>
      </div>
    </Card>
  )
}

