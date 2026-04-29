"use client"

import { useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { Topbar } from "@/components/topbar"
import { AuthGuard } from "@/components/auth-guard"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  TrendingUp,
  Target,
  DollarSign,
  Calendar,
  Plus,
  Edit,
  CheckCircle,
  AlertCircle,
  Clock,
  Trophy,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface MetaFinanciera {
  id: string
  nombre: string
  descripcion: string
  financiera: string
  tipo: "recuperacion" | "gestion" | "acuerdos" | "cartera"
  valorActual: number
  valorMeta: number
  unidad: "moneda" | "porcentaje" | "numero"
  periodo: string
  fechaInicio: string
  fechaFin: string
  estado: "en_progreso" | "cumplida" | "incumplida" | "pendiente"
}

const metas: MetaFinanciera[] = [
  {
    id: "META-001",
    nombre: "Recuperación mensual",
    descripcion: "Meta de recuperación de cartera del mes",
    financiera: "Krediya",
    tipo: "recuperacion",
    valorActual: 125000000,
    valorMeta: 150000000,
    unidad: "moneda",
    periodo: "Marzo 2024",
    fechaInicio: "2024-03-01",
    fechaFin: "2024-03-31",
    estado: "en_progreso"
  },
  {
    id: "META-002",
    nombre: "Tasa de contactabilidad",
    descripcion: "Porcentaje de clientes contactados efectivamente",
    financiera: "Krediya",
    tipo: "gestion",
    valorActual: 65,
    valorMeta: 75,
    unidad: "porcentaje",
    periodo: "Marzo 2024",
    fechaInicio: "2024-03-01",
    fechaFin: "2024-03-31",
    estado: "en_progreso"
  },
  {
    id: "META-003",
    nombre: "Acuerdos de pago",
    descripcion: "Número de acuerdos generados en el mes",
    financiera: "Krediya",
    tipo: "acuerdos",
    valorActual: 85,
    valorMeta: 80,
    unidad: "numero",
    periodo: "Marzo 2024",
    fechaInicio: "2024-03-01",
    fechaFin: "2024-03-31",
    estado: "cumplida"
  },
  {
    id: "META-004",
    nombre: "Reducción de mora",
    descripcion: "Reducir el porcentaje de cartera en mora",
    financiera: "Krediya",
    tipo: "cartera",
    valorActual: 18.5,
    valorMeta: 15,
    unidad: "porcentaje",
    periodo: "Marzo 2024",
    fechaInicio: "2024-03-01",
    fechaFin: "2024-03-31",
    estado: "en_progreso"
  },
  {
    id: "META-005",
    nombre: "Recuperación Q1",
    descripcion: "Meta de recuperación del primer trimestre",
    financiera: "Krediya",
    tipo: "recuperacion",
    valorActual: 380000000,
    valorMeta: 450000000,
    unidad: "moneda",
    periodo: "Q1 2024",
    fechaInicio: "2024-01-01",
    fechaFin: "2024-03-31",
    estado: "en_progreso"
  },
  {
    id: "META-006",
    nombre: "Gestiones diarias",
    descripcion: "Promedio de gestiones por día",
    financiera: "Krediya",
    tipo: "gestion",
    valorActual: 145,
    valorMeta: 160,
    unidad: "numero",
    periodo: "Marzo 2024",
    fechaInicio: "2024-03-01",
    fechaFin: "2024-03-31",
    estado: "en_progreso"
  },
]

const getTipoStyle = (tipo: string) => {
  switch (tipo) {
    case "recuperacion": return "bg-emerald/10 text-emerald"
    case "gestion": return "bg-info/10 text-info"
    case "acuerdos": return "bg-warning/10 text-warning"
    case "cartera": return "bg-special/10 text-special"
    default: return "bg-muted text-muted-foreground"
  }
}

const getTipoLabel = (tipo: string) => {
  switch (tipo) {
    case "recuperacion": return "Recuperación"
    case "gestion": return "Gestión"
    case "acuerdos": return "Acuerdos"
    case "cartera": return "Cartera"
    default: return tipo
  }
}

const getEstadoStyle = (estado: string) => {
  switch (estado) {
    case "cumplida": return "bg-emerald/10 text-emerald"
    case "incumplida": return "bg-destructive/10 text-destructive"
    case "en_progreso": return "bg-info/10 text-info"
    case "pendiente": return "bg-muted text-muted-foreground"
    default: return "bg-muted text-muted-foreground"
  }
}

const getEstadoLabel = (estado: string) => {
  switch (estado) {
    case "cumplida": return "Cumplida"
    case "incumplida": return "Incumplida"
    case "en_progreso": return "En progreso"
    case "pendiente": return "Pendiente"
    default: return estado
  }
}

export default function MetasPage() {
  const [filtroTipo, setFiltroTipo] = useState("todos")
  const [filtroEstado, setFiltroEstado] = useState("todos")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [selectedMeta, setSelectedMeta] = useState<MetaFinanciera | null>(null)

  const metasFiltradas = metas.filter(m => {
    const matchTipo = filtroTipo === "todos" || m.tipo === filtroTipo
    const matchEstado = filtroEstado === "todos" || m.estado === filtroEstado
    return matchTipo && matchEstado
  })

  const formatValue = (valor: number, unidad: string) => {
    if (unidad === "moneda") {
      return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(valor)
    }
    if (unidad === "porcentaje") {
      return `${valor.toFixed(1)}%`
    }
    return valor.toLocaleString('es-CO')
  }

  const getProgress = (actual: number, meta: number, tipo: string) => {
    if (tipo === "cartera") {
      // For cartera, lower is better (reducing mora)
      return Math.min(((meta / actual) * 100), 100)
    }
    return Math.min((actual / meta) * 100, 100)
  }

  // Stats
  const metasCumplidas = metas.filter(m => m.estado === "cumplida").length
  const metasEnProgreso = metas.filter(m => m.estado === "en_progreso").length
  const promedioAvance = metas.reduce((acc, m) => acc + getProgress(m.valorActual, m.valorMeta, m.tipo), 0) / metas.length

  return (
    <AuthGuard>
      <AppLayout>
        <Topbar
          title="Metas Financieras"
          breadcrumbs={[{ label: "Métricas" }, { label: "Metas" }]}
        />

        <div className="p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald/10">
                    <Target className="h-5 w-5 text-emerald" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{metas.length}</p>
                    <p className="text-sm text-muted-foreground">Total metas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald/10">
                    <Trophy className="h-5 w-5 text-emerald" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{metasCumplidas}</p>
                    <p className="text-sm text-muted-foreground">Cumplidas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-info/10">
                    <Clock className="h-5 w-5 text-info" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{metasEnProgreso}</p>
                    <p className="text-sm text-muted-foreground">En progreso</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-warning/10">
                    <TrendingUp className="h-5 w-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{promedioAvance.toFixed(1)}%</p>
                    <p className="text-sm text-muted-foreground">Avance promedio</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="bg-card border-border">
            <CardHeader className="border-b border-border pb-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-foreground">Metas del Período</CardTitle>
                  <CardDescription>Seguimiento de metas por financiera</CardDescription>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                    <SelectTrigger className="w-36 bg-background">
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="recuperacion">Recuperación</SelectItem>
                      <SelectItem value="gestion">Gestión</SelectItem>
                      <SelectItem value="acuerdos">Acuerdos</SelectItem>
                      <SelectItem value="cartera">Cartera</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                    <SelectTrigger className="w-36 bg-background">
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="en_progreso">En progreso</SelectItem>
                      <SelectItem value="cumplida">Cumplidas</SelectItem>
                      <SelectItem value="incumplida">Incumplidas</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button className="bg-emerald hover:bg-emerald-bright text-emerald-foreground" onClick={() => setIsCreateOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva Meta
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {metasFiltradas.map((meta) => {
                  const progress = getProgress(meta.valorActual, meta.valorMeta, meta.tipo)
                  const cumplida = meta.estado === "cumplida" || progress >= 100
                  
                  return (
                    <Card 
                      key={meta.id} 
                      className={cn(
                        "bg-muted/30 border-border hover:border-emerald/50 transition-colors cursor-pointer",
                        cumplida && "border-emerald/30"
                      )}
                      onClick={() => setSelectedMeta(meta)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Badge className={cn("border-0", getTipoStyle(meta.tipo))}>
                              {getTipoLabel(meta.tipo)}
                            </Badge>
                            <Badge className={cn("border-0", getEstadoStyle(meta.estado))}>
                              {getEstadoLabel(meta.estado)}
                            </Badge>
                          </div>
                          {cumplida && (
                            <CheckCircle className="h-5 w-5 text-emerald" />
                          )}
                        </div>

                        <h3 className="font-semibold text-foreground mb-1">{meta.nombre}</h3>
                        <p className="text-xs text-muted-foreground mb-3">{meta.descripcion}</p>

                        <div className="space-y-2">
                          <div className="flex items-end justify-between">
                            <span className="text-xl font-bold text-foreground">
                              {formatValue(meta.valorActual, meta.unidad)}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              Meta: {formatValue(meta.valorMeta, meta.unidad)}
                            </span>
                          </div>
                          <Progress 
                            value={progress} 
                            className={cn(
                              "h-2",
                              cumplida ? "[&>div]:bg-emerald" : progress >= 80 ? "[&>div]:bg-warning" : "[&>div]:bg-info"
                            )}
                          />
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{progress.toFixed(1)}% completado</span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {meta.periodo}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Create Dialog */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Nueva Meta Financiera</DialogTitle>
              <DialogDescription>
                Configura una nueva meta para el período
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Nombre</Label>
                <Input placeholder="Nombre de la meta" />
              </div>
              <div className="space-y-2">
                <Label>Descripción</Label>
                <Input placeholder="Descripción breve" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recuperacion">Recuperación</SelectItem>
                      <SelectItem value="gestion">Gestión</SelectItem>
                      <SelectItem value="acuerdos">Acuerdos</SelectItem>
                      <SelectItem value="cartera">Cartera</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Unidad</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="moneda">Moneda</SelectItem>
                      <SelectItem value="porcentaje">Porcentaje</SelectItem>
                      <SelectItem value="numero">Número</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Valor meta</Label>
                  <Input type="number" placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label>Período</Label>
                  <Input placeholder="Ej: Marzo 2024" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Fecha inicio</Label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <Label>Fecha fin</Label>
                  <Input type="date" />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancelar</Button>
              <Button className="bg-emerald hover:bg-emerald-bright text-emerald-foreground">
                Crear meta
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Detail Dialog */}
        <Dialog open={!!selectedMeta} onOpenChange={() => setSelectedMeta(null)}>
          <DialogContent className="sm:max-w-lg">
            {selectedMeta && (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={cn("border-0", getTipoStyle(selectedMeta.tipo))}>
                      {getTipoLabel(selectedMeta.tipo)}
                    </Badge>
                    <Badge className={cn("border-0", getEstadoStyle(selectedMeta.estado))}>
                      {getEstadoLabel(selectedMeta.estado)}
                    </Badge>
                  </div>
                  <DialogTitle>{selectedMeta.nombre}</DialogTitle>
                  <DialogDescription>{selectedMeta.descripcion}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/50 rounded-lg p-4 text-center">
                      <p className="text-sm text-muted-foreground mb-1">Valor Actual</p>
                      <p className="text-2xl font-bold text-foreground">
                        {formatValue(selectedMeta.valorActual, selectedMeta.unidad)}
                      </p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4 text-center">
                      <p className="text-sm text-muted-foreground mb-1">Meta</p>
                      <p className="text-2xl font-bold text-foreground">
                        {formatValue(selectedMeta.valorMeta, selectedMeta.unidad)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progreso</span>
                      <span className="font-medium">{getProgress(selectedMeta.valorActual, selectedMeta.valorMeta, selectedMeta.tipo).toFixed(1)}%</span>
                    </div>
                    <Progress 
                      value={getProgress(selectedMeta.valorActual, selectedMeta.valorMeta, selectedMeta.tipo)} 
                      className="h-3"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4 bg-muted/50 rounded-lg p-4">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground mb-1">Período</p>
                      <p className="font-medium text-foreground text-sm">{selectedMeta.periodo}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground mb-1">Inicio</p>
                      <p className="font-medium text-foreground text-sm">{selectedMeta.fechaInicio}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground mb-1">Fin</p>
                      <p className="font-medium text-foreground text-sm">{selectedMeta.fechaFin}</p>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setSelectedMeta(null)}>Cerrar</Button>
                  <Button className="bg-emerald hover:bg-emerald-bright text-emerald-foreground">
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </AppLayout>
    </AuthGuard>
  )
}
