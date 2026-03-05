"use client"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import ReactMarkdown from "react-markdown"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"

function todayFormatted() {
  return new Date().toLocaleDateString("en-CA", {
    year: "numeric", month: "long", day: "numeric"
  })
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }}
      className="text-[12px] font-semibold px-3 py-1.5 rounded-md
        border border-accent-green text-accent-green
        hover:bg-accent-green hover:text-black transition-colors"
    >
      {copied ? "✓ Copied!" : "Copy Message"}
    </button>
  )
}

function extractEmployerMessage(report: string): string {
  const start = report.indexOf("Dear ")
  const end = report.indexOf("## SHOULD YOU FILE")
  if (start === -1 || end === -1) return ""
  return report.slice(start, end).trim()
}

export function ReportClient() {
  const sp = useSearchParams()
  const sessionId = sp.get("session_id")
  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [report, setReport] = useState<string | null>(null)
  const [email, setEmail] = useState<string | null>(null)

  // Loading steps for perceived intelligence
  useEffect(() => {
    if (!loading) return
    const steps = [800, 1800, 3200, 5000]
    const timers = steps.map((ms, i) =>
      setTimeout(() => setStep(i + 1), ms)
    )
    return () => timers.forEach(clearTimeout)
  }, [loading])

  useEffect(() => {
    if (!sessionId) {
      setError("Missing session ID")
      setLoading(false)
      return
    }
    let cancelled = false
    async function run() {
      try {
        const res = await fetch(
          `/api/get-report?session_id=${encodeURIComponent(sessionId!)}`
        )
        const data = await res.json()
        if (cancelled) return
        if (!res.ok) throw new Error(data.error || "Unable to fetch report")
        setReport(data.report || null)
        setEmail(data.email || null)
      } catch (e) {
        if (cancelled) return
        setError(e instanceof Error ? e.message : "Unknown error")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    run()
    return () => { cancelled = true }
  }, [sessionId])

  const employerMessage = report ? extractEmployerMessage(report) : ""

  // ── LOADING ────────────────────────────────────────────────────────
  if (loading) {
    const steps = [
      "Verifying payment...",
      "Analyzing your ESA situation...",
      "Calculating exact amounts...",
      "Preparing your employer message...",
    ]
    return (
      <div className="grid place-items-center py-20">
        <div className="text-center max-w-[320px]">
          {/* Pulse circle */}
          <div className="mx-auto mb-8 relative w-16 h-16">
            <div className="absolute inset-0 rounded-full bg-accent-green/20
              animate-ping" />
            <div className="relative w-16 h-16 rounded-full bg-accent-green/10
              border border-accent-green/30 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-accent-green animate-pulse" />
            </div>
          </div>
          {/* Step list */}
          <div className="grid gap-3">
            {steps.map((s, i) => (
              <div key={i} className={`flex items-center gap-3 text-[14px]
                transition-all duration-500
                ${step > i ? "text-primary" : "text-muted"}`}>
                <span className="w-5 h-5 rounded-full flex items-center
                  justify-center text-[11px] flex-shrink-0
                  border border-border">
                  {step > i ? (
                    <span className="text-accent-green">✓</span>
                  ) : step === i ? (
                    <span className="animate-spin inline-block">⟳</span>
                  ) : (
                    <span className="text-muted">○</span>
                  )}
                </span>
                {s}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ── ERROR ──────────────────────────────────────────────────────────
  if (error || !report) {
    return (
      <Card className="p-6 border-accent-red/30">
        <div className="text-body font-semibold text-primary">
          We couldn&apos;t load your report.
        </div>
        <div className="mt-2 text-body text-muted">
          {error || "Unknown error"}
        </div>
        <div className="mt-4 p-4 rounded-lg bg-surface border border-border">
          <div className="text-[13px] text-muted">
            Your payment was received. Email us and we&apos;ll send
            your report manually within 1 hour.
          </div>
          <a href="mailto:support@wagechecker.ca"
            className="mt-2 inline-block text-[13px] font-semibold
              text-accent-green">
            support@wagechecker.ca →
          </a>
        </div>
        <Link href="/" className="mt-4 inline-block text-[13px]
          text-muted underline">
          Back to home
        </Link>
      </Card>
    )
  }

  // ── REPORT ─────────────────────────────────────────────────────────
  return (
    <div className="grid gap-4 pb-12">

      {/* Header */}
      <div className="bg-surface border border-border rounded-xl p-5">
        <div className="text-[11px] font-semibold tracking-widest
          text-accent-green uppercase">
          Ontario ESA Wage Report
        </div>
        <div className="mt-1 text-[22px] font-bold text-primary">
          Your Results
        </div>
        <div className="mt-1 text-[13px] text-muted">
          {todayFormatted()} · Based on Ontario Employment Standards Act 2000
        </div>
      </div>

      {/* Email + Download row */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        {email && (
          <div className="text-[13px] text-muted">
            📧 Report sent to <span className="text-primary">{email}</span>
          </div>
        )}
        <Button
          variant="secondary"
          onClick={() => window.print()}
          className="text-[13px]"
        >
          Download as PDF
        </Button>
      </div>

      {/* Report content */}
      <Card className="p-6">
        <ReactMarkdown
          components={{
            h2: ({ children }) => (
              <h2 className="text-[11px] font-bold tracking-widest
                text-accent-green uppercase mt-8 mb-3 pb-2
                border-b border-border first:mt-0">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-[15px] font-semibold text-primary
                mt-5 mb-2">
                {children}
              </h3>
            ),
            strong: ({ children }) => (
              <strong className="text-primary font-semibold">
                {children}
              </strong>
            ),
            p: ({ children }) => (
              <p className="text-[14px] text-muted leading-relaxed mb-3">
                {children}
              </p>
            ),
            ul: ({ children }) => (
              <ul className="mb-3 grid gap-1">{children}</ul>
            ),
            li: ({ children }) => (
              <li className="text-[14px] text-muted flex gap-2">
                <span className="text-accent-green mt-0.5">·</span>
                <span>{children}</span>
              </li>
            ),
            hr: () => <hr className="border-border my-6" />,
            code: ({ children }) => (
              <code className="block bg-surface border border-border
                rounded-lg p-4 text-[13px] font-mono text-accent-green
                leading-relaxed whitespace-pre-wrap my-3">
                {children}
              </code>
            ),
          }}
        >
          {/* Hide the employer message section — shown separately below */}
          {report.replace(/## YOUR MESSAGE TO YOUR EMPLOYER[\s\S]*?(?=## SHOULD YOU FILE|$)/,
            "## YOUR MESSAGE TO YOUR EMPLOYER\n\n*(See copy-paste box below)*\n\n"
          )}
        </ReactMarkdown>
      </Card>

      {/* Employer message — copyable box */}
      {employerMessage && (
        <Card className="p-6 border-accent-green/20">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[11px] font-bold tracking-widest
                text-accent-green uppercase">
                Your Message to Send
              </div>
              <div className="text-[13px] text-muted mt-1">
                ✏️ Replace{" "}
                <span className="text-primary">[Employer&apos;s Name]</span>
                {" "}before sending
              </div>
            </div>
            <CopyButton text={employerMessage} />
          </div>
          <div className="bg-surface rounded-lg p-4 border border-border
            text-[13px] text-muted font-mono leading-relaxed
            whitespace-pre-wrap">
            {employerMessage}
          </div>
        </Card>
      )}

      {/* Disclaimer */}
      <div className="text-[12px] text-muted leading-relaxed
        border-t border-border pt-4">
        This report is for educational purposes only based on Ontario
        Employment Standards Act 2000. It does not constitute legal advice.
        Amounts are estimates based on information provided. For complex
        situations, consult a licensed Ontario employment lawyer.
      </div>

    </div>
  )
}