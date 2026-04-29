"use client"

import { useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { Topbar } from "@/components/topbar"
import { AuthGuard } from "@/components/auth-guard"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  History,
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  Percent,
  Download,
  Filter,
  BarChart3,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface HistoricoPorcentaje {
  id: string
  periodo: string
  financiera: string
  tasaRecuperacion: number
  variacionRecuperacion: number
  carteraMora: number
  variacionMora: number
  contactabilidad: number
  variacionContactabilidad: number
  cumplimientoAcuerdos: number
  variacionAcuerdos: number
}

const historico: HistoricoPorcentaje[] = [
  {
    id: "HIS-001",
    periodo: "Marzo 2024",
    financiera: "Krediya",
    tasaRecuperacion: 78.5,
    variacionRecuperacion: 3.2,
    carteraMora: 18.5,
    variacionMora: -2.3,
    contactabilidad: 65.2,
    variacionContactabilidad: 0.5,
    cumplimientoAcuerdos: 72.8,
    variacionAcuerdos: 4.1
  },
  {
    id: "HIS-002",
    periodo: "Febrero 2024",
    financiera: "Krediya",
    tasaRecuperacion: 75.3,
    variacionRecuperacion: 2.1,
    carteraMora: 20.8,
    variacionMora: -1.5,
    contactabilidad: 64.7,
    variacionContactabilidad: 1.2,
    cumplimientoAcuerdos: 68.7,
    variacionAcuerdos: 2.3
  },
  {
    id: "HIS-003",
    periodo: "Enero 2024",
    financiera: "Krediya",
    tasaRecuperacion: 73.2,
    variacionRecuperacion: -1.5,
    carteraMora: 22.3,
    variacionMora: 3.2,
    contactabilidad: 63.5,
    variacionContactabilidad: -0.8,
    cumplimientoAcuerdos: 66.4,
    variacionAcuerdos: -1.2
  },
  {
    id: "HIS-004",
    periodo: "Diciembre 2023",
    financiera: "Krediya",
    tasaRecuperacion: 74.7,
    variacionRecuperacion: 4.5,
    carteraMora: 19.1,
    variacionMora: -4.1,
    contactabilidad: 64.3,
    variacionContactabilidad: 2.1,
    cumplimientoAcuerdos: 67.6,
    variacionAcuerdos: 3.5
  },
  {
    id: "HIS-005",
    periodo: "Noviembre 2023",
    financiera: "Krediya",
    tasaRecuperacion: 70.2,
    variacionRecuperacion: 1.8,
    carteraMora: 23.2,
    variacionMora: 1.5,
    contactabilidad: 62.2,
    variacionContactabilidad: -1.3,
    cumplimientoAcuerdos: 64.1,
    variacionAcuerdos: -0.5
  },
  {
    id: "HIS-006",
    periodo: "Octubre 2023",
    financiera: "Krediya",
    tasaRecuperacion: 68.4,
    variacionRecuperacion: -2.1,
    carteraMora: 21.7,
    variacionMora: 2.8,
    contactabilidad: 63.5,
    variacionContactabilidad: 0.9,
    cumplimientoAcuerdos: 64.6,
    variacionAcuerdos: 1.2
  },
]

const financieras = ["Krediya", "PayJoy", "ALO", "Distribuciones"]

export default function HistoricoPage() {
  const [filtroFinanciera, setFiltroFinanciera] = useState("Krediya")
  const [filtroPeriodo, setFiltroPeriodo] = useState("todos")

  const historicoFiltrado = historico.filter(h => {
    const matchFinanciera = h.financiera === filtroFinanciera
    return matchFinanciera
  })

  // Calculate averages
  const promedioRecuperacion = historicoFiltrado.reduce((acc, h) => acc + h.tasaRecuperacion, 0) / historicoFiltrado.length
  const promedioMora = historicoFiltrado.reduce((acc, h) => acc + h.carteraMora, 0) / historicoFiltrado.length
  const promedioContactabilidad = historicoFiltrado.reduce((acc, h) => acc + h.contactabilidad, 0) / historicoFiltrado.length
  const promedioCumplimiento = historicoFiltrado.reduce((acc, h) => acc + h.cumplimientoAcuerdos, 0) / historicoFiltrado.length

  // Latest vs first comparison
  const tendenciaGeneral = historicoFiltrado[0]?.tasaRecuperacion > historicoFiltrado[historicoFiltrado.length - 1]?.tasaRecuperacion

  return (
    <AuthGuard>
      <AppLayout>
        <Topbar
          title="Histórico de Porcentajes"
          breadcrumbs={[{ label: "Métricas" }, { label: "Histórico" }]}
        />

        <div className="p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald/10">
                    <TrendingUp className="h-5 w-5 text-emerald" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{promedioRecuperacion.toFixed(1)}%</p>
                    <p className="text-sm text-muted-foreground">Prom. Recuperación</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-destructive/10">
                    <Percent className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{promedioMora.toFixed(1)}%</p>
                    <p className="text-sm text-muted-foreground">Prom. Cartera Mora</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-info/10">
                    <Percent className="h-5 w-5 text-info" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{promedioContactabilidad.toFixed(1)}%</p>
                    <p className="text-sm text-muted-foreground">Prom. Contactabilidad</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-warning/10">
                    <Percent className="h-5 w-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{promedioCumplimiento.toFixed(1)}%</p>
                    <p className="text-sm text-muted-foreground">Prom. Cumplimiento</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Trend Summary */}
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-2 rounded-lg",
                    tendenciaGeneral ? "bg-emerald/10" : "bg-destructive/10"
                  )}>
                    {tendenciaGeneral ? (
                      <TrendingUp className="h-5 w-5 text-emerald" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-destructive" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      Tendencia {tendenciaGeneral ? "positiva" : "negativa"} en los últimos 6 meses
                    </p>
                    <p className="text-sm text-muted-foreground">
                      La tasa de recuperación ha {tendenciaGeneral ? "aumentado" : "disminuido"} comparado con el inicio del período
                    </p>
                  </div>
                </div>
                <Badge className={cn(
                  "border-0",
                  tendenciaGeneral ? "bg-emerald/10 text-emerald" : "bg-destructive/10 text-destructive"
                )}>
                  {tendenciaGeneral ? "Mejorando" : "Requiere atención"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Table */}
          <Card className="bg-card border-border">
            <CardHeader className="border-b border-border">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <History className="h-5 w-5" />
                    Histórico por Período
                  </CardTitle>
                  <CardDescription>Evolución de indicadores mes a mes</CardDescription>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Select value={filtroFinanciera} onValueChange={setFiltroFinanciera}>
                    <SelectTrigger className="w-40 bg-background">
                      <SelectValue placeholder="Financiera" />
                    </SelectTrigger>
                    <SelectContent>
                      {financieras.map(f => (
                        <SelectItem key={f} value={f}>{f}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Período</TableHead>
                    <TableHead className="text-muted-foreground text-center">Tasa Recuperación</TableHead>
                    <TableHead className="text-muted-foreground text-center">Cartera Mora</TableHead>
                    <TableHead className="text-muted-foreground text-center">Contactabilidad</TableHead>
                    <TableHead className="text-muted-foreground text-center">Cumplimiento Acuerdos</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historicoFiltrado.map((h, index) => (
                    <TableRow key={h.id} className={cn("border-border", index === 0 && "bg-emerald/5")}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium text-foreground">{h.periodo}</span>
                          {index === 0 && (
                            <Badge className="bg-emerald/10 text-emerald border-0 text-xs">Actual</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex flex-col items-center">
                          <span className="font-bold text-foreground">{h.tasaRecuperacion}%</span>
                          <span className={cn(
                            "text-xs flex items-center gap-0.5",
                            h.variacionRecuperacion > 0 ? "text-emerald" : h.variacionRecuperacion < 0 ? "text-destructive" : "text-muted-foreground"
                          )}>
                            {h.variacionRecuperacion > 0 ? <TrendingUp className="h-3 w-3" /> : h.variacionRecuperacion < 0 ? <TrendingDown className="h-3 w-3" /> : null}
                            {h.variacionRecuperacion > 0 ? "+" : ""}{h.variacionRecuperacion}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex flex-col items-center">
                          <span className="font-bold text-foreground">{h.carteraMora}%</span>
                          <span className={cn(
                            "text-xs flex items-center gap-0.5",
                            h.variacionMora < 0 ? "text-emerald" : h.variacionMora > 0 ? "text-destructive" : "text-muted-foreground"
                          )}>
                            {h.variacionMora < 0 ? <TrendingDown className="h-3 w-3" /> : h.variacionMora > 0 ? <TrendingUp className="h-3 w-3" /> : null}
                            {h.variacionMora > 0 ? "+" : ""}{h.variacionMora}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex flex-col items-center">
                          <span className="font-bold text-foreground">{h.contactabilidad}%</span>
                          <span className={cn(
                            "text-xs flex items-center gap-0.5",
                            h.variacionContactabilidad > 0 ? "text-emerald" : h.variacionContactabilidad < 0 ? "text-destructive" : "text-muted-foreground"
                          )}>
                            {h.variacionContactabilidad > 0 ? <TrendingUp className="h-3 w-3" /> : h.variacionContactabilidad < 0 ? <TrendingDown className="h-3 w-3" /> : null}
                            {h.variacionContactabilidad > 0 ? "+" : ""}{h.variacionContactabilidad}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex flex-col items-center">
                          <span className="font-bold text-foreground">{h.cumplimientoAcuerdos}%</span>
                          <span className={cn(
                            "text-xs flex items-center gap-0.5",
                            h.variacionAcuerdos > 0 ? "text-emerald" : h.variacionAcuerdos < 0 ? "text-destructive" : "text-muted-foreground"
                          )}>
                            {h.variacionAcuerdos > 0 ? <TrendingUp className="h-3 w-3" /> : h.variacionAcuerdos < 0 ? <TrendingDown className="h-3 w-3" /> : null}
                            {h.variacionAcuerdos > 0 ? "+" : ""}{h.variacionAcuerdos}%
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    </AuthGuard>
  )
}
