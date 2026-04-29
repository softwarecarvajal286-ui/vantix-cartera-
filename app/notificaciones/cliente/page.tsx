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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Bell,
  Search,
  User,
  Clock,
  AlertCircle,
  CheckCircle,
  Info,
  ChevronRight,
  CreditCard,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ClienteNotificaciones {
  cliente: {
    id: string
    nombre: string
    cedula: string
  }
  notificaciones: {
    id: string
    tipo: "info" | "warning" | "success" | "error"
    motivo: string
    titulo: string
    mensaje: string
    fecha: string
    hora: string
    leida: boolean
  }[]
  totalNoLeidas: number
}

const clientesNotificaciones: ClienteNotificaciones[] = [
  {
    cliente: { id: "CLI-001", nombre: "Carlos Mendoza", cedula: "1234567890" },
    notificaciones: [
      { id: "NOT-001", tipo: "warning", motivo: "Vencimiento", titulo: "Cuota próxima a vencer", mensaje: "La cuota vence en 3 días", fecha: "2024-03-25", hora: "09:30", leida: false },
      { id: "NOT-005", tipo: "warning", motivo: "Acuerdo", titulo: "Acuerdo próximo a vencer", mensaje: "Verificar cumplimiento", fecha: "2024-03-23", hora: "14:30", leida: false },
      { id: "NOT-010", tipo: "success", motivo: "Pago", titulo: "Pago recibido", mensaje: "Se registró un pago de $500,000", fecha: "2024-03-20", hora: "10:00", leida: true },
    ],
    totalNoLeidas: 2
  },
  {
    cliente: { id: "CLI-002", nombre: "María García", cedula: "0987654321" },
    notificaciones: [
      { id: "NOT-002", tipo: "error", motivo: "Mora", titulo: "Cliente entró en mora", mensaje: "5 días de atraso", fecha: "2024-03-25", hora: "08:15", leida: false },
      { id: "NOT-011", tipo: "info", motivo: "Gestión", titulo: "Llamada programada", mensaje: "Recordatorio de llamada", fecha: "2024-03-24", hora: "07:00", leida: true },
    ],
    totalNoLeidas: 1
  },
  {
    cliente: { id: "CLI-003", nombre: "Juan Pérez", cedula: "1122334455" },
    notificaciones: [
      { id: "NOT-003", tipo: "success", motivo: "Pago", titulo: "Pago recibido", mensaje: "Pago de $1,200,000", fecha: "2024-03-24", hora: "16:45", leida: true },
    ],
    totalNoLeidas: 0
  },
  {
    cliente: { id: "CLI-004", nombre: "Ana López", cedula: "5544332211" },
    notificaciones: [
      { id: "NOT-004", tipo: "info", motivo: "Gestión", titulo: "Gestión programada", mensaje: "Llamada a las 10:00 AM", fecha: "2024-03-24", hora: "07:00", leida: true },
    ],
    totalNoLeidas: 0
  },
  {
    cliente: { id: "CLI-005", nombre: "Roberto Díaz", cedula: "6677889900" },
    notificaciones: [
      { id: "NOT-006", tipo: "success", motivo: "Compromiso", titulo: "Compromiso cumplido", mensaje: "Pago de $500,000", fecha: "2024-03-23", hora: "11:20", leida: true },
    ],
    totalNoLeidas: 0
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
    default: return "bg-muted text-muted-foreground"
  }
}

export default function NotificacionesPorClientePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCliente, setSelectedCliente] = useState<ClienteNotificaciones | null>(null)
  const [filtroEstado, setFiltroEstado] = useState("todos")

  const clientesFiltrados = clientesNotificaciones.filter(c =>
    c.cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.cliente.cedula.includes(searchTerm)
  ).filter(c => {
    if (filtroEstado === "con_pendientes") return c.totalNoLeidas > 0
    return true
  })

  const formatDate = (fecha: string) => {
    const date = new Date(fecha)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (fecha === today.toISOString().split("T")[0]) return "Hoy"
    if (fecha === yesterday.toISOString().split("T")[0]) return "Ayer"
    return date.toLocaleDateString("es-CO", { day: "numeric", month: "short" })
  }

  const totalNotificaciones = clientesNotificaciones.reduce((acc, c) => acc + c.notificaciones.length, 0)
  const totalNoLeidas = clientesNotificaciones.reduce((acc, c) => acc + c.totalNoLeidas, 0)
  const clientesConPendientes = clientesNotificaciones.filter(c => c.totalNoLeidas > 0).length

  return (
    <AuthGuard>
      <AppLayout>
        <Topbar
          title="Notificaciones por Cliente"
          breadcrumbs={[{ label: "Notificaciones" }, { label: "Por Cliente" }]}
        />

        <div className="p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald/10">
                    <User className="h-5 w-5 text-emerald" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{clientesNotificaciones.length}</p>
                    <p className="text-sm text-muted-foreground">Clientes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-info/10">
                    <Bell className="h-5 w-5 text-info" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{totalNotificaciones}</p>
                    <p className="text-sm text-muted-foreground">Total notificaciones</p>
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
                    <p className="text-2xl font-bold text-foreground">{totalNoLeidas}</p>
                    <p className="text-sm text-muted-foreground">Sin leer</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-warning/10">
                    <User className="h-5 w-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{clientesConPendientes}</p>
                    <p className="text-sm text-muted-foreground">Con pendientes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cliente List */}
            <Card className="bg-card border-border lg:col-span-1">
              <CardHeader className="border-b border-border">
                <CardTitle className="text-foreground flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Clientes
                </CardTitle>
                <div className="space-y-3 pt-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar cliente..."
                      className="pl-9 bg-background"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos los clientes</SelectItem>
                      <SelectItem value="con_pendientes">Con pendientes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[500px]">
                  <div className="divide-y divide-border">
                    {clientesFiltrados.map((item) => (
                      <div
                        key={item.cliente.id}
                        className={cn(
                          "flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors cursor-pointer",
                          selectedCliente?.cliente.id === item.cliente.id && "bg-emerald/10"
                        )}
                        onClick={() => setSelectedCliente(item)}
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-emerald/20 text-emerald">
                            {item.cliente.nombre.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate">{item.cliente.nombre}</p>
                          <p className="text-xs text-muted-foreground">{item.cliente.cedula}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {item.totalNoLeidas > 0 && (
                            <Badge className="bg-destructive text-destructive-foreground border-0">
                              {item.totalNoLeidas}
                            </Badge>
                          )}
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Notificaciones del Cliente */}
            <Card className="bg-card border-border lg:col-span-2">
              <CardHeader className="border-b border-border">
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  {selectedCliente ? `Notificaciones de ${selectedCliente.cliente.nombre}` : "Selecciona un cliente"}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {!selectedCliente ? (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <User className="h-12 w-12 mb-4 opacity-50" />
                    <p className="text-lg font-medium">Selecciona un cliente</p>
                    <p className="text-sm">Las notificaciones aparecerán aquí</p>
                  </div>
                ) : selectedCliente.notificaciones.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mb-4 text-emerald" />
                    <p className="text-lg font-medium">Sin notificaciones</p>
                    <p className="text-sm">Este cliente no tiene notificaciones</p>
                  </div>
                ) : (
                  <ScrollArea className="h-[500px]">
                    <div className="divide-y divide-border">
                      {selectedCliente.notificaciones.map((notificacion) => {
                        const TipoIcon = getTipoIcon(notificacion.tipo)
                        return (
                          <div
                            key={notificacion.id}
                            className={cn(
                              "flex items-start gap-4 p-4 hover:bg-muted/50 transition-colors",
                              !notificacion.leida && "bg-emerald/5"
                            )}
                          >
                            <div className={cn("p-2 rounded-lg shrink-0", getTipoStyle(notificacion.tipo))}>
                              <TipoIcon className="h-4 w-4" />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className={cn(
                                  "font-medium text-foreground",
                                  !notificacion.leida && "font-semibold"
                                )}>
                                  {notificacion.titulo}
                                </h4>
                                {!notificacion.leida && (
                                  <span className="h-2 w-2 rounded-full bg-emerald shrink-0" />
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {notificacion.mensaje}
                              </p>
                              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                <Badge className={cn("border-0 text-xs", getMotivoStyle(notificacion.motivo))}>
                                  {notificacion.motivo}
                                </Badge>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {formatDate(notificacion.fecha)} {notificacion.hora}
                                </span>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </AppLayout>
    </AuthGuard>
  )
}
