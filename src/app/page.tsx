import { Container } from "@/components/ui/Container"
import { Card } from "@/components/ui/Card"
import { ButtonLink } from "@/components/ui/ButtonLink"


export default function HomePage() {
  return (
    <main>
      {/* HERO */}
      <section className="bg-background text-white">
        <Container className="py-14">
          <div className="mx-auto w-full max-w-[560px] text-center">

            {/* Badge */}
            <div className="inline-block rounded-full border border-accent-green/25 bg-accent-green/8 px-3 py-1 text-[12px] font-semibold tracking-[0.1em] text-accent-green">
              🇨🇦 Free Ontario ESA Check
            </div>

            {/* Headline */}
            <h1 className="mt-4 text-h1-mobile md:text-h1-desktop">
              Were you underpaid?
            </h1>

            {/* Subheadline */}
            <p className="mt-4 text-body text-white/80 mx-auto max-w-[460px]">
              Ontario workers lose millions yearly to unpaid overtime, missed stat
              holiday pay, and illegal shift cancellations. Check your last pay
              period in 2 minutes — free.
            </p>

            {/* CTA */}
            <div className="mt-8">
              <ButtonLink
                href="/check"
                className="min-h-[56px] text-[16px] font-semibold mx-auto max-w-[340px]"
              >
                Check My Pay — It&apos;s Free →
              </ButtonLink>
              <div className="mt-3 text-caption text-white/50">
                Anonymous · No login · No personal details needed
              </div>
            </div>

          </div>
        </Container>
      </section>

      {/* TRUST SIGNALS */}
      <section className="bg-surface py-10">
        <Container>
          <div className="-mx-5 flex gap-4 overflow-x-auto px-5 pb-2">
            <div className="min-w-[240px]">
              <Card className="p-5">
                <div className="text-[20px]">📋</div>
                <div className="mt-2 text-body font-semibold text-primary">
                  Based on Ontario ESA 2000
                </div>
                <div className="mt-1 text-caption text-muted">
                  The actual law, not estimates
                </div>
              </Card>
            </div>
            <div className="min-w-[240px]">
              <Card className="p-5">
                <div className="text-[20px]">🔒</div>
                <div className="mt-2 text-body font-semibold text-primary">
                  Fully Anonymous
                </div>
                <div className="mt-1 text-caption text-muted">
                  We never ask your name or employer
                </div>
              </Card>
            </div>
            <div className="min-w-[240px]">
              <Card className="p-5">
                <div className="text-[20px]">⚡</div>
                <div className="mt-2 text-body font-semibold text-primary">
                  2-Minute Check
                </div>
                <div className="mt-1 text-caption text-muted">
                  Answer 8 questions, see your result
                </div>
              </Card>
            </div>
          </div>
        </Container>
      </section>

      {/* VIOLATIONS */}
      <section className="bg-background py-14">
        <Container>
          <div className="mx-auto max-w-[640px]">

            <h2 className="text-h2-mobile md:text-h2-desktop text-center">
              3 violations most workers don&apos;t know about
            </h2>
            <p className="mt-3 text-body text-muted text-center">
              These are the most common ways Ontario employers underpay — 
              usually counting on workers not knowing the rules.
            </p>

            <div className="mt-8 grid gap-4">

              {/* Card 1 */}
              <Card className="p-5 border-t-2 border-t-accent-red">
                <div className="flex items-center justify-between">
                  <div className="text-body font-semibold text-primary">
                    Overtime After 44 Hours
                  </div>
                  <span className="rounded px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide bg-red-950 text-accent-red">
                    High
                  </span>
                </div>
                <div className="mt-2 text-body text-muted">
                  Ontario law requires 1.5x pay for every hour over 44 in a
                  single workweek. Not per day — per week. Most employers
                  never volunteer this.
                </div>
                <div className="mt-3 rounded-md bg-surface px-4 py-2.5 font-mono text-[13px] text-accent-green">
                  Worked 48 hrs at $18/hr → $108 extra owed this week
                </div>
              </Card>

              {/* Card 2 */}
              <Card className="p-5 border-t-2 border-t-amber-500">
                <div className="flex items-center justify-between">
                  <div className="text-body font-semibold text-primary">
                    The 3-Hour Minimum Rule
                  </div>
                  <span className="rounded px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide bg-amber-950 text-amber-400">
                    Medium
                  </span>
                </div>
                <div className="mt-2 text-body text-muted">
                  If your employer calls you in but sends you home early,
                  they must pay you for at least 3 hours — regardless of
                  how long you actually worked.
                </div>
                <div className="mt-3 rounded-md bg-surface px-4 py-2.5 font-mono text-[13px] text-accent-green">
                  Worked 1 hr? Still owed 2 more hours of pay.
                </div>
              </Card>

              {/* Card 3 */}
              <Card className="p-5 border-t-2 border-t-amber-500">
                <div className="flex items-center justify-between">
                  <div className="text-body font-semibold text-primary">
                    Stat Holiday Premium Pay
                  </div>
                  <span className="rounded px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide bg-amber-950 text-amber-400">
                    Medium
                  </span>
                </div>
                <div className="mt-2 text-body text-muted">
                  Working on Family Day, Christmas, or any Ontario stat
                  holiday legally requires premium pay. Most hourly workers
                  never receive what they&apos;re owed.
                </div>
                <div className="mt-3 rounded-md bg-surface px-4 py-2.5 font-mono text-[13px] text-accent-green">
                  8hrs on Family Day at $20/hr → $80+ owed
                </div>
              </Card>

            </div>
          </div>
        </Container>
      </section>

      {/* URGENCY STAT — replaces fake testimonial */}
      <section className="bg-surface py-12">
        <Container>
          <div className="mx-auto max-w-[480px] text-center">
            <div className="text-[40px] font-bold text-accent-green">
              7.8M
            </div>
            <div className="mt-1 text-body font-semibold text-primary">
              Ontario workers covered by the ESA
            </div>
            <div className="mt-2 text-body text-muted">
              Most have never checked if their employer 
              is following it. A 2-minute check could 
              find money you&apos;re already owed.
            </div>
          </div>
        </Container>
      </section>

      {/* CTA REPEAT */}
      <section className="bg-background py-16">
        <Container>
          <div className="mx-auto w-full max-w-[480px] text-center">
            <h2 className="text-h2-mobile md:text-h2-desktop">
              Find out in 2 minutes
            </h2>
            <p className="mt-3 text-body text-muted">
              Free to check. $19 only if violations are found 
              and you want the full breakdown.
            </p>
            <div className="mt-6">
              <ButtonLink
                href="/check"
                className="min-h-[56px] text-[16px] font-semibold"
              >
                Check My Pay Now →
              </ButtonLink>
            </div>
            <div className="mt-3 text-caption text-muted">
              Anonymous · No login · No subscription
            </div>
          </div>
        </Container>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border pb-12 pt-8">
        <Container>
          <div className="mx-auto max-w-[680px] text-center text-caption text-muted">
            <p>
              wagechecker.ca is an educational tool based on Ontario
              Employment Standards Act 2000. It is not legal advice and
              does not constitute a lawyer-client relationship. For complex
              situations, consult a licensed Ontario employment lawyer.
            </p>
            <p className="mt-3">
              © 2026{" "}
              <a href="/" className="text-muted hover:text-primary transition-colors">
                wagechecker.ca
              </a>{" "}
              · Anonymous by design
            </p>
          </div>
        </Container>
      </footer>

    </main>
  )
}