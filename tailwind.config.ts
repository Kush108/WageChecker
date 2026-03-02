import type { Config } from "tailwindcss"

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Dark, premium system (Linear/Stripe-like)
        background: "#050B14",
        surface: "#0B1220",
        card: "#0B1220",
        border: "#1B263A",
        primary: {
          // Primary text color (kept as `primary` to minimize class churn)
          DEFAULT: "#E6EDF3"
        },
        accent: {
          green: "#22C55E",
          red: "#EF4444"
        },
        muted: {
          DEFAULT: "#94A3B8"
        }
      },
      boxShadow: {
        card: "0 1px 0 rgba(255,255,255,0.04), 0 18px 40px rgba(0,0,0,0.40)"
      },
      borderRadius: {
        card: "14px"
      },
      fontSize: {
        "h1-mobile": ["28px", { lineHeight: "1.15", fontWeight: "700" }],
        "h1-desktop": ["40px", { lineHeight: "1.1", fontWeight: "700" }],
        "h2-mobile": ["22px", { lineHeight: "1.2", fontWeight: "600" }],
        "h2-desktop": ["30px", { lineHeight: "1.2", fontWeight: "600" }],
        body: ["16px", { lineHeight: "1.6", fontWeight: "400" }],
        caption: ["13px", { lineHeight: "1.4", fontWeight: "400" }]
      }
    }
  },
  plugins: []
} satisfies Config

