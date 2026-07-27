/** @type {import('tailwindcss').Config} */

// Tokens are defined once as CSS custom properties in src/app/globals.css and
// documented in docs/DESIGN-SYSTEM.md. This file only exposes them as
// utilities — it must never introduce a hex that isn't in those two places.
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Brand ramp (§2.1). 200/400/500/700 are sampled from the logo masters.
        brand: {
          50: "var(--k-brand-50)",
          100: "var(--k-brand-100)",
          200: "var(--k-brand-200)",
          300: "var(--k-brand-300)",
          400: "var(--k-brand-400)",
          500: "var(--k-brand-500)",
          600: "var(--k-brand-600)",
          700: "var(--k-brand-700)",
          800: "var(--k-brand-800)",
          900: "var(--k-brand-900)",
        },

        // Surface, ink, semantic (§2.2–2.3).
        surface: {
          DEFAULT: "var(--k-surface)",
          sunken: "var(--k-surface-sunken)",
        },
        ink: {
          DEFAULT: "var(--k-ink)",
          muted: "var(--k-ink-muted)",
          subtle: "var(--k-ink-subtle)",
        },
        line: {
          DEFAULT: "var(--k-line)",
          strong: "var(--k-line-strong)",
        },
        blush: "var(--k-blush)",
        success: "var(--k-success)",
        danger: "var(--k-danger)",
        warning: "var(--k-warning)",

        // Legacy aliases — the original six tokens, unchanged, so the existing
        // components keep rendering while sections migrate to the ramp above.
        // Do not reach for these in new code.
        kayaan: {
          bg: "#faf7f2",
          ink: "#1c1917",
          brown: "#6b4a35",
          brownDark: "#4a3224",
          accent: "#c9a876",
          pink: "#f7e6e6",
        },
      },

      fontFamily: {
        sans: ["var(--k-font-sans)"],
        display: ["var(--k-font-display)"],
        emoji: ["var(--k-font-emoji)"],
        // Legacy alias — `font-arabic` is still applied in layout.tsx.
        arabic: ["var(--k-font-sans)"],
      },

      // §3.2 — sizes paired with the line-height Arabic actually needs.
      fontSize: {
        "display-1": ["clamp(2.25rem, 6vw, 4rem)", { lineHeight: "1.15", fontWeight: "800" }],
        "display-2": ["clamp(1.75rem, 4vw, 2.75rem)", { lineHeight: "1.2", fontWeight: "800" }],
        h1: ["1.75rem", { lineHeight: "1.35", fontWeight: "700" }],
        h2: ["1.375rem", { lineHeight: "1.4", fontWeight: "700" }],
        h3: ["1.125rem", { lineHeight: "1.5", fontWeight: "600" }],
        "body-lg": ["1.0625rem", { lineHeight: "1.75" }],
        body: ["0.9375rem", { lineHeight: "1.7" }],
        "body-sm": ["0.875rem", { lineHeight: "1.65" }],
        caption: ["0.8125rem", { lineHeight: "1.5", fontWeight: "500" }],
        price: ["1.0625rem", { lineHeight: "1.3", fontWeight: "700" }],
      },

      // §4.2 — four steps plus pill. `rounded-none` stays for full-bleed media.
      borderRadius: {
        xs: "var(--k-radius-xs)",
        sm: "var(--k-radius-sm)",
        md: "var(--k-radius-md)",
        lg: "var(--k-radius-lg)",
        pill: "var(--k-radius-pill)",
      },

      // §4.3 — two steps. Product cards get neither.
      boxShadow: {
        1: "var(--k-shadow-1)",
        2: "var(--k-shadow-2)",
      },

      transitionTimingFunction: {
        k: "var(--k-ease)",
      },
      transitionDuration: {
        fast: "var(--k-dur-fast)",
        base: "var(--k-dur-base)",
        slow: "var(--k-dur-slow)",
      },

      maxWidth: {
        container: "var(--k-container)",
        "container-wide": "var(--k-container-wide)",
      },

      // §4.4 — `top-header` / `pt-header` for anything that pins under the
      // sticky header. Kept as a spacing entry so it works with every inset
      // utility rather than being re-typed as an arbitrary value.
      spacing: {
        header: "var(--k-header-h)",
      },

      // §7 — the two crops used across the site.
      aspectRatio: {
        product: "4 / 5",
        hero: "16 / 9",
      },
    },
  },
  plugins: [],
};
