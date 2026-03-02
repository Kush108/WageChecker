"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"

function todayISO() {
  return new Date().toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric"
  })
}

export function ReportClient() {
  const sp = useSearchParams()
  const sessionId = sp.get("session_id")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [report, setReport] = useState<string | null>(null)
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function run() {
      if (!sessionId) {
        setError("Missing session_id")
        setLoading(false)
        return
      }
      try {
        setLoading(true)
        const res = await fetch(`/api/get-report?session_id=${encodeURIComponent(sessionId)}`)
        const data = (await res.json()) as {
          report?: string
          paid?: boolean
          email?: string
          error?: string
        }
        if (cancelled) return
        if (!res.ok) throw new Error(data.error || "Unable to fetch report")
        setReport(data.report || null)
        setEmail(data.email || null)
      } catch (e) {
        if (cancelled) return
        setError(e instanceof Error ? e.message : "Unknown error")
      } finally {
        if (cancelled) return
        setLoading(false)
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [sessionId])

  const reportLines = useMemo(() => {
    if (!report) return []
    return report.split("\n")
  }, [report])

  if (loading) {
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

  if (error || !report) {
    return (
      <Card className="p-6">
        <div className="text-body font-semibold text-primary">We couldn’t load your report.</div>
        <div className="mt-2 text-body text-muted">{error || "Unknown error"}</div>
        <div className="mt-6">
          <Link href="/results" className="text-body font-medium underline">
            Back to results
          </Link>
        </div>
      </Card>
    )
  }

  return (
    <div className="grid gap-4">
      <Card className="p-6 bg-primary text-white print-reset-shadow print-card">
        <div className="text-[18px] font-semibold">Your Ontario ESA Wage Report</div>
        <div className="mt-2 text-caption text-white/75">{todayISO()}</div>
        <div className="mt-1 text-caption text-white/75">
          Based on Ontario Employment Standards Act 2000
        </div>
      </Card>

      <Card className="p-6 print-card print-reset-shadow">
        <div className="flex items-center justify-between gap-3 no-print">
          <div className="text-body text-muted">
            {email ? <>A copy of this report has been sent to <b>{email}</b>.</> : null}
          </div>
          <div className="w-[220px]">
            <Button variant="secondary" onClick={() => window.print()}>
              Download as PDF
            </Button>
          </div>
        </div>

        <div className="mt-4 whitespace-pre-wrap text-body text-primary font-[ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace]">
          {reportLines.join("\n")}
        </div>
      </Card>

      <div className="text-caption text-muted">
        This report is for educational purposes only. It is not legal advice and does not create a lawyer-client relationship.
      </div>
    </div>
  )
}

