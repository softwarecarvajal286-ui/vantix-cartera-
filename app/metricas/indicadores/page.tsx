"use client"

import { useMemo, useState } from "react"
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
  Target,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Phone,
  FileText,
  Plus,
  Edit,
  Search,
  BarChart3,
  Percent,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import {
  getFinancieraModuleConfig,
  getIndicatorsForFinanciera,
  resolveSupportedFinancieraId,
} from "@/lib/financiera-module-content"

interface Indicador {
  id: string
  nombre: string
  descripcion: string
  valor: number
  meta: number
  unidad: "porcentaje" | "moneda" | "numero"
  tendencia: "subiendo" | "bajando" | "estable"
  variacion: number
  categoria: string
  periodo: string
}

const indicadores: Indicador[] = [
  {
    id: "IND-001",
    nombre: "Tasa de Recuperación",
    descripcion: "Porcentaje de cartera recuperada del mes",
    valor: 78.5,
    meta: 85,
    unidad: "porcentaje",
    tendencia: "subiendo",
    variacion: 3.2,
    categoria: "Cobranza",
    periodo: "Marzo 2024"
  },
  {
    id: "IND-002",
    nombre: "Monto Recuperado",
    descripcion: "Total de dinero recuperado en el mes",
    valor: 125000000,
    meta: 150000000,
    unidad: "moneda",
    tendencia: "subiendo",
    variacion: 12.5,
    categoria: "Cobranza",
    periodo: "Marzo 2024"
  },
  {
    id: "IND-003",
    nombre: "Contactabilidad",
    descripcion: "Porcentaje de clientes contactados efectivamente",
    valor: 65.2,
    meta: 75,
    unidad: "porcentaje",
    tendencia: "estable",
    variacion: 0.5,
    categoria: "Gestión",
    periodo: "Marzo 2024"
  },
  {
    id: "IND-004",
    nombre: "Gestiones Diarias",
    descripcion: "Promedio de gestiones realizadas por día",
    valor: 145,
    meta: 160,
    unidad: "numero",
    tendencia: "bajando",
    variacion: -5.3,
    categoria: "Gestión",
    periodo: "Marzo 2024"
  },
  {
    id: "IND-005",
    nombre: "Cumplimiento de Acuerdos",
    descripcion: "Porcentaje de acuerdos cumplidos",
    valor: 72.8,
    meta: 80,
    unidad: "porcentaje",
    tendencia: "subiendo",
    variacion: 4.1,
    categoria: "Acuerdos",
    periodo: "Marzo 2024"
  },
  {
    id: "IND-006",
    nombre: "Cartera en Mora",
    descripcion: "Porcentaje de cartera con días de mora > 30",
    valor: 18.5,
    meta: 15,
    unidad: "porcentaje",
    tendencia: "bajando",
    variacion: -2.3,
    categoria: "Cartera",
    periodo: "Marzo 2024"
  },
  {
    id: "IND-007",
    nombre: "Promesas de Pago",
    descripcion: "Número de promesas obtenidas en el mes",
    valor: 234,
    meta: 250,
    unidad: "numero",
    tendencia: "subiendo",
    variacion: 8.2,
    categoria: "Gestión",
    periodo: "Marzo 2024"
  },
  {
    id: "IND-008",
    nombre: "Clientes Activos",
    descripcion: "Total de clientes con obligaciones vigentes",
    valor: 1250,
    meta: 1500,
    unidad: "numero",
    tendencia: "estable",
    variacion: 1.2,
    categoria: "Cartera",
    periodo: "Marzo 2024"
  },
]

const getCategoriaIcon = (categoria: string) => {
  switch (categoria) {
    case "Cobranza": return DollarSign
    case "Generales": return BarChart3
    case "Gestion": return Phone
    case "Gestión": return Phone
    case "Acuerdos": return FileText
    case "Cartera": return Users
    case "Riesgo": return Target
    case "Krediya": return Target
    case "PayJoy": return Target
    case "ALO": return Target
    case "Distritec": return Target
    default: return Target
  }
}

const getCategoriaStyle = (categoria: string) => {
  switch (categoria) {
    case "Cobranza": return "bg-emerald/10 text-emerald"
    case "Generales": return "bg-info/10 text-info"
    case "Gestion": return "bg-info/10 text-info"
    case "Gestión": return "bg-info/10 text-info"
    case "Acuerdos": return "bg-warning/10 text-warning"
    case "Cartera": return "bg-special/10 text-special"
    case "Riesgo": return "bg-destructive/10 text-destructive"
    case "Krediya": return "bg-special/10 text-special"
    case "PayJoy": return "bg-info/10 text-info"
    case "ALO": return "bg-warning/10 text-warning"
    case "Distritec": return "bg-purple-500/10 text-purple-500"
    default: return "bg-muted text-muted-foreground"
  }
}

export default function IndicadoresPage() {
  const { user, selectedFinanciera } = useAuth()
  const activeFinancieraId = resolveSupportedFinancieraId(selectedFinanciera?.id ?? user?.financieraId)
  const financieraActiva = getFinancieraModuleConfig(activeFinancieraId)
  const [searchTerm, setSearchTerm] = useState("")
  const [filtroCategoria, setFiltroCategoria] = useState("todos")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [selectedIndicador, setSelectedIndicador] = useState<Indicador | null>(null)
  const indicadores = useMemo(() => getIndicatorsForFinanciera(activeFinancieraId), [activeFinancieraId])

  const indicadoresFiltrados = indicadores.filter(ind => {
    const matchSearch = ind.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ind.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    const matchCategoria = filtroCategoria === "todos" || ind.categoria === filtroCategoria
    return matchSearch && matchCategoria
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

  const getProgress = (valor: number, meta: number) => {
    return Math.min((valor / meta) * 100, 100)
  }

  const categorias = [...new Set(indicadores.map(ind => ind.categoria))]

  // Summary stats
  const promedioAlcanzado = indicadores.reduce((acc, ind) => acc + (ind.valor / ind.meta) * 100, 0) / indicadores.length
  const indicadoresCumplidos = indicadores.filter(ind => ind.valor >= ind.meta).length

  return (
    <AuthGuard>
      <AppLayout>
        <Topbar
          title="Indicadores"
          breadcrumbs={[{ label: "Métricas" }, { label: "Indicadores" }]}
        />

        <div className="p-6 space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald/10">
                    <Target className="h-5 w-5 text-emerald" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{indicadores.length}</p>
                    <p className="text-sm text-muted-foreground">Total indicadores</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald/10">
                    <TrendingUp className="h-5 w-5 text-emerald" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{indicadoresCumplidos}</p>
                    <p className="text-sm text-muted-foreground">Meta cumplida</p>
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
                    <p className="text-2xl font-bold text-foreground">{promedioAlcanzado.toFixed(1)}%</p>
                    <p className="text-sm text-muted-foreground">Promedio alcanzado</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-warning/10">
                    <Calendar className="h-5 w-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-foreground">{financieraActiva.nombre}</p>
                    <p className="text-sm text-muted-foreground">Período actual</p>
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
                  <CardTitle className="text-foreground">Panel de Indicadores</CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {financieraActiva.nombre} combina indicadores generales y metricas particulares del lineamiento.
                  </p>
                  <CardDescription>Monitorea el desempeño de tu operación</CardDescription>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar indicador..."
                      className="pl-9 bg-background"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
                    <SelectTrigger className="w-36 bg-background">
                      <SelectValue placeholder="Categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todas</SelectItem>
                      {categorias.map(c => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button className="bg-emerald hover:bg-emerald-bright text-emerald-foreground" onClick={() => setIsCreateOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Indicador
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {indicadoresFiltrados.map((ind) => {
                  const CategoriaIcon = getCategoriaIcon(ind.categoria)
                  const progress = getProgress(ind.valor, ind.meta)
                  const cumplido = ind.valor >= ind.meta
                  
                  return (
                    <Card 
                      key={ind.id} 
                      className={cn(
                        "bg-muted/30 border-border hover:border-emerald/50 transition-colors cursor-pointer",
                        cumplido && "border-emerald/30"
                      )}
                      onClick={() => setSelectedIndicador(ind)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className={cn("p-1.5 rounded-lg", getCategoriaStyle(ind.categoria))}>
                              <CategoriaIcon className="h-4 w-4" />
                            </div>
                            <Badge className={cn("border-0 text-xs", getCategoriaStyle(ind.categoria))}>
                              {ind.categoria}
                            </Badge>
                            {ind.particular && (
                              <Badge variant="outline" className="text-[10px] uppercase tracking-[0.14em]">
                                Particular
                              </Badge>
                            )}
                          </div>
                          <div className={cn(
                            "flex items-center gap-1 text-xs font-medium",
                            ind.tendencia === "subiendo" && ind.categoria !== "Cartera" ? "text-emerald" : 
                            ind.tendencia === "bajando" && ind.categoria === "Cartera" ? "text-emerald" :
                            ind.tendencia === "bajando" ? "text-destructive" :
                            "text-muted-foreground"
                          )}>
                            {ind.tendencia === "subiendo" ? (
                              <ArrowUpRight className="h-3 w-3" />
                            ) : ind.tendencia === "bajando" ? (
                              <ArrowDownRight className="h-3 w-3" />
                            ) : null}
                            {ind.variacion > 0 ? "+" : ""}{ind.variacion}%
                          </div>
                        </div>

                        <h3 className="font-semibold text-foreground mb-1">{ind.nombre}</h3>
                        <p className="text-xs text-muted-foreground mb-3 line-clamp-1">{ind.descripcion}</p>

                        <div className="space-y-2">
                          <div className="flex items-end justify-between">
                            <span className="text-2xl font-bold text-foreground">
                              {formatValue(ind.valor, ind.unidad)}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              Meta: {formatValue(ind.meta, ind.unidad)}
                            </span>
                          </div>
                          <Progress 
                            value={progress} 
                            className={cn(
                              "h-2",
                              cumplido ? "[&>div]:bg-emerald" : progress >= 80 ? "[&>div]:bg-warning" : "[&>div]:bg-info"
                            )}
                          />
                          <p className="text-xs text-muted-foreground text-right">
                            {progress.toFixed(1)}% de la meta
                          </p>
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
              <DialogTitle>Nuevo Indicador</DialogTitle>
              <DialogDescription>
                Crea un nuevo indicador para monitorear
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Nombre</Label>
                <Input placeholder="Nombre del indicador" />
              </div>
              <div className="space-y-2">
                <Label>Descripción</Label>
                <Input placeholder="Descripción breve" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Categoría</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      {categorias.map(c => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
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
                      <SelectItem value="porcentaje">Porcentaje</SelectItem>
                      <SelectItem value="moneda">Moneda</SelectItem>
                      <SelectItem value="numero">Número</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Valor inicial</Label>
                  <Input type="number" placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label>Meta</Label>
                  <Input type="number" placeholder="100" />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancelar</Button>
              <Button className="bg-emerald hover:bg-emerald-bright text-emerald-foreground">
                Crear indicador
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Detail Dialog */}
        <Dialog open={!!selectedIndicador} onOpenChange={() => setSelectedIndicador(null)}>
          <DialogContent className="sm:max-w-lg">
            {selectedIndicador && (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-3">
                    <div className={cn("p-2 rounded-lg", getCategoriaStyle(selectedIndicador.categoria))}>
                      {(() => {
                        const Icon = getCategoriaIcon(selectedIndicador.categoria)
                        return <Icon className="h-5 w-5" />
                      })()}
                    </div>
                    <div>
                      <DialogTitle>{selectedIndicador.nombre}</DialogTitle>
                      <DialogDescription>{selectedIndicador.descripcion}</DialogDescription>
                    </div>
                  </div>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/50 rounded-lg p-4 text-center">
                      <p className="text-sm text-muted-foreground mb-1">Valor Actual</p>
                      <p className="text-2xl font-bold text-foreground">
                        {formatValue(selectedIndicador.valor, selectedIndicador.unidad)}
                      </p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4 text-center">
                      <p className="text-sm text-muted-foreground mb-1">Meta</p>
                      <p className="text-2xl font-bold text-foreground">
                        {formatValue(selectedIndicador.meta, selectedIndicador.unidad)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progreso</span>
                      <span className="font-medium">{getProgress(selectedIndicador.valor, selectedIndicador.meta).toFixed(1)}%</span>
                    </div>
                    <Progress 
                      value={getProgress(selectedIndicador.valor, selectedIndicador.meta)} 
                      className="h-3"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4 bg-muted/50 rounded-lg p-4">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground mb-1">Tendencia</p>
                      <div className={cn(
                        "flex items-center justify-center gap-1",
                        selectedIndicador.tendencia === "subiendo" ? "text-emerald" : 
                        selectedIndicador.tendencia === "bajando" ? "text-destructive" : "text-muted-foreground"
                      )}>
                        {selectedIndicador.tendencia === "subiendo" ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : selectedIndicador.tendencia === "bajando" ? (
                          <TrendingDown className="h-4 w-4" />
                        ) : (
                          <span className="text-sm">-</span>
                        )}
                        <span className="text-sm font-medium capitalize">{selectedIndicador.tendencia}</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground mb-1">Variación</p>
                      <p className={cn(
                        "font-medium",
                        selectedIndicador.variacion > 0 ? "text-emerald" : 
                        selectedIndicador.variacion < 0 ? "text-destructive" : "text-muted-foreground"
                      )}>
                        {selectedIndicador.variacion > 0 ? "+" : ""}{selectedIndicador.variacion}%
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground mb-1">Período</p>
                      <p className="font-medium text-foreground">{selectedIndicador.periodo}</p>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setSelectedIndicador(null)}>Cerrar</Button>
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
