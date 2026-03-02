"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Container } from "@/components/ui/Container"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"

export default function GlobalError({
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
    <html lang="en">
      <body>
        <main className="py-10">
          <Container>
            <div className="mx-auto w-full max-w-[520px]">
              <Card className="p-6">
                <div className="text-body font-semibold text-primary">
                  Something went wrong.
                </div>
                <div className="mt-2 text-body text-muted">
                  Please try again. If this keeps happening, contact{" "}
                  <a className="underline" href="mailto:support@wagechecker.ca">
                    support@wagechecker.ca
                  </a>
                  .
                </div>
                <div className="mt-6 grid gap-3">
                  <Button onClick={reset}>Try again</Button>
                  <Link href="/" className="text-center text-body font-medium underline">
                    Back to home
                  </Link>
                </div>
              </Card>
            </div>
          </Container>
        </main>
      </body>
    </html>
  )
}

