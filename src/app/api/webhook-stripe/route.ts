import Stripe from "stripe"
import { NextResponse } from "next/server"
import type { QuizAnswers } from "@/lib/types"
import { generateReport } from "@/lib/server/report"
import { sendReportEmail } from "@/lib/server/email"

export async function POST(request: Request) {
  const stripeSecret  = process.env.STRIPE_SECRET_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!stripeSecret)  return new NextResponse("Missing STRIPE_SECRET_KEY",  { status: 500 })
  if (!webhookSecret) return new NextResponse("Missing STRIPE_WEBHOOK_SECRET", { status: 500 })

  const stripe = new Stripe(stripeSecret, { apiVersion: "2024-06-20" })

  const sig = request.headers.get("stripe-signature")
  if (!sig) return new NextResponse("Missing stripe-signature header", { status: 400 })

  const body = await request.text()
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Webhook signature verification failed"
    return new NextResponse(`Webhook Error: ${msg}`, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session
    const meta    = session.metadata ?? {}
    const email   = session.customer_email || meta.email

    if (email && meta.hoursWorked) {
      const inputs: QuizAnswers = {
        province:            (meta.province       as QuizAnswers["province"])       || "ON",
        employmentType:      (meta.employmentType as QuizAnswers["employmentType"]) || "hourly",
        hourlyRate:          meta.hourlyRate          ? parseFloat(meta.hourlyRate)          : undefined,
        annualSalary:        meta.annualSalary        ? parseFloat(meta.annualSalary)        : undefined,
        hoursWorked:         parseFloat(meta.hoursWorked || "0"),
        shiftCancelled:      (meta.shiftCancelled  as QuizAnswers["shiftCancelled"])  || "no",
        cancelledShiftHours: meta.cancelledShiftHours ? parseFloat(meta.cancelledShiftHours) : undefined,
        statHoliday:         (meta.statHoliday     as QuizAnswers["statHoliday"])     || "no",
        vacationPay:         (meta.vacationPay     as QuizAnswers["vacationPay"])     || "yes",
        tenure:              (meta.tenure          as QuizAnswers["tenure"])          || "lt1",
        email,
      }

      try {
        // Generate report
        const reportText = await generateReport({ ...inputs, email })

        // Send email via Resend
        await sendReportEmail({
          to: email,
          reportText,
          sessionId: session.id
        })

        // Notify Make.com — mark as paid
        const makeWebhookUrl = process.env.MAKE_WEBHOOK_URL
        if (makeWebhookUrl) {
          await fetch(makeWebhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email,
              paid:       true,
              session_id: session.id,
              timestamp:  new Date().toISOString()
            })
          })
        }
      } catch (err) {
        // Log error but still return 200 so Stripe doesn't retry
        console.error("Report generation or email failed:", err)
      }
    }
  }

  return NextResponse.json({ received: true })
}