"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { brand } from "@/lib/brand"

type BrandMarkSize = "sm" | "md" | "lg"

const sizeStyles: Record<BrandMarkSize, { shell: string; text: string; dot: string }> = {
  sm: {
    shell: "h-10 w-10 rounded-2xl",
    text: "text-sm",
    dot: "h-2.5 w-2.5",
  },
  md: {
    shell: "h-12 w-12 rounded-[20px]",
    text: "text-base",
    dot: "h-3 w-3",
  },
  lg: {
    shell: "h-14 w-14 rounded-[22px]",
    text: "text-lg",
    dot: "h-3.5 w-3.5",
  },
}

export function BrandMark({
  size = "md",
  className,
}: {
  size?: BrandMarkSize
  className?: string
}) {
  const styles = sizeStyles[size]

  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden border border-white/14 bg-[linear-gradient(145deg,#0a111d,#05070c_55%,#151d2a)] text-white shadow-[0_16px_34px_rgba(5,7,12,0.34)]",
        styles.shell,
        className
      )}
    >
      <div className="absolute inset-[1px] rounded-[inherit] border border-white/8" />
      <div className="absolute inset-x-0 bottom-0 h-[52%] bg-[radial-gradient(circle_at_bottom,rgba(255,93,82,0.52),transparent_70%)]" />
      <span className={cn("relative z-10 font-semibold uppercase tracking-[0.12em]", styles.text)}>
        {brand.shortName}
      </span>
      <span
        className={cn(
          "absolute right-1.5 top-1.5 rounded-full border border-white/30 bg-[#ff5d52]",
          styles.dot
        )}
      />
    </div>
  )
}

export function BrandLockup({
  className,
  size = "md",
  showSlogan = false,
  inverted = false,
}: {
  className?: string
  size?: BrandMarkSize
  showSlogan?: boolean
  inverted?: boolean
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <BrandMark size={size} />
      <div className="min-w-0">
        <p
          className={cn(
            "truncate text-sm font-semibold tracking-tight",
            inverted ? "text-white" : "text-slate-900"
          )}
        >
          {brand.name}
        </p>
        {showSlogan && (
          <p
            className={cn(
              "truncate text-xs",
              inverted ? "text-white/60" : "text-slate-500"
            )}
          >
            {brand.slogan}
          </p>
        )}
      </div>
    </div>
  )
}
