"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ThemeToggleProps {
  className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const buttonClassName = cn(
    "h-9 w-9 rounded-xl border border-white/45 bg-white/35 text-slate-600 hover:border-[#ffd3ce] hover:bg-white/80 hover:text-slate-900 dark:border-white/10 dark:bg-transparent dark:text-slate-400 dark:hover:border-white/12 dark:hover:bg-white/10 dark:hover:text-white",
    className
  )

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className={buttonClassName}>
        <Sun className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className={buttonClassName}
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      title="Cambiar tema"
    >
      {resolvedTheme === "dark" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
      <span className="sr-only">Cambiar tema</span>
    </Button>
  )
}
