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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Star,
  Search,
  Eye,
  Edit,
  Plus,
  User,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface CalificacionCliente {
  id: string
  cliente: {
    id: string
    nombre: string
    cedula: string
  }
  calificacion: "A" | "B" | "C" | "D" | "E"
  puntaje: number
  riesgo: "Bajo" | "Medio" | "Alto" | "Muy Alto"
  comportamientoPago: number
  historialCredito: number
  capacidadPago: number
  ultimaActualizacion: string
  tendencia: "mejorando" | "empeorando" | "estable"
}

const calificaciones: CalificacionCliente[] = [
  {
    id: "CAL-001",
    cliente: { id: "CLI-001", nombre: "Carlos Mendoza", cedula: "1234567890" },
    calificacion: "B",
    puntaje: 72,
    riesgo: "Medio",
    comportamientoPago: 75,
    historialCredito: 68,
    capacidadPago: 73,
    ultimaActualizacion: "2024-03-25",
    tendencia: "mejorando"
  },
  {
    id: "CAL-002",
    cliente: { id: "CLI-002", nombre: "María García", cedula: "0987654321" },
    calificacion: "C",
    puntaje: 58,
    riesgo: "Alto",
    comportamientoPago: 52,
    historialCredito: 60,
    capacidadPago: 62,
    ultimaActualizacion: "2024-03-25",
    tendencia: "empeorando"
  },
  {
    id: "CAL-003",
    cliente: { id: "CLI-003", nombre: "Juan Pérez", cedula: "1122334455" },
    calificacion: "A",
    puntaje: 92,
    riesgo: "Bajo",
    comportamientoPago: 95,
    historialCredito: 88,
    capacidadPago: 93,
    ultimaActualizacion: "2024-03-24",
    tendencia: "estable"
  },
  {
    id: "CAL-004",
    cliente: { id: "CLI-004", nombre: "Ana López", cedula: "5544332211" },
    calificacion: "A",
    puntaje: 88,
    riesgo: "Bajo",
    comportamientoPago: 90,
    historialCredito: 85,
    capacidadPago: 89,
    ultimaActualizacion: "2024-03-24",
    tendencia: "mejorando"
  },
  {
    id: "CAL-005",
    cliente: { id: "CLI-005", nombre: "Roberto Díaz", cedula: "6677889900" },
    calificacion: "D",
    puntaje: 42,
    riesgo: "Muy Alto",
    comportamientoPago: 35,
    historialCredito: 45,
    capacidadPago: 46,
    ultimaActualizacion: "2024-03-23",
    tendencia: "empeorando"
  },
  {
    id: "CAL-006",
    cliente: { id: "CLI-006", nombre: "Luis Torres", cedula: "1122112211" },
    calificacion: "B",
    puntaje: 78,
    riesgo: "Medio",
    comportamientoPago: 80,
    historialCredito: 75,
    capacidadPago: 79,
    ultimaActualizacion: "2024-03-22",
    tendencia: "estable"
  },
]

const getCalificacionStyle = (cal: string) => {
  switch (cal) {
    case "A": return "bg-emerald text-emerald-foreground"
    case "B": return "bg-info text-white"
    case "C": return "bg-warning text-warning-foreground"
    case "D": return "bg-orange-500 text-white"
    case "E": return "bg-destructive text-destructive-foreground"
    default: return "bg-muted text-muted-foreground"
  }
}

const getRiesgoStyle = (riesgo: string) => {
  switch (riesgo) {
    case "Bajo": return "bg-emerald/10 text-emerald"
    case "Medio": return "bg-warning/10 text-warning"
    case "Alto": return "bg-orange-500/10 text-orange-500"
    case "Muy Alto": return "bg-destructive/10 text-destructive"
    default: return "bg-muted text-muted-foreground"
  }
}

export default function CalificacionesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filtroCalificacion, setFiltroCalificacion] = useState("todos")
  const [filtroRiesgo, setFiltroRiesgo] = useState("todos")
  const [selectedCalificacion, setSelectedCalificacion] = useState<CalificacionCliente | null>(null)

  const calificacionesFiltradas = calificaciones.filter(c => {
    const matchSearch = 
      c.cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.cliente.cedula.includes(searchTerm)
    const matchCalificacion = filtroCalificacion === "todos" || c.calificacion === filtroCalificacion
    const matchRiesgo = filtroRiesgo === "todos" || c.riesgo === filtroRiesgo
    return matchSearch && matchCalificacion && matchRiesgo
  })

  // Stats
  const calificacionA = calificaciones.filter(c => c.calificacion === "A").length
  const calificacionB = calificaciones.filter(c => c.calificacion === "B").length
  const riesgoAlto = calificaciones.filter(c => c.riesgo === "Alto" || c.riesgo === "Muy Alto").length
  const promedioPuntaje = Math.round(calificaciones.reduce((acc, c) => acc + c.puntaje, 0) / calificaciones.length)

  return (
    <AuthGuard>
      <AppLayout>
        <Topbar
          title="Calificaciones de Clientes"
          breadcrumbs={[{ label: "Métricas" }, { label: "Calificaciones" }]}
        />

        <div className="p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald/10">
                    <Star className="h-5 w-5 text-emerald" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{calificaciones.length}</p>
                    <p className="text-sm text-muted-foreground">Total evaluados</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald/10">
                    <CheckCircle className="h-5 w-5 text-emerald" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{calificacionA + calificacionB}</p>
                    <p className="text-sm text-muted-foreground">Calificación A/B</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-destructive/10">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{riesgoAlto}</p>
                    <p className="text-sm text-muted-foreground">Riesgo alto</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-info/10">
                    <Star className="h-5 w-5 text-info" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{promedioPuntaje}</p>
                    <p className="text-sm text-muted-foreground">Puntaje promedio</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Distribution */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-4">
              <CardTitle className="text-foreground">Distribución de Calificaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                {["A", "B", "C", "D", "E"].map(cal => {
                  const count = calificaciones.filter(c => c.calificacion === cal).length
                  const percent = (count / calificaciones.length) * 100
                  return (
                    <div key={cal} className="flex-1 text-center">
                      <div className={cn(
                        "mx-auto w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold mb-2",
                        getCalificacionStyle(cal)
                      )}>
                        {cal}
                      </div>
                      <p className="text-2xl font-bold text-foreground">{count}</p>
                      <p className="text-sm text-muted-foreground">{percent.toFixed(0)}%</p>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Table */}
          <Card className="bg-card border-border">
            <CardHeader className="border-b border-border">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Lista de Calificaciones
                  </CardTitle>
                  <CardDescription>Evaluación de riesgo crediticio por cliente</CardDescription>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar cliente..."
                      className="pl-9 bg-background"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={filtroCalificacion} onValueChange={setFiltroCalificacion}>
                    <SelectTrigger className="w-32 bg-background">
                      <SelectValue placeholder="Calificación" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todas</SelectItem>
                      {["A", "B", "C", "D", "E"].map(c => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={filtroRiesgo} onValueChange={setFiltroRiesgo}>
                    <SelectTrigger className="w-32 bg-background">
                      <SelectValue placeholder="Riesgo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="Bajo">Bajo</SelectItem>
                      <SelectItem value="Medio">Medio</SelectItem>
                      <SelectItem value="Alto">Alto</SelectItem>
                      <SelectItem value="Muy Alto">Muy Alto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Cliente</TableHead>
                    <TableHead className="text-muted-foreground text-center">Calificación</TableHead>
                    <TableHead className="text-muted-foreground text-center">Puntaje</TableHead>
                    <TableHead className="text-muted-foreground">Riesgo</TableHead>
                    <TableHead className="text-muted-foreground text-center">Tendencia</TableHead>
                    <TableHead className="text-muted-foreground">Última Actualización</TableHead>
                    <TableHead className="text-muted-foreground text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {calificacionesFiltradas.map((cal) => (
                    <TableRow key={cal.id} className="border-border">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className="bg-emerald/20 text-emerald text-sm">
                              {cal.cliente.nombre.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-foreground">{cal.cliente.nombre}</p>
                            <p className="text-xs text-muted-foreground">{cal.cliente.cedula}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={cn(
                          "inline-flex items-center justify-center h-8 w-8 rounded-full text-sm font-bold",
                          getCalificacionStyle(cal.calificacion)
                        )}>
                          {cal.calificacion}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="font-bold text-foreground">{cal.puntaje}</span>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn("border-0", getRiesgoStyle(cal.riesgo))}>
                          {cal.riesgo}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {cal.tendencia === "mejorando" ? (
                          <TrendingUp className="h-4 w-4 text-emerald mx-auto" />
                        ) : cal.tendencia === "empeorando" ? (
                          <TrendingDown className="h-4 w-4 text-destructive mx-auto" />
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{cal.ultimaActualizacion}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedCalificacion(cal)}>
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Detail Dialog */}
        <Dialog open={!!selectedCalificacion} onOpenChange={() => setSelectedCalificacion(null)}>
          <DialogContent className="sm:max-w-lg">
            {selectedCalificacion && (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-emerald/20 text-emerald">
                        {selectedCalificacion.cliente.nombre.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <DialogTitle>{selectedCalificacion.cliente.nombre}</DialogTitle>
                      <DialogDescription>{selectedCalificacion.cliente.cedula}</DialogDescription>
                    </div>
                  </div>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="flex items-center justify-center gap-6">
                    <div className="text-center">
                      <div className={cn(
                        "mx-auto w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-2",
                        getCalificacionStyle(selectedCalificacion.calificacion)
                      )}>
                        {selectedCalificacion.calificacion}
                      </div>
                      <p className="text-sm text-muted-foreground">Calificación</p>
                    </div>
                    <div className="text-center">
                      <p className="text-4xl font-bold text-foreground mb-2">{selectedCalificacion.puntaje}</p>
                      <p className="text-sm text-muted-foreground">Puntaje</p>
                    </div>
                    <div className="text-center">
                      <Badge className={cn("text-sm py-1 px-3 mb-2", getRiesgoStyle(selectedCalificacion.riesgo))}>
                        {selectedCalificacion.riesgo}
                      </Badge>
                      <p className="text-sm text-muted-foreground">Riesgo</p>
                    </div>
                  </div>

                  <div className="space-y-4 bg-muted/50 rounded-lg p-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Comportamiento de pago</span>
                        <span className="font-medium text-foreground">{selectedCalificacion.comportamientoPago}%</span>
                      </div>
                      <Progress value={selectedCalificacion.comportamientoPago} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Historial crediticio</span>
                        <span className="font-medium text-foreground">{selectedCalificacion.historialCredito}%</span>
                      </div>
                      <Progress value={selectedCalificacion.historialCredito} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Capacidad de pago</span>
                        <span className="font-medium text-foreground">{selectedCalificacion.capacidadPago}%</span>
                      </div>
                      <Progress value={selectedCalificacion.capacidadPago} className="h-2" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Tendencia:</span>
                      <span className={cn(
                        "flex items-center gap-1 font-medium",
                        selectedCalificacion.tendencia === "mejorando" ? "text-emerald" :
                        selectedCalificacion.tendencia === "empeorando" ? "text-destructive" : "text-muted-foreground"
                      )}>
                        {selectedCalificacion.tendencia === "mejorando" ? (
                          <>
                            <TrendingUp className="h-4 w-4" /> Mejorando
                          </>
                        ) : selectedCalificacion.tendencia === "empeorando" ? (
                          <>
                            <TrendingDown className="h-4 w-4" /> Empeorando
                          </>
                        ) : "Estable"}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Actualizado: {selectedCalificacion.ultimaActualizacion}
                    </span>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setSelectedCalificacion(null)}>Cerrar</Button>
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
