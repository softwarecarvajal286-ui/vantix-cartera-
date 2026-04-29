"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
  Phone,
  MessageSquare,
  Mail,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Plus,
} from "lucide-react"
import { AppLayout } from "@/components/app-layout"
import { Topbar } from "@/components/topbar"
import { StatusBadge } from "@/components/status-badge"
import { useApp } from "@/lib/app-context"
import { Cuenta, Cliente, CanalContacto } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

export default function AgendaPage() {
  const router = useRouter()
  const { clientes, gestores } = useApp()
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date())
  const [filtroGestor, setFiltroGestor] = useState<string>("todos")
  const [vistaActual, setVistaActual] = useState<"dia" | "semana">("dia")

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0]
  }

  // Obtener próximas gestiones agendadas
  const gestionesAgendadas = useMemo(() => {
    const items: Array<{
      cliente: Cliente
      cuenta: Cuenta
      fechaProxima: string
      prioridad: "alta" | "media" | "baja"
    }> = []

    clientes.forEach(cliente => {
      cliente.cuentas.forEach(cuenta => {
        if (cuenta.proximaGestion) {
          const prioridad = cuenta.diasMora > 90 ? "alta" : cuenta.diasMora > 30 ? "media" : "baja"
          items.push({
            cliente,
            cuenta,
            fechaProxima: cuenta.proximaGestion,
            prioridad
          })
        }
      })
    })

    // Filtrar por gestor si está seleccionado
    const filtradas = filtroGestor === "todos" 
      ? items 
      : items.filter(item => item.cuenta.gestorAsignado === filtroGestor)

    return filtradas.sort((a, b) => a.fechaProxima.localeCompare(b.fechaProxima))
  }, [clientes, filtroGestor])

  // Agrupar por fecha
  const gestionesPorFecha = useMemo(() => {
    const grupos: Record<string, typeof gestionesAgendadas> = {}
    gestionesAgendadas.forEach(item => {
      if (!grupos[item.fechaProxima]) {
        grupos[item.fechaProxima] = []
      }
      grupos[item.fechaProxima].push(item)
    })
    return grupos
  }, [gestionesAgendadas])

  // Generar días de la semana actual
  const diasSemana = useMemo(() => {
    const dias: Date[] = []
    const inicio = new Date(fechaSeleccionada)
    inicio.setDate(inicio.getDate() - inicio.getDay())
    
    for (let i = 0; i < 7; i++) {
      const dia = new Date(inicio)
      dia.setDate(dia.getDate() + i)
      dias.push(dia)
    }
    return dias
  }, [fechaSeleccionada])

  const cambiarSemana = (direccion: number) => {
    const nueva = new Date(fechaSeleccionada)
    nueva.setDate(nueva.getDate() + (direccion * 7))
    setFechaSeleccionada(nueva)
  }

  const cambiarDia = (direccion: number) => {
    const nueva = new Date(fechaSeleccionada)
    nueva.setDate(nueva.getDate() + direccion)
    setFechaSeleccionada(nueva)
  }

  const hoy = formatDate(new Date())
  const fechaActualStr = formatDate(fechaSeleccionada)

  const getPrioridadColor = (prioridad: "alta" | "media" | "baja") => {
    switch (prioridad) {
      case "alta": return "bg-red-500/10 text-red-500 border-red-500/30"
      case "media": return "bg-amber-500/10 text-amber-500 border-amber-500/30"
      case "baja": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
    }
  }

  // Stats de la agenda
  const statsAgenda = useMemo(() => {
    const gestionesHoy = gestionesPorFecha[hoy] || []
    const gestionesFechaSeleccionada = gestionesPorFecha[fechaActualStr] || []
    const gestionesSemana = diasSemana.reduce((total, dia) => {
      const fecha = formatDate(dia)
      return total + (gestionesPorFecha[fecha]?.length || 0)
    }, 0)
    const alta = gestionesAgendadas.filter(g => g.prioridad === "alta").length
    const pendientes = gestionesAgendadas.length

    return { gestionesHoy: gestionesHoy.length, gestionesFechaSeleccionada: gestionesFechaSeleccionada.length, gestionesSemana, alta, pendientes }
  }, [gestionesPorFecha, gestionesAgendadas, diasSemana, hoy, fechaActualStr])

  return (
    <AppLayout>
      <Topbar
        title="Agenda de Gestiones"
        breadcrumbs={[
          { label: "Inicio", href: "/" },
          { label: "Operación" },
          { label: "Agenda" }
        ]}
        showCreate={false}
      />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Hoy</p>
                  <p className="text-2xl font-bold">{statsAgenda.gestionesHoy}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Esta Semana</p>
                  <p className="text-2xl font-bold">{statsAgenda.gestionesSemana}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Prioridad Alta</p>
                  <p className="text-2xl font-bold">{statsAgenda.alta}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Phone className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Pendientes</p>
                  <p className="text-2xl font-bold">{statsAgenda.pendientes}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant={vistaActual === "dia" ? "default" : "outline"}
              size="sm"
              onClick={() => setVistaActual("dia")}
            >
              Día
            </Button>
            <Button
              variant={vistaActual === "semana" ? "default" : "outline"}
              size="sm"
              onClick={() => setVistaActual("semana")}
            >
              Semana
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => vistaActual === "semana" ? cambiarSemana(-1) : cambiarDia(-1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium min-w-[180px] text-center">
              {vistaActual === "semana" 
                ? `${diasSemana[0].toLocaleDateString("es-CO", { day: "numeric", month: "short" })} - ${diasSemana[6].toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" })}`
                : fechaSeleccionada.toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
              }
            </span>
            <Button variant="outline" size="icon" onClick={() => vistaActual === "semana" ? cambiarSemana(1) : cambiarDia(1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setFechaSeleccionada(new Date())}>
              Hoy
            </Button>
          </div>

          <Select value={filtroGestor} onValueChange={setFiltroGestor}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Gestor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              {gestores.filter(g => g.rol === "gestor").map(g => (
                <SelectItem key={g.id} value={g.id}>{g.nombre}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Calendar View */}
        {vistaActual === "semana" ? (
          <Card className="bg-card">
            <CardContent className="p-0">
              <div className="grid grid-cols-7 border-b border-border">
                {diasSemana.map((dia, index) => {
                  const fechaDia = formatDate(dia)
                  const esHoy = fechaDia === hoy
                  const gestiones = gestionesPorFecha[fechaDia] || []
                  
                  return (
                    <div 
                      key={index} 
                      className={cn(
                        "p-3 text-center border-r last:border-r-0 border-border",
                        esHoy && "bg-primary/5"
                      )}
                    >
                      <p className="text-xs text-muted-foreground uppercase">
                        {dia.toLocaleDateString("es-CO", { weekday: "short" })}
                      </p>
                      <p className={cn(
                        "text-lg font-bold",
                        esHoy && "text-primary"
                      )}>
                        {dia.getDate()}
                      </p>
                      {gestiones.length > 0 && (
                        <Badge variant="secondary" className="mt-1 text-xs">
                          {gestiones.length}
                        </Badge>
                      )}
                    </div>
                  )
                })}
              </div>
              <div className="grid grid-cols-7 min-h-[400px]">
                {diasSemana.map((dia, index) => {
                  const fechaDia = formatDate(dia)
                  const gestiones = gestionesPorFecha[fechaDia] || []
                  
                  return (
                    <div 
                      key={index}
                      className="p-2 border-r last:border-r-0 border-border"
                    >
                      <ScrollArea className="h-[380px]">
                        <div className="space-y-2">
                          {gestiones.map((item) => (
                            <button
                              key={item.cuenta.id}
                              onClick={() => router.push(`/operacion/cartera?cuenta=${item.cuenta.id}`)}
                              className={cn(
                                "w-full p-2 rounded-md text-left text-xs transition-all hover:scale-[1.02]",
                                getPrioridadColor(item.prioridad)
                              )}
                            >
                              <p className="font-medium truncate">{item.cliente.nombre} {item.cliente.apellido}</p>
                              <p className="text-[10px] opacity-80 truncate">{item.cuenta.numeroCredito}</p>
                              <p className="text-[10px] font-mono">{formatCurrency(item.cuenta.saldoMora)}</p>
                            </button>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Gestiones para {fechaSeleccionada.toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long" })}
                <Badge variant="secondary" className="ml-2">{statsAgenda.gestionesFechaSeleccionada} pendientes</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                {(gestionesPorFecha[fechaActualStr] || []).length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                      <CheckCircle2 className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground">No hay gestiones agendadas para este día</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => router.push("/operacion/cartera")}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Agendar gestiones
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {(gestionesPorFecha[fechaActualStr] || []).map((item) => {
                      const gestor = gestores.find(g => g.id === item.cuenta.gestorAsignado)
                      
                      return (
                        <button
                          key={item.cuenta.id}
                          onClick={() => router.push(`/operacion/cartera?cuenta=${item.cuenta.id}`)}
                          className="w-full p-4 rounded-lg border border-border bg-card hover:bg-muted/50 transition-all text-left"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-medium">{item.cliente.nombre} {item.cliente.apellido}</p>
                              <p className="text-sm text-muted-foreground font-mono">{item.cuenta.numeroCredito}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <StatusBadge status={item.cuenta.estado} />
                              <Badge className={cn("border", getPrioridadColor(item.prioridad))}>
                                {item.prioridad === "alta" ? "Prioridad Alta" : item.prioridad === "media" ? "Prioridad Media" : "Prioridad Baja"}
                              </Badge>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Saldo en Mora</p>
                              <p className="font-medium text-destructive">{formatCurrency(item.cuenta.saldoMora)}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Días en Mora</p>
                              <p className="font-medium">{item.cuenta.diasMora} días</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Gestor Asignado</p>
                              <p className="font-medium flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {gestor?.nombre || "Sin asignar"}
                              </p>
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        )}

        {/* Lista de todas las próximas gestiones */}
        <Card className="bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Próximas Gestiones Programadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <div className="space-y-2">
                {gestionesAgendadas.slice(0, 20).map((item) => {
                  const gestor = gestores.find(g => g.id === item.cuenta.gestorAsignado)
                  const fechaObj = new Date(item.fechaProxima + "T12:00:00")
                  
                  return (
                    <button
                      key={item.cuenta.id}
                      onClick={() => router.push(`/operacion/cartera?cuenta=${item.cuenta.id}`)}
                      className="w-full flex items-center gap-4 p-3 rounded-lg border border-border hover:bg-muted/50 transition-all text-left"
                    >
                      <div className={cn(
                        "h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0",
                        getPrioridadColor(item.prioridad)
                      )}>
                        <Calendar className="h-5 w-5" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium truncate">{item.cliente.nombre} {item.cliente.apellido}</p>
                          <span className="text-xs text-muted-foreground font-mono">{item.cuenta.numeroCredito}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{fechaObj.toLocaleDateString("es-CO", { weekday: "short", day: "numeric", month: "short" })}</span>
                          <span>{item.cuenta.diasMora} días mora</span>
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {gestor?.nombre || "Sin asignar"}
                          </span>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <p className="font-medium text-destructive">{formatCurrency(item.cuenta.saldoMora)}</p>
                        <StatusBadge status={item.cuenta.estado} size="sm" />
                      </div>
                    </button>
                  )
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
