"use client"

import { useMemo, useState } from "react"
import { addDays, addMonths, format, isWeekend } from "date-fns"
import { es } from "date-fns/locale"
import {
  CalendarClock,
  CalendarDays,
  CalendarRange,
  CircleDashed,
  Clock3,
  Coins,
  Sparkles,
} from "lucide-react"

import { AuthGuard } from "@/components/auth-guard"
import { AppLayout } from "@/components/app-layout"
import { Topbar } from "@/components/topbar"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

type PaymentFrequency = "semanal" | "catorcenal" | "quincenal" | "mensual" | "bimestral"

const frequencyOptions: Array<{
  value: PaymentFrequency
  label: string
  shortLabel: string
  description: string
}> = [
  {
    value: "semanal",
    label: "Semanal",
    shortLabel: "7 dias",
    description: "Genera una fecha cada 7 dias calendario.",
  },
  {
    value: "catorcenal",
    label: "Catorcenal",
    shortLabel: "14 dias",
    description: "Genera una fecha cada 14 dias calendario.",
  },
  {
    value: "quincenal",
    label: "Quincenal",
    shortLabel: "15 dias",
    description: "Genera una fecha cada 15 dias calendario.",
  },
  {
    value: "mensual",
    label: "Mensual",
    shortLabel: "1 mes",
    description: "Genera una fecha mensual conservando el dia base cuando sea posible.",
  },
  {
    value: "bimestral",
    label: "Bimestral",
    shortLabel: "2 meses",
    description: "Genera una fecha cada dos meses calendario.",
  },
] as const

function getFrequencyMeta(frequency: PaymentFrequency) {
  return frequencyOptions.find((item) => item.value === frequency) ?? frequencyOptions[0]
}

function buildSchedule(startDate: string, frequency: PaymentFrequency, count = 10) {
  if (!startDate) return []

  const baseDate = new Date(`${startDate}T00:00:00`)
  if (Number.isNaN(baseDate.getTime())) return []

  return Array.from({ length: count }, (_, index) => {
    let date = baseDate

    switch (frequency) {
      case "semanal":
        date = addDays(baseDate, index * 7)
        break
      case "catorcenal":
        date = addDays(baseDate, index * 14)
        break
      case "quincenal":
        date = addDays(baseDate, index * 15)
        break
      case "mensual":
        date = addMonths(baseDate, index)
        break
      case "bimestral":
        date = addMonths(baseDate, index * 2)
        break
    }

    return {
      installment: index + 1,
      date,
      iso: format(date, "yyyy-MM-dd"),
      weekday: format(date, "EEEE", { locale: es }),
      longLabel: format(date, "d 'de' MMMM 'de' yyyy", { locale: es }),
      compactLabel: format(date, "dd MMM yyyy", { locale: es }),
      weekend: isWeekend(date),
    }
  })
}

function capitalizeWords(value: string) {
  return value.replace(/\b\w/g, (letter) => letter.toUpperCase())
}

export default function SimuladorCuotasPage() {
  const [startDate, setStartDate] = useState(() => format(new Date(), "yyyy-MM-dd"))
  const [frequency, setFrequency] = useState<PaymentFrequency>("quincenal")

  const schedule = useMemo(() => buildSchedule(startDate, frequency, 10), [frequency, startDate])
  const frequencyMeta = getFrequencyMeta(frequency)

  const summary = useMemo(() => {
    if (schedule.length === 0) {
      return {
        firstDate: "--",
        lastDate: "--",
        weekends: 0,
        spanLabel: "--",
      }
    }

    const firstDate = schedule[0]
    const lastDate = schedule[schedule.length - 1]
    const weekends = schedule.filter((item) => item.weekend).length
    const spanLabel = `${firstDate.compactLabel} - ${lastDate.compactLabel}`

    return {
      firstDate: capitalizeWords(`${firstDate.weekday} ${firstDate.compactLabel}`),
      lastDate: capitalizeWords(`${lastDate.weekday} ${lastDate.compactLabel}`),
      weekends,
      spanLabel,
    }
  }, [schedule])

  return (
    <AuthGuard>
      <AppLayout>
        <Topbar
          title="Simulador de Cuotas"
          breadcrumbs={[
            { label: "Inicio" },
            { label: "Herramientas" },
            { label: "Simulador de Cuotas" },
          ]}
          showCreate={false}
        />

        <div className="space-y-5">
          <section className="glass-panel relative overflow-hidden rounded-[34px] p-5 sm:p-6 xl:p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_18%),radial-gradient(circle_at_bottom_right,rgba(255,93,82,0.08),transparent_20%)]" />
            <div className="relative z-10 grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
              <div className="space-y-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-white/56">
                    <Sparkles className="h-3.5 w-3.5 text-[#ff5d52]" />
                    Herramienta operativa
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-white/56">
                    <CalendarRange className="h-3.5 w-3.5 text-emerald-500" />
                    10 fechas automaticas
                  </span>
                </div>

                <div>
                  <h2 className="text-balance text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                    Calcula rapidamente el calendario de pago de tu cliente.
                  </h2>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-400">
                    Selecciona la fecha inicial y la periodicidad del pago. El simulador te
                    mostrara las siguientes 10 fechas del plan segun calendario, ideal para
                    acuerdos, simulaciones y seguimiento comercial.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <SummaryTile
                    icon={CalendarClock}
                    label="Primera cuota"
                    value={summary.firstDate}
                    detail="Inicio del plan"
                  />
                  <SummaryTile
                    icon={Clock3}
                    label="Decima cuota"
                    value={summary.lastDate}
                    detail="Cierre del tramo"
                  />
                  <SummaryTile
                    icon={CircleDashed}
                    label="Frecuencia"
                    value={frequencyMeta.label}
                    detail={frequencyMeta.shortLabel}
                  />
                </div>
              </div>

              <div className="glass-card rounded-[30px] p-5 sm:p-6">
                <div className="flex items-center gap-2">
                  <span className="rounded-full border border-white/12 bg-white/12 p-2 text-[#ff5d52]">
                    <Coins className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-950 dark:text-white">
                      Calculadora de calendario
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Configura fecha base y rango de pago
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                      Fecha inicial
                    </Label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(event) => setStartDate(event.target.value)}
                      className="h-12 w-full rounded-2xl border border-slate-200/72 bg-[rgba(232,238,245,0.82)] px-4 text-sm text-slate-700 shadow-[0_12px_28px_rgba(148,163,184,0.08)] outline-none transition focus:border-[#ffb7b1] focus:ring-2 focus:ring-[#ffd0cc]/60 dark:border-white/14 dark:bg-white/[0.08] dark:text-white dark:focus:border-[#ff5d52]/50 dark:focus:ring-[#ff5d52]/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                      Rango de pago
                    </Label>
                    <Select
                      value={frequency}
                      onValueChange={(value) => setFrequency(value as PaymentFrequency)}
                    >
                      <SelectTrigger className="h-12 rounded-2xl border-slate-200/72 bg-[rgba(232,238,245,0.82)] text-sm text-slate-700 shadow-[0_12px_28px_rgba(148,163,184,0.08)] dark:border-white/14 dark:bg-white/[0.08] dark:text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-white/75 bg-[rgba(246,248,252,0.94)] dark:border-white/14 dark:bg-[#111827]/94">
                        {frequencyOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="mirror-tile-soft rounded-[22px] p-4">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {frequencyMeta.label}
                    </p>
                    <p className="mt-2 text-xs leading-6 text-slate-500 dark:text-slate-400">
                      {frequencyMeta.description}
                    </p>
                    <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                      Rango mostrado: {summary.spanLabel}
                    </p>
                  </div>

                  <Button className="h-11 w-full rounded-2xl border border-[#ff7b71] bg-[linear-gradient(135deg,#ff5d52,#ff7d57)] text-white shadow-[0_18px_34px_rgba(255,95,82,0.24)] hover:brightness-105">
                    Calendario generado automaticamente
                  </Button>
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div className="glass-panel rounded-[34px] p-5 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-slate-950 dark:text-white">
                    Calendario proyectado
                  </h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Las siguientes 10 fechas quedan listas para compartir o usar en tu acuerdo.
                  </p>
                </div>
                <div className="inline-flex rounded-full border border-white/14 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-white/56">
                  {schedule.length} cuotas visibles
                </div>
              </div>

              <div className="mt-5 overflow-hidden rounded-[26px] border border-white/12">
                <div className="grid grid-cols-[84px_minmax(0,1fr)_140px_130px] border-b border-white/10 bg-white/8 px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-white/52">
                  <span>Cuota</span>
                  <span>Fecha</span>
                  <span>Dia</span>
                  <span>Estado</span>
                </div>

                <div className="divide-y divide-white/8">
                  {schedule.map((item) => (
                    <div
                      key={`${item.installment}-${item.iso}`}
                      className="grid grid-cols-[84px_minmax(0,1fr)_140px_130px] items-center gap-3 px-4 py-4 text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <span className="flex h-9 w-9 items-center justify-center rounded-2xl border border-white/12 bg-white/10 font-semibold text-slate-950 dark:text-white">
                          {item.installment}
                        </span>
                      </div>

                      <div className="min-w-0">
                        <p className="font-medium text-slate-950 dark:text-white">
                          {capitalizeWords(item.longLabel)}
                        </p>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          Base calendario: {item.iso}
                        </p>
                      </div>

                      <div className="text-slate-600 dark:text-slate-300">
                        {capitalizeWords(item.weekday)}
                      </div>

                      <div>
                        <span
                          className={cn(
                            "inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em]",
                            item.weekend
                              ? "bg-amber-500/12 text-amber-600 dark:text-amber-300"
                              : "bg-emerald-500/12 text-emerald-600 dark:text-emerald-300"
                          )}
                        >
                          {item.weekend ? "fin de semana" : "habil"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <aside className="space-y-5">
              <div className="glass-panel rounded-[30px] p-5">
                <div className="flex items-center gap-2">
                  <div className="rounded-full border border-white/12 bg-white/8 p-2 text-[#ff5d52]">
                    <CalendarDays className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-950 dark:text-white">
                      Lectura rapida
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Vista resumida del plan
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  <QuickInfoRow
                    title="Fecha base"
                    value={schedule[0] ? capitalizeWords(schedule[0].compactLabel) : "--"}
                  />
                  <QuickInfoRow
                    title="Periodicidad"
                    value={frequencyMeta.label}
                  />
                  <QuickInfoRow
                    title="Cuotas fin de semana"
                    value={summary.weekends.toString()}
                  />
                  <QuickInfoRow
                    title="Ultima fecha"
                    value={schedule[9] ? capitalizeWords(schedule[9].compactLabel) : "--"}
                  />
                </div>
              </div>

              <div className="mirror-tile rounded-[30px] p-5">
                <p className="text-sm font-semibold text-slate-950 dark:text-white">
                  Nota operativa
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
                  Este simulador proyecta las fechas segun calendario. Si tu operacion mueve pagos
                  por festivos o fines de semana, puedes usar esta base como primera referencia y
                  luego ajustar el acuerdo final.
                </p>
              </div>
            </aside>
          </section>
        </div>
      </AppLayout>
    </AuthGuard>
  )
}

function SummaryTile({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: React.ElementType
  label: string
  value: string
  detail: string
}) {
  return (
    <div className="mirror-tile rounded-[24px] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            {label}
          </p>
          <p className="mt-3 text-sm font-semibold text-slate-950 dark:text-white">{value}</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{detail}</p>
        </div>
        <span className="rounded-2xl border border-white/12 bg-white/12 p-2.5 text-[#ff5d52]">
          <Icon className="h-4 w-4" />
        </span>
      </div>
    </div>
  )
}

function QuickInfoRow({ title, value }: { title: string; value: string }) {
  return (
    <div className="mirror-tile-soft rounded-[22px] p-3.5">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">{title}</p>
      <p className="mt-2 text-sm font-medium text-slate-950 dark:text-white">{value}</p>
    </div>
  )
}
