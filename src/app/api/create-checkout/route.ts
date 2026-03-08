import Stripe from "stripe"
import { NextResponse } from "next/server"
import type { QuizAnswers } from "@/lib/types"

export async function POST(request: Request) {
  try {
    const stripeSecret = process.env.STRIPE_SECRET_KEY
    const publicUrl    = process.env.NEXT_PUBLIC_URL
    if (!stripeSecret) throw new Error("Missing STRIPE_SECRET_KEY")
    if (!publicUrl)    throw new Error("Missing NEXT_PUBLIC_URL")

    const stripe = new Stripe(stripeSecret, { apiVersion: "2024-06-20" })

    const body = await request.json()
    const { email, ...inputs } = body ?? {}
    if (!email) throw new Error("Missing email")

    // Stripe metadata: store each field separately
    // to stay well under the 500-char per-value limit
    const q = inputs as Partial<QuizAnswers>
    const metadata: Record<string, string> = {
      email:                String(email),
      employmentType:       String(q.employmentType ?? ""),
      hourlyRate:           String(q.hourlyRate     ?? ""),
      annualSalary:         String(q.annualSalary   ?? ""),
      hoursWorked:          String(q.hoursWorked    ?? ""),
      shiftCancelled:       String(q.shiftCancelled ?? ""),
      cancelledShiftHours:  String(q.cancelledShiftHours ?? ""),
      statHoliday:          String(q.statHoliday    ?? ""),
      vacationPay:          String(q.vacationPay    ?? ""),
      tenure:               String(q.tenure         ?? ""),
      province:             String(q.province       ?? "ON"),
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "cad",
            product_data: {
              name: "Ontario ESA Wage Report",
              description:
                "Full violation breakdown, exact calculations, " +
                "employer message template & next steps"
            },
            unit_amount: 100  // $19.00 CAD
          },
          quantity: 1
        }
      ],
      metadata,
      success_url: `${publicUrl}/report?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${publicUrl}/results`,
    })

    return NextResponse.json({ url: session.url })
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Unknown error" },
      { status: 400 }
    )
  }
}