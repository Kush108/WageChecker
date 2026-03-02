import type { CalculationResult, QuizAnswers, Violation } from "@/lib/types"

export function calculateOntarioESA(inputs: QuizAnswers): CalculationResult {
  const hourlyRate =
    inputs.employmentType === "hourly"
      ? Number(inputs.hourlyRate || 0)
      : Number(inputs.annualSalary || 0) / 52 / 40

  const violations: Violation[] = []
  let totalOwed = 0

  const hoursWorked = Number(inputs.hoursWorked || 0)

  // VIOLATION 1: Overtime after 44 hours/week
  const OVERTIME_THRESHOLD = 44
  if (hoursWorked > OVERTIME_THRESHOLD && hourlyRate > 0) {
    const overtimeHours = hoursWorked - OVERTIME_THRESHOLD
    const amount = overtimeHours * (hourlyRate * 0.5)
    violations.push({
      id: "overtime",
      name: "Unpaid Overtime",
      section: "ESA 2000 — Section 22",
      severity: "HIGH",
      shortDesc: `Worked ${overtimeHours} hour(s) over the 44-hour weekly threshold`,
      amount,
      fullCalc: `${overtimeHours} hours × $${(hourlyRate * 0.5).toFixed(
        2
      )} (50% premium) = $${amount.toFixed(2)}`,
      employerMessage:
        "Hi — I believe I’m owed overtime premium pay for hours worked above 44 in a workweek under ESA 2000 s.22. Can you please review my last pay period and confirm the overtime premium amount and when it will be paid?",
      nextSteps: [
        "Gather your schedule/time punches for the week in question",
        "Compare paid hours vs hours actually worked",
        "Ask payroll/HR to correct the overtime premium and provide a revised pay stub"
      ]
    })
    totalOwed += amount
  }

  // VIOLATION 2: 3-hour minimum rule (simplified, conservative)
  if (inputs.shiftCancelled === "yes" && hourlyRate > 0) {
    const shiftLength = Number(inputs.cancelledShiftHours || 0)
    if (shiftLength > 0 && shiftLength < 3) {
      const amount = hourlyRate * (3 - shiftLength)
      violations.push({
        id: "three-hour",
        name: "3-Hour Minimum Rule",
        section: "ESA 2000 — Section 21(2)",
        severity: "MEDIUM",
        shortDesc: "Short-notice cancellation may still require 3 hours minimum pay",
        amount,
        fullCalc: `$${hourlyRate.toFixed(
          2
        )}/hr × (3.00 − ${shiftLength.toFixed(2)}) hrs = $${amount.toFixed(2)}`,
        employerMessage:
          "Hi — I believe the 3-hour minimum rule applies to my cancelled/shortened shift under ESA 2000 s.21(2). Can you please confirm the minimum-pay adjustment and when it will be paid?",
        nextSteps: [
          "Save any texts/emails showing the cancellation timing",
          "Write down the scheduled start/end time of the shift",
          "Ask payroll/HR to apply the minimum-pay adjustment"
        ]
      })
      totalOwed += amount
    } else {
      violations.push({
        id: "three-hour-review",
        name: "Shift Cancellation — Needs Review",
        section: "ESA 2000 — Section 21(2)",
        severity: "MEDIUM",
        shortDesc:
          "You reported a short-notice cancellation. Compensation can depend on the scheduled length and circumstances.",
        amount: null,
        fullCalc:
          "The amount depends on your scheduled shift length and how the cancellation happened (and in some cases, exceptions).",
        employerMessage:
          "Hi — I’m requesting a review of compensation related to a short-notice shift cancellation under ESA 2000 s.21(2). Can you confirm what payment is owed for the cancelled shift and provide the calculation?",
        nextSteps: [
          "Gather the posted schedule and any cancellation notice",
          "Confirm the originally scheduled shift length",
          "Ask payroll/HR for the calculation they used"
        ]
      })
    }
  }

  // VIOLATION 3: Stat holiday premium pay (conservative estimate)
  if (inputs.statHoliday === "yes" && hourlyRate > 0) {
    const amount = hourlyRate * 8 * 0.5
    violations.push({
      id: "stat-holiday",
      name: "Stat Holiday Premium Pay",
      section: "ESA 2000 — Section 24",
      severity: "MEDIUM",
      shortDesc:
        "Working a statutory holiday may require premium pay or a substitute day off",
      amount,
      fullCalc: `8.0 hours × $${hourlyRate.toFixed(
        2
      )} × 0.5 (premium) = $${amount.toFixed(2)}`,
      employerMessage:
        "Hi — I’m requesting a review of my statutory holiday pay. Under ESA 2000 s.24, working a stat holiday can require premium pay and/or a substitute day off. Can you confirm how my stat holiday was paid and whether any premium is still owed?",
      nextSteps: [
        "Identify the stat holiday date and hours worked",
        "Check your pay stub line items for holiday premium/substitute day",
        "Ask payroll/HR to correct any missing premium pay"
      ]
    })
    totalOwed += amount
  }

  // VIOLATION 4: Vacation pay not paid (flag only)
  if (inputs.vacationPay === "never") {
    violations.push({
      id: "vacation-pay",
      name: "Vacation Pay Not Paid",
      section: "ESA 2000 — Section 33",
      severity: "HIGH",
      shortDesc: "Minimum vacation pay is typically at least 4% of gross wages",
      amount: null,
      fullCalc:
        "Vacation pay depends on your gross wages over a period of time (often 4%+ depending on entitlement).",
      employerMessage:
        "Hi — I believe vacation pay may be missing from my pay. Under ESA 2000 s.33, vacation pay is generally required. Can you confirm my vacation pay accrual and provide a pay-stub breakdown showing what has been paid to date?",
      nextSteps: [
        "Review multiple pay stubs for a vacation pay line item",
        "Estimate gross wages over the period and compare to vacation pay paid",
        "Request a written breakdown from payroll/HR"
      ]
    })
  }

  return { hourlyRate, violations, totalOwed }
}

