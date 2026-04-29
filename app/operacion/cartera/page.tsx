"use client"

import { Suspense, useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import {
  Search,
  Filter,
  Download,
  Plus,
  MoreHorizontal,
  Phone,
  Mail,
  MessageSquare,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ArrowUpDown,
  RefreshCw,
} from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"
import { AppLayout } from "@/components/app-layout"
import { Topbar } from "@/components/topbar"
import { StatusBadge } from "@/components/status-badge"
import { useApp } from "@/lib/app-context"
import { Cliente, Cuenta, EstadoCuenta, TipoProducto, CanalContacto, ResultadoGestion } from "@/lib/types"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

const ITEMS_PER_PAGE = 10

const tipoProductoLabels: Record<TipoProducto, string> = {
  credito_consumo: "Crédito Consumo",
  tarjeta_credito: "Tarjeta Crédito",
  hipotecario: "Hipotecario",
  vehicular: "Vehicular",
  microempresa: "Microempresa"
}

const estadoLabels: Record<EstadoCuenta, string> = {
  al_dia: "Al día",
  mora_temprana: "Mora Temprana",
  mora_media: "Mora Media",
  mora_avanzada: "Mora Avanzada",
  critico: "Crítico",
  castigado: "Castigado"
}

const canalLabels: Record<CanalContacto, string> = {
  telefono: "Teléfono",
  sms: "SMS",
  email: "Email",
  whatsapp: "WhatsApp",
  visita: "Visita",
  carta: "Carta"
}

const resultadoLabels: Record<ResultadoGestion, string> = {
  contacto_efectivo: "Contacto Efectivo",
  no_contesta: "No Contesta",
  numero_errado: "Número Errado",
  buzon: "Buzón",
  promesa_pago: "Promesa de Pago",
  negativa: "Negativa",
  acuerdo: "Acuerdo",
  pago_realizado: "Pago Realizado"
}

function CarteraPageContent() {
  const searchParams = useSearchParams()
  const {
    clientes,
    gestores,
    filtrosCartera,
    setFiltrosCartera,
    obtenerCuentasFiltradas,
    agregarGestion,
    asignarGestor,
    mostrarNotificacion
  } = useApp()

  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCuenta, setSelectedCuenta] = useState<{ cliente: Cliente; cuenta: Cuenta } | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isGestionModalOpen, setIsGestionModalOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [sortField, setSortField] = useState<"diasMora" | "saldoMora" | "nombre">("diasMora")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const [gestionForm, setGestionForm] = useState({
    canal: "telefono" as CanalContacto,
    resultado: "contacto_efectivo" as ResultadoGestion,
    observaciones: "",
    siguienteAccion: "",
    fechaSiguienteAccion: "",
    promesaMonto: "",
    promesaFecha: ""
  })

  useEffect(() => {
    const cuentaId = searchParams.get("cuenta")
    const estado = searchParams.get("estado")
    
    if (estado) {
      setFiltrosCartera((prev) => (
        prev.estado === estado
          ? prev
          : { ...prev, estado: estado as EstadoCuenta }
      ))
    }
    
    if (!cuentaId) return

    const found = clientes
      .flatMap(c => c.cuentas.map(cu => ({ cliente: c, cuenta: cu })))
      .find(({ cuenta }) => cuenta.id === cuentaId)

    if (found) {
      setSelectedCuenta(found)
      setIsDrawerOpen(true)
    }
  }, [clientes, searchParams, setFiltrosCartera])

  const cuentasFiltradas = useMemo(() => {
    const datos = obtenerCuentasFiltradas()
    
    return datos.sort((a, b) => {
      let comparison = 0
      if (sortField === "diasMora") {
        comparison = a.cuenta.diasMora - b.cuenta.diasMora
      } else if (sortField === "saldoMora") {
        comparison = a.cuenta.saldoMora - b.cuenta.saldoMora
      } else if (sortField === "nombre") {
        comparison = `${a.cliente.nombre} ${a.cliente.apellido}`.localeCompare(`${b.cliente.nombre} ${b.cliente.apellido}`)
      }
      return sortDirection === "desc" ? -comparison : comparison
    })
  }, [obtenerCuentasFiltradas, sortField, sortDirection])

  const totalPages = Math.ceil(cuentasFiltradas.length / ITEMS_PER_PAGE)
  const paginatedData = cuentasFiltradas.slice(
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

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const handleOpenDetail = (item: { cliente: Cliente; cuenta: Cuenta }) => {
    setSelectedCuenta(item)
    setIsDrawerOpen(true)
  }

  const handleQuickAction = (action: "call" | "email" | "whatsapp", item: { cliente: Cliente; cuenta: Cuenta }) => {
    setSelectedCuenta(item)
    if (action === "call") {
      mostrarNotificacion({
        tipo: "info",
        titulo: "Llamando...",
        mensaje: `Iniciando llamada a ${item.cliente.telefono}`
      })
    } else if (action === "email") {
      window.open(`mailto:${item.cliente.email}`)
    } else if (action === "whatsapp") {
      window.open(`https://wa.me/57${item.cliente.telefono}`)
    }
    setGestionForm(prev => ({
      ...prev,
      canal: action === "call" ? "telefono" : action === "email" ? "email" : "whatsapp"
    }))
    setIsGestionModalOpen(true)
  }

  const handleSubmitGestion = () => {
    if (!selectedCuenta) return

    const gestor = gestores.find(g => g.id === selectedCuenta.cuenta.gestorAsignado) || gestores[0]
    
    agregarGestion(selectedCuenta.cuenta.id, {
      fecha: new Date().toISOString().split("T")[0],
      hora: new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" }),
      canal: gestionForm.canal,
      resultado: gestionForm.resultado,
      observaciones: gestionForm.observaciones,
      gestorId: gestor.id,
      gestorNombre: gestor.nombre,
      promesaPago: gestionForm.resultado === "promesa_pago" && gestionForm.promesaMonto ? {
        fecha: gestionForm.promesaFecha,
        monto: parseFloat(gestionForm.promesaMonto),
        cumplida: false
      } : undefined,
      siguienteAccion: gestionForm.siguienteAccion,
      fechaSiguienteAccion: gestionForm.fechaSiguienteAccion
    })

    setGestionForm({
      canal: "telefono",
      resultado: "contacto_efectivo",
      observaciones: "",
      siguienteAccion: "",
      fechaSiguienteAccion: "",
      promesaMonto: "",
      promesaFecha: ""
    })
    setIsGestionModalOpen(false)
    
    // Refresh selected cuenta data
    const updated = clientes
      .flatMap(c => c.cuentas.map(cu => ({ cliente: c, cuenta: cu })))
      .find(({ cuenta }) => cuenta.id === selectedCuenta.cuenta.id)
    if (updated) {
      setSelectedCuenta(updated)
    }
  }

  const handleAssignGestor = (cuentaId: string, gestorId: string) => {
    asignarGestor(cuentaId, gestorId)
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
      mostrarNotificacion({
        tipo: "success",
        titulo: "Datos actualizados",
        mensaje: "La cartera ha sido actualizada"
      })
    }, 250)
  }

  const handleExport = () => {
    const headers = ["Cliente", "Cédula", "Crédito", "Producto", "Saldo Mora", "Días Mora", "Estado", "Gestor"]
    const rows = cuentasFiltradas.map(({ cliente, cuenta }) => {
      const gestor = gestores.find(g => g.id === cuenta.gestorAsignado)
      return [
        `${cliente.nombre} ${cliente.apellido}`,
        cliente.cedula,
        cuenta.numeroCredito,
        tipoProductoLabels[cuenta.tipoProducto],
        cuenta.saldoMora,
        cuenta.diasMora,
        estadoLabels[cuenta.estado],
        gestor?.nombre || ""
      ].join(",")
    })

    const csv = [headers.join(","), ...rows].join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `cartera_${new Date().toISOString().split("T")[0]}.csv`
    a.click()

    mostrarNotificacion({
      tipo: "success",
      titulo: "Exportación exitosa",
      mensaje: `Se exportaron ${cuentasFiltradas.length} registros`
    })
  }

  const clearFilters = () => {
    setFiltrosCartera({
      busqueda: "",
      estado: "todos",
      tipoProducto: "todos",
      gestor: "todos",
      diasMoraMin: null,
      diasMoraMax: null,
      montoMin: null,
      montoMax: null
    })
    setCurrentPage(1)
  }

  const hasActiveFilters = 
    filtrosCartera.estado !== "todos" ||
    filtrosCartera.tipoProducto !== "todos" ||
    filtrosCartera.gestor !== "todos" ||
    filtrosCartera.diasMoraMin !== null ||
    filtrosCartera.diasMoraMax !== null

  return (
    <AppLayout>
      <Topbar
        title="Gestión de Cartera"
        breadcrumbs={[
          { label: "Inicio", href: "/" },
          { label: "Operación" },
          { label: "Cartera" }
        ]}
        showCreate={false}
      />

      <div className="p-6 space-y-4">
        {/* Search and Filter Bar */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[280px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, cédula o número de crédito..."
              value={filtrosCartera.busqueda}
              onChange={(e) => {
                setFiltrosCartera({ ...filtrosCartera, busqueda: e.target.value })
                setCurrentPage(1)
              }}
              className="pl-10"
            />
          </div>

          <Select
            value={filtrosCartera.estado}
            onValueChange={(value) => {
              setFiltrosCartera({ ...filtrosCartera, estado: value as EstadoCuenta | "todos" })
              setCurrentPage(1)
            }}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              {Object.entries(estadoLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filtrosCartera.tipoProducto}
            onValueChange={(value) => {
              setFiltrosCartera({ ...filtrosCartera, tipoProducto: value as TipoProducto | "todos" })
              setCurrentPage(1)
            }}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Producto" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              {Object.entries(tipoProductoLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filtrosCartera.gestor}
            onValueChange={(value) => {
              setFiltrosCartera({ ...filtrosCartera, gestor: value })
              setCurrentPage(1)
            }}
          >
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

          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsFilterOpen(true)}
            className={cn(hasActiveFilters && "border-primary text-primary")}
          >
            <Filter className="h-4 w-4" />
          </Button>

          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-1" />
              Limpiar
            </Button>
          )}

          <div className="flex items-center gap-2 ml-auto">
            <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-card">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total Cuentas</p>
              <p className="text-2xl font-bold">{cuentasFiltradas.length}</p>
            </CardContent>
          </Card>
          <Card className="bg-card">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Saldo en Mora</p>
              <p className="text-2xl font-bold text-destructive">
                {formatCurrency(cuentasFiltradas.reduce((sum, { cuenta }) => sum + cuenta.saldoMora, 0))}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Promedio Días</p>
              <p className="text-2xl font-bold">
                {cuentasFiltradas.length > 0 
                  ? Math.round(cuentasFiltradas.reduce((sum, { cuenta }) => sum + cuenta.diasMora, 0) / cuentasFiltradas.length)
                  : 0}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Casos Críticos</p>
              <p className="text-2xl font-bold text-destructive">
                {cuentasFiltradas.filter(({ cuenta }) => cuenta.estado === "critico" || cuenta.estado === "castigado").length}
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
                  <th className="text-left p-4 font-medium text-muted-foreground">
                    <button
                      onClick={() => handleSort("nombre")}
                      className="flex items-center gap-1 hover:text-foreground transition-colors"
                    >
                      Cliente
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Crédito</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Producto</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">
                    <button
                      onClick={() => handleSort("saldoMora")}
                      className="flex items-center gap-1 hover:text-foreground ml-auto transition-colors"
                    >
                      Saldo Mora
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="text-center p-4 font-medium text-muted-foreground">
                    <button
                      onClick={() => handleSort("diasMora")}
                      className="flex items-center gap-1 hover:text-foreground mx-auto transition-colors"
                    >
                      Días
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="text-center p-4 font-medium text-muted-foreground">Estado</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Gestor</th>
                  <th className="text-center p-4 font-medium text-muted-foreground">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map(({ cliente, cuenta }) => {
                  const gestor = gestores.find(g => g.id === cuenta.gestorAsignado)
                  return (
                    <tr
                      key={cuenta.id}
                      className="border-b border-border hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => handleOpenDetail({ cliente, cuenta })}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium shrink-0">
                            {cliente.nombre.charAt(0)}{cliente.apellido.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium truncate">{cliente.nombre} {cliente.apellido}</p>
                            <p className="text-sm text-muted-foreground">{cliente.cedula}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="font-mono text-sm">{cuenta.numeroCredito}</p>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline" className="whitespace-nowrap">{tipoProductoLabels[cuenta.tipoProducto]}</Badge>
                      </td>
                      <td className="p-4 text-right font-medium text-destructive">
                        {formatCurrency(cuenta.saldoMora)}
                      </td>
                      <td className="p-4 text-center">
                        <span className={cn(
                          "inline-flex items-center justify-center h-8 w-12 rounded-full font-bold text-sm",
                          cuenta.diasMora === 0 && "bg-emerald-500/10 text-emerald-500",
                          cuenta.diasMora > 0 && cuenta.diasMora <= 30 && "bg-amber-500/10 text-amber-500",
                          cuenta.diasMora > 30 && cuenta.diasMora <= 60 && "bg-orange-500/10 text-orange-500",
                          cuenta.diasMora > 60 && cuenta.diasMora <= 90 && "bg-red-500/10 text-red-500",
                          cuenta.diasMora > 90 && "bg-red-600/20 text-red-600"
                        )}>
                          {cuenta.diasMora}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <StatusBadge status={cuenta.estado} />
                      </td>
                      <td className="p-4">
                        <Select
                          value={cuenta.gestorAsignado}
                          onValueChange={(value) => handleAssignGestor(cuenta.id, value)}
                        >
                          <SelectTrigger 
                            className="w-32 h-8 text-xs"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <SelectValue>
                              {gestor?.nombre.split(" ")[0] || "Sin asignar"}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {gestores.filter(g => g.rol === "gestor").map(g => (
                              <SelectItem key={g.id} value={g.id}>{g.nombre}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-1" onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            onClick={() => handleQuickAction("call", { cliente, cuenta })}
                            title="Llamar"
                          >
                            <Phone className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            onClick={() => handleQuickAction("whatsapp", { cliente, cuenta })}
                            title="WhatsApp"
                          >
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            onClick={() => handleQuickAction("email", { cliente, cuenta })}
                            title="Email"
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleOpenDetail({ cliente, cuenta })}>
                                <Eye className="h-4 w-4 mr-2" />
                                Ver detalle
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {
                                setSelectedCuenta({ cliente, cuenta })
                                setIsGestionModalOpen(true)
                              }}>
                                <Plus className="h-4 w-4 mr-2" />
                                Nueva gestión
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                <AlertCircle className="h-4 w-4 mr-2" />
                                Escalar caso
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  )
                })}
                {paginatedData.length === 0 && (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-muted-foreground">
                      No se encontraron cuentas con los filtros aplicados
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
                Mostrando {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, cuentasFiltradas.length)} de {cuentasFiltradas.length}
              </p>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let page = i + 1
                  if (totalPages > 5) {
                    if (currentPage > 3) page = currentPage - 2 + i
                    if (currentPage > totalPages - 2) page = totalPages - 4 + i
                  }
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  )
                })}
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Detail Drawer */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          {selectedCuenta && (
            <>
              <SheetHeader className="pb-4 border-b border-border">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold">
                      {selectedCuenta.cliente.nombre.charAt(0)}{selectedCuenta.cliente.apellido.charAt(0)}
                    </div>
                    <div>
                      <SheetTitle className="text-xl">
                        {selectedCuenta.cliente.nombre} {selectedCuenta.cliente.apellido}
                      </SheetTitle>
                      <SheetDescription>
                        {selectedCuenta.cliente.cedula} | {selectedCuenta.cuenta.numeroCredito}
                      </SheetDescription>
                    </div>
                  </div>
                  <StatusBadge status={selectedCuenta.cuenta.estado} size="lg" />
                </div>
              </SheetHeader>

              <Tabs defaultValue="info" className="mt-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="info">Información</TabsTrigger>
                  <TabsTrigger value="cuenta">Cuenta</TabsTrigger>
                  <TabsTrigger value="gestiones">
                    Gestiones ({selectedCuenta.cuenta.historialGestiones.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="info" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Teléfono</p>
                      <p className="font-medium">{selectedCuenta.cliente.telefono}</p>
                    </div>
                    {selectedCuenta.cliente.telefonoAlt && (
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Tel. Alternativo</p>
                        <p className="font-medium">{selectedCuenta.cliente.telefonoAlt}</p>
                      </div>
                    )}
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{selectedCuenta.cliente.email}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Ciudad</p>
                      <p className="font-medium">{selectedCuenta.cliente.ciudad}</p>
                    </div>
                    <div className="space-y-1 col-span-2">
                      <p className="text-sm text-muted-foreground">Dirección</p>
                      <p className="font-medium">{selectedCuenta.cliente.direccion}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Ocupación</p>
                      <p className="font-medium">{selectedCuenta.cliente.ocupacion}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Ingreso Mensual</p>
                      <p className="font-medium">{formatCurrency(selectedCuenta.cliente.ingresoMensual)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Segmento</p>
                      <Badge variant="outline" className="capitalize">{selectedCuenta.cliente.segmento}</Badge>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Riesgo</p>
                      <Badge 
                        variant={
                          selectedCuenta.cliente.riesgo === "bajo" ? "default" :
                          selectedCuenta.cliente.riesgo === "medio" ? "secondary" :
                          "destructive"
                        }
                        className="capitalize"
                      >
                        {selectedCuenta.cliente.riesgo}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button 
                      className="flex-1"
                      onClick={() => {
                        setGestionForm(prev => ({ ...prev, canal: "telefono" }))
                        setIsGestionModalOpen(true)
                      }}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Llamar
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => window.open(`https://wa.me/57${selectedCuenta.cliente.telefono}`)}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      WhatsApp
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => window.open(`mailto:${selectedCuenta.cliente.email}`)}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="cuenta" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="bg-muted/30">
                      <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">Saldo Actual</p>
                        <p className="text-2xl font-bold">{formatCurrency(selectedCuenta.cuenta.saldoActual)}</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-destructive/10">
                      <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">Saldo en Mora</p>
                        <p className="text-2xl font-bold text-destructive">{formatCurrency(selectedCuenta.cuenta.saldoMora)}</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Monto Original</p>
                      <p className="font-medium">{formatCurrency(selectedCuenta.cuenta.montoOriginal)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Cuota Mensual</p>
                      <p className="font-medium">{formatCurrency(selectedCuenta.cuenta.cuotaMensual)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Días en Mora</p>
                      <p className="font-medium text-destructive">{selectedCuenta.cuenta.diasMora} días</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Tasa de Interés</p>
                      <p className="font-medium">{selectedCuenta.cuenta.tasaInteres}% E.A.</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Fecha Desembolso</p>
                      <p className="font-medium">{selectedCuenta.cuenta.fechaDesembolso}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Fecha Vencimiento</p>
                      <p className="font-medium">{selectedCuenta.cuenta.fechaVencimiento}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Tipo Producto</p>
                      <Badge variant="outline">{tipoProductoLabels[selectedCuenta.cuenta.tipoProducto]}</Badge>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Gestor</p>
                      <p className="font-medium">
                        {gestores.find(g => g.id === selectedCuenta.cuenta.gestorAsignado)?.nombre || "Sin asignar"}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button className="w-full" onClick={() => setIsGestionModalOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Registrar Nueva Gestión
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="gestiones" className="mt-4">
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-4">
                      {selectedCuenta.cuenta.historialGestiones.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">
                          No hay gestiones registradas
                        </p>
                      ) : (
                        selectedCuenta.cuenta.historialGestiones.map((gestion) => (
                          <div
                            key={gestion.id}
                            className="p-4 rounded-lg border border-border bg-muted/20"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">{canalLabels[gestion.canal]}</Badge>
                                <Badge 
                                  variant={
                                    gestion.resultado === "contacto_efectivo" || gestion.resultado === "pago_realizado" ? "default" :
                                    gestion.resultado === "promesa_pago" || gestion.resultado === "acuerdo" ? "secondary" :
                                    "outline"
                                  }
                                >
                                  {resultadoLabels[gestion.resultado]}
                                </Badge>
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {gestion.fecha} {gestion.hora}
                              </span>
                            </div>
                            <p className="text-sm mb-2">{gestion.observaciones}</p>
                            {gestion.promesaPago && (
                              <div className="flex items-center gap-2 text-sm">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>
                                  Promesa: {formatCurrency(gestion.promesaPago.monto)} para {gestion.promesaPago.fecha}
                                </span>
                                {gestion.promesaPago.cumplida !== undefined && (
                                  <Badge variant={gestion.promesaPago.cumplida ? "default" : "destructive"}>
                                    {gestion.promesaPago.cumplida ? "Cumplida" : "Incumplida"}
                                  </Badge>
                                )}
                              </div>
                            )}
                            <p className="text-xs text-muted-foreground mt-2">
                              Gestionado por: {gestion.gestorNombre}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>

                  <div className="pt-4 border-t border-border mt-4">
                    <Button className="w-full" onClick={() => setIsGestionModalOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Nueva Gestión
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Nueva Gestión Modal */}
      <Dialog open={isGestionModalOpen} onOpenChange={setIsGestionModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Registrar Nueva Gestión</DialogTitle>
            <DialogDescription>
              {selectedCuenta && (
                <>
                  {selectedCuenta.cliente.nombre} {selectedCuenta.cliente.apellido} - {selectedCuenta.cuenta.numeroCredito}
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Canal de Contacto</Label>
                <Select
                  value={gestionForm.canal}
                  onValueChange={(value) => setGestionForm(prev => ({ ...prev, canal: value as CanalContacto }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(canalLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Resultado</Label>
                <Select
                  value={gestionForm.resultado}
                  onValueChange={(value) => setGestionForm(prev => ({ ...prev, resultado: value as ResultadoGestion }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(resultadoLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Observaciones</Label>
              <Textarea
                value={gestionForm.observaciones}
                onChange={(e) => setGestionForm(prev => ({ ...prev, observaciones: e.target.value }))}
                placeholder="Detalle de la gestión realizada..."
                rows={3}
              />
            </div>

            {gestionForm.resultado === "promesa_pago" && (
              <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-muted/50">
                <div className="space-y-2">
                  <Label>Monto Promesa</Label>
                  <Input
                    type="number"
                    value={gestionForm.promesaMonto}
                    onChange={(e) => setGestionForm(prev => ({ ...prev, promesaMonto: e.target.value }))}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Fecha Promesa</Label>
                  <Input
                    type="date"
                    value={gestionForm.promesaFecha}
                    onChange={(e) => setGestionForm(prev => ({ ...prev, promesaFecha: e.target.value }))}
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Siguiente Acción</Label>
                <Input
                  value={gestionForm.siguienteAccion}
                  onChange={(e) => setGestionForm(prev => ({ ...prev, siguienteAccion: e.target.value }))}
                  placeholder="Ej: Llamada de seguimiento"
                />
              </div>
              <div className="space-y-2">
                <Label>Fecha Siguiente Acción</Label>
                <Input
                  type="date"
                  value={gestionForm.fechaSiguienteAccion}
                  onChange={(e) => setGestionForm(prev => ({ ...prev, fechaSiguienteAccion: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsGestionModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmitGestion}>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Guardar Gestión
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Advanced Filters Dialog */}
      <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Filtros Avanzados</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Días Mora Mínimo</Label>
                <Input
                  type="number"
                  value={filtrosCartera.diasMoraMin ?? ""}
                  onChange={(e) => setFiltrosCartera({
                    ...filtrosCartera,
                    diasMoraMin: e.target.value ? parseInt(e.target.value) : null
                  })}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label>Días Mora Máximo</Label>
                <Input
                  type="number"
                  value={filtrosCartera.diasMoraMax ?? ""}
                  onChange={(e) => setFiltrosCartera({
                    ...filtrosCartera,
                    diasMoraMax: e.target.value ? parseInt(e.target.value) : null
                  })}
                  placeholder="Sin límite"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Monto Mora Mínimo</Label>
                <Input
                  type="number"
                  value={filtrosCartera.montoMin ?? ""}
                  onChange={(e) => setFiltrosCartera({
                    ...filtrosCartera,
                    montoMin: e.target.value ? parseInt(e.target.value) : null
                  })}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label>Monto Mora Máximo</Label>
                <Input
                  type="number"
                  value={filtrosCartera.montoMax ?? ""}
                  onChange={(e) => setFiltrosCartera({
                    ...filtrosCartera,
                    montoMax: e.target.value ? parseInt(e.target.value) : null
                  })}
                  placeholder="Sin límite"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={clearFilters}>
              Limpiar
            </Button>
            <Button onClick={() => {
              setIsFilterOpen(false)
              setCurrentPage(1)
            }}>
              Aplicar Filtros
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  )
}

function CarteraPageFallback() {
  return (
    <AppLayout>
      <div className="space-y-4 p-6">
        <div className="glass-card h-24 animate-pulse rounded-2xl" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="h-24 animate-pulse rounded-2xl bg-card" />
          ))}
        </div>
        <div className="h-[420px] animate-pulse rounded-2xl bg-card" />
      </div>
    </AppLayout>
  )
}

export default function CarteraPage() {
  return (
    <AuthGuard>
      <Suspense fallback={<CarteraPageFallback />}>
        <CarteraPageContent />
      </Suspense>
    </AuthGuard>
  )
}
