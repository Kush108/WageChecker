import { Container } from "@/components/ui/Container"
import { ResultsClient } from "@/app/results/results-client"

export default function ResultsPage() {
  return (
    <main className="py-8">
      <Container>
        <div className="mx-auto w-full max-w-[520px]">
          <ResultsClient />
        </div>
      </Container>
    </main>
  )
}

