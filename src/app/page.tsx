import { Container } from "@/components/ui/Container"
import { Card } from "@/components/ui/Card"
import { ButtonLink } from "@/components/ui/ButtonLink"

export default function HomePage() {
  return (
    <main>
      {/* HERO */}
      <section className="bg-background text-white">
        <Container className="py-12">
          <div className="mx-auto w-full max-w-[560px]">
            <div className="text-[12px] font-semibold tracking-[0.12em] text-accent-green">
              FREE ONTARIO ESA CHECK
            </div>
            <h1 className="mt-3 text-h1-mobile md:text-h1-desktop">
              Were you paid correctly?
            </h1>
            <p className="mt-4 text-body text-white/90">
              Ontario workers lose millions yearly to unpaid overtime, missed stat
              holiday pay, and illegal shift cancellations. Check your last pay
              period in 2 minutes — free.
            </p>

            <div className="mt-7">
              <ButtonLink href="/check" className="min-h-[56px] text-[16px] font-semibold">
                Check My Pay Now →
              </ButtonLink>
              <div className="mt-3 text-caption text-white/60">
                Anonymous. No login. No personal info required.
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* TRUST SIGNALS */}
      <section className="bg-surface py-10">
        <Container>
          <div className="-mx-5 flex gap-4 overflow-x-auto px-5 pb-2">
            <div className="min-w-[260px]">
              <Card className="p-5">
                <div className="text-[18px]">📋</div>
                <div className="mt-2 text-body font-semibold text-primary">
                  Based on Ontario ESA 2000
                </div>
                <div className="mt-1 text-caption text-muted">
                  The actual law, not estimates
                </div>
              </Card>
            </div>
            <div className="min-w-[260px]">
              <Card className="p-5">
                <div className="text-[18px]">🔒</div>
                <div className="mt-2 text-body font-semibold text-primary">
                  Fully Anonymous
                </div>
                <div className="mt-1 text-caption text-muted">
                  We never ask your name or employer
                </div>
              </Card>
            </div>
            <div className="min-w-[260px]">
              <Card className="p-5">
                <div className="text-[18px]">⚡</div>
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

      {/* TOP VIOLATIONS */}
      <section className="py-2">
        <Container>
          <h2 className="text-h2-mobile md:text-h2-desktop">
            3 violations most workers don&apos;t know about
          </h2>
          <div className="mt-5 grid gap-4">
            <Card className="p-5">
              <div className="text-body font-semibold text-primary">
                Overtime After 44 Hours
              </div>
              <div className="mt-2 text-body text-muted">
                Ontario law requires 1.5x pay for every hour over 44 in a single
                workweek. Not per day — per week.
              </div>
              <div className="mt-3 text-body font-semibold text-accent-green">
                Worked 48 hrs at $18/hr? You&apos;re owed $108 extra.
              </div>
            </Card>

            <Card className="p-5">
              <div className="text-body font-semibold text-primary">
                The 3-Hour Minimum Rule
              </div>
              <div className="mt-2 text-body text-muted">
                If your employer calls you in but sends you home early, they must
                pay you for at least 3 hours — regardless of how long you actually
                worked.
              </div>
              <div className="mt-3 text-body font-semibold text-accent-green">
                Sent home after 1 hour? Still owed 2 more hours of pay.
              </div>
            </Card>

            <Card className="p-5">
              <div className="text-body font-semibold text-primary">
                Stat Holiday Premium Pay
              </div>
              <div className="mt-2 text-body text-muted">
                Working on a statutory holiday (like Christmas or Family Day)
                legally requires premium pay — time and a half plus your regular
                pay, or a substitute day off.
              </div>
              <div className="mt-3 text-body font-semibold text-accent-green">
                Worked 8hrs on Family Day at $20/hr? Employer may owe you $80 extra.
              </div>
            </Card>
          </div>
        </Container>
      </section>

      {/* SOCIAL PROOF */}
      <section className="py-10">
        <Container>
          <Card className="p-6">
            <div className="text-[22px] leading-none text-muted">&ldquo;</div>
            <div className="mt-2 text-body text-primary">
              I had no idea my boss was shorting me on overtime for 6 months. The
              checker found it in 2 minutes.
            </div>
            <div className="mt-3 text-caption text-muted">
              — Ontario warehouse worker (verified buyer)
            </div>
            {/* Replace with real testimonial after first 10 sales */}
          </Card>
        </Container>
      </section>

      {/* CTA REPEAT */}
      <section className="pb-14">
        <Container>
          <div className="mx-auto w-full max-w-[560px]">
            <ButtonLink href="/check" className="min-h-[56px] text-[16px] font-semibold">
              Check My Pay Now →
            </ButtonLink>
            <div className="mt-3 text-caption text-muted text-center">
              Free check takes 2 minutes. Full report $19 CAD.
            </div>
          </div>
        </Container>
      </section>

      {/* FOOTER */}
      <footer className="pb-12">
        <Container>
          <div className="mx-auto max-w-[760px] text-center text-caption text-muted">
            <p>
              wagechecker.ca is an educational tool based on Ontario Employment Standards
              Act 2000. It is not legal advice and does not constitute a lawyer-client
              relationship. For complex situations, consult a licensed Ontario employment
              lawyer.
            </p>
            <p className="mt-3">© 2026 wagechecker.ca — Anonymous by design.</p>
          </div>
        </Container>
      </footer>
    </main>
  )
}

