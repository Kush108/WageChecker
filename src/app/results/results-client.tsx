"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { calculateOntarioESA } from "@/lib/calc"
import { formatMoneyCAD } from "@/lib/format"
import type { CalculationResult, QuizAnswers, Violation } from "@/lib/types"

const STORAGE_KEY = "wagechecker.quiz.v1"

function readAnswers(): QuizAnswers | null {
  const raw = sessionStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as QuizAnswers
  } catch {
    return null
  }
}

function severityTone(sev: Violation["severity"]) {
  if (sev === "HIGH") return "danger" as const
  return "warning" as const
}

function yearsFromTenure(t: QuizAnswers["tenure"]) {
  switch (t) {
    case "lt1":
      return 0
    case "1to3":
      return 2
    case "3to5":
      return 4
    case "5plus":
      return 5
    default:
      return 0
  }
}

export function ResultsClient() {
  const router = useRouter()
  const [answers, setAnswers] = useState<QuizAnswers | null>(null)
  const [checkingOut, setCheckingOut] = useState(false)

  useEffect(() => {
    const a = readAnswers()
    setAnswers(a)
  }, [])

  const calc: CalculationResult | null = useMemo(() => {
    if (!answers) return null
    return calculateOntarioESA(answers)
  }, [answers])

  async function unlock() {
    if (!answers?.email) return
    try {
      setCheckingOut(true)
      const res = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers)
      })
      const data = (await res.json()) as { url?: string; error?: string }
      if (data.url) window.location.href = data.url
    } finally {
      setCheckingOut(false)
    }
  }

  if (!answers || !calc) {
    return (
      <Card className="p-6">
        <div className="text-body font-semibold">We couldn’t find your answers.</div>
        <div className="mt-2 text-body text-muted">
          Please run the quick check again.
        </div>
        <div className="mt-6">
          <Button onClick={() => router.push("/check")}>Go to checker →</Button>
        </div>
      </Card>
    )
  }

  const { violations, totalOwed } = calc
  const years = yearsFromTenure(answers.tenure)
  const longTermEstimate =
    years >= 1 ? Math.min(totalOwed * 52 * years, totalOwed * 52 * 5) : 0

  return (
    <div className="grid gap-4">
      {violations.length === 0 ? (
        <Card className="p-6 border-[rgba(29,185,84,0.35)]">
          <div className="text-body font-semibold text-accent-green">
            ✅ No obvious ESA violations found
          </div>
          <div className="mt-2 text-body text-primary">
            Based on what you entered, your last pay period appears to comply with
            Ontario ESA minimums.
          </div>
          <div className="mt-4 text-body text-muted">
            Want to check for more complex situations like overtime averaging
            agreements, public holiday entitlement calculations, or termination pay?
          </div>
        </Card>
      ) : (
        <Card className="p-6 border-[rgba(230,57,70,0.45)]">
          <div className="text-body font-semibold text-primary">
            🚨 We found {violations.length} potential ESA violation(s)
          </div>
          <div className="mt-5 text-caption text-muted">You may be owed up to</div>
          <div className="mt-1 text-[34px] leading-tight font-bold text-accent-green">
            {formatMoneyCAD(totalOwed)}
          </div>
          <div className="mt-1 text-caption text-muted">based on last week alone</div>

          {years >= 1 ? (
            <div className="mt-4 text-body text-primary">
              Over {years} years, this could total{" "}
              <span className="font-semibold text-accent-green">
                {formatMoneyCAD(longTermEstimate)}
              </span>{" "}
              <span className="text-muted">(capped conservatively)</span>
            </div>
          ) : null}
        </Card>
      )}

      {violations.map((v) => (
        <Card key={v.id} className="p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-body font-semibold text-primary">{v.name}</div>
              <div className="mt-1 text-caption text-muted">{v.section}</div>
            </div>
            <Badge tone={severityTone(v.severity)}>{v.severity}</Badge>
          </div>

          <div className="mt-3 text-body text-primary">{v.shortDesc}</div>

          <div className="mt-4">
            <div className="text-caption text-muted">Amount potentially owed</div>
            <div className="relative mt-1 rounded-lg border border-border bg-background px-4 py-3">
              <div className="absolute inset-0 flex items-center justify-center gap-2 rounded-lg bg-white/60">
                <span className="text-body font-semibold text-primary">🔒</span>
                <span className="text-body font-semibold text-primary">Locked</span>
              </div>
              <div className="text-[18px] font-semibold text-primary blur-[6px]">
                {v.amount == null ? "Needs review" : formatMoneyCAD(v.amount)}
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-border bg-background p-4">
            <div className="text-body font-semibold text-primary blur-[6px]">
              Full calculation breakdown
            </div>
            <div className="mt-2 text-body font-semibold text-primary blur-[6px]">
              Employer message template
            </div>
            <div className="mt-2 text-body font-semibold text-primary blur-[6px]">
              Your next steps
            </div>
          </div>
        </Card>
      ))}

      <Card className="p-6">
        <div className="text-h2-mobile">Unlock Your Full Report</div>
        <div className="mt-2 text-[28px] font-bold text-primary">$19 CAD</div>
        <div className="mt-1 text-body text-muted">One-time. No subscription.</div>

        <ul className="mt-5 grid gap-2 text-body text-primary">
          <li>✓ Exact dollar amount for each violation</li>
          <li>✓ Full calculation showing the math</li>
          <li>✓ Specific ESA section your employer violated</li>
          <li>✓ Copy-paste message to send your employer or HR</li>
          <li>✓ Whether your case qualifies for MOL complaint</li>
          <li>✓ How to file a complaint (takes ~20 minutes)</li>
          <li>✓ Your 3 clear next steps</li>
        </ul>

        <div className="mt-6">
          {/* Value framing — makes $19 feel trivial */}
          <div className="mb-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-center">
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              Think about it this way
            </div>
            <div className="mt-1 text-sm text-amber-200">
              Typical ESA recovery: <span className="font-bold">$300–$2,000</span>.
              This report costs <span className="font-bold">$19</span>.
              {" "}That is less than 1% of what you may be owed.
            </div>
          </div>

          {/* What you get */}
          <div className="mb-4 rounded-xl border border-slate-700 bg-slate-800/50 p-4">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Your full report includes
            </div>
            <div className="space-y-1 text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Exact dollar amount for each violation</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Step-by-step math your employer hopes you never see</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Copy-paste message to send your employer today</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Whether to file a Ministry of Labour complaint</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Your exact next 3 steps</span>
              </div>
            </div>
          </div>

          <Button onClick={unlock} disabled={checkingOut}>
            {checkingOut ? "Redirecting to payment..." : "Unlock My Full Report — $19 CAD"}
          </Button>

          {/* Trust signals */}
          <div className="mt-3 flex flex-col items-center gap-1">
            <div className="text-center text-caption text-muted">
              🔒 Secured by Stripe · SSL encrypted · No card stored
            </div>
            <div className="text-center text-caption text-muted">
              One-time payment · No subscription · No recurring charges
            </div>
            <div className="text-center text-caption text-muted">
              Report delivered to {answers.email} within 60 seconds
            </div>
          </div>
        </div>

      </Card>
    </div>
  )
}

