import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Use — wagechecker.ca",
}

export default function TermsPage() {
  return (
    <>
      <main className="mx-auto max-w-2xl px-6 py-16 text-slate-300">

        <div className="mb-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-green-500">wagechecker.ca</p>
          <h1 className="text-3xl font-bold text-white">Terms of Use</h1>
          <p className="mt-2 text-sm text-slate-400">Last updated: March 2026</p>
        </div>

        <div className="space-y-8">

          <section>
            <h2 className="mb-3 text-lg font-semibold text-white">1. Educational tool only</h2>
            <p className="leading-relaxed">
              wagechecker.ca is an educational tool based on the Ontario Employment Standards Act 2000. It is not legal advice and does not create a lawyer-client relationship. Results are estimates based on information you provide. For complex situations, consult a licensed Ontario employment lawyer or contact the Ministry of Labour at 1-800-531-5551.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-white">2. Accuracy of results</h2>
            <p className="leading-relaxed">
              Violation checks and dollar amounts are calculated based on information you enter. We make no guarantee that results are complete or applicable to your specific situation. ESA rules may vary based on your industry, employment contract, and other factors not captured in our quiz.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-white">3. Payment and refunds</h2>
            <p className="leading-relaxed">
              The full ESA Wage Report costs $19 CAD as a one-time payment. Once payment is processed and your report is generated, we do not offer refunds. If you experience a technical issue and did not receive your report, contact{" "}
              <a href="mailto:support@wagechecker.ca" className="text-green-400 underline">support@wagechecker.ca</a>{" "}
              within 48 hours and we will resolve it manually within 1 hour.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-white">4. Acceptable use</h2>
            <p className="leading-relaxed">
              This tool is for Ontario workers checking their own employment situation. You may not use wagechecker.ca to generate reports for others without their knowledge, for commercial resale, or in any way that violates applicable law.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-white">5. Limitation of liability</h2>
            <p className="leading-relaxed">
              wagechecker.ca is provided as-is without warranties of any kind. We are not liable for any decisions made based on results from this tool, including outcomes of employer communications, Ministry of Labour complaints, or legal proceedings. Always verify your rights with a qualified professional before taking action.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-white">6. Jurisdiction</h2>
            <p className="leading-relaxed">
              This tool is designed for Ontario, Canada. ESA rules referenced apply only to Ontario employees. These terms are governed by the laws of Ontario, Canada.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-white">7. Changes to these terms</h2>
            <p className="leading-relaxed">
              We may update these terms at any time. Continued use of wagechecker.ca after changes constitutes acceptance of the updated terms.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-white">8. Contact</h2>
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