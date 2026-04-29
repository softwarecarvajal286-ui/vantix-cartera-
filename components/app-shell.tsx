"use client"

import * as React from "react"
import { NotificationToast } from "@/components/notification-toast"
import { AppProvider } from "@/lib/app-context"

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      {children}
      <NotificationToast />
    </AppProvider>
  )
}
