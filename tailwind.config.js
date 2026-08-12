/** @type {import('tailwindcss').Config} */
const sans = [
  "Manrope",
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
      colors: {
        "primary": "#135bec",
        "primary-dark": "#0e47bd",
        "primary-soft": "#eaf1fe",
        "ink": "#0f172a",
        "ink-soft": "#374151",
        "muted": "#6b7280",
        "muted-strong": "#5a6472",
        "muted-soft": "#8a93a1",
        "muted-faint": "#9aa1ac",
        "placeholder": "#b9c0cb",
        "line": "#e6e8ec",
        "line-strong": "#dfe2e8",
        "line-soft": "#f0f1f4",
        "canvas": "#f4f5f7",
        "surface": "#ffffff",
        "surface-2": "#f7f8fa",
        "surface-3": "#f5f7fa",
        "surface-4": "#f1f3f6",
        "night": "#101622",
        "night-2": "#1b2a45",
        "night-line": "#5f6d84",
        "night-text": "#8f9bb1",
        "danger": "#e5484d",
        "background-light": "#f4f5f7",
        "background-dark": "#101622",
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
        "hero-mobile": "linear-gradient(130deg, #101622 0%, #1b2a45 65%, #22375d 100%)",
        "hero-desktop": "linear-gradient(120deg, #101622 0%, #1b2a45 60%, #21365c 100%)",
        "photo": "linear-gradient(165deg, #f7f8fa 0%, #e9ecf1 100%)",
        "photo-strong": "linear-gradient(165deg, #f7f8fa 0%, #e6eaf0 100%)",
        "tile": "linear-gradient(160deg, #eef1f6, #dfe4ec)",
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
