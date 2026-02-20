// Site constants
export const SITE_TITLE = "La Kokosphère"
export const SITE_DESCRIPTION =
  "Hypnothérapeute certifiée au Mans et en Sarthe. Cécile Pascual, spécialiste en hypnose ericksonienne pour traiter stress, anxiété, phobies, addictions et troubles du sommeil. Séances à domicile au Mans. Prenez RDV."
export const SITE_URL = "https://la-kokosphere.fr"
export const SITE_EMAIL = "kokosphere72@gmail.com"
export const SITE_PHONE = "+33 6 63 64 10 85"
export const SITE_ADDRESS = "11 Rue du Docteur LEROY - 72000 LE MANS"
export const SITE_SIRET = "824 632 301 00019"
export const SITE_RCS = "RCS Le Mans 824 632 301"
export const SITE_APE = "8690F"
export const SITE_ADMIN = "https://la-kokosphere.sanity.studio"

// Developer credits
export const DEVELOPER_NAME = "Dev2Go - Franck Vienot"
export const DEVELOPER_URL = "https://dev2go.vercel.app"

// Calendly URL
export const CALENDLY_URL = "https://calendly.com/kokosphere72/30min"

// Charte graphique - Couleurs centralisées
export const COLORS = {
  // Couleurs primaires
  primary: {
    50: "#eff6ff", // Bleu très clair
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#3b82f6", // Bleu principal
    600: "#2563eb", // Bleu foncé
    700: "#1d4ed8",
    800: "#1e40af",
    900: "#1e3a8a",
  },

  // Couleurs secondaires
  secondary: {
    50: "#faf5ff", // Violet très clair
    100: "#f3e8ff",
    200: "#e9d5ff",
    300: "#d8b4fe",
    400: "#c084fc",
    500: "#a855f7", // Violet principal
    600: "#9333ea", // Violet foncé
    700: "#7c3aed",
    800: "#6b21a8",
    900: "#581c87",
  },

  // Couleurs d'accent
  accent: {
    success: "#10b981", // Vert
    warning: "#f59e0b", // Orange
    error: "#ef4444", // Rouge
    info: "#06b6d4", // Cyan
  },

  // Couleurs neutres
  neutral: {
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
  },

  // Couleurs de fond
  background: {
    light: "#ffffff",
    dark: "#0f172a",
    primary: "#eff6ff",
    secondary: "#faf5ff",
  },

  // Couleurs de texte
  text: {
    primary: "#1e293b", // Texte principal
    secondary: "#64748b", // Texte secondaire
    light: "#f8fafc", // Texte clair
    muted: "#94a3b8", // Texte atténué
  },
} as const

// Classes Tailwind pour les couleurs (pour faciliter l'utilisation)
export const COLOR_CLASSES = {
  // Couleurs primaires
  primary: {
    bg: "bg-primary-600",
    text: "text-primary-600",
    border: "border-primary-600",
    hover: {
      bg: "hover:bg-primary-700",
      text: "hover:text-primary-700",
    },
    gradient: "bg-gradient-to-r from-primary-600 to-primary-700",
  },

  // Couleurs secondaires
  secondary: {
    bg: "bg-secondary-600",
    text: "text-secondary-600",
    border: "border-secondary-600",
    hover: {
      bg: "hover:bg-secondary-700",
      text: "hover:text-secondary-700",
    },
    gradient: "bg-gradient-to-r from-secondary-600 to-secondary-700",
  },

  // Gradients combinés
  gradients: {
    primary: "bg-gradient-to-br from-primary-50 via-secondary-50 to-primary-100",
    hero: "bg-gradient-to-br from-primary-600 to-secondary-600",
    card: "bg-gradient-to-br from-white to-gray-50",
  },

  // Couleurs d'accent
  accent: {
    success: {
      bg: "bg-green-500",
      text: "text-green-600",
      hover: "hover:bg-green-600",
    },
    warning: {
      bg: "bg-yellow-500",
      text: "text-yellow-600",
      hover: "hover:bg-yellow-600",
    },
    error: {
      bg: "bg-red-500",
      text: "text-red-600",
      hover: "hover:bg-red-600",
    },
  },
} as const

// Configuration des thèmes
export const THEME_CONFIG = {
  // Couleurs par défaut
  default: {
    primary: COLORS.primary[600],
    secondary: COLORS.secondary[600],
    accent: COLORS.accent.success,
  },

  // Variantes de thème (pour des variations futures)
  variants: {
    calm: {
      primary: "#4f46e5", // Indigo
      secondary: "#7c3aed", // Violet
      accent: "#10b981", // Vert
    },
    energetic: {
      primary: "#dc2626", // Rouge
      secondary: "#ea580c", // Orange
      accent: "#fbbf24", // Jaune
    },
    professional: {
      primary: "#1e293b", // Slate
      secondary: "#475569", // Slate
      accent: "#3b82f6", // Bleu
    },
  },
} as const

// Fonction utilitaire pour obtenir une couleur
export function getColor(category: keyof typeof COLORS, shade?: string): string {
  if (shade) {
    return COLORS[category][shade as keyof (typeof COLORS)[typeof category]] || ""
  }
  return COLORS[category] as any
}

// Fonction utilitaire pour obtenir une classe Tailwind
export function getColorClass(
  type: "bg" | "text" | "border",
  category: "primary" | "secondary",
): string {
  const colorConfig = COLOR_CLASSES[category]
  return colorConfig[type] || ""
}
