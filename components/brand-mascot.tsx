"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export function BrandMascot({
  className,
  mode = "default",
}: {
  className?: string
  mode?: "default" | "ghost"
}) {
  const isGhost = mode === "ghost"

  return (
    <div
      className={cn(
        "relative aspect-square overflow-hidden rounded-[32px]",
        isGhost
          ? "bg-transparent"
          : "border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] shadow-[0_24px_50px_rgba(5,7,12,0.24)] backdrop-blur-xl",
        className
      )}
    >
      <svg
        viewBox="0 0 320 320"
        className="h-full w-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="vanta-body" x1="40" y1="36" x2="256" y2="274" gradientUnits="userSpaceOnUse">
            <stop stopColor={isGhost ? "rgba(255,255,255,0.22)" : "#131a28"} />
            <stop offset="0.42" stopColor={isGhost ? "rgba(255,93,82,0.2)" : "#0A111D"} />
            <stop offset="1" stopColor={isGhost ? "rgba(255,255,255,0.1)" : "#05070C"} />
          </linearGradient>
          <radialGradient id="vanta-glow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(200 114) rotate(124.581) scale(160.153 149.93)">
            <stop stopColor={isGhost ? "rgba(255,93,82,0.28)" : "#FF5D52"} />
            <stop offset="1" stopColor={isGhost ? "rgba(255,93,82,0)" : "rgba(255,93,82,0)"} />
          </radialGradient>
          <linearGradient id="vanta-accent" x1="98" y1="26" x2="195" y2="140" gradientUnits="userSpaceOnUse">
            <stop stopColor={isGhost ? "rgba(255,255,255,0.6)" : "#FFB4AD"} />
            <stop offset="1" stopColor={isGhost ? "rgba(255,93,82,0.35)" : "#FF5D52"} />
          </linearGradient>
        </defs>

        <circle cx="192" cy="154" r="128" fill="url(#vanta-glow)" />
        <path
          d="M92 84L132 32L176 92L146 112L92 84Z"
          fill="url(#vanta-accent)"
          fillOpacity={isGhost ? 0.5 : 1}
        />
        <path
          d="M166 88L218 40L240 110L202 122L166 88Z"
          fill="url(#vanta-accent)"
          fillOpacity={isGhost ? 0.38 : 0.92}
        />
        <path
          d="M87 93C107 63 142 48 177 50C229 54 270 95 270 146C270 215 213 270 141 270C90 270 51 240 42 194C35 158 47 126 72 107L87 93Z"
          fill="url(#vanta-body)"
          stroke={isGhost ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.08)"}
          strokeWidth="2"
        />
        <path
          d="M104 185C118 200 146 211 175 208C191 206 209 201 221 193"
          stroke={isGhost ? "rgba(255,255,255,0.4)" : "#E8EDF8"}
          strokeWidth="12"
          strokeLinecap="round"
          opacity={isGhost ? 0.3 : 0.92}
        />
        <path
          d="M220 193C233 186 246 176 255 162C264 148 266 131 262 116"
          stroke={isGhost ? "rgba(255,255,255,0.18)" : "#0A111D"}
          strokeWidth="14"
          strokeLinecap="round"
          opacity={isGhost ? 0.7 : 1}
        />
        <path
          d="M112 118C128 107 151 101 172 103C200 106 225 119 241 138"
          stroke={isGhost ? "rgba(255,255,255,0.24)" : "#FFB4AD"}
          strokeWidth="9"
          strokeLinecap="round"
          opacity={isGhost ? 0.5 : 0.94}
        />
        <circle cx="198" cy="138" r="9" fill={isGhost ? "rgba(255,255,255,0.75)" : "#F8FAFC"} />
        <circle cx="198" cy="138" r="3.5" fill={isGhost ? "rgba(255,93,82,0.8)" : "#FF5D52"} />
        <path
          d="M228 214C221 235 206 255 184 268"
          stroke={isGhost ? "rgba(255,255,255,0.22)" : "#FF5D52"}
          strokeWidth="10"
          strokeLinecap="round"
          opacity={isGhost ? 0.45 : 0.74}
        />
      </svg>
    </div>
  )
}
