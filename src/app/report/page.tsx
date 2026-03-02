import { Container } from "@/components/ui/Container"
import { ReportClient } from "@/app/report/report-client"

export default function ReportPage() {
  return (
    <main className="py-8">
      <Container>
        <div className="mx-auto w-full max-w-[760px]">
          <ReportClient />
        </div>
      </Container>
    </main>
  )
}

