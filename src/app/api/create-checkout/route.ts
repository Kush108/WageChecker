import Stripe from "stripe"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const stripeSecret = process.env.STRIPE_SECRET_KEY
    const publicUrl = process.env.NEXT_PUBLIC_URL
    if (!stripeSecret) throw new Error("Missing STRIPE_SECRET_KEY")
    if (!publicUrl) throw new Error("Missing NEXT_PUBLIC_URL")

    const stripe = new Stripe(stripeSecret, {
      apiVersion: "2024-06-20"
    })

    const body = await request.json()
    const { email, ...inputs } = body ?? {}
    if (!email) throw new Error("Missing email")

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "cad",
            product_data: {
              name: "ESA Wage Report",
              description:
                "Full violation breakdown, exact calculations, employer message template, and next steps"
            },
            unit_amount: 1900
          },
          quantity: 1
        }
      ],
      metadata: {
        email,
        inputs: JSON.stringify(inputs)
      },
      success_url: `${publicUrl}/report?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${publicUrl}/results`
    })

    return NextResponse.json({ url: session.url })
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Unknown error" },
      { status: 400 }
    )
  }
}

