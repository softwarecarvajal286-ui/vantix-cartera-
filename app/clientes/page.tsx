"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Phone,
  Mail,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  UserPlus,
  CreditCard,
  AlertTriangle,
} from "lucide-react"
import { AppLayout } from "@/components/app-layout"
import { Topbar } from "@/components/topbar"
import { StatusBadge } from "@/components/status-badge"
import { useApp } from "@/lib/app-context"
import { Cliente } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

const ITEMS_PER_PAGE = 10

export default function ClientesPage() {
  const router = useRouter()
  const { clientes, agregarCliente, actualizarCliente, eliminarCliente, mostrarNotificacion } = useApp()

  const [selectedClients, setSelectedClients] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filtroSegmento, setFiltroSegmento] = useState("todos")
  const [filtroRiesgo, setFiltroRiesgo] = useState("todos")
  const [filtroCiudad, setFiltroCiudad] = useState("todos")
  const [currentPage, setCurrentPage] = useState(1)
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false)
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null)
  
  const [clienteForm, setClienteForm] = useState({
    cedula: "",
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    telefonoAlt: "",
    direccion: "",
    ciudad: "",
    fechaNacimiento: "",
    ocupacion: "",
    ingresoMensual: "",
    segmento: "standard" as "premium" | "standard" | "basico",
    riesgo: "medio" as "bajo" | "medio" | "alto" | "critico"
  })

  const resetForm = () => {
    setClienteForm({
      cedula: "",
      nombre: "",
      apellido: "",
      email: "",
      telefono: "",
      telefonoAlt: "",
      direccion: "",
      ciudad: "",
      fechaNacimiento: "",
      ocupacion: "",
      ingresoMensual: "",
      segmento: "standard",
      riesgo: "medio"
    })
  }

  const ciudades = useMemo(() => {
    const unique = new Set(clientes.map(c => c.ciudad))
    return Array.from(unique).sort()
  }, [clientes])

  const clientesFiltrados = useMemo(() => {
    return clientes.filter(cliente => {
      // Búsqueda
      if (searchTerm) {
        const busqueda = searchTerm.toLowerCase()
        const coincide = 
          cliente.nombre.toLowerCase().includes(busqueda) ||
          cliente.apellido.toLowerCase().includes(busqueda) ||
          cliente.cedula.includes(searchTerm) ||
          cliente.email.toLowerCase().includes(busqueda)
        if (!coincide) return false
      }
      
      if (filtroSegmento !== "todos" && cliente.segmento !== filtroSegmento) return false
      if (filtroRiesgo !== "todos" && cliente.riesgo !== filtroRiesgo) return false
      if (filtroCiudad !== "todos" && cliente.ciudad !== filtroCiudad) return false
      
      return true
    }).sort((a, b) => `${a.nombre} ${a.apellido}`.localeCompare(`${b.nombre} ${b.apellido}`))
  }, [clientes, searchTerm, filtroSegmento, filtroRiesgo, filtroCiudad])

  const totalPages = Math.ceil(clientesFiltrados.length / ITEMS_PER_PAGE)
  const paginatedData = clientesFiltrados.slice(
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

  const toggleSelectAll = () => {
    if (selectedClients.length === paginatedData.length) {
      setSelectedClients([])
    } else {
      setSelectedClients(paginatedData.map((c) => c.id))
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedClients((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    )
  }

  const handleCreateCliente = () => {
    if (!clienteForm.cedula || !clienteForm.nombre || !clienteForm.apellido) {
      mostrarNotificacion({
        tipo: "error",
        titulo: "Error",
        mensaje: "Por favor complete los campos obligatorios"
      })
      return
    }

    agregarCliente({
      ...clienteForm,
      ingresoMensual: parseFloat(clienteForm.ingresoMensual) || 0
    })
    
    setIsCreateModalOpen(false)
    resetForm()
  }

  const handleEditCliente = () => {
    if (!selectedCliente) return

    actualizarCliente(selectedCliente.id, {
      ...clienteForm,
      ingresoMensual: parseFloat(clienteForm.ingresoMensual) || 0
    })
    
    setIsEditModalOpen(false)
    resetForm()
    setSelectedCliente(null)
  }

  const handleDeleteCliente = () => {
    if (!selectedCliente) return
    
    eliminarCliente(selectedCliente.id)
    setIsDeleteDialogOpen(false)
    setSelectedCliente(null)
  }

  const openEditModal = (cliente: Cliente) => {
    setSelectedCliente(cliente)
    setClienteForm({
      cedula: cliente.cedula,
      nombre: cliente.nombre,
      apellido: cliente.apellido,
      email: cliente.email,
      telefono: cliente.telefono,
      telefonoAlt: cliente.telefonoAlt || "",
      direccion: cliente.direccion,
      ciudad: cliente.ciudad,
      fechaNacimiento: cliente.fechaNacimiento,
      ocupacion: cliente.ocupacion,
      ingresoMensual: cliente.ingresoMensual.toString(),
      segmento: cliente.segmento,
      riesgo: cliente.riesgo
    })
    setIsEditModalOpen(true)
  }

  const openDetailDrawer = (cliente: Cliente) => {
    setSelectedCliente(cliente)
    setIsDetailDrawerOpen(true)
  }

  const handleBulkDelete = () => {
    selectedClients.forEach(id => eliminarCliente(id))
    setSelectedClients([])
    mostrarNotificacion({
      tipo: "success",
      titulo: "Clientes eliminados",
      mensaje: `Se eliminaron ${selectedClients.length} clientes`
    })
  }

  const clearFilters = () => {
    setSearchTerm("")
    setFiltroSegmento("todos")
    setFiltroRiesgo("todos")
    setFiltroCiudad("todos")
    setCurrentPage(1)
  }

  const hasActiveFilters = filtroSegmento !== "todos" || filtroRiesgo !== "todos" || filtroCiudad !== "todos"

  return (
    <AppLayout>
      <Topbar
        title="Lista de Clientes"
        breadcrumbs={[
          { label: "Inicio", href: "/" },
          { label: "Clientes" },
          { label: "Lista" }
        ]}
        showCreate={false}
      />

      <div className="p-6 space-y-4">
        {/* Search and Filter Bar */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[280px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, cédula o email..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              className="pl-10"
            />
          </div>

          <Select value={filtroSegmento} onValueChange={(v) => { setFiltroSegmento(v); setCurrentPage(1) }}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Segmento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
              <SelectItem value="standard">Standard</SelectItem>
              <SelectItem value="basico">Básico</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filtroRiesgo} onValueChange={(v) => { setFiltroRiesgo(v); setCurrentPage(1) }}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Riesgo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="bajo">Bajo</SelectItem>
              <SelectItem value="medio">Medio</SelectItem>
              <SelectItem value="alto">Alto</SelectItem>
              <SelectItem value="critico">Crítico</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filtroCiudad} onValueChange={(v) => { setFiltroCiudad(v); setCurrentPage(1) }}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Ciudad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todas</SelectItem>
              {ciudades.map(ciudad => (
                <SelectItem key={ciudad} value={ciudad}>{ciudad}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-1" />
              Limpiar
            </Button>
          )}

          <Button className="ml-auto" onClick={() => { resetForm(); setIsCreateModalOpen(true) }}>
            <UserPlus className="h-4 w-4 mr-2" />
            Nuevo Cliente
          </Button>
        </div>

        {/* Bulk Actions */}
        {selectedClients.length > 0 && (
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-3 flex items-center justify-between">
              <span className="text-sm font-medium">
                {selectedClients.length} cliente(s) seleccionado(s)
              </span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setSelectedClients([])}>
                  Deseleccionar
                </Button>
                <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                  <Trash2 className="h-4 w-4 mr-1" />
                  Eliminar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-card">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total Clientes</p>
              <p className="text-2xl font-bold">{clientesFiltrados.length}</p>
            </CardContent>
          </Card>
          <Card className="bg-card">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Cuentas Activas</p>
              <p className="text-2xl font-bold">
                {clientesFiltrados.reduce((sum, c) => sum + c.cuentas.length, 0)}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Riesgo Alto/Crítico</p>
              <p className="text-2xl font-bold text-destructive">
                {clientesFiltrados.filter(c => c.riesgo === "alto" || c.riesgo === "critico").length}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Segmento Premium</p>
              <p className="text-2xl font-bold text-primary">
                {clientesFiltrados.filter(c => c.segmento === "premium").length}
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
                  <th className="w-12 p-4">
                    <Checkbox
                      checked={selectedClients.length === paginatedData.length && paginatedData.length > 0}
                      onCheckedChange={toggleSelectAll}
                    />
                  </th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Cliente</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Cédula</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Contacto</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Ciudad</th>
                  <th className="text-center p-4 font-medium text-muted-foreground">Cuentas</th>
                  <th className="text-center p-4 font-medium text-muted-foreground">Segmento</th>
                  <th className="text-center p-4 font-medium text-muted-foreground">Riesgo</th>
                  <th className="text-center p-4 font-medium text-muted-foreground">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((cliente) => (
                  <tr
                    key={cliente.id}
                    className="border-b border-border hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => openDetailDrawer(cliente)}
                  >
                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedClients.includes(cliente.id)}
                        onCheckedChange={() => toggleSelect(cliente.id)}
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary/10 text-primary font-medium">
                            {cliente.nombre.charAt(0)}{cliente.apellido.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{cliente.nombre} {cliente.apellido}</p>
                          <p className="text-sm text-muted-foreground">{cliente.ocupacion}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-sm">{cliente.cedula}</td>
                    <td className="p-4">
                      <div className="text-sm">
                        <p>{cliente.telefono}</p>
                        <p className="text-muted-foreground truncate max-w-[200px]">{cliente.email}</p>
                      </div>
                    </td>
                    <td className="p-4">{cliente.ciudad}</td>
                    <td className="p-4 text-center">
                      <Badge variant="outline">{cliente.cuentas.length}</Badge>
                    </td>
                    <td className="p-4 text-center">
                      <Badge 
                        variant={cliente.segmento === "premium" ? "default" : "secondary"}
                        className="capitalize"
                      >
                        {cliente.segmento}
                      </Badge>
                    </td>
                    <td className="p-4 text-center">
                      <Badge 
                        variant={
                          cliente.riesgo === "bajo" ? "default" :
                          cliente.riesgo === "medio" ? "secondary" :
                          "destructive"
                        }
                        className="capitalize"
                      >
                        {cliente.riesgo}
                      </Badge>
                    </td>
                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            mostrarNotificacion({ tipo: "info", titulo: "Llamando...", mensaje: `Iniciando llamada a ${cliente.telefono}` })
                          }}
                        >
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => window.open(`https://wa.me/57${cliente.telefono}`)}
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openDetailDrawer(cliente)}>
                              <Eye className="h-4 w-4 mr-2" />
                              Ver perfil
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openEditModal(cliente)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/operacion/cartera?busqueda=${cliente.cedula}`)}>
                              <CreditCard className="h-4 w-4 mr-2" />
                              Ver cuentas
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => window.open(`mailto:${cliente.email}`)}>
                              <Mail className="h-4 w-4 mr-2" />
                              Enviar email
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => {
                                setSelectedCliente(cliente)
                                setIsDeleteDialogOpen(true)
                              }}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
                {paginatedData.length === 0 && (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-muted-foreground">
                      No se encontraron clientes
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
                Mostrando {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, clientesFiltrados.length)} de {clientesFiltrados.length}
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

      {/* Create/Edit Modal */}
      <Dialog open={isCreateModalOpen || isEditModalOpen} onOpenChange={(open) => {
        if (!open) {
          setIsCreateModalOpen(false)
          setIsEditModalOpen(false)
          resetForm()
        }
      }}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditModalOpen ? "Editar Cliente" : "Nuevo Cliente"}</DialogTitle>
            <DialogDescription>
              {isEditModalOpen ? "Actualice los datos del cliente" : "Complete los datos para registrar un nuevo cliente"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Cédula *</Label>
                <Input
                  value={clienteForm.cedula}
                  onChange={(e) => setClienteForm(prev => ({ ...prev, cedula: e.target.value }))}
                  placeholder="1234567890"
                />
              </div>
              <div className="space-y-2">
                <Label>Fecha Nacimiento</Label>
                <Input
                  type="date"
                  value={clienteForm.fechaNacimiento}
                  onChange={(e) => setClienteForm(prev => ({ ...prev, fechaNacimiento: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nombre *</Label>
                <Input
                  value={clienteForm.nombre}
                  onChange={(e) => setClienteForm(prev => ({ ...prev, nombre: e.target.value }))}
                  placeholder="Juan"
                />
              </div>
              <div className="space-y-2">
                <Label>Apellido *</Label>
                <Input
                  value={clienteForm.apellido}
                  onChange={(e) => setClienteForm(prev => ({ ...prev, apellido: e.target.value }))}
                  placeholder="Pérez"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={clienteForm.email}
                  onChange={(e) => setClienteForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="juan@email.com"
                />
              </div>
              <div className="space-y-2">
                <Label>Teléfono</Label>
                <Input
                  value={clienteForm.telefono}
                  onChange={(e) => setClienteForm(prev => ({ ...prev, telefono: e.target.value }))}
                  placeholder="3001234567"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Dirección</Label>
              <Input
                value={clienteForm.direccion}
                onChange={(e) => setClienteForm(prev => ({ ...prev, direccion: e.target.value }))}
                placeholder="Calle 123 #45-67"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Ciudad</Label>
                <Input
                  value={clienteForm.ciudad}
                  onChange={(e) => setClienteForm(prev => ({ ...prev, ciudad: e.target.value }))}
                  placeholder="Bogotá"
                />
              </div>
              <div className="space-y-2">
                <Label>Ocupación</Label>
                <Input
                  value={clienteForm.ocupacion}
                  onChange={(e) => setClienteForm(prev => ({ ...prev, ocupacion: e.target.value }))}
                  placeholder="Ingeniero"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Ingreso Mensual</Label>
                <Input
                  type="number"
                  value={clienteForm.ingresoMensual}
                  onChange={(e) => setClienteForm(prev => ({ ...prev, ingresoMensual: e.target.value }))}
                  placeholder="5000000"
                />
              </div>
              <div className="space-y-2">
                <Label>Segmento</Label>
                <Select
                  value={clienteForm.segmento}
                  onValueChange={(v) => setClienteForm(prev => ({ ...prev, segmento: v as typeof clienteForm.segmento }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="basico">Básico</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Riesgo</Label>
                <Select
                  value={clienteForm.riesgo}
                  onValueChange={(v) => setClienteForm(prev => ({ ...prev, riesgo: v as typeof clienteForm.riesgo }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bajo">Bajo</SelectItem>
                    <SelectItem value="medio">Medio</SelectItem>
                    <SelectItem value="alto">Alto</SelectItem>
                    <SelectItem value="critico">Crítico</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsCreateModalOpen(false)
              setIsEditModalOpen(false)
              resetForm()
            }}>
              Cancelar
            </Button>
            <Button onClick={isEditModalOpen ? handleEditCliente : handleCreateCliente}>
              {isEditModalOpen ? "Guardar Cambios" : "Crear Cliente"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Confirmar Eliminación
            </DialogTitle>
            <DialogDescription>
              {selectedCliente && (
                <>
                  ¿Está seguro que desea eliminar a <strong>{selectedCliente.nombre} {selectedCliente.apellido}</strong>?
                  Esta acción no se puede deshacer y se eliminarán todas sus cuentas asociadas.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteCliente}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail Drawer */}
      <Sheet open={isDetailDrawerOpen} onOpenChange={setIsDetailDrawerOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selectedCliente && (
            <>
              <SheetHeader className="pb-4 border-b border-border">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                      {selectedCliente.nombre.charAt(0)}{selectedCliente.apellido.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <SheetTitle className="text-xl">
                      {selectedCliente.nombre} {selectedCliente.apellido}
                    </SheetTitle>
                    <SheetDescription>
                      {selectedCliente.cedula} | {selectedCliente.ocupacion}
                    </SheetDescription>
                  </div>
                </div>
              </SheetHeader>

              <div className="space-y-6 mt-6">
                <div className="flex gap-2">
                  <Badge variant={selectedCliente.segmento === "premium" ? "default" : "secondary"} className="capitalize">
                    {selectedCliente.segmento}
                  </Badge>
                  <Badge 
                    variant={
                      selectedCliente.riesgo === "bajo" ? "default" :
                      selectedCliente.riesgo === "medio" ? "secondary" :
                      "destructive"
                    }
                    className="capitalize"
                  >
                    Riesgo {selectedCliente.riesgo}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Teléfono</p>
                    <p className="font-medium">{selectedCliente.telefono}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium truncate">{selectedCliente.email}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Ciudad</p>
                    <p className="font-medium">{selectedCliente.ciudad}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Ingreso</p>
                    <p className="font-medium">{formatCurrency(selectedCliente.ingresoMensual)}</p>
                  </div>
                  <div className="space-y-1 col-span-2">
                    <p className="text-sm text-muted-foreground">Dirección</p>
                    <p className="font-medium">{selectedCliente.direccion}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1" onClick={() => {
                    mostrarNotificacion({ tipo: "info", titulo: "Llamando...", mensaje: `Iniciando llamada a ${selectedCliente.telefono}` })
                  }}>
                    <Phone className="h-4 w-4 mr-2" />
                    Llamar
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={() => window.open(`https://wa.me/57${selectedCliente.telefono}`)}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    WhatsApp
                  </Button>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Cuentas ({selectedCliente.cuentas.length})</h4>
                  <ScrollArea className="h-[200px]">
                    <div className="space-y-2">
                      {selectedCliente.cuentas.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          No tiene cuentas registradas
                        </p>
                      ) : (
                        selectedCliente.cuentas.map(cuenta => (
                          <button
                            key={cuenta.id}
                            onClick={() => router.push(`/operacion/cartera?cuenta=${cuenta.id}`)}
                            className="w-full p-3 rounded-lg border border-border hover:bg-muted/50 text-left transition-all"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-mono text-sm">{cuenta.numeroCredito}</span>
                              <StatusBadge status={cuenta.estado} size="sm" />
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Mora: {formatCurrency(cuenta.saldoMora)}</span>
                              <span className="text-destructive font-medium">{cuenta.diasMora} días</span>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </div>

                <div className="flex gap-2 pt-4 border-t border-border">
                  <Button variant="outline" className="flex-1" onClick={() => openEditModal(selectedCliente)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => router.push(`/operacion/cartera?busqueda=${selectedCliente.cedula}`)}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Ver Cuentas
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </AppLayout>
  )
}
