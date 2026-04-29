"use client"

import { ChartCard } from "@/components/chart-card"

type ChartDatum = Record<string, string | number>

interface DashboardChartsProps {
  distribucionCartera: ChartDatum[]
  recaudoData: ChartDatum[]
}

export function DashboardCharts({
  distribucionCartera,
  recaudoData,
}: DashboardChartsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
      <ChartCard
        title="Recaudo vs Meta"
        subtitle="Ultima semana operativa"
        type="area"
        data={recaudoData}
        className="xl:col-span-3"
      />
      <ChartCard
        title="Distribucion de mora"
        subtitle="Segmentacion por dias"
        type="pie"
        data={distribucionCartera}
        className="xl:col-span-2"
      />
    </div>
  )
}
