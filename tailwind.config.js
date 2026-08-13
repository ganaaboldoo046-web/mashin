/** @type {import('tailwindcss').Config} */
const sans = [
  "Inter",
  "ui-sans-serif",
  "system-ui",
  "sans-serif",
  '"Apple Color Emoji"',
  '"Segoe UI Emoji"',
  '"Segoe UI Symbol"',
  '"Noto Color Emoji"',
];

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      /* 색상은 index.css의 CSS 변수를 가리킨다 — 테마 전환이 자동으로 따라오게. */
      colors: {
        "primary": "#D60000",
        "primary-dark": "#A80000",
        "primary-soft": "var(--tint)",
        "accent-soft": "var(--accent-soft)",
        "ink": "var(--text)",
        "ink-soft": "var(--text-2)",
        "muted": "var(--muted)",
        "muted-strong": "var(--text-3)",
        "muted-soft": "var(--muted-2)",
        "muted-faint": "var(--muted-2)",
        "placeholder": "var(--muted-3)",
        "line": "var(--line)",
        "line-2": "var(--line-2)",
        "line-strong": "var(--line)",
        "line-soft": "var(--surface-2)",
        "canvas": "var(--bg)",
        "surface": "var(--surface)",
        "surface-2": "var(--surface-2)",
        "surface-3": "var(--surface-2)",
        "surface-4": "var(--line)",
        "night": "var(--ink-block)",
        "night-2": "var(--surface-2)",
        "night-line": "var(--muted-2)",
        "night-text": "var(--muted)",
        "danger": "var(--danger)",
        "background-light": "var(--bg)",
        "background-dark": "var(--bg)",
      },
      fontFamily: {
        "display": sans,
        "sans": sans,
      },
      maxWidth: {
        "shell": "1280px",
        "app": "430px",
      },
      boxShadow: {
        "pop": "0 16px 40px rgba(9,14,24,0.14)",
        "modal": "0 30px 70px rgba(9,14,24,0.35)",
      },
      backgroundImage: {
        "hero-mobile": "linear-gradient(130deg, #0D0D0D 0%, #2A0A0A 55%, #B70000 100%)",
        "hero-desktop": "linear-gradient(120deg, #0D0D0D 0%, #2A0A0A 55%, #B70000 100%)",
        "photo": "linear-gradient(165deg, var(--surface-2) 0%, var(--surface-3) 100%)",
        "photo-strong": "linear-gradient(165deg, var(--surface-2) 0%, var(--surface-3) 100%)",
        "tile": "linear-gradient(160deg, var(--surface-2), var(--surface-3))",
      },
      keyframes: {
        "marquee": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        "sheet-up": {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-in-right": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "bounce-slow": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        "marquee": "marquee 34s linear infinite",
        "sheet-up": "sheet-up 0.22s ease-out",
        "fade-in": "fade-in 0.18s ease-out",
        "slide-in-right": "slide-in-right 0.24s ease-out",
        "slide-up": "slide-up 0.22s ease-out",
        "bounce-slow": "bounce-slow 2.4s ease-in-out infinite",
      },
    },
  },
  darkMode: "class",
  plugins: [],
}
