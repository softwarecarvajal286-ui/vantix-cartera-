"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type ChartType = "area" | "bar" | "pie"

interface ChartCardProps {
  title: string
  subtitle?: string
  type: ChartType
  data: Record<string, string | number>[]
  dataKey?: string
  xAxisKey?: string
  colors?: string[]
  className?: string
  showPeriodSelector?: boolean
}

const defaultColors = ["#FF5D52", "#E2E8F0", "#F59E0B", "#38BDF8", "#94A3B8"]

function CustomTooltip({
  active,
  payload,
  label,
  isDark,
}: {
  active?: boolean
  payload?: Array<{ value: number; name: string; color: string }>
  label?: string
  isDark: boolean
}) {
  if (!active || !payload || payload.length === 0) {
    return null
  }

  return (
    <div
      className={cn(
        "rounded-2xl border p-3 shadow-xl",
        isDark
          ? "border-white/10 bg-[#0d131e] text-white"
          : "border-white/80 bg-white/96 text-slate-900 shadow-slate-200/60"
      )}
    >
      <p className="mb-1 text-sm font-medium">{label}</p>
      {payload.map((entry, index) => (
        <p key={index} className="text-sm" style={{ color: entry.color }}>
          {entry.name}: {typeof entry.value === "number" ? entry.value.toLocaleString() : entry.value}
        </p>
      ))}
    </div>
  )
}

export function ChartCard({
  title,
  subtitle,
  type,
  data,
  dataKey = "value",
  xAxisKey = "name",
  colors = defaultColors,
  className,
  showPeriodSelector = true,
}: ChartCardProps) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme !== "light"
  const chartId = React.useId().replace(/:/g, "")
  const areaGradientId = `area-gradient-${chartId}`
  const barGradientId = `bar-gradient-${chartId}`
  const axisColor = isDark ? "#7F8CA3" : "#64748B"
  const gridColor = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(148, 163, 184, 0.16)"
  const strokeColor = isDark ? "#05070C" : "#F8FAFC"

  const renderChart = () => {
    switch (type) {
      case "area":
        return (
          <ResponsiveContainer width="100%" height={230}>
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={areaGradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors[0]} stopOpacity={0.5} />
                  <stop offset="95%" stopColor={colors[0]} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey={xAxisKey} tick={{ fill: axisColor, fontSize: 12 }} tickLine={false} axisLine={false} />
              <YAxis
                tick={{ fill: axisColor, fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => (value >= 1000000 ? `${(value / 1000000).toFixed(1)}M` : value.toLocaleString())}
              />
              <Tooltip content={<CustomTooltip isDark={isDark} />} />
              <Area
                type="monotone"
                dataKey={dataKey}
                stroke={colors[0]}
                strokeWidth={3}
                fill={`url(#${areaGradientId})`}
                dot={{ fill: colors[0], strokeWidth: 2, r: 4, stroke: strokeColor }}
                activeDot={{ r: 6, fill: colors[0], stroke: strokeColor, strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )

      case "bar":
        return (
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={barGradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={colors[0]} stopOpacity={1} />
                  <stop offset="100%" stopColor={colors[0]} stopOpacity={0.6} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey={xAxisKey} tick={{ fill: axisColor, fontSize: 12 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: axisColor, fontSize: 12 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip isDark={isDark} />} />
              <Bar dataKey={dataKey} fill={`url(#${barGradientId})`} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )

      case "pie":
        return (
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={82}
                paddingAngle={3}
                dataKey={dataKey}
                nameKey={xAxisKey}
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip isDark={isDark} />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => (
                  <span className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-600")}>{value}</span>
                )}
                wrapperStyle={{ paddingTop: "10px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        )
    }
  }

  return (
    <div className={cn("glass-panel rounded-[30px] p-5 sm:p-6", className)}>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <span className="inline-flex rounded-full border border-white/12 bg-white/8 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400 dark:text-white/46">
            analytics
          </span>
          <h3 className="mt-3 text-lg font-semibold text-slate-950 dark:text-white">{title}</h3>
          {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
        </div>
        {showPeriodSelector && type === "area" && (
          <Select defaultValue="semana">
            <SelectTrigger className="h-10 w-[148px] rounded-2xl border-slate-200/72 bg-[rgba(232,238,245,0.82)] text-xs text-slate-700 shadow-[0_12px_28px_rgba(148,163,184,0.08)] dark:border-white/14 dark:bg-white/[0.08] dark:text-slate-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-white/70 bg-[rgba(246,248,252,0.94)] dark:border-white/14 dark:bg-[#111827]/94">
              <SelectItem value="semana" className="text-xs text-slate-700 dark:text-white">Ultima semana</SelectItem>
              <SelectItem value="mes" className="text-xs text-slate-700 dark:text-white">Ultimo mes</SelectItem>
              <SelectItem value="trimestre" className="text-xs text-slate-700 dark:text-white">Trimestre</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>
      {renderChart()}
    </div>
  )
}
