"use client"

import * as React from "react"
import { LucideIcon, MoreVertical, TrendingDown, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface KpiCardProps {
  title: string
  value: string | number
  change?: number
  changeLabel?: string
  icon: LucideIcon
  variant?:
    | "default"
    | "primary"
    | "secondary"
    | "accent"
    | "success"
    | "warning"
    | "info"
    | "danger"
    | "teal"
    | "pink"
    | "green"
    | "amber"
    | "purple"
  size?: "default" | "large"
  showMenu?: boolean
  onClick?: () => void
}

const variantStyles = {
  default: {
    chip: "from-slate-300/68 to-white/55 dark:from-slate-700/62 dark:to-slate-800/55",
    icon: "text-slate-700 dark:text-slate-200",
    glow: "bg-slate-400/12 dark:bg-slate-200/6",
    line: "from-slate-300/72 to-slate-500/10 dark:from-slate-200/22 dark:to-transparent",
  },
  primary: {
    chip: "from-[#ffddd9] to-white dark:from-[#3a1411] dark:to-[#140d0c]",
    icon: "text-[#ff5d52]",
    glow: "bg-[#ff5d52]/14",
    line: "from-[#ff5d52] to-[#ffb7b1]/15",
  },
  secondary: {
    chip: "from-slate-300/68 to-white/55 dark:from-slate-700/62 dark:to-slate-800/55",
    icon: "text-slate-700 dark:text-slate-200",
    glow: "bg-slate-400/12 dark:bg-slate-200/6",
    line: "from-slate-300/72 to-slate-500/10 dark:from-slate-200/22 dark:to-transparent",
  },
  accent: {
    chip: "from-sky-200/70 to-white dark:from-sky-500/16 dark:to-[#10151f]",
    icon: "text-sky-600 dark:text-sky-300",
    glow: "bg-sky-500/12",
    line: "from-sky-400 to-sky-200/10",
  },
  success: {
    chip: "from-emerald-200/70 to-white dark:from-emerald-500/16 dark:to-[#10151f]",
    icon: "text-emerald-600 dark:text-emerald-300",
    glow: "bg-emerald-500/12",
    line: "from-emerald-400 to-emerald-200/10",
  },
  warning: {
    chip: "from-amber-200/78 to-white dark:from-amber-500/16 dark:to-[#10151f]",
    icon: "text-amber-600 dark:text-amber-300",
    glow: "bg-amber-500/12",
    line: "from-amber-400 to-amber-200/10",
  },
  info: {
    chip: "from-sky-200/70 to-white dark:from-sky-500/16 dark:to-[#10151f]",
    icon: "text-sky-600 dark:text-sky-300",
    glow: "bg-sky-500/12",
    line: "from-sky-400 to-sky-200/10",
  },
  danger: {
    chip: "from-[#ffd9d5] to-white dark:from-[#3a1411] dark:to-[#140d0c]",
    icon: "text-[#ff5d52]",
    glow: "bg-[#ff5d52]/14",
    line: "from-[#ff5d52] to-[#ffb7b1]/15",
  },
  teal: {
    chip: "from-[#d7f4f1] to-white dark:from-teal-500/16 dark:to-[#10151f]",
    icon: "text-teal-600 dark:text-teal-300",
    glow: "bg-teal-500/12",
    line: "from-teal-400 to-teal-200/10",
  },
  pink: {
    chip: "from-[#ffe0ed] to-white dark:from-pink-500/16 dark:to-[#10151f]",
    icon: "text-pink-600 dark:text-pink-300",
    glow: "bg-pink-500/12",
    line: "from-pink-400 to-pink-200/10",
  },
  green: {
    chip: "from-emerald-200/70 to-white dark:from-emerald-500/16 dark:to-[#10151f]",
    icon: "text-emerald-600 dark:text-emerald-300",
    glow: "bg-emerald-500/12",
    line: "from-emerald-400 to-emerald-200/10",
  },
  amber: {
    chip: "from-amber-200/78 to-white dark:from-amber-500/16 dark:to-[#10151f]",
    icon: "text-amber-600 dark:text-amber-300",
    glow: "bg-amber-500/12",
    line: "from-amber-400 to-amber-200/10",
  },
  purple: {
    chip: "from-violet-200/78 to-white dark:from-violet-500/16 dark:to-[#10151f]",
    icon: "text-violet-600 dark:text-violet-300",
    glow: "bg-violet-500/12",
    line: "from-violet-400 to-violet-200/10",
  },
}

export function KpiCard({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  variant = "default",
  size = "default",
  showMenu = true,
  onClick,
}: KpiCardProps) {
  const styles = variantStyles[variant] || variantStyles.default
  const isPositive = change !== undefined && change >= 0

  return (
    <div
      className={cn(
        "glass-panel group relative overflow-hidden rounded-[28px] border-white/14 transition-[transform,box-shadow,background-color] duration-300",
        onClick && "cursor-pointer hover:-translate-y-1 hover:shadow-[0_26px_52px_rgba(5,7,12,0.2)]",
        size === "large" ? "p-5 sm:p-6" : "p-5"
      )}
      onClick={onClick}
    >
      <div className={cn("absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r", styles.line)} />
      <div className={cn("absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl", styles.glow)} />

      {showMenu && (
        <button className="absolute right-4 top-4 rounded-full border border-transparent p-1.5 opacity-0 transition-all group-hover:opacity-100 hover:border-white/12 hover:bg-white/10">
          <MoreVertical className="h-4 w-4 text-slate-500 dark:text-slate-400" />
        </button>
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={cn(
              "flex shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br",
              size === "large" ? "h-12 w-12" : "h-11 w-11",
              styles.chip
            )}
          >
            <Icon className={cn(size === "large" ? "h-5 w-5" : "h-[18px] w-[18px]", styles.icon)} />
          </div>

          <div className="min-w-0">
            <p
              className={cn(
                "truncate font-medium text-slate-500 dark:text-slate-400",
                size === "large" ? "text-sm" : "text-xs uppercase tracking-[0.14em]"
              )}
            >
              {title}
            </p>
            <span className="mt-1 inline-flex rounded-full border border-white/12 bg-white/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400 dark:text-white/54">
              live
            </span>
          </div>
        </div>
      </div>

      <div className={cn("mt-5", size === "large" && "mt-6")}>
        <p
          className={cn(
            "text-balance font-semibold text-slate-950 dark:text-white",
            size === "large" ? "text-[1.95rem] leading-none sm:text-[2.2rem]" : "text-[1.7rem] leading-none"
          )}
        >
          {value}
        </p>

        {change !== undefined && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <div
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
                isPositive
                  ? "bg-emerald-500/12 text-emerald-500 dark:text-emerald-300"
                  : "bg-[#ff5d52]/12 text-[#ff5d52]"
              )}
            >
              {isPositive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
              <span>{isPositive ? `+${change}%` : `${change}%`}</span>
            </div>
            {changeLabel && <span className="text-xs text-slate-500 dark:text-slate-400">{changeLabel}</span>}
          </div>
        )}
      </div>
    </div>
  )
}
