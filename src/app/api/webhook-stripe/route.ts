import Stripe from "stripe"
import { NextResponse } from "next/server"
import { sendReportEmail } from "@/lib/server/email"

export async function POST(request: Request) {
  const stripeSecret  = process.env.STRIPE_SECRET_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!stripeSecret)  return new NextResponse("Missing STRIPE_SECRET_KEY",  { status: 500 })
  if (!webhookSecret) return new NextResponse("Missing STRIPE_WEBHOOK_SECRET", { status: 500 })

  const stripe = new Stripe(stripeSecret, { apiVersion: "2024-06-20" })

  const sig = request.headers.get("stripe-signature")
  if (!sig) return new NextResponse("Missing stripe-signature", { status: 400 })

  const body = await request.text()
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Signature verification failed"
    return new NextResponse(`Webhook Error: ${msg}`, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session
    const meta    = session.metadata ?? {}
    const email   = session.customer_email || meta.email
    const baseUrl = process.env.NEXT_PUBLIC_URL || "https://wagechecker.ca"

    if (email && meta.hoursWorked) {
      try {
        // Send email with report link ONLY — no OpenAI call here
        // Report is generated fresh when user visits /report page
        await sendReportEmail({
          to: email,
          reportText: "", // empty — email uses link-only mode
          sessionId: session.id,
          linkOnly: true,
          baseUrl,
        })

        // Notify Make.com
        const makeWebhookUrl = process.env.MAKE_WEBHOOK_URL
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
      } catch (err) {
        console.error("Webhook email failed:", err)
      }
    }
  }

  return NextResponse.json({ received: true })
}