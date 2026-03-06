import Stripe from "stripe"
import { NextResponse } from "next/server"
import type { QuizAnswers } from "@/lib/types"
import { generateReport } from "@/lib/server/report"

export async function GET(request: Request) {
  const stripeSecret = process.env.STRIPE_SECRET_KEY
  if (!stripeSecret) {
    return NextResponse.json(
      { error: "Missing STRIPE_SECRET_KEY" },
      { status: 500 }
    )
  }

  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get("session_id")
  if (!sessionId) {
    return NextResponse.json({ error: "No session ID" }, { status: 400 })
  }

  const stripe = new Stripe(stripeSecret, { apiVersion: "2024-06-20" })

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { error: "Payment not completed" },
        { status: 403 }
      )
    }

    const meta  = session.metadata ?? {}
    const email = session.customer_email || meta.email

    // Validate we have the minimum needed
    if (!email || !meta.hoursWorked) {
      return NextResponse.json(
        { error: "Missing session metadata" },
        { status: 400 }
      )
    }

    // Reconstruct inputs from flat metadata fields
    const inputs: QuizAnswers = {
      province:            (meta.province       as QuizAnswers["province"])       || "ON",
      employmentType:      (meta.employmentType as QuizAnswers["employmentType"]) || "hourly",
      hourlyRate:          meta.hourlyRate          ? parseFloat(meta.hourlyRate)          : undefined,
      annualSalary:        meta.annualSalary        ? parseFloat(meta.annualSalary)        : undefined,
      hoursWorked:         parseFloat(meta.hoursWorked || "0"),
      shiftCancelled:      (meta.shiftCancelled  as QuizAnswers["shiftCancelled"])  || "no",
      cancelledShiftHours: meta.cancelledShiftHours
                             ? parseFloat(meta.cancelledShiftHours)
                             : undefined,
      statHoliday:         (meta.statHoliday     as QuizAnswers["statHoliday"])     || "no",
      vacationPay:         (meta.vacationPay     as QuizAnswers["vacationPay"])     || "yes",
      tenure:              (meta.tenure          as QuizAnswers["tenure"])          || "lt1",
      email,
    }

    const report = await generateReport({ ...inputs, email })

    return NextResponse.json({ report, paid: true, email })

  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Session not found" },
      { status: 404 }
    )
  }
}
