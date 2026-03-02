import OpenAI from "openai"
import type { QuizAnswers } from "@/lib/types"
import { requiredEnv } from "@/lib/server/env"

export async function generateReport(inputs: QuizAnswers) {
  const openai = new OpenAI({ apiKey: requiredEnv("OPENAI_API_KEY") })

  const effectiveRate =
    inputs.employmentType === "hourly"
      ? (inputs.hourlyRate ?? 0)
      : Number(inputs.annualSalary ?? 0) / 52 / 40

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    max_tokens: 1500,
    messages: [
      {
        role: "system",
        content:
          "You are an Ontario Employment Standards Act specialist helping workers understand their rights. " +
          "You provide accurate, plain-English explanations with specific ESA 2000 section references. " +
          "You are not a lawyer. Always end reports with the standard disclaimer."
      },
      {
        role: "user",
        content:
          `Generate a complete ESA violation report for this Ontario worker:\n\n` +
          `Employment: ${inputs.employmentType}\n` +
          `Effective hourly rate: $${effectiveRate.toFixed(2)}/hr\n` +
          `Hours worked last week: ${inputs.hoursWorked}\n` +
          `Shift cancelled under 48hrs notice: ${inputs.shiftCancelled}\n` +
          `Cancelled shift length: ${inputs.cancelledShiftHours ?? "N/A"} hours\n` +
          `Worked stat holiday recently: ${inputs.statHoliday}\n` +
          `Vacation pay received: ${inputs.vacationPay}\n` +
          `Tenure: ${inputs.tenure}\n\n` +
          `Structure your response with these exact sections:\n\n` +
          `## VIOLATIONS FOUND\n` +
          `[For each violation:]\n` +
          `### [Violation Name] — [ESA Section]\n` +
          `**What happened:** [1 sentence plain English]\n` +
          `**The math:** [Step by step calculation]\n` +
          `**Amount owed:** $[X]\n\n` +
          `## TOTAL AMOUNT POTENTIALLY OWED\n` +
          `$[total] (based on information provided)\n\n` +
          `## YOUR MESSAGE TO YOUR EMPLOYER\n` +
          `[Professional, firm, factual email/text they can copy-paste. Include specific amounts, ESA sections, and a 14-day response deadline. ` +
          `Do not be aggressive. Sign as "A Wagechecker.ca User".]\n\n` +
          `## SHOULD YOU FILE AN MOL COMPLAINT?\n` +
          `[YES / MAYBE / NO]\n` +
          `[2-3 sentences of specific reasoning]\n` +
          `[If yes: note the 2-year limitation period]\n\n` +
          `## YOUR NEXT 3 STEPS\n` +
          `1. [Specific, actionable]\n` +
          `2. [Specific, actionable]\n` +
          `3. [Specific, actionable]\n\n` +
          `---\n` +
          `DISCLAIMER: This report is for educational purposes only based on Ontario Employment Standards Act 2000. ` +
          `It is not legal advice. Amounts are estimates based on information provided. For complex situations, consult a licensed Ontario employment lawyer.`
      }
    ]
  })

  return completion.choices[0]?.message?.content ?? ""
}

