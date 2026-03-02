# Wage Checker (Next.js 14)

Mobile-first Ontario ESA 2000 wage checker: free preview + paid report.

## Local setup

1. Install Node.js (recommended: Node 20+).
2. Create `.env.local`:
   - Copy `.env.example` → `.env.local`
   - Fill in the keys.
3. Install dependencies:
   - `npm install`
4. Run:
   - `npm run dev`
   - Open `http://localhost:3000`

## Stripe webhook (local)

1. Install Stripe CLI.
2. Login:
   - `stripe login`
3. Forward webhooks to your dev server:
   - `stripe listen --forward-to localhost:3000/api/webhook-stripe`
4. Copy the printed webhook signing secret into `STRIPE_WEBHOOK_SECRET`.

## Test flow

- Go to `/check`, complete the quiz, enter your email → redirected to `/results`
- Click “Unlock My Full Report — $19” → Stripe checkout
- Complete payment (test card `4242 4242 4242 4242`) → redirected to `/report?session_id=...`
- Webhook generates + emails the report (Resend) and marks paid in Make.com (optional)

## Deploy

Deploy to Vercel and set the environment variables in the Vercel project settings.

