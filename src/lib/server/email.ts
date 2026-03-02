import { Resend } from "resend"
import { requiredEnv } from "@/lib/server/env"

export async function sendReportEmail({
  to,
  reportText,
  sessionId
}: {
  to: string
  reportText: string
  sessionId: string
}) {
  const resend = new Resend(requiredEnv("RESEND_API_KEY"))
  const baseUrl = requiredEnv("NEXT_PUBLIC_URL")
  const from = process.env.REPORTS_FROM_EMAIL || "Wage Checker Reports <reports@wagechecker.ca>"

  await resend.emails.send({
    from,
    to,
    subject: "Your Ontario ESA Wage Report",
    html: `
      <div style="font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
        <h1 style="color:#0D1B2A;margin:0 0 8px 0">Your Ontario ESA Wage Report</h1>
        <p style="color:#374151;line-height:1.6;margin:0 0 16px 0">
          Your full report is ready. You can view it anytime at:
        </p>
        <p style="margin:0 0 24px 0">
          <a href="${baseUrl}/report?session_id=${sessionId}"
             style="background:#1DB954;color:white;padding:12px 18px;border-radius:8px;text-decoration:none;display:inline-block;font-weight:600">
            View My Report →
          </a>
        </p>
        <hr style="margin:24px 0;border:none;border-top:1px solid #E2E8F0" />
        <div style="white-space:pre-wrap;font-size:14px;line-height:1.65;color:#111827;background:#F8F9FA;border:1px solid #E2E8F0;border-radius:12px;padding:14px">
${escapeHtml(reportText)}
        </div>
        <p style="font-size:12px;color:#64748B;line-height:1.4;margin:18px 0 0 0">
          wagechecker.ca — Educational tool only. Not legal advice.
        </p>
      </div>
    `
  })
}

function escapeHtml(text: string) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;")
}

