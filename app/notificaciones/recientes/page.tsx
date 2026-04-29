"use client"

import { useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { Topbar } from "@/components/topbar"
import { AuthGuard } from "@/components/auth-guard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Bell,
  Clock,
  User,
  AlertCircle,
  CheckCircle,
  Info,
  CreditCard,
  RefreshCw,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Notificacion {
  id: string
  tipo: "info" | "warning" | "success" | "error"
  motivo: string
  titulo: string
  mensaje: string
  fecha: string
  hora: string
  leida: boolean
  cliente?: { id: string; nombre: string }
  obligacion?: { id: string; numero: string }
  accion?: string
  tiempoRelativo: string
}

const notificacionesRecientes: Notificacion[] = [
  {
    id: "NOT-001",
    tipo: "warning",
    motivo: "Vencimiento",
    titulo: "Cuota próxima a vencer",
    mensaje: "La cuota del crédito OBL-001 vence en 3 días. Monto: $850,000",
    fecha: "2024-03-25",
    hora: "09:30",
    leida: false,
    cliente: { id: "CLI-001", nombre: "Carlos Mendoza" },
    obligacion: { id: "OBL-001", numero: "CR-2024-001" },
    accion: "Ver obligación",
    tiempoRelativo: "Hace 2 minutos"
  },
  {
    id: "NOT-002",
    tipo: "error",
    motivo: "Mora",
    titulo: "Cliente entró en mora",
    mensaje: "El cliente María García ha entrado en mora con 5 días de atraso",
    fecha: "2024-03-25",
    hora: "08:15",
    leida: false,
    cliente: { id: "CLI-002", nombre: "María García" },
    obligacion: { id: "OBL-002", numero: "CR-2024-002" },
    accion: "Gestionar",
    tiempoRelativo: "Hace 15 minutos"
  },
  {
    id: "NOT-009",
    tipo: "success",
    motivo: "Pago",
    titulo: "Pago confirmado",
    mensaje: "Se confirmó el pago de Luis Torres por $750,000",
    fecha: "2024-03-25",
    hora: "07:45",
    leida: false,
    cliente: { id: "CLI-006", nombre: "Luis Torres" },
    accion: "Ver pago",
    tiempoRelativo: "Hace 45 minutos"
  },
  {
    id: "NOT-003",
    tipo: "success",
    motivo: "Pago",
    titulo: "Pago recibido",
    mensaje: "Se registró un pago de $1,200,000 para el crédito CR-2024-003",
    fecha: "2024-03-25",
    hora: "07:00",
    leida: true,
    cliente: { id: "CLI-003", nombre: "Juan Pérez" },
    obligacion: { id: "OBL-003", numero: "CR-2024-003" },
    accion: "Ver pago",
    tiempoRelativo: "Hace 1 hora"
  },
  {
    id: "NOT-004",
    tipo: "info",
    motivo: "Gestión",
    titulo: "Gestión programada",
    mensaje: "Tiene una llamada programada con Ana López a las 10:00 AM",
    fecha: "2024-03-25",
    hora: "06:30",
    leida: true,
    cliente: { id: "CLI-004", nombre: "Ana López" },
    accion: "Ver agenda",
    tiempoRelativo: "Hace 2 horas"
  },
  {
    id: "NOT-010",
    tipo: "info",
    motivo: "Sistema",
    titulo: "Sincronización completada",
    mensaje: "Los datos de cartera han sido actualizados exitosamente",
    fecha: "2024-03-25",
    hora: "06:00",
    leida: true,
    accion: "Ver cartera",
    tiempoRelativo: "Hace 3 horas"
  },
]

const getTipoIcon = (tipo: string) => {
  switch (tipo) {
    case "success": return CheckCircle
    case "warning": return AlertCircle
    case "error": return AlertCircle
    case "info": return Info
    default: return Bell
  }
}

const getTipoStyle = (tipo: string) => {
  switch (tipo) {
    case "success": return "text-emerald bg-emerald/10"
    case "warning": return "text-warning bg-warning/10"
    case "error": return "text-destructive bg-destructive/10"
    case "info": return "text-info bg-info/10"
    default: return "text-muted-foreground bg-muted"
  }
}

const getMotivoStyle = (motivo: string) => {
  switch (motivo) {
    case "Pago": return "bg-emerald/10 text-emerald"
    case "Compromiso": return "bg-emerald/10 text-emerald"
    case "Mora": return "bg-destructive/10 text-destructive"
    case "Incumplimiento": return "bg-destructive/10 text-destructive"
    case "Vencimiento": return "bg-warning/10 text-warning"
    case "Acuerdo": return "bg-warning/10 text-warning"
    case "Gestión": return "bg-info/10 text-info"
    case "Sistema": return "bg-special/10 text-special"
    default: return "bg-muted text-muted-foreground"
  }
}

export default function NotificacionesRecientesPage() {
  const [notificacionesList, setNotificacionesList] = useState(notificacionesRecientes)
  const [selectedNotificacion, setSelectedNotificacion] = useState<Notificacion | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const marcarComoLeida = (id: string) => {
    setNotificacionesList(prev =>
      prev.map(n => n.id === id ? { ...n, leida: true } : n)
    )
  }

  const openDetail = (notificacion: Notificacion) => {
    setSelectedNotificacion(notificacion)
    setIsDetailOpen(true)
    if (!notificacion.leida) {
      marcarComoLeida(notificacion.id)
    }
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1000)
  }

  const noLeidas = notificacionesList.filter(n => !n.leida).length

  return (
    <AuthGuard>
      <AppLayout>
        <Topbar
          title="Notificaciones Recientes"
          breadcrumbs={[{ label: "Notificaciones" }, { label: "Recientes" }]}
        />

        <div className="p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald/10">
                    <Clock className="h-5 w-5 text-emerald" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{notificacionesList.length}</p>
                    <p className="text-sm text-muted-foreground">Últimas 24 horas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-destructive/10">
                    <AlertCircle className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{noLeidas}</p>
                    <p className="text-sm text-muted-foreground">Sin leer</p>
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
                    <p className="text-2xl font-bold text-foreground">
                      {notificacionesList.filter(n => n.tipo === "success").length}
                    </p>
                    <p className="text-sm text-muted-foreground">Pagos/Éxitos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Timeline */}
          <Card className="bg-card border-border">
            <CardHeader className="border-b border-border">
              <div className="flex items-center justify-between">
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Actividad Reciente
                </CardTitle>
                <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
                  <RefreshCw className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")} />
                  Actualizar
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[550px]">
                <div className="p-4">
                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-border" />
                    
                    <div className="space-y-6">
                      {notificacionesList.map((notificacion, index) => {
                        const TipoIcon = getTipoIcon(notificacion.tipo)
                        return (
                          <div
                            key={notificacion.id}
                            className="relative flex gap-4 cursor-pointer group"
                            onClick={() => openDetail(notificacion)}
                          >
                            {/* Timeline dot */}
                            <div className={cn(
                              "relative z-10 flex items-center justify-center h-10 w-10 rounded-full shrink-0 transition-transform group-hover:scale-110",
                              getTipoStyle(notificacion.tipo),
                              !notificacion.leida && "ring-2 ring-emerald ring-offset-2 ring-offset-background"
                            )}>
                              <TipoIcon className="h-4 w-4" />
                            </div>

                            {/* Content */}
                            <div className={cn(
                              "flex-1 bg-muted/30 rounded-lg p-4 transition-colors group-hover:bg-muted/50",
                              !notificacion.leida && "bg-emerald/5 group-hover:bg-emerald/10"
                            )}>
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <div className="flex items-center gap-2">
                                  <h4 className={cn(
                                    "font-medium text-foreground",
                                    !notificacion.leida && "font-semibold"
                                  )}>
                                    {notificacion.titulo}
                                  </h4>
                                  {!notificacion.leida && (
                                    <span className="h-2 w-2 rounded-full bg-emerald" />
                                  )}
                                </div>
                                <span className="text-xs text-muted-foreground whitespace-nowrap">
                                  {notificacion.tiempoRelativo}
                                </span>
                              </div>
                              
                              <p className="text-sm text-muted-foreground mb-3">
                                {notificacion.mensaje}
                              </p>

                              <div className="flex items-center flex-wrap gap-2">
                                <Badge className={cn("border-0 text-xs", getMotivoStyle(notificacion.motivo))}>
                                  {notificacion.motivo}
                                </Badge>
                                {notificacion.cliente && (
                                  <Badge variant="outline" className="text-xs">
                                    <User className="h-3 w-3 mr-1" />
                                    {notificacion.cliente.nombre}
                                  </Badge>
                                )}
                                {notificacion.obligacion && (
                                  <Badge variant="outline" className="text-xs font-mono">
                                    <CreditCard className="h-3 w-3 mr-1" />
                                    {notificacion.obligacion.numero}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Detail Dialog */}
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <div className="flex items-center gap-3">
                {selectedNotificacion && (
                  <>
                    <div className={cn("p-2 rounded-lg", getTipoStyle(selectedNotificacion.tipo))}>
                      {(() => {
                        const Icon = getTipoIcon(selectedNotificacion.tipo)
                        return <Icon className="h-5 w-5" />
                      })()}
                    </div>
                    <div>
                      <DialogTitle className="text-foreground">{selectedNotificacion.titulo}</DialogTitle>
                      <DialogDescription className="flex items-center gap-2 mt-1">
                        <Badge className={cn("border-0 text-xs", getMotivoStyle(selectedNotificacion.motivo))}>
                          {selectedNotificacion.motivo}
                        </Badge>
                        <span className="text-muted-foreground text-xs">
                          {selectedNotificacion.tiempoRelativo}
                        </span>
                      </DialogDescription>
                    </div>
                  </>
                )}
              </div>
            </DialogHeader>

            {selectedNotificacion && (
              <div className="space-y-4 pt-2">
                <p className="text-foreground">{selectedNotificacion.mensaje}</p>

                <div className="space-y-3 bg-muted/50 rounded-lg p-4">
                  {selectedNotificacion.cliente && (
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Cliente:</span>
                      <span className="text-sm font-medium text-foreground">{selectedNotificacion.cliente.nombre}</span>
                    </div>
                  )}
                  {selectedNotificacion.obligacion && (
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Obligación:</span>
                      <span className="text-sm font-mono font-medium text-foreground">{selectedNotificacion.obligacion.numero}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Hora:</span>
                    <span className="text-sm font-medium text-foreground">{selectedNotificacion.fecha} {selectedNotificacion.hora}</span>
                  </div>
                </div>

                {selectedNotificacion.accion && (
                  <div className="flex justify-end gap-2 pt-2">
                    <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
                      Cerrar
                    </Button>
                    <Button className="bg-emerald hover:bg-emerald-bright text-emerald-foreground">
                      {selectedNotificacion.accion}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </AppLayout>
    </AuthGuard>
  )
}
