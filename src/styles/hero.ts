import { heroui } from "@heroui/react";

export default heroui({
  addCommonColors: true,
  themes: {
    light: {
      colors: {
        background: "#ffffff",
        foreground: "#231E2D",
        content1: "#ffffff",
        content2: "#f8fafc",
        content3: "#f1f5f9",
        content4: "#e2e8f0",
        default: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
          DEFAULT: "#64748b",
          foreground: "#231E2D",
        },
      },
    },
    dark: {
      colors: {
        background: "#0d1117",
        foreground: "#f1f5f9",
        content1: "#161d2b",
        content2: "#111827",
        content3: "#1a2235",
        content4: "#1e293b",
        default: {
          50: "#0f172a",
          100: "#1e293b",
          200: "#334155",
          300: "#475569",
          400: "#64748b",
          500: "#94a3b8",
          600: "#cbd5e1",
          700: "#e2e8f0",
          800: "#f1f5f9",
          900: "#f8fafc",
          DEFAULT: "#94a3b8",
          foreground: "#f1f5f9",
        },
      },
    },
  },
});
