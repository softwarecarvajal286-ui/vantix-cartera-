"use client"

import { useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { Topbar } from "@/components/topbar"
import { AuthGuard } from "@/components/auth-guard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Bell,
  Search,
  EyeOff,
  Clock,
  User,
  AlertCircle,
  CheckCircle,
  Info,
  Trash2,
  MoreHorizontal,
  Check,
  CheckCheck,
  CreditCard,
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
  gestor?: { id: string; nombre: string }
  obligacion?: { id: string; numero: string }
  accion?: string
}

const notificacionesPendientes: Notificacion[] = [
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
    accion: "Ver obligación"
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
    gestor: { id: "GES-001", nombre: "Juan Díaz" },
    obligacion: { id: "OBL-002", numero: "CR-2024-002" },
    accion: "Gestionar"
  },
  {
    id: "NOT-005",
    tipo: "warning",
    motivo: "Acuerdo",
    titulo: "Acuerdo próximo a vencer",
    mensaje: "El acuerdo de pago ACU-001 vence mañana. Verificar cumplimiento.",
    fecha: "2024-03-23",
    hora: "14:30",
    leida: false,
    cliente: { id: "CLI-001", nombre: "Carlos Mendoza" },
    accion: "Ver acuerdo"
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

export default function NotificacionesPendientesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [notificacionesList, setNotificacionesList] = useState(notificacionesPendientes)
  const [selectedNotificacion, setSelectedNotificacion] = useState<Notificacion | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const notificacionesFiltradas = notificacionesList.filter(n =>
    n.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.mensaje.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.cliente?.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const marcarComoLeida = (id: string) => {
    setNotificacionesList(prev => prev.filter(n => n.id !== id))
  }

  const marcarTodasComoLeidas = () => {
    setNotificacionesList([])
  }

  const eliminarNotificacion = (id: string) => {
    setNotificacionesList(prev => prev.filter(n => n.id !== id))
  }

  const openDetail = (notificacion: Notificacion) => {
    setSelectedNotificacion(notificacion)
    setIsDetailOpen(true)
  }

  const formatDate = (fecha: string) => {
    const date = new Date(fecha)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (fecha === today.toISOString().split("T")[0]) return "Hoy"
    if (fecha === yesterday.toISOString().split("T")[0]) return "Ayer"
    return date.toLocaleDateString("es-CO", { day: "numeric", month: "short" })
  }

  return (
    <AuthGuard>
      <AppLayout>
        <Topbar
          title="Notificaciones Pendientes"
          breadcrumbs={[{ label: "Notificaciones" }, { label: "Pendientes" }]}
        />

        <div className="p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-destructive/10">
                    <EyeOff className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{notificacionesList.length}</p>
                    <p className="text-sm text-muted-foreground">Sin leer</p>
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
                    <p className="text-2xl font-bold text-foreground">
                      {notificacionesList.filter(n => n.tipo === "error").length}
                    </p>
                    <p className="text-sm text-muted-foreground">Críticas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-warning/10">
                    <AlertCircle className="h-5 w-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {notificacionesList.filter(n => n.tipo === "warning").length}
                    </p>
                    <p className="text-sm text-muted-foreground">Advertencias</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* List */}
          <Card className="bg-card border-border">
            <CardHeader className="border-b border-border">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <CardTitle className="text-foreground flex items-center gap-2">
                  <EyeOff className="h-5 w-5" />
                  Notificaciones sin leer
                </CardTitle>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar..."
                      className="pl-9 bg-background"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button
                    variant="outline"
                    onClick={marcarTodasComoLeidas}
                    disabled={notificacionesList.length === 0}
                  >
                    <CheckCheck className="h-4 w-4 mr-2" />
                    Marcar todas como leídas
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {notificacionesFiltradas.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mb-4 text-emerald" />
                  <p className="text-lg font-medium">Todo al día</p>
                  <p className="text-sm">No tienes notificaciones pendientes</p>
                </div>
              ) : (
                <ScrollArea className="h-[500px]">
                  <div className="divide-y divide-border">
                    {notificacionesFiltradas.map((notificacion) => {
                      const TipoIcon = getTipoIcon(notificacion.tipo)
                      return (
                        <div
                          key={notificacion.id}
                          className="flex items-start gap-4 p-4 hover:bg-muted/50 transition-colors cursor-pointer bg-emerald/5"
                          onClick={() => openDetail(notificacion)}
                        >
                          <div className={cn("p-2 rounded-lg shrink-0", getTipoStyle(notificacion.tipo))}>
                            <TipoIcon className="h-4 w-4" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-foreground truncate">
                                {notificacion.titulo}
                              </h4>
                              <span className="h-2 w-2 rounded-full bg-emerald shrink-0" />
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                              {notificacion.mensaje}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <Badge className={cn("border-0 text-xs", getMotivoStyle(notificacion.motivo))}>
                                {notificacion.motivo}
                              </Badge>
                              {notificacion.cliente && (
                                <span className="flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  {notificacion.cliente.nombre}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatDate(notificacion.fecha)} {notificacion.hora}
                              </span>
                            </div>
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); marcarComoLeida(notificacion.id) }}>
                                <Check className="h-4 w-4 mr-2" />
                                Marcar como leída
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={(e) => { e.stopPropagation(); eliminarNotificacion(notificacion.id) }}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      )
                    })}
                  </div>
                </ScrollArea>
              )}
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
                          {selectedNotificacion.fecha} - {selectedNotificacion.hora}
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
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" onClick={() => {
                    marcarComoLeida(selectedNotificacion.id)
                    setIsDetailOpen(false)
                  }}>
                    <Check className="h-4 w-4 mr-2" />
                    Marcar leída
                  </Button>
                  {selectedNotificacion.accion && (
                    <Button className="bg-emerald hover:bg-emerald-bright text-emerald-foreground">
                      {selectedNotificacion.accion}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </AppLayout>
    </AuthGuard>
  )
}
