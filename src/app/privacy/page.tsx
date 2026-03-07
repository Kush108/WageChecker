import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy — wagechecker.ca",
}

export default function PrivacyPage() {
  return (
    <>
      <main className="mx-auto max-w-2xl px-6 py-16 text-slate-300">

        <div className="mb-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-green-500">wagechecker.ca</p>
          <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
          <p className="mt-2 text-sm text-slate-400">Last updated: March 2026</p>
        </div>

        <div className="space-y-8">

          <section>
            <h2 className="mb-3 text-lg font-semibold text-white">Our commitment to you</h2>
            <p className="leading-relaxed">
              wagechecker.ca is built on anonymity. We designed this tool so workers can check their rights without fear. We collect the minimum data necessary to provide the service and nothing more.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-white">What we collect</h2>
            <div className="space-y-3">
              <div className="rounded-lg border border-slate-700 bg-slate-800 p-4">
                <p className="mb-1 font-medium text-white">Email address</p>
                <p className="text-sm text-slate-400">Required to send your report and provide support. We never share or sell your email. Unsubscribe anytime.</p>
              </div>
              <div className="rounded-lg border border-slate-700 bg-slate-800 p-4">
                <p className="mb-1 font-medium text-white">Quiz answers</p>
                <p className="text-sm text-slate-400">Your employment type, hourly rate, hours worked, and ESA-related answers. Used only to calculate your violation check. We never store your employer name.</p>
              </div>
              <div className="rounded-lg border border-slate-700 bg-slate-800 p-4">
                <p className="mb-1 font-medium text-white">Payment information</p>
                <p className="text-sm text-slate-400">Payments are processed by Stripe. wagechecker.ca never sees or stores your card details. Stripe is PCI DSS Level 1 certified.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-white">What we never collect</h2>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><span className="text-green-500">✓</span><span>Your name</span></li>
              <li className="flex items-center gap-2"><span className="text-green-500">✓</span><span>Your employer name or address</span></li>
              <li className="flex items-center gap-2"><span className="text-green-500">✓</span><span>Your SIN or government ID</span></li>
              <li className="flex items-center gap-2"><span className="text-green-500">✓</span><span>Your location beyond province</span></li>
              <li className="flex items-center gap-2"><span className="text-green-500">✓</span><span>Anything that could identify you to your employer</span></li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-white">How we use your data</h2>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><span className="text-slate-500">→</span><span>To generate and deliver your ESA violation report</span></li>
              <li className="flex items-center gap-2"><span className="text-slate-500">→</span><span>To send you a copy of your report via email</span></li>
              <li className="flex items-center gap-2"><span className="text-slate-500">→</span><span>To send Ontario worker rights tips if you opted in</span></li>
              <li className="flex items-center gap-2"><span className="text-slate-500">→</span><span>To provide customer support if you contact us</span></li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-white">Third-party services</h2>
            <ul className="space-y-2 text-sm">
              <li><span className="font-medium text-white">Stripe</span> — payment processing (PCI compliant, card data never touches our servers)</li>
              <li><span className="font-medium text-white">Resend</span> — transactional email delivery</li>
              <li><span className="font-medium text-white">Vercel</span> — hosting (servers in North America)</li>
              <li><span className="font-medium text-white">OpenAI</span> — AI report generation (data not used to train models under our API agreement)</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-white">Data retention</h2>
            <p className="leading-relaxed">
              Quiz answers and email addresses are retained for up to 12 months so you can retrieve your report. You can request deletion anytime by emailing{" "}
              <a href="mailto:support@wagechecker.ca" className="text-green-400 underline">support@wagechecker.ca</a>.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-white">Your rights</h2>
            <p className="leading-relaxed">
              You have the right to access, correct, or delete any personal information we hold. Contact us at{" "}
              <a href="mailto:support@wagechecker.ca" className="text-green-400 underline">support@wagechecker.ca</a>. We respond within 5 business days.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-white">Contact</h2>
            <p className="leading-relaxed">
              Questions? Email{" "}
              <a href="mailto:support@wagechecker.ca" className="text-green-400 underline">support@wagechecker.ca</a>.
            </p>
          </section>

        </div>

        <div className="mt-12 border-t border-slate-800 pt-8">
          <a href="/" className="text-sm text-slate-400 hover:text-white">← Back to wagechecker.ca</a>
        </div>

      </main>
    </>
  )
}