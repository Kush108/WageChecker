import OpenAI from "openai"
import type { QuizAnswers } from "@/lib/types"
import { requiredEnv } from "@/lib/server/env"

export async function generateReport(inputs: QuizAnswers) {
  const openai = new OpenAI({ apiKey: requiredEnv("OPENAI_API_KEY") })

  const effectiveRate =
    inputs.employmentType === "hourly"
      ? (inputs.hourlyRate ?? 0)
      : Number(inputs.annualSalary ?? 0) / 52 / 40

  const hours = inputs.hoursWorked ?? 0
  const rate  = effectiveRate

  // ── OVERTIME ────────────────────────────────────────────────────────
  const overtimeHours     = Math.max(0, hours - 44)
  const overtimeOwed      = parseFloat((overtimeHours * rate * 0.5).toFixed(2))
  const overtimeViolation = overtimeHours > 0

  // ── 3-HOUR RULE ─────────────────────────────────────────────────────
  // ESA s.21(2): employer owes minimum 3 hours pay on cancellation
  // NOT the full shift — 3 hours is both the floor and the ceiling
  const cancelledHours = inputs.cancelledShiftHours ?? 0
  const shiftViolation = inputs.shiftCancelled === "yes" && cancelledHours < 3
  const shiftOwed      =
    inputs.shiftCancelled === "yes" && cancelledHours < 3
      ? parseFloat(((3 - cancelledHours) * rate).toFixed(2))
      : inputs.shiftCancelled === "yes" && cancelledHours >= 3
      ? parseFloat((3 * rate).toFixed(2)) // max owed is 3hrs, not full shift
      : 0

  // ── STAT HOLIDAY ────────────────────────────────────────────────────
  // Uses actual hours worked on holiday — not weekly hours
  const statViolation   = inputs.statHoliday === "yes"
  const statHoursWorked = inputs.statHolidayHours ?? 8
  const statOwed        = statViolation
    ? parseFloat((statHoursWorked * rate * 0.5).toFixed(2))
    : 0

  // ── VACATION PAY ────────────────────────────────────────────────────
  // "never" = confirmed violation
  // "sometimes" = needs review only (lump sum payments are legal under ESA)
  const vacationViolation   = inputs.vacationPay === "never"
  const vacationNeedsReview = inputs.vacationPay === "sometimes"
  const vacationOwed        = vacationViolation
    ? parseFloat((hours * rate * 0.04).toFixed(2))
    : 0

  // ── TOTALS ──────────────────────────────────────────────────────────
  const totalOwed = parseFloat(
    (overtimeOwed + shiftOwed + statOwed + vacationOwed).toFixed(2)
  )
  const twoYearTotal = parseFloat((totalOwed * 104).toFixed(2))

  const violationCount = [
    overtimeViolation,
    shiftViolation,
    statViolation,
    vacationViolation,
  ].filter(Boolean).length

  const tenureLabel: Record<QuizAnswers["tenure"], string> = {
    lt1:    "less than 1 year",
    "1to3": "1–3 years",
    "3to5": "3–5 years",
    "5plus":"5+ years",
  }

  // ── VIOLATION FACTS FOR AI ──────────────────────────────────────────
  // All math done here — AI only writes prose, never recalculates
  const violationFacts = [

    // OVERTIME
    overtimeViolation
      ? `OVERTIME (ESA s.22): Worked ${hours}hrs. ` +
        `${hours} − 44 = ${overtimeHours} overtime hrs × ` +
        `($${rate.toFixed(2)} × 0.5) = $${overtimeOwed} owed.`
      : `OVERTIME: Worked ${hours}hrs which is at or under the 44hr threshold. ` +
        `DO NOT mention overtime at all. Not even to say it was checked.`,

    // SHIFT CANCELLATION
    inputs.shiftCancelled === "yes"
      ? shiftViolation
        ? `3-HOUR RULE (ESA s.21(2)): Shift cancelled with less than 48hrs notice. ` +
          `Shift was ${cancelledHours}hrs. ESA guarantees minimum 3hrs pay. ` +
          `Owed: (3 − ${cancelledHours}) × $${rate.toFixed(2)} = $${shiftOwed}. ` +
          `Note: ESA s.21(2) guarantees 3 hours minimum — not the full shift length.`
        : `SHIFT CANCELLATION: Cancelled but shift was ${cancelledHours}hrs ` +
          `which already meets the 3-hour minimum. No violation — do not flag this.`
      : inputs.shiftCancelled === "not_last_week"
      ? `SHIFT CANCELLATION: Has happened before but not last week. ` +
        `Advise worker to check past pay stubs — if shifts were cancelled ` +
        `with less than 48hrs notice and they worked under 3hrs, ` +
        `they may have a claim under ESA s.21(2). No current calculation.`
      : `SHIFT CANCELLATION: No cancellation reported. DO NOT mention this section.`,

    // STAT HOLIDAY
    statViolation
      ? `STAT HOLIDAY (ESA s.24): Worked ${statHoursWorked}hrs on a statutory holiday. ` +
        `Premium pay = ${statHoursWorked}hrs × ($${rate.toFixed(2)} × 0.5) = $${statOwed} extra owed. ` +
        `This is calculated on holiday hours worked only — not weekly total hours.`
      : inputs.statHoliday === "unsure"
      ? `STAT HOLIDAY: Worker is unsure if they worked a stat holiday. ` +
        `Advise them to check their schedule against Ontario stat holidays: ` +
        `New Years, Family Day, Good Friday, Victoria Day, Canada Day, ` +
        `Labour Day, Thanksgiving, Christmas, Boxing Day. ` +
        `If they did work one, premium pay applies under ESA s.24. No calculation.`
      : `STAT HOLIDAY: Did not work a stat holiday. DO NOT mention this section.`,

    // VACATION PAY
    vacationViolation
      ? `VACATION PAY (ESA s.33): Worker never receives vacation pay. ` +
        `Minimum 4% of gross wages required. ` +
        `4% of this week = ${hours}hrs × $${rate.toFixed(2)} × 0.04 = $${vacationOwed} owed. ` +
        `Over 2 years this compounds significantly.`
      : vacationNeedsReview
      ? `VACATION PAY: Worker receives it "sometimes" — flag as NEEDS REVIEW only. ` +
        `Do NOT calculate a dollar amount. ` +
        `Employers can legally pay vacation pay as a lump sum or on each cheque. ` +
        `Advise worker to add up all vacation pay received in the last 12 months ` +
        `and verify it equals at least 4% of total gross earnings. ` +
        `If it falls short, they have a claim under ESA s.33.`
      : `VACATION PAY: Received correctly. DO NOT mention this section.`,

  ].join("\n")

  const noViolationsFound = violationCount === 0

  // ── OPENAI CALL ─────────────────────────────────────────────────────
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    max_tokens: 2000,
    temperature: 0.2,
    messages: [
      {
        role: "system",
        content:
          `You are a precise Ontario Employment Standards Act 2000 specialist. ` +
          `You write clear, accurate wage violation reports for Ontario workers.\n\n` +
          `CRITICAL RULES — FOLLOW ALL OF THESE EXACTLY:\n` +
          `1. ONLY report violations explicitly listed as violations below.\n` +
          `2. If a section says "DO NOT mention" — do not mention it anywhere, ` +
          `   not even to say it was checked or reviewed.\n` +
          `3. Use EXACTLY the dollar amounts provided. Never recalculate or change them.\n` +
          `4. 44 hours or less = zero overtime. Never flag this as a violation.\n` +
          `5. ESA s.21(2) shift cancellation = 3 hours minimum pay maximum. ` +
          `   Never say the worker is owed their full shift.\n` +
          `6. Stat holiday premium = holiday hours worked only, not weekly hours.\n` +
          `7. Vacation pay "sometimes" = NEEDS REVIEW only, no dollar amount.\n` +
          `8. Write in plain English. Workers are not lawyers.\n` +
          `9. Be firm and factual. Never aggressive or emotional.\n` +
          `10. Never use placeholders like [Worker Name] in violation headings. ` +
          `    Use the violation name only e.g. "Unpaid Overtime — ESA Section 22".\n` +
          `11. Always include the disclaimer at the end.`,
      },
      {
        role: "user",
        content:
          `Generate an ESA wage report for this Ontario worker.\n\n` +
          `WORKER DETAILS:\n` +
          `Employment type: ${inputs.employmentType}\n` +
          `Hourly rate: $${rate.toFixed(2)}/hr\n` +
          `Hours worked last week: ${hours}\n` +
          `Tenure with employer: ${tenureLabel[inputs.tenure]}\n\n` +
          `PRE-CALCULATED VIOLATION DATA — USE THESE EXACT NUMBERS, DO NOT CHANGE THEM:\n` +
          `${violationFacts}\n\n` +
          `TOTAL OWED THIS WEEK: $${totalOwed}\n` +
          `NUMBER OF VIOLATIONS: ${violationCount}\n\n` +
          (noViolationsFound
            ? `NO VIOLATIONS FOUND. Write an encouraging, helpful report that:\n` +
              `- Clearly confirms no violations were detected\n` +
              `- Explains what to watch for going forward\n` +
              `  (overtime over 44hrs, shift cancellations under 48hrs notice,\n` +
              `   stat holidays, vacation pay on every cheque)\n` +
              `- Reminds them they can recheck if their situation changes\n` +
              `- Ends with the disclaimer\n\n`
            : `VIOLATIONS FOUND. Write the full structured report below.\n\n`) +
          `REQUIRED STRUCTURE:\n\n` +
          `## VIOLATIONS FOUND\n\n` +
          `### [Violation Name] — ESA Section [X]\n` +
          `**What happened:** [1 sentence, plain English, specific to their situation]\n` +
          `**The math:** [Show every calculation step using exact numbers above]\n` +
          `**Amount owed:** $[exact number from above — never change this]\n\n` +
          `[Repeat for each violation]\n\n` +
          `## TOTAL AMOUNT POTENTIALLY OWED\n\n` +
          `$${totalOwed} this week based on information provided\n\n` +
          `If this has been ongoing: up to $${twoYearTotal} over 2 years\n` +
          `(ESA s.111 — 2-year recovery window)\n\n` +
          `## YOUR MESSAGE TO YOUR EMPLOYER\n\n` +
          `Subject: [Professional subject line referencing ESA]\n\n` +
          `Dear [Employer Name],\n\n` +
          `[Professional, firm, factual email. Must include:\n` +
          `- Each violation with its ESA section number\n` +
          `- Exact dollar amounts for each\n` +
          `- Request for resolution within 14 days\n` +
          `- Not aggressive — just factual and clear]\n\n` +
          `Sincerely,\n` +
          `[Your Name]\n` +
          `(Replace [Your Name] with your name before sending)\n\n` +
          `## SHOULD YOU FILE AN MOL COMPLAINT?\n\n` +
          `[YES / MAYBE / NO — choose one]\n\n` +
          `[2–3 sentences of reasoning specific to their actual violations.]\n` +
          `[If yes or maybe: remind them of the 2-year limitation period under ESA s.96.]\n\n` +
          `## YOUR NEXT 3 STEPS\n\n` +
          `1. [Specific and actionable — not generic]\n` +
          `2. [Specific and actionable — not generic]\n` +
          `3. [Specific and actionable — not generic]\n\n` +
          `---\n\n` +
          `DISCLAIMER: This report is for educational purposes only based on ` +
          `Ontario Employment Standards Act 2000. It is not legal advice and ` +
          `does not create a lawyer-client relationship. Amounts are estimates ` +
          `based on information provided. For complex situations, consult a ` +
          `licensed Ontario employment lawyer or contact the Ontario Ministry ` +
          `of Labour at 1-800-531-5551.`,
      },
    ],
  })

  return completion.choices[0]?.message?.content ?? ""
}
