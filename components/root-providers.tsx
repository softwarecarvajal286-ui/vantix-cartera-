"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import { usePathname } from "next/navigation"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/auth-context"

const AppShell = dynamic(
  () => import("@/components/app-shell").then((mod) => mod.AppShell),
  {
    loading: () => <div className="min-h-screen bg-[#05070c]" />,
  }
)

export function RootProviders({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isPublicRoute = pathname === "/login"

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      <AuthProvider>
        {isPublicRoute ? children : <AppShell>{children}</AppShell>}
      </AuthProvider>
    </ThemeProvider>
  )
}
