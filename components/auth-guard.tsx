"use client"

import * as React from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Loader2 } from "lucide-react"
import { BrandMark } from "@/components/brand-mark"
import { brand } from "@/lib/brand"

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated && pathname !== "/login") {
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, pathname, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <BrandMark size="lg" />
          <Loader2 className="h-8 w-8 animate-spin text-[#ff5d52]" />
          <div className="text-center">
            <p className="font-medium text-foreground">{brand.name}</p>
            <p className="text-sm text-muted-foreground">Cargando...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated && pathname !== "/login") {
    return null
  }

  return <>{children}</>
}
