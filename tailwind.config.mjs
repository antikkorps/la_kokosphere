import { COLORS } from "./src/consts.ts"

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        // Couleurs primaires et secondaires depuis la configuration centralisée
        primary: COLORS.primary,
        secondary: COLORS.secondary,

        // Couleurs d'accent
        accent: COLORS.accent,

        // Couleurs neutres
        neutral: COLORS.neutral,

        // Couleurs de fond
        background: COLORS.background,

        // Couleurs de texte
        text: COLORS.text,
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ["Georgia", "serif"],
      },
      // Gradients personnalisés
      backgroundImage: {
        "gradient-primary": "linear-gradient(to bottom right, var(--tw-gradient-stops))",
        "gradient-hero": "linear-gradient(to bottom right, var(--tw-gradient-stops))",
        "gradient-card": "linear-gradient(to bottom right, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
}
