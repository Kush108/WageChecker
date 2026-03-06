import { Resend } from "resend"
import { requiredEnv } from "@/lib/server/env"

function markdownToHtml(text: string): string {
  return text
    .replace(/## (.*)/g,
      '<h2 style="color:#22C55E;font-size:13px;font-weight:700;' +
      'letter-spacing:0.1em;text-transform:uppercase;margin:28px 0 10px;' +
      'padding-bottom:8px;border-bottom:1px solid #E2E8F0">$1</h2>')
    .replace(/### (.*)/g,
      '<h3 style="color:#111827;font-size:15px;font-weight:600;' +
      'margin:16px 0 8px">$1</h3>')
    .replace(/\*\*(.*?)\*\*/g,
      '<strong style="color:#111827;font-weight:600">$1</strong>')
    .replace(/^- (.*)/gm,
      '<li style="color:#374151;margin:4px 0">$1</li>')
    .replace(/^---$/gm,
      '<hr style="border:none;border-top:1px solid #E2E8F0;margin:20px 0">')
    .replace(/\n\n/g,
      '</p><p style="color:#374151;line-height:1.65;margin:0 0 12px">')
    .replace(/\n/g, "<br>")
}

export async function sendReportEmail({
  to,
  reportText,
  sessionId,
  linkOnly = false,
  baseUrl = "https://wagechecker.ca",
}: {
  to: string
  reportText: string
  sessionId: string
  linkOnly?: boolean
  baseUrl?: string
}) {
  const resend = new Resend(requiredEnv("RESEND_API_KEY"))
  const from   = process.env.REPORTS_FROM_EMAIL ||
                 "Wage Checker Reports <reports@wagechecker.ca>"

  const reportUrl = `${baseUrl}/report?session_id=${sessionId}`

  const reportSection = linkOnly || !reportText
    ? `<p style="color:#374151;font-size:14px;line-height:1.6;margin:0 0 16px">
        Your full report is ready — including exact violation amounts, 
        step-by-step calculations, and a copy-paste employer message.
       </p>`
    : `<div style="background:#ffffff;border:1px solid #E2E8F0;
        border-radius:12px;padding:24px;margin-bottom:24px">
        <p style="color:#374151;line-height:1.65;margin:0 0 12px">
          ${markdownToHtml(reportText)}
        </p>
       </div>`

  await resend.emails.send({
    from,
    to,
    subject: "Your Ontario ESA Wage Report is ready — wagechecker.ca",
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
</head>
<body style="margin:0;padding:0;background:#F8F9FA;
  font-family:Inter,system-ui,-apple-system,sans-serif">
  <div style="max-width:600px;margin:0 auto;padding:32px 20px">

    <!-- Header -->
    <div style="background:#050B14;border-radius:12px;
      padding:24px;margin-bottom:24px">
      <div style="font-size:11px;font-weight:700;letter-spacing:0.1em;
        text-transform:uppercase;color:#22C55E;margin-bottom:8px">
        Ontario ESA Wage Report
      </div>
      <div style="font-size:22px;font-weight:700;color:#F1F5F9">
        Your Report is Ready
      </div>
      <div style="font-size:13px;color:#64748B;margin-top:4px">
        Based on Ontario Employment Standards Act 2000
      </div>
    </div>

    <!-- CTA Button -->
    <div style="text-align:center;margin-bottom:28px">
      <a href="${reportUrl}"
        style="background:#22C55E;color:#000000;padding:16px 32px;
        border-radius:8px;text-decoration:none;font-weight:700;
        font-size:16px;display:inline-block">
        View My Full Report →
      </a>
      <div style="font-size:12px;color:#94A3B8;margin-top:10px">
        Bookmark this link — you can return to it anytime
      </div>
    </div>

    ${reportSection}

    <!-- Share nudge -->
    <div style="background:#F0FDF4;border:1px solid #BBF7D0;
      border-radius:10px;padding:16px;margin-bottom:24px;text-align:center">
      <div style="font-size:14px;color:#166534;font-weight:600">
        Know someone who might be underpaid?
      </div>
      <div style="font-size:13px;color:#16A34A;margin-top:4px">
        Share wagechecker.ca — free to check, 2 minutes
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align:center;font-size:12px;color:#94A3B8;line-height:1.5">
      <a href="https://wagechecker.ca"
        style="color:#64748B;text-decoration:none;font-weight:600">
        wagechecker.ca
      </a><br>
      Educational tool only. Not legal advice.<br>
      Not affiliated with the Ontario government.
    </div>

  </div>
</body>
</html>`
  })
}