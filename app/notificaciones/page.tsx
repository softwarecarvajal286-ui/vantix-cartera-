"use client"

import { useEffect, useMemo, useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { Topbar } from "@/components/topbar"
import { AuthGuard } from "@/components/auth-guard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  Eye,
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
  Filter,
  Calendar,
  CreditCard,
  FileText,
  Phone,
  Mail,
  MessageSquare,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import {
  getFinancieraModuleConfig,
  getNotificationsForFinanciera,
  resolveSupportedFinancieraId,
} from "@/lib/financiera-module-content"

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
  particular?: boolean
}

const notificaciones: Notificacion[] = [
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
    id: "NOT-003",
    tipo: "success",
    motivo: "Pago",
    titulo: "Pago recibido",
    mensaje: "Se registró un pago de $1,200,000 para el crédito CR-2024-003",
    fecha: "2024-03-24",
    hora: "16:45",
    leida: true,
    cliente: { id: "CLI-003", nombre: "Juan Pérez" },
    obligacion: { id: "OBL-003", numero: "CR-2024-003" },
    accion: "Ver pago"
  },
  {
    id: "NOT-004",
    tipo: "info",
    motivo: "Gestión",
    titulo: "Gestión programada",
    mensaje: "Tiene una llamada programada con Ana López a las 10:00 AM",
    fecha: "2024-03-24",
    hora: "07:00",
    leida: true,
    cliente: { id: "CLI-004", nombre: "Ana López" },
    gestor: { id: "GES-002", nombre: "Ana Pérez" },
    accion: "Ver agenda"
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
  {
    id: "NOT-006",
    tipo: "success",
    motivo: "Compromiso",
    titulo: "Compromiso cumplido",
    mensaje: "Roberto Díaz cumplió su compromiso de pago por $500,000",
    fecha: "2024-03-23",
    hora: "11:20",
    leida: true,
    cliente: { id: "CLI-005", nombre: "Roberto Díaz" },
    gestor: { id: "GES-001", nombre: "Juan Díaz" },
    accion: "Ver detalle"
  },
  {
    id: "NOT-007",
    tipo: "error",
    motivo: "Incumplimiento",
    titulo: "Acuerdo incumplido",
    mensaje: "El cliente Luis Torres no cumplió con la cuota acordada",
    fecha: "2024-03-22",
    hora: "18:00",
    leida: true,
    cliente: { id: "CLI-006", nombre: "Luis Torres" },
    obligacion: { id: "OBL-006", numero: "CR-2024-006" },
    accion: "Reprogramar"
  },
  {
    id: "NOT-008",
    tipo: "info",
    motivo: "Sistema",
    titulo: "Nueva asignación",
    mensaje: "Se le han asignado 5 nuevos casos de cartera",
    fecha: "2024-03-22",
    hora: "08:00",
    leida: true,
    gestor: { id: "GES-002", nombre: "Ana Pérez" },
    accion: "Ver cartera"
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
    case "Clientes sin gestion": return "bg-warning/10 text-warning"
    case "Pagos pendientes hoy": return "bg-info/10 text-info"
    case "Alza en indicador establecido": return "bg-destructive/10 text-destructive"
    case "Alerta FPD7": return "bg-warning/10 text-warning"
    case "Alerta FPD15": return "bg-warning/10 text-warning"
    case "Promesa de pago": return "bg-emerald/10 text-emerald"
    case "Cambio subestado": return "bg-warning/10 text-warning"
    case "Cuota pateada": return "bg-destructive/10 text-destructive"
    case "Pago realizado": return "bg-emerald/10 text-emerald"
    case "Inconsistencia": return "bg-info/10 text-info"
    case "Documentacion incompleta": return "bg-warning/10 text-warning"
    case "Pago WhatsApp": return "bg-emerald/10 text-emerald"
    case "Aprobacion cliente": return "bg-info/10 text-info"
    case "Alerta cartera": return "bg-destructive/10 text-destructive"
    case "Recordatorio WhatsApp": return "bg-info/10 text-info"
    case "Gestión": return "bg-info/10 text-info"
    case "Sistema": return "bg-special/10 text-special"
    default: return "bg-muted text-muted-foreground"
  }
}

export default function NotificacionesPage() {
  const { user, selectedFinanciera } = useAuth()
  const activeFinancieraId = resolveSupportedFinancieraId(selectedFinanciera?.id ?? user?.financieraId)
  const financieraActiva = getFinancieraModuleConfig(activeFinancieraId)
  const [searchTerm, setSearchTerm] = useState("")
  const [filtroMotivo, setFiltroMotivo] = useState("todos")
  const [filtroEstado, setFiltroEstado] = useState("todos")
  const baseNotificaciones = useMemo(() => getNotificationsForFinanciera(activeFinancieraId), [activeFinancieraId])
  const [notificacionesList, setNotificacionesList] = useState<Notificacion[]>(baseNotificaciones)
  const [selectedNotificacion, setSelectedNotificacion] = useState<Notificacion | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  useEffect(() => {
    setNotificacionesList(baseNotificaciones)
  }, [baseNotificaciones])

  const noLeidas = notificacionesList.filter(n => !n.leida).length
  const leidas = notificacionesList.filter(n => n.leida).length

  const notificacionesFiltradas = notificacionesList.filter(n => {
    const matchSearch = 
      n.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.mensaje.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.cliente?.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.gestor?.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchMotivo = filtroMotivo === "todos" || n.motivo === filtroMotivo
    const matchEstado = 
      filtroEstado === "todos" ||
      (filtroEstado === "leidas" && n.leida) ||
      (filtroEstado === "no_leidas" && !n.leida)

    return matchSearch && matchMotivo && matchEstado
  })

  const marcarComoLeida = (id: string) => {
    setNotificacionesList(prev =>
      prev.map(n => n.id === id ? { ...n, leida: true } : n)
    )
  }

  const marcarComoNoLeida = (id: string) => {
    setNotificacionesList(prev =>
      prev.map(n => n.id === id ? { ...n, leida: false } : n)
    )
  }

  const marcarTodasComoLeidas = () => {
    setNotificacionesList(prev =>
      prev.map(n => ({ ...n, leida: true }))
    )
  }

  const eliminarNotificacion = (id: string) => {
    setNotificacionesList(prev => prev.filter(n => n.id !== id))
  }

  const openDetail = (notificacion: Notificacion) => {
    setSelectedNotificacion(notificacion)
    setIsDetailOpen(true)
    if (!notificacion.leida) {
      marcarComoLeida(notificacion.id)
    }
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

  const motivos = [...new Set(notificacionesList.map(n => n.motivo))]

  return (
    <AuthGuard>
      <AppLayout>
        <Topbar
          title="Notificaciones"
          breadcrumbs={[{ label: "Notificaciones" }, { label: "Todas" }]}
        />

        <div className="p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald/10">
                    <Bell className="h-5 w-5 text-emerald" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{notificacionesList.length}</p>
                    <p className="text-sm text-muted-foreground">Total</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-destructive/10">
                    <EyeOff className="h-5 w-5 text-destructive" />
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
                  <div className="p-2 rounded-lg bg-info/10">
                    <Eye className="h-5 w-5 text-info" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{leidas}</p>
                    <p className="text-sm text-muted-foreground">Leídas</p>
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
                      {notificacionesList.filter(n => n.tipo === "warning" || n.tipo === "error").length}
                    </p>
                    <p className="text-sm text-muted-foreground">Urgentes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Actions */}
          <Card className="bg-card border-border">
            <CardHeader className="border-b border-border pb-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-foreground">Centro de Notificaciones</CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Alertas genericas del sistema y notificaciones particulares de {financieraActiva.nombre}.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar notificación..."
                      className="pl-9 bg-background"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={filtroMotivo} onValueChange={setFiltroMotivo}>
                    <SelectTrigger className="w-36 bg-background">
                      <SelectValue placeholder="Motivo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      {motivos.map(m => (
                        <SelectItem key={m} value={m}>{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                    <SelectTrigger className="w-36 bg-background">
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todas</SelectItem>
                      <SelectItem value="no_leidas">No leídas</SelectItem>
                      <SelectItem value="leidas">Leídas</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    onClick={marcarTodasComoLeidas}
                    disabled={noLeidas === 0}
                  >
                    <CheckCheck className="h-4 w-4 mr-2" />
                    Marcar todas
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <Tabs defaultValue="todas" className="w-full">
                <div className="border-b border-border px-4">
                  <TabsList className="bg-transparent h-12">
                    <TabsTrigger value="todas" className="data-[state=active]:bg-emerald/10 data-[state=active]:text-emerald">
                      Todas ({notificacionesList.length})
                    </TabsTrigger>
                    <TabsTrigger value="no_leidas" className="data-[state=active]:bg-emerald/10 data-[state=active]:text-emerald">
                      No leídas ({noLeidas})
                    </TabsTrigger>
                    <TabsTrigger value="urgentes" className="data-[state=active]:bg-emerald/10 data-[state=active]:text-emerald">
                      Urgentes ({notificacionesList.filter(n => n.tipo === "warning" || n.tipo === "error").length})
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="todas" className="m-0">
                  <NotificacionList
                    notificaciones={notificacionesFiltradas}
                    onOpen={openDetail}
                    onMarkAsRead={marcarComoLeida}
                    onMarkAsUnread={marcarComoNoLeida}
                    onDelete={eliminarNotificacion}
                    formatDate={formatDate}
                  />
                </TabsContent>
                <TabsContent value="no_leidas" className="m-0">
                  <NotificacionList
                    notificaciones={notificacionesFiltradas.filter(n => !n.leida)}
                    onOpen={openDetail}
                    onMarkAsRead={marcarComoLeida}
                    onMarkAsUnread={marcarComoNoLeida}
                    onDelete={eliminarNotificacion}
                    formatDate={formatDate}
                  />
                </TabsContent>
                <TabsContent value="urgentes" className="m-0">
                  <NotificacionList
                    notificaciones={notificacionesFiltradas.filter(n => n.tipo === "warning" || n.tipo === "error")}
                    onOpen={openDetail}
                    onMarkAsRead={marcarComoLeida}
                    onMarkAsUnread={marcarComoNoLeida}
                    onDelete={eliminarNotificacion}
                    formatDate={formatDate}
                  />
                </TabsContent>
              </Tabs>
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
                  {selectedNotificacion.gestor && (
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Gestor:</span>
                      <span className="text-sm font-medium text-foreground">{selectedNotificacion.gestor.nombre}</span>
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

interface NotificacionListProps {
  notificaciones: Notificacion[]
  onOpen: (n: Notificacion) => void
  onMarkAsRead: (id: string) => void
  onMarkAsUnread: (id: string) => void
  onDelete: (id: string) => void
  formatDate: (fecha: string) => string
}

function NotificacionList({
  notificaciones,
  onOpen,
  onMarkAsRead,
  onMarkAsUnread,
  onDelete,
  formatDate,
}: NotificacionListProps) {
  if (notificaciones.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <Bell className="h-12 w-12 mb-4 opacity-50" />
        <p className="text-lg font-medium">No hay notificaciones</p>
        <p className="text-sm">Las notificaciones aparecerán aquí</p>
      </div>
    )
  }

  return (
    <ScrollArea className="h-[500px]">
      <div className="divide-y divide-border">
        {notificaciones.map((notificacion) => {
          const TipoIcon = getTipoIcon(notificacion.tipo)
          return (
            <div
              key={notificacion.id}
              className={cn(
                "flex items-start gap-4 p-4 hover:bg-muted/50 transition-colors cursor-pointer",
                !notificacion.leida && "bg-emerald/5"
              )}
              onClick={() => onOpen(notificacion)}
            >
              <div className={cn("p-2 rounded-lg shrink-0", getTipoStyle(notificacion.tipo))}>
                <TipoIcon className="h-4 w-4" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className={cn(
                    "font-medium text-foreground truncate",
                    !notificacion.leida && "font-semibold"
                  )}>
                    {notificacion.titulo}
                  </h4>
                  {!notificacion.leida && (
                    <span className="h-2 w-2 rounded-full bg-emerald shrink-0" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                  {notificacion.mensaje}
                </p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <Badge className={cn("border-0 text-xs", getMotivoStyle(notificacion.motivo))}>
                    {notificacion.motivo}
                  </Badge>
                  {notificacion.particular && (
                    <Badge variant="outline" className="text-[10px] uppercase tracking-[0.14em]">
                      Particular
                    </Badge>
                  )}
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
                  {notificacion.leida ? (
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onMarkAsUnread(notificacion.id) }}>
                      <EyeOff className="h-4 w-4 mr-2" />
                      Marcar como no leída
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onMarkAsRead(notificacion.id) }}>
                      <Check className="h-4 w-4 mr-2" />
                      Marcar como leída
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={(e) => { e.stopPropagation(); onDelete(notificacion.id) }}
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
  )
}
