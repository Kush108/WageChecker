"use client"
import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { ProgressBar } from "@/components/ui/ProgressBar"
import { SelectionCard } from "@/components/ui/SelectionCard"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import type {
  EmploymentType,
  Province,
  QuizAnswers,
  ShiftCancelled,
  StatHoliday,
  Tenure,
  VacationPay
} from "@/lib/types"

const STORAGE_KEY = "wagechecker.quiz.v1"

function saveAnswers(a: QuizAnswers) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(a))
}

// Shows a live hint based on answers so far — builds anticipation
function ViolationHint({ hours, shiftCancelled, statHoliday, vacationPay }: {
  hours: string
  shiftCancelled: ShiftCancelled | null
  statHoliday: StatHoliday | null
  vacationPay: VacationPay | null
}) {
  const flags: string[] = []
  if (Number(hours) > 44) flags.push("🔴 Possible overtime violation")
  if (shiftCancelled === "yes") flags.push("🟡 Possible shift cancellation violation")
  if (statHoliday === "yes") flags.push("🟡 Possible stat holiday violation")
  if (vacationPay === "never" || vacationPay === "sometimes")
    flags.push("🟡 Possible vacation pay violation")
  if (flags.length === 0) return null
  return (
    <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
      <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
        Potential violations detected
      </div>
      {flags.map((f) => (
        <div key={f} className="text-sm text-amber-200">{f}</div>
      ))}
      <div className="mt-2 text-xs text-muted">
        Complete the quiz to see exact dollar amounts
      </div>
    </div>
  )
}

export function CheckQuiz() {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
  const [submitting, setSubmitting] = useState(false)
  const [province] = useState<Province>("ON")
  const [employmentType, setEmploymentType] = useState<EmploymentType | null>(null)
  const [hourlyRate, setHourlyRate] = useState<string>("")
  const [annualSalary, setAnnualSalary] = useState<string>("")
  const [hoursWorked, setHoursWorked] = useState<string>("")
  const [shiftCancelled, setShiftCancelled] = useState<ShiftCancelled | null>(null)
  const [cancelledShiftHours, setCancelledShiftHours] = useState<string>("")
  const [statHoliday, setStatHoliday] = useState<StatHoliday | null>(null)
  const [statHolidayHours, setStatHolidayHours] = useState<string>("")
  const [vacationPay, setVacationPay] = useState<VacationPay | null>(null)
  const [tenure, setTenure] = useState<Tenure | null>(null)
  const [email, setEmail] = useState("")
  const [marketingOptIn, setMarketingOptIn] = useState(true)

  const progress = useMemo(() => {
    return step === 1 ? 25 : step === 2 ? 50 : step === 3 ? 75 : 100
  }, [step])

  // Live overtime hint for step 2
  const overtimeHint = useMemo(() => {
    const h = Number(hoursWorked)
    if (h <= 0) return null
    if (h > 44) {
      const extra = h - 44
      return `⚡ You worked ${extra} hour${extra > 1 ? "s" : ""} over the 44-hour threshold — overtime may be owed`
    }
    if (h >= 40 && h <= 44) {
      return `✓ Under the 44-hour overtime threshold this week`
    }
    return null
  }, [hoursWorked])

  function back() {
    setStep((s) => (s === 1 ? 1 : ((s - 1) as 1 | 2 | 3 | 4)))
  }

  function continueFromStep1() {
    if (!employmentType) return
    if (employmentType === "hourly" && Number(hourlyRate) <= 0) return
    if (employmentType === "salary" && Number(annualSalary) <= 0) return
    setStep(2)
  }

  function continueFromStep2() {
    if (Number(hoursWorked) <= 0) return
    if (!shiftCancelled) return
    if (shiftCancelled === "yes" && Number(cancelledShiftHours) <= 0) return
    setStep(3)
  }

  function continueFromStep3() {
    if (!statHoliday || !vacationPay || !tenure) return
    if (statHoliday === "yes" && Number(statHolidayHours) <= 0) return
    setStep(4)
  }

  async function submit() {
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    if (!emailOk) return
    const answers: QuizAnswers = {
      province,
      employmentType: employmentType as EmploymentType,
      hourlyRate: employmentType === "hourly" ? Number(hourlyRate) : undefined,
      annualSalary: employmentType === "salary" ? Number(annualSalary) : undefined,
      hoursWorked: Number(hoursWorked),
      shiftCancelled: shiftCancelled as ShiftCancelled,
      cancelledShiftHours:
        shiftCancelled === "yes" ? Number(cancelledShiftHours) : undefined,
      statHoliday: statHoliday as StatHoliday,
      statHolidayHours:
        statHoliday === "yes" ? Number(statHolidayHours) : undefined,
      vacationPay: vacationPay as VacationPay,
      tenure: tenure as Tenure,
      email: email.trim(),
      marketingOptIn
    }
    try {
      setSubmitting(true)
      saveAnswers(answers)
      await fetch("/api/capture-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers)
      })
      router.push("/results")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <ProgressBar value={progress} />
      <div className="mt-3 flex items-center justify-between">
        <div className="text-caption text-muted">Step {step} of 4</div>
        {step >= 2 ? (
          <button type="button" onClick={back} className="text-body font-medium">
            ← Back
          </button>
        ) : (
          <span />
        )}
      </div>

      {/* ── STEP 1: Job Basics ── */}
      {step === 1 ? (
        <div className="mt-6">
          <h2 className="text-h2-mobile">Your job basics</h2>
          <p className="mt-1 text-body text-muted">
            Takes 2 minutes. We never ask your name or employer.
          </p>
          <div className="mt-5">
            <div className="mb-3 text-body font-medium text-primary">
              Which province do you work in?
            </div>
            <div className="grid grid-cols-2 gap-3">
              <SelectionCard
                title="Ontario"
                icon="✅"
                selected
                onClick={() => {}}
              />
              <SelectionCard
                title="British Columbia"
                icon="🔜"
                disabled
                badge="Coming soon"
              />
              <SelectionCard
                title="Alberta"
                icon="🔜"
                disabled
                badge="Coming soon"
              />
              <SelectionCard
                title="Quebec"
                icon="🔜"
                disabled
                badge="Coming soon"
              />
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-1 text-body font-medium text-primary">
              How are you paid?
            </div>
            <div className="mb-3 text-caption text-muted">
              ESA rules apply differently depending on how you're compensated
            </div>
            <div className="grid gap-3">
              <SelectionCard
                title="Hourly or Part-time"
                icon="⏱"
                selected={employmentType === "hourly"}
                onClick={() => setEmploymentType("hourly")}
              />
              <SelectionCard
                title="Salaried Full-time"
                icon="💼"
                selected={employmentType === "salary"}
                onClick={() => setEmploymentType("salary")}
              />
            </div>
          </div>

          {employmentType === "hourly" ? (
            <div className="mt-6">
              <Input
                label="What is your hourly rate?"
                helperText="Ontario minimum wage is $17.20/hr — anything below is a violation"
                type="number"
                inputMode="decimal"
                placeholder="e.g. 18.50"
                prefix="$"
                suffix="/hr"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
              />
            </div>
          ) : null}

          {employmentType === "salary" ? (
            <div className="mt-6">
              <Input
                label="What is your annual salary?"
                type="number"
                inputMode="numeric"
                placeholder="e.g. 52000"
                prefix="$"
                suffix="/year"
                value={annualSalary}
                onChange={(e) => setAnnualSalary(e.target.value)}
                helperText="We convert this to an hourly rate for ESA calculations"
              />
            </div>
          ) : null}

          <div className="mt-7">
            <Button onClick={continueFromStep1} disabled={!employmentType}>
              Continue →
            </Button>
          </div>
        </div>
      ) : null}

      {/* ── STEP 2: Hours & Shifts ── */}
      {step === 2 ? (
        <div className="mt-6">
          <h2 className="text-h2-mobile">Last week&apos;s hours</h2>
          <p className="mt-1 text-body text-muted">
            Ontario ESA overtime kicks in after 44 hours in a single week.
          </p>
          <div className="mt-5">
            <Input
              label="How many total hours did you work last week?"
              helperText="Include all time worked, even unpaid breaks your employer required"
              type="number"
              inputMode="decimal"
              placeholder="e.g. 46"
              suffix="hours"
              value={hoursWorked}
              onChange={(e) => setHoursWorked(e.target.value)}
            />
            {/* Live overtime hint */}
            {overtimeHint ? (
              <div className={`mt-3 rounded-lg px-4 py-3 text-sm font-medium ${
                Number(hoursWorked) > 44
                  ? "border border-red-500/30 bg-red-500/10 text-red-300"
                  : "border border-green-500/30 bg-green-500/10 text-green-300"
              }`}>
                {overtimeHint}
              </div>
            ) : null}
          </div>

          <div className="mt-6">
            <div className="mb-1 text-body font-medium text-primary">
              Did your employer cancel a shift with less than 48 hours notice?
            </div>
            <div className="mb-3 text-caption text-muted">
              Under ESA s.21(2), last-minute cancellations may entitle you to
              3 hours minimum pay
            </div>
            <div className="grid gap-3">
              <SelectionCard
                title="Yes — they cancelled my shift"
                icon="✅"
                selected={shiftCancelled === "yes"}
                onClick={() => setShiftCancelled("yes")}
              />
              <SelectionCard
                title="No — all shifts went ahead"
                icon="❌"
                selected={shiftCancelled === "no"}
                onClick={() => setShiftCancelled("no")}
              />
              <SelectionCard
                title="Not last week, but it's happened"
                icon="🤷"
                selected={shiftCancelled === "not_last_week"}
                onClick={() => setShiftCancelled("not_last_week")}
              />
            </div>
          </div>

          {shiftCancelled === "yes" ? (
            <div className="mt-5">
              <Input
                label="How long was the cancelled shift supposed to be?"
                helperText="If under 3 hours, your employer still owes you 3 hours of pay"
                type="number"
                inputMode="decimal"
                placeholder="e.g. 4"
                suffix="hours"
                value={cancelledShiftHours}
                onChange={(e) => setCancelledShiftHours(e.target.value)}
              />
            </div>
          ) : null}

          <div className="mt-7">
            <Button onClick={continueFromStep2}>Continue →</Button>
          </div>
        </div>
      ) : null}

      {/* ── STEP 3: Holidays & Vacation ── */}
      {step === 3 ? (
        <div className="mt-6">
          <h2 className="text-h2-mobile">Holidays &amp; vacation</h2>
          <p className="mt-1 text-body text-muted">
            Two of the most commonly missed violations in Ontario.
          </p>

          <div className="mt-5">
            <div className="mb-1 text-body font-medium text-primary">
              Did you work on a statutory holiday in the past 3 months?
            </div>
            <div className="mb-3 text-caption text-muted">
              Ontario stat holidays: New Year&apos;s, Family Day, Good Friday,
              Victoria Day, Canada Day, Labour Day, Thanksgiving, Christmas,
              Boxing Day
            </div>
            <div className="grid gap-3">
              <SelectionCard
                title="Yes, I worked a stat holiday"
                icon="✅"
                selected={statHoliday === "yes"}
                onClick={() => setStatHoliday("yes")}
              />
              <SelectionCard
                title="No, I had the day off"
                icon="❌"
                selected={statHoliday === "no"}
                onClick={() => setStatHoliday("no")}
              />
              <SelectionCard
                title="I'm not sure / I don't remember"
                icon="🤷"
                selected={statHoliday === "unsure"}
                onClick={() => setStatHoliday("unsure")}
              />
            </div>
          </div>

          {statHoliday === "yes" ? (
            <div className="mt-5">
              <Input
                label="How many hours did you work on that holiday?"
                helperText="Used to calculate your premium pay — ESA s.24 requires 1.5× your regular rate"
                type="number"
                inputMode="decimal"
                placeholder="e.g. 8"
                suffix="hours"
                value={statHolidayHours}
                onChange={(e) => setStatHolidayHours(e.target.value)}
              />
            </div>
          ) : null}

          <div className="mt-6">
            <div className="mb-1 text-body font-medium text-primary">
              Does your employer pay you vacation pay?
            </div>
            <div className="mb-3 text-caption text-muted">
              Ontario law requires at least 4% of your gross wages as vacation
              pay — ESA s.33
            </div>
            <div className="grid gap-3">
              <SelectionCard
                title="Yes, I see it on my pay stub"
                icon="✅"
                selected={vacationPay === "yes"}
                onClick={() => setVacationPay("yes")}
              />
              <SelectionCard
                title="Sometimes / I'm not sure"
                icon="⚠️"
                selected={vacationPay === "sometimes"}
                onClick={() => setVacationPay("sometimes")}
              />
              <SelectionCard
                title="No, I've never received vacation pay"
                icon="❌"
                selected={vacationPay === "never"}
                onClick={() => setVacationPay("never")}
              />
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-1 text-body font-medium text-primary">
              How long have you worked for this employer?
            </div>
            <div className="mb-3 text-caption text-muted">
              Tenure affects your ESA entitlements and recovery window
            </div>
            <div className="grid grid-cols-2 gap-3">
              <SelectionCard
                title="Less than 1 year"
                icon="📅"
                selected={tenure === "lt1"}
                onClick={() => setTenure("lt1")}
              />
              <SelectionCard
                title="1–3 years"
                icon="📅"
                selected={tenure === "1to3"}
                onClick={() => setTenure("1to3")}
              />
              <SelectionCard
                title="3–5 years"
                icon="📅"
                selected={tenure === "3to5"}
                onClick={() => setTenure("3to5")}
              />
              <SelectionCard
                title="5+ years"
                icon="📅"
                selected={tenure === "5plus"}
                onClick={() => setTenure("5plus")}
              />
            </div>
          </div>

          {/* Live violation hint — builds anticipation */}
          <ViolationHint
            hours={hoursWorked}
            shiftCancelled={shiftCancelled}
            statHoliday={statHoliday}
            vacationPay={vacationPay}
          />

          <div className="mt-7">
            <Button onClick={continueFromStep3}>Continue →</Button>
          </div>
        </div>
      ) : null}

      {/* ── STEP 4: Email ── */}
      {step === 4 ? (
        <div className="mt-6">
          <h2 className="text-h2-mobile">Get your free result</h2>
          <p className="mt-2 text-body text-muted">
            Your result is calculated and ready. Enter your email to unlock it
            — we&apos;ll also send you a copy so you don&apos;t lose it.
          </p>

          {/* Anticipation card */}
          <div className="mt-5 rounded-xl border border-green-500/30 bg-green-500/10 p-4">
            <div className="text-sm font-semibold text-green-400">
              🔍 Your free check includes:
            </div>
            <div className="mt-2 space-y-1 text-sm text-green-200">
              <div>✓ Which ESA rules apply to your situation</div>
              <div>✓ Whether violations were detected</div>
              <div>✓ Estimated dollar amount owed this week</div>
              <div>✓ What it could total over 2 years</div>
            </div>
          </div>

          <div className="mt-6">
            <Input
              label="Email address"
              type="email"
              inputMode="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <label className="mt-5 flex items-start gap-3 text-body">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 accent-primary"
              checked={marketingOptIn}
              onChange={(e) => setMarketingOptIn(e.target.checked)}
            />
            <span>
              Send me Ontario worker rights tips{" "}
              <span className="text-muted">(helpful, never spammy)</span>
            </span>
          </label>

          <div className="mt-7">
            <Button onClick={submit} disabled={submitting}>
              {submitting ? "Calculating your result..." : "See My Result →"}
            </Button>
            <div className="mt-3 text-center text-[12px] leading-relaxed text-muted">
              Anonymous. We never collect your name or employer.
              Unsubscribe anytime.
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
