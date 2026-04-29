"use client"

import * as React from "react"
import Image from "next/image"
import { useTheme } from "next-themes"
import { AppSidebar } from "@/components/app-sidebar"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme !== "light"

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="fixed inset-0 -z-10">
        {isDark ? (
          <>
            <div className="absolute inset-0 bg-[#0a0f18]" />
            <div className="absolute inset-y-0 left-0 w-full lg:w-[46%]">
              <Image
                src="/images/dashboard-bg.jpg"
                alt=""
                fill
                className="object-cover object-center opacity-78"
                quality={75}
                sizes="(max-width: 1024px) 100vw, 46vw"
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,15,24,0.06),rgba(10,15,24,0.48)_72%,#0a0f18)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.1),transparent_20%),radial-gradient(circle_at_top_left,rgba(255,93,82,0.1),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(96,165,250,0.1),transparent_18%)]" />
            </div>
            <div className="absolute right-[-10%] top-[10%] h-[28rem] w-[28rem] rounded-full bg-[#ff5d52]/12 blur-3xl" />
            <div className="absolute left-[18%] bottom-[-12%] h-[24rem] w-[24rem] rounded-full bg-[#334155]/48 blur-3xl" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),transparent_18%,rgba(10,15,24,0.3)_100%)]" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-[#edf1f6]" />
            <Image
              src="/images/dashboard-bg-light.jpg"
              alt=""
              fill
              className="object-cover object-center opacity-78 blur-[1px]"
              quality={75}
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.9),transparent_28%),radial-gradient(circle_at_top_right,rgba(255,93,82,0.1),transparent_20%),radial-gradient(circle_at_bottom_left,rgba(203,213,225,0.42),transparent_26%),linear-gradient(180deg,rgba(255,255,255,0.26),rgba(237,241,246,0.5))]" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.12),rgba(237,241,246,0.34))]" />
            <div className="absolute right-[-10%] top-[12%] h-[22rem] w-[22rem] rounded-full bg-[#ffd5cf]/30 blur-3xl" />
            <div className="absolute left-[-8%] bottom-[-8%] h-[18rem] w-[18rem] rounded-full bg-[#cbd5e1]/28 blur-3xl" />
          </>
        )}
      </div>

      <AppSidebar />
      <main className="min-h-screen px-3 pb-24 pt-4 sm:ml-[104px] sm:px-4 sm:pt-5 md:px-5 lg:ml-[120px] lg:px-6 lg:pb-8 lg:pt-6 xl:px-8">
        {children}
      </main>
    </div>
  )
}
