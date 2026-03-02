import Stripe from "stripe"
import { NextResponse } from "next/server"
import type { QuizAnswers } from "@/lib/types"
import { generateReport } from "@/lib/server/report"
import { sendReportEmail } from "@/lib/server/email"

export async function POST(request: Request) {
  const stripeSecret = process.env.STRIPE_SECRET_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!stripeSecret) {
    return new NextResponse("Missing STRIPE_SECRET_KEY", { status: 500 })
  }
  if (!webhookSecret) {
    return new NextResponse("Missing STRIPE_WEBHOOK_SECRET", { status: 500 })
  }

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
    const email = session.customer_email || (session.metadata?.email as string | undefined)
    const inputsRaw = session.metadata?.inputs as string | undefined
    const makeWebhookUrl = process.env.MAKE_WEBHOOK_URL

    if (email && inputsRaw) {
      const inputs = JSON.parse(inputsRaw) as QuizAnswers

      // Generate report + email it
      const reportText = await generateReport({ ...inputs, email })
      await sendReportEmail({ to: email, reportText, sessionId: session.id })

      // Mark as paid in Make.com (optional)
      if (makeWebhookUrl) {
        await fetch(makeWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            paid: true,
            session_id: session.id,
            timestamp: new Date().toISOString()
          })
        })
      }
    }
  }

  return NextResponse.json({ received: true })
}

