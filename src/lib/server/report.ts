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

  // ── Pre-calculate violations server-side so AI can't hallucinate ──

  // OVERTIME
  const overtimeHours    = Math.max(0, hours - 44)
  const overtimeOwed     = parseFloat((overtimeHours * rate * 0.5).toFixed(2))
  const overtimeViolation = overtimeHours > 0

  // 3-HOUR RULE
  const cancelledHours   = inputs.cancelledShiftHours ?? 0
  const shiftCancelled   = inputs.shiftCancelled === "yes" ||
                           inputs.shiftCancelled === "not_last_week"
  const shiftViolation   = inputs.shiftCancelled === "yes" && cancelledHours < 3
  const shiftOwed        = inputs.shiftCancelled === "yes" && cancelledHours < 3
                             ? parseFloat(((3 - cancelledHours) * rate).toFixed(2))
                             : inputs.shiftCancelled === "yes" && cancelledHours >= 3
                             ? parseFloat((cancelledHours * rate).toFixed(2))
                             : 0

  // STAT HOLIDAY
  
  const statViolation   = inputs.statHoliday === "yes"
  const statHoursWorked = inputs.statHolidayHours ?? 8
  const statOwed        = statViolation
    ? parseFloat((statHoursWorked * rate * 0.5).toFixed(2))
    : 0

  // VACATION PAY
  const vacationViolation = inputs.vacationPay === "never" ||
                            inputs.vacationPay === "sometimes"
  const vacationOwed      = vacationViolation
                             ? parseFloat((hours * rate * 0.04).toFixed(2))
                             : 0

  const totalOwed     = parseFloat(
    (overtimeOwed + shiftOwed + statOwed + vacationOwed).toFixed(2)
  )
  const twoYearTotal  = parseFloat((totalOwed * 104).toFixed(2))
  const violationCount = [
    overtimeViolation,
    shiftViolation,
    statViolation,
    vacationViolation,
  ].filter(Boolean).length

  const tenureLabel: Record<QuizAnswers["tenure"], string> = {
    lt1:   "less than 1 year",
    "1to3":  "1–3 years",
    "3to5":  "3–5 years",
    "5plus": "5+ years",
  }

  // ── Violation facts passed to AI — prevents hallucination ─────────
  const violationFacts = [
    overtimeViolation
      ? `OVERTIME (ESA s.22): Worked ${hours}hrs. ` +
        `${hours} − 44 = ${overtimeHours} overtime hrs × ` +
        `($${rate.toFixed(2)} × 0.5) = $${overtimeOwed} owed.`
      : `OVERTIME: Worked ${hours}hrs which is at or under the 44hr threshold. ` +
        `DO NOT mention overtime at all.`,

    inputs.shiftCancelled === "yes"
      ? shiftViolation
        ? `3-HOUR RULE (ESA s.21(2)): Shift cancelled with <48hrs notice. ` +
          `Shift was ${cancelledHours}hrs. Minimum 3hrs guaranteed. ` +
          `Owed: (3 − ${cancelledHours}) × $${rate.toFixed(2)} = $${shiftOwed}.`
        : `SHIFT CANCELLATION: Cancelled but shift was ${cancelledHours}hrs ` +
          `which meets the 3-hour minimum. No violation here.`
      : inputs.shiftCancelled === "not_last_week"
      ? `SHIFT CANCELLATION: Has happened before but not last week. ` +
        `Mention they should check past pay periods but no current violation to calculate.`
      : `SHIFT CANCELLATION: No cancellation. DO NOT mention this section.`,

    statViolation
      ? `STAT HOLIDAY (ESA s.24): Worked a stat holiday. ` +
        `Premium = ${hours}hrs × ($${rate.toFixed(2)} × 0.5) = $${statOwed} extra owed.`
      : inputs.statHoliday === "unsure"
      ? `STAT HOLIDAY: Worker is unsure. Mention they should check if any recent ` +
        `holidays were worked — if so, premium pay applies under ESA s.24.`
      : `STAT HOLIDAY: Did not work a stat holiday. DO NOT mention this section.`,

    vacationViolation
      ? `VACATION PAY (ESA s.33): Vacation pay received "${inputs.vacationPay}". ` +
        `4% of gross = ${hours}hrs × $${rate.toFixed(2)} × 0.04 = $${vacationOwed} owed.`
      : `VACATION PAY: Received correctly. DO NOT mention this section.`,
  ].join("\n")

  const noViolationsFound = violationCount === 0

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
          `CRITICAL RULES — FOLLOW EXACTLY:\n` +
          `1. ONLY report violations explicitly listed as violations below.\n` +
          `2. If a section says "DO NOT mention" — do not mention it at all, ` +
          `   not even to say it was checked.\n` +
          `3. Use EXACTLY the dollar amounts provided. Never recalculate.\n` +
          `4. 44 hours or less = zero overtime. Never flag this as a violation.\n` +
          `5. Write in plain English. Workers are not lawyers.\n` +
          `6. Firm, factual, never aggressive.\n` +
          `7. Always include the disclaimer at the end.` +
          `8. Never use [Worker's Name] or any placeholder in violation headings. ` +
          `Use the actual violation name only, e.g. "Unpaid Overtime" or "Stat Holiday Premium Pay".`
      },
      {
        role: "user",
        content:
          `Generate an ESA wage report for this Ontario worker.\n\n` +
          `WORKER DETAILS:\n` +
          `Employment: ${inputs.employmentType}\n` +
          `Hourly rate: $${rate.toFixed(2)}/hr\n` +
          `Hours last week: ${hours}\n` +
          `Tenure: ${tenureLabel[inputs.tenure]}\n\n` +
          `PRE-CALCULATED VIOLATION DATA — USE THESE EXACT NUMBERS:\n` +
          `${violationFacts}\n\n` +
          `TOTAL OWED THIS WEEK: $${totalOwed}\n` +
          `TOTAL VIOLATIONS: ${violationCount}\n\n` +
          (noViolationsFound
            ? `NO VIOLATIONS FOUND. Write a clear, encouraging report:\n` +
              `- Confirm no violations detected based on info provided\n` +
              `- Tell them what to watch for (overtime over 44hrs, ` +
              `shift cancellations, stat holidays)\n` +
              `- Remind them they can recheck if situation changes\n` +
              `- Keep it positive and helpful\n\n`
            : `VIOLATIONS FOUND. Write the full report:\n\n`) +
          `## VIOLATIONS FOUND\n` +
          `### [Name] — ESA Section [X]\n` +
          `**What happened:** [1 sentence, plain English]\n` +
          `**The math:** [Show every step using exact numbers above]\n` +
          `**Amount owed:** $[exact number]\n\n` +
          `## TOTAL AMOUNT POTENTIALLY OWED\n` +
          `$${totalOwed} this week\n` +
          `If ongoing: up to $${twoYearTotal} over 2 years ` +
          `(ESA s.111 — 2-year recovery limit)\n\n` +
          `## YOUR MESSAGE TO YOUR EMPLOYER\n` +
          `Subject: [Clear subject line]\n\n` +
          `Dear [Employer's Name],\n\n` +
          `[Professional, firm email. Include:\n` +
          `- Specific ESA section numbers\n` +
          `- Exact dollar amounts\n` +
          `- 14-day response deadline\n` +
          `- Not aggressive, just factual]\n\n` +
          `Sincerely,\n` +
          `[Your Name] ← remind them to replace this before sending\n\n` +
          `## SHOULD YOU FILE AN MOL COMPLAINT?\n` +
          `[YES / MAYBE / NO]\n` +
          `[2-3 sentences specific to their actual violations]\n` +
          `[If yes: note 2-year limit under ESA s.96]\n\n` +
          `## YOUR NEXT 3 STEPS\n` +
          `1. [Specific and actionable]\n` +
          `2. [Specific and actionable]\n` +
          `3. [Specific and actionable]\n\n` +
          `---\n` +
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