"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { EstadoCuenta } from "@/lib/types"

type StatusVariant =
  | EstadoCuenta
  | "al-dia"
  | "pendiente"
  | "mora"
  | "fpd"
  | "bloqueado"
  | "activo"
  | "inactivo"
  | "vigente"
  | "cumplido"
  | "incumplido"
  | "vencido"
  | "creado"
  | "en-revision"
  | "aprobado"
  | "rechazado"
  | "cargado"
  | "validado"

interface StatusBadgeProps {
  status?: EstadoCuenta
  variant?: StatusVariant
  label?: string
  size?: "sm" | "md" | "lg"
  className?: string
}

const statusConfig: Record<string, { bg: string; text: string; defaultLabel: string }> = {
  // EstadoCuenta types
  "al_dia": { 
    bg: "bg-emerald-500/15 dark:bg-emerald-500/20", 
    text: "text-emerald-600 dark:text-emerald-400", 
    defaultLabel: "Al día" 
  },
  "mora_temprana": { 
    bg: "bg-amber-500/15 dark:bg-amber-500/20", 
    text: "text-amber-600 dark:text-amber-400", 
    defaultLabel: "Mora Temprana" 
  },
  "mora_media": { 
    bg: "bg-orange-500/15 dark:bg-orange-500/20", 
    text: "text-orange-600 dark:text-orange-400", 
    defaultLabel: "Mora Media" 
  },
  "mora_avanzada": { 
    bg: "bg-red-500/15 dark:bg-red-500/20", 
    text: "text-red-500 dark:text-red-400", 
    defaultLabel: "Mora Avanzada" 
  },
  "critico": { 
    bg: "bg-red-600/20 dark:bg-red-600/30", 
    text: "text-red-600 dark:text-red-400", 
    defaultLabel: "Crítico" 
  },
  "castigado": { 
    bg: "bg-red-900/30 dark:bg-red-900/40", 
    text: "text-red-700 dark:text-red-300", 
    defaultLabel: "Castigado" 
  },
  // Legacy variants
  "al-dia": { 
    bg: "bg-emerald-500/15 dark:bg-emerald-500/20", 
    text: "text-emerald-600 dark:text-emerald-400", 
    defaultLabel: "Al día" 
  },
  "pendiente": { 
    bg: "bg-amber-500/15 dark:bg-amber-500/20", 
    text: "text-amber-600 dark:text-amber-400", 
    defaultLabel: "Pendiente" 
  },
  "mora": { 
    bg: "bg-red-500/15 dark:bg-red-500/20", 
    text: "text-red-500", 
    defaultLabel: "En mora" 
  },
  "fpd": { 
    bg: "bg-blue-500/15 dark:bg-blue-500/20", 
    text: "text-blue-600 dark:text-blue-400", 
    defaultLabel: "FPD" 
  },
  "bloqueado": { 
    bg: "bg-red-950/30 dark:bg-red-950/50", 
    text: "text-red-400", 
    defaultLabel: "Bloqueado" 
  },
  "activo": { 
    bg: "bg-emerald-500/15 dark:bg-emerald-500/20", 
    text: "text-emerald-600 dark:text-emerald-400", 
    defaultLabel: "Activo" 
  },
  "inactivo": { 
    bg: "bg-gray-500/15 dark:bg-gray-500/20", 
    text: "text-gray-500", 
    defaultLabel: "Inactivo" 
  },
  "vigente": { 
    bg: "bg-emerald-500/15 dark:bg-emerald-500/20", 
    text: "text-emerald-600 dark:text-emerald-400", 
    defaultLabel: "Vigente" 
  },
  "cumplido": { 
    bg: "bg-emerald-500/15 dark:bg-emerald-500/20", 
    text: "text-emerald-600 dark:text-emerald-400", 
    defaultLabel: "Cumplido" 
  },
  "incumplido": { 
    bg: "bg-red-500/15 dark:bg-red-500/20", 
    text: "text-red-500", 
    defaultLabel: "Incumplido" 
  },
  "vencido": { 
    bg: "bg-red-500/15 dark:bg-red-500/20", 
    text: "text-red-500", 
    defaultLabel: "Vencido" 
  },
  "creado": { 
    bg: "bg-blue-500/15 dark:bg-blue-500/20", 
    text: "text-blue-600 dark:text-blue-400", 
    defaultLabel: "Creado" 
  },
  "en-revision": { 
    bg: "bg-amber-500/15 dark:bg-amber-500/20", 
    text: "text-amber-600 dark:text-amber-400", 
    defaultLabel: "En revisión" 
  },
  "aprobado": { 
    bg: "bg-emerald-500/15 dark:bg-emerald-500/20", 
    text: "text-emerald-600 dark:text-emerald-400", 
    defaultLabel: "Aprobado" 
  },
  "rechazado": { 
    bg: "bg-red-500/15 dark:bg-red-500/20", 
    text: "text-red-500", 
    defaultLabel: "Rechazado" 
  },
  "cargado": { 
    bg: "bg-blue-500/15 dark:bg-blue-500/20", 
    text: "text-blue-600 dark:text-blue-400", 
    defaultLabel: "Cargado" 
  },
  "validado": { 
    bg: "bg-emerald-500/15 dark:bg-emerald-500/20", 
    text: "text-emerald-600 dark:text-emerald-400", 
    defaultLabel: "Validado" 
  },
}

const sizeClasses = {
  sm: "px-2 py-0.5 text-[10px]",
  md: "px-2.5 py-0.5 text-xs",
  lg: "px-3 py-1 text-sm"
}

export function StatusBadge({ status, variant, label, size = "md", className }: StatusBadgeProps) {
  const key = status || variant || "pendiente"
  const config = statusConfig[key] || statusConfig["pendiente"]

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium whitespace-nowrap",
        sizeClasses[size],
        config.bg,
        config.text,
        className
      )}
    >
      {label || config.defaultLabel}
    </span>
  )
}
