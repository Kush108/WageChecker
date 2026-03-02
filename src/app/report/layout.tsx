import type { ReactNode } from "react"
import { Suspense } from "react"

export default function ReportLayout({ children }: { children: ReactNode }) {
  // Needed because `useSearchParams` is used in the client report component.
  return <Suspense fallback={null}>{children}</Suspense>
}

