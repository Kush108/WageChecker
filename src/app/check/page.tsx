import { Container } from "@/components/ui/Container"
import { Card } from "@/components/ui/Card"
import { CheckQuiz } from "@/app/check/quiz"

export default function CheckPage() {
  return (
    <main className="py-8">
      <Container>
        <div className="mx-auto w-full max-w-[480px]">
          <Card className="p-5">
            <CheckQuiz />
          </Card>
          <div className="mt-4 text-center text-caption text-muted">
            Educational tool only. Not legal advice.
          </div>
        </div>
      </Container>
    </main>
  )
}

