export const brand = {
  name: "Vantyx",
  shortName: "VX",
  slogan: "Cartera, riesgo y recaudo en una sola vista.",
  description:
    "Suite comercial para bancos, financieras y equipos de cobranza que necesitan operar cartera, riesgo y recaudo desde una experiencia unificada.",
  mascot: {
    name: "Vanta",
    title: "Zorro centinela",
    description: "Una mascota vigilante, agil y precisa que representa control, velocidad y lectura del riesgo.",
  },
  locale: "es-CO",
  colors: {
    obsidian: "#05070c",
    ink: "#0b1220",
    steel: "#d7deea",
    signal: "#ff5d52",
    signalSoft: "#ffb4ad",
    glass: "rgba(255,255,255,0.12)",
  },
} as const

export type Brand = typeof brand
