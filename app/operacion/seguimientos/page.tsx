"use client"

import { useState, useMemo } from "react"
import {
  Search,
  Filter,
  AlertCircle,
  Clock,
  Phone,
  Mail,
  MessageSquare,
  Eye,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Calendar,
  RefreshCw,
  X,
} from "lucide-react"
import { AppLayout } from "@/components/app-layout"
import { Topbar } from "@/components/topbar"
import { AuthGuard } from "@/components/auth-guard"
import { useApp } from "@/lib/app-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

const ITEMS_PER_PAGE = 10

export default function SeguimientosVencidosPage() {
  const { clientes, gestores, agregarGestion, mostrarNotificacion } = useApp()
  const [searchTerm, setSearchTerm] = useState("")
  const [filtroGestor, setFiltroGestor] = useState("todos")
  const [filtroDias, setFiltroDias] = useState("todos")
  const [currentPage, setCurrentPage] = useState(1)
  const [isGestionModalOpen, setIsGestionModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const [gestionForm, setGestionForm] = useState({
    canal: "telefono",
    resultado: "contacto_efectivo",
    observaciones: "",
    siguienteAccion: "",
    fechaSiguienteAccion: ""
  })

  // Obtener seguimientos vencidos
  const seguimientosVencidos = useMemo(() => {
    const hoy = new Date()
    const items: any[] = []

    clientes.forEach(cliente => {
      cliente.cuentas.forEach(cuenta => {
        cuenta.historialGestiones.forEach(gestion => {
          if (gestion.fechaSiguienteAccion) {
            const fechaSeguimiento = new Date(gestion.fechaSiguienteAccion)
            if (fechaSeguimiento < hoy) {
              const diasVencido = Math.floor((hoy.getTime() - fechaSeguimiento.getTime()) / (1000 * 60 * 60 * 24))
              items.push({
                id: `${cuenta.id}-${gestion.fecha}-${gestion.hora}`,
                cliente,
                cuenta,
                gestion,
                fechaSeguimiento: gestion.fechaSiguienteAccion,
                diasVencido,
                siguienteAccion: gestion.siguienteAccion
              })
            }
          }
        })
      })
    })

    return items.sort((a, b) => b.diasVencido - a.diasVencido)
  }, [clientes])

  // Filtrar
  const itemsFiltrados = useMemo(() => {
    return seguimientosVencidos.filter(item => {
      if (searchTerm) {
        const busqueda = searchTerm.toLowerCase()
        const coincide = 
          item.cliente.nombre.toLowerCase().includes(busqueda) ||
          item.cliente.apellido.toLowerCase().includes(busqueda) ||
          item.cliente.cedula.includes(searchTerm) ||
          item.cuenta.numeroCredito.includes(searchTerm)
        if (!coincide) return false
      }

      if (filtroGestor !== "todos" && item.cuenta.gestorAsignado !== filtroGestor) return false
      
      if (filtroDias !== "todos") {
        const dias = parseInt(filtroDias)
        if (dias === 7 && item.diasVencido > 7) return false
        if (dias === 15 && (item.diasVencido <= 7 || item.diasVencido > 15)) return false
        if (dias === 30 && item.diasVencido <= 15) return false
      }

      return true
    })
  }, [seguimientosVencidos, searchTerm, filtroGestor, filtroDias])

  const totalPages = Math.ceil(itemsFiltrados.length / ITEMS_PER_PAGE)
  const paginatedData = itemsFiltrados.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const handleGestionar = (item: any) => {
    setSelectedItem(item)
    setIsGestionModalOpen(true)
  }

  const handleSubmitGestion = () => {
    if (!selectedItem) return

    const gestor = gestores.find(g => g.id === selectedItem.cuenta.gestorAsignado) || gestores[0]
    
    agregarGestion(selectedItem.cuenta.id, {
      fecha: new Date().toISOString().split("T")[0],
      hora: new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" }),
      canal: gestionForm.canal as any,
      resultado: gestionForm.resultado as any,
      observaciones: gestionForm.observaciones,
      gestorId: gestor.id,
      gestorNombre: gestor.nombre,
      siguienteAccion: gestionForm.siguienteAccion,
      fechaSiguienteAccion: gestionForm.fechaSiguienteAccion
    })

    setGestionForm({
      canal: "telefono",
      resultado: "contacto_efectivo",
      observaciones: "",
      siguienteAccion: "",
      fechaSiguienteAccion: ""
    })
    setIsGestionModalOpen(false)
    setSelectedItem(null)
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
      mostrarNotificacion({
        tipo: "success",
        titulo: "Datos actualizados",
        mensaje: "Los seguimientos han sido actualizados"
      })
    }, 800)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setFiltroGestor("todos")
    setFiltroDias("todos")
    setCurrentPage(1)
  }

  const hasActiveFilters = filtroGestor !== "todos" || filtroDias !== "todos"

  return (
    <AuthGuard>
      <AppLayout>
        <Topbar
          title="Seguimientos Vencidos"
          breadcrumbs={[
            { label: "Inicio", href: "/" },
            { label: "Operacion" },
            { label: "Seguimientos Vencidos" }
          ]}
          showCreate={false}
        />

        <div className="p-6 space-y-4">
          {/* Search and Filter Bar */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[280px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, cedula o numero de credito..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
                className="pl-10"
              />
            </div>

            <Select value={filtroGestor} onValueChange={(v) => { setFiltroGestor(v); setCurrentPage(1) }}>
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

            <Select value={filtroDias} onValueChange={(v) => { setFiltroDias(v); setCurrentPage(1) }}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Dias vencido" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="7">Hasta 7 dias</SelectItem>
                <SelectItem value="15">8-15 dias</SelectItem>
                <SelectItem value="30">Mas de 15 dias</SelectItem>
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-1" />
                Limpiar
              </Button>
            )}

            <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isRefreshing} className="ml-auto">
              <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-card">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Total Vencidos</p>
                <p className="text-2xl font-bold text-destructive">{itemsFiltrados.length}</p>
              </CardContent>
            </Card>
            <Card className="bg-card">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Hasta 7 dias</p>
                <p className="text-2xl font-bold text-amber-500">
                  {itemsFiltrados.filter(i => i.diasVencido <= 7).length}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">8-15 dias</p>
                <p className="text-2xl font-bold text-orange-500">
                  {itemsFiltrados.filter(i => i.diasVencido > 7 && i.diasVencido <= 15).length}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Mas de 15 dias</p>
                <p className="text-2xl font-bold text-red-600">
                  {itemsFiltrados.filter(i => i.diasVencido > 15).length}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Table */}
          <Card className="bg-card">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 font-medium text-muted-foreground">Cliente</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Credito</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Fecha Seguimiento</th>
                    <th className="text-center p-4 font-medium text-muted-foreground">Dias Vencido</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Accion Pendiente</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Gestor</th>
                    <th className="text-center p-4 font-medium text-muted-foreground">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((item) => {
                    const gestor = gestores.find(g => g.id === item.cuenta.gestorAsignado)
                    return (
                      <tr
                        key={item.id}
                        className="border-b border-border hover:bg-muted/50 transition-colors"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center text-destructive font-medium shrink-0">
                              {item.cliente.nombre.charAt(0)}{item.cliente.apellido.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium truncate">{item.cliente.nombre} {item.cliente.apellido}</p>
                              <p className="text-sm text-muted-foreground">{item.cliente.cedula}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="font-mono text-sm">{item.cuenta.numeroCredito}</p>
                          <p className="text-sm text-destructive">{formatCurrency(item.cuenta.saldoMora)}</p>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{item.fechaSeguimiento}</span>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <span className={cn(
                            "inline-flex items-center justify-center h-8 px-3 rounded-full font-bold text-sm",
                            item.diasVencido <= 7 && "bg-amber-500/10 text-amber-500",
                            item.diasVencido > 7 && item.diasVencido <= 15 && "bg-orange-500/10 text-orange-500",
                            item.diasVencido > 15 && "bg-red-600/20 text-red-600"
                          )}>
                            <AlertCircle className="h-3 w-3 mr-1" />
                            {item.diasVencido}d
                          </span>
                        </td>
                        <td className="p-4">
                          <p className="text-sm max-w-[200px] truncate">{item.siguienteAccion || "Sin accion definida"}</p>
                        </td>
                        <td className="p-4">
                          <p className="text-sm">{gestor?.nombre || "Sin asignar"}</p>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => {
                                mostrarNotificacion({ tipo: "info", titulo: "Llamando...", mensaje: `Iniciando llamada a ${item.cliente.telefono}` })
                              }}
                            >
                              <Phone className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => window.open(`https://wa.me/57${item.cliente.telefono}`)}
                            >
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleGestionar(item)}
                            >
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                              Gestionar
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                  {paginatedData.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-muted-foreground">
                        <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No hay seguimientos vencidos</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Mostrando {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, itemsFiltrados.length)} de {itemsFiltrados.length}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm">
                    Pagina {currentPage} de {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Modal de Gestion */}
        <Dialog open={isGestionModalOpen} onOpenChange={setIsGestionModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Registrar Gestion</DialogTitle>
              <DialogDescription>
                {selectedItem && `${selectedItem.cliente.nombre} ${selectedItem.cliente.apellido} - ${selectedItem.cuenta.numeroCredito}`}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Canal</Label>
                  <Select value={gestionForm.canal} onValueChange={(v) => setGestionForm({...gestionForm, canal: v})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="telefono">Telefono</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      <SelectItem value="visita">Visita</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Resultado</Label>
                  <Select value={gestionForm.resultado} onValueChange={(v) => setGestionForm({...gestionForm, resultado: v})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="contacto_efectivo">Contacto Efectivo</SelectItem>
                      <SelectItem value="no_contesta">No Contesta</SelectItem>
                      <SelectItem value="numero_errado">Numero Errado</SelectItem>
                      <SelectItem value="buzon">Buzon</SelectItem>
                      <SelectItem value="promesa_pago">Promesa de Pago</SelectItem>
                      <SelectItem value="negativa">Negativa</SelectItem>
                      <SelectItem value="acuerdo">Acuerdo</SelectItem>
                      <SelectItem value="pago_realizado">Pago Realizado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Observaciones</Label>
                <Textarea 
                  value={gestionForm.observaciones}
                  onChange={(e) => setGestionForm({...gestionForm, observaciones: e.target.value})}
                  placeholder="Detalle de la gestion..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Siguiente Accion</Label>
                <Input 
                  value={gestionForm.siguienteAccion}
                  onChange={(e) => setGestionForm({...gestionForm, siguienteAccion: e.target.value})}
                  placeholder="Accion a realizar..."
                />
              </div>
              <div className="space-y-2">
                <Label>Fecha Siguiente Accion</Label>
                <Input 
                  type="date"
                  value={gestionForm.fechaSiguienteAccion}
                  onChange={(e) => setGestionForm({...gestionForm, fechaSiguienteAccion: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsGestionModalOpen(false)}>Cancelar</Button>
              <Button onClick={handleSubmitGestion}>Guardar Gestion</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </AppLayout>
    </AuthGuard>
  )
}
