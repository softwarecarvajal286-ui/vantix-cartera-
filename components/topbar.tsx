"use client"

import * as React from "react"
import {
  Bell,
  Building2,
  ChevronRight,
  Download,
  Plus,
  Search,
  Upload,
  User,
} from "lucide-react"

import { useAuth } from "@/lib/auth-context"
import { brand } from "@/lib/brand"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface TopbarProps {
  title: string
  breadcrumbs?: { label: string; href?: string }[]
  showSearch?: boolean
  showImport?: boolean
  showExport?: boolean
  showCreate?: boolean
  createLabel?: string
  onCreateClick?: () => void
}

const notifications = [
  { id: 1, title: "Cuenta en mora critica", description: "Maria Lopez · 45 dias", type: "critical" },
  { id: 2, title: "Acuerdo por vencer", description: "Juan Perez · manana", type: "warning" },
  { id: 3, title: "Pago registrado", description: "Carlos Ruiz · $500.000", type: "success" },
  { id: 4, title: "Documentacion pendiente", description: "Ana Garcia · 3 archivos", type: "info" },
] as const

export function Topbar({
  title,
  breadcrumbs = [],
  showSearch = true,
  showImport = true,
  showExport = true,
  showCreate = true,
  createLabel = "Nueva gestion",
  onCreateClick,
}: TopbarProps) {
  const {
    user,
    selectedFinanciera,
    selectedFinancieraId,
    setSelectedFinancieraId,
    getVisibleFinancieras,
  } = useAuth()

  const financieras = getVisibleFinancieras()
  const canSwitchFinanciera = user?.role === "Admin"

  return (
    <header className="sticky top-3 z-30 mb-5 sm:top-4 sm:mb-6">
      <div className="glass-panel rounded-[28px] px-4 py-4 sm:px-5 sm:py-5">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                {breadcrumbs.map((crumb, index) => (
                  <React.Fragment key={`${crumb.label}-${index}`}>
                    {index > 0 && <ChevronRight className="h-3 w-3 text-slate-400 dark:text-slate-500" />}
                    <span
                      className={cn(
                        "truncate",
                        index === breadcrumbs.length - 1
                          ? "font-semibold text-[#ff5d52]"
                          : "text-slate-500 dark:text-slate-400"
                      )}
                    >
                      {crumb.label}
                    </span>
                  </React.Fragment>
                ))}
              </div>

              <div className="mt-2 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <div className="min-w-0">
                  <h1 className="text-balance text-2xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-[32px]">
                    {title}
                  </h1>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                    {brand.slogan}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 xl:justify-end">
              <div className="min-w-[200px] flex-1 sm:flex-none">
                <Select
                  value={selectedFinancieraId}
                  onValueChange={setSelectedFinancieraId}
                  disabled={!canSwitchFinanciera}
                >
                  <SelectTrigger className="h-10 rounded-2xl border-slate-200/72 bg-[rgba(232,238,245,0.82)] px-3 text-sm text-slate-700 shadow-[0_12px_28px_rgba(148,163,184,0.08)] dark:border-white/14 dark:bg-white/[0.08] dark:text-slate-100">
                    <div className="flex min-w-0 items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: selectedFinanciera?.color ?? "#ff5d52" }}
                      />
                      <Building2 className="h-4 w-4 shrink-0 text-slate-500 dark:text-slate-400" />
                      <SelectValue placeholder={canSwitchFinanciera ? "Seleccionar financiera" : "Financiera asignada"} />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-white/75 bg-[rgba(246,248,252,0.94)] dark:border-white/14 dark:bg-[#111827]/94">
                    {financieras.map((financiera) => (
                      <SelectItem key={financiera.id} value={financiera.id}>
                        {financiera.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {showImport && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 rounded-2xl border-slate-200/72 bg-[rgba(232,238,245,0.82)] px-3 text-slate-700 shadow-[0_12px_28px_rgba(148,163,184,0.08)] hover:bg-[rgba(239,243,248,0.94)] hover:text-slate-900 dark:border-white/14 dark:bg-white/[0.08] dark:text-slate-100 dark:hover:bg-white/[0.12]"
                >
                  <Upload className="h-4 w-4" />
                  <span className="hidden sm:inline">Importar</span>
                </Button>
              )}

              {showExport && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 rounded-2xl border-slate-200/72 bg-[rgba(232,238,245,0.82)] px-3 text-slate-700 shadow-[0_12px_28px_rgba(148,163,184,0.08)] hover:bg-[rgba(239,243,248,0.94)] hover:text-slate-900 dark:border-white/14 dark:bg-white/[0.08] dark:text-slate-100 dark:hover:bg-white/[0.12]"
                >
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Exportar</span>
                </Button>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative h-10 w-10 rounded-2xl border border-slate-200/72 bg-[rgba(232,238,245,0.82)] text-slate-700 shadow-[0_12px_28px_rgba(148,163,184,0.08)] hover:bg-[rgba(239,243,248,0.94)] hover:text-slate-900 dark:border-white/14 dark:bg-white/[0.08] dark:text-slate-100 dark:hover:bg-white/[0.12]"
                  >
                    <Bell className="h-[18px] w-[18px]" />
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#ff5d52] text-[10px] font-semibold text-white">
                      4
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-[min(20rem,calc(100vw-2rem))] rounded-3xl border-white/80 bg-white/92 p-1 shadow-xl shadow-slate-200/60 dark:border-white/10 dark:bg-[#0d131e]/96"
                >
                  <DropdownMenuLabel className="flex items-center justify-between px-3 py-2 text-slate-900 dark:text-white">
                    <span>Notificaciones</span>
                    <Badge className="border-0 bg-[#ff5d52] text-xs text-white">4 nuevas</Badge>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-slate-200 dark:bg-white/8" />
                  {notifications.map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      className="mx-1 my-1 flex cursor-pointer flex-col items-start gap-1 rounded-2xl p-3 text-slate-900 hover:bg-slate-50 dark:text-white dark:hover:bg-white/[0.05]"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "h-2 w-2 rounded-full",
                            notification.type === "critical" && "bg-[#ff5d52]",
                            notification.type === "warning" && "bg-amber-500",
                            notification.type === "success" && "bg-emerald-500",
                            notification.type === "info" && "bg-sky-500"
                          )}
                        />
                        <span className="text-sm font-medium">{notification.title}</span>
                      </div>
                      <span className="ml-4 text-xs text-slate-500 dark:text-slate-400">
                        {notification.description}
                      </span>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator className="bg-slate-200 dark:bg-white/8" />
                  <DropdownMenuItem className="mx-1 my-1 justify-center rounded-2xl text-[#ff5d52] hover:bg-slate-50 dark:hover:bg-white/[0.05]">
                    Ver todas las notificaciones
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-2xl border border-slate-200/72 bg-[rgba(232,238,245,0.82)] text-slate-700 shadow-[0_12px_28px_rgba(148,163,184,0.08)] hover:bg-[rgba(239,243,248,0.94)] hover:text-slate-900 dark:border-white/14 dark:bg-white/[0.08] dark:text-slate-100 dark:hover:bg-white/[0.12]"
              >
                <User className="h-[18px] w-[18px]" />
              </Button>

              {showCreate && (
                <Button
                  onClick={onCreateClick}
                  className="h-10 rounded-2xl border border-[#ff8179] bg-[linear-gradient(135deg,#ff5d52,#ff7b57)] px-4 text-white shadow-[0_18px_34px_rgba(255,93,82,0.24)] hover:brightness-105"
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">{createLabel}</span>
                </Button>
              )}
            </div>
          </div>

          {showSearch && (
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full lg:max-w-[420px]">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 dark:text-slate-400" />
                <Input
                  placeholder="Buscar cliente, documento o cuenta..."
                  className="h-12 rounded-2xl border-slate-200/72 bg-[rgba(232,238,245,0.82)] pl-11 text-slate-700 placeholder:text-slate-400 shadow-[0_14px_32px_rgba(148,163,184,0.08)] focus-visible:border-[#ffb7b1] focus-visible:ring-[#ffd0cc]/60 dark:border-white/14 dark:bg-white/[0.08] dark:text-white dark:placeholder:text-slate-400 dark:focus-visible:border-[#ff5d52]/50 dark:focus-visible:ring-[#ff5d52]/20"
                />
              </div>
              <div className="hidden text-xs uppercase tracking-[0.18em] text-slate-400 lg:block">
                {selectedFinanciera?.nombre ?? "Contexto financiero"} · {brand.name}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
