"use client"

import { useState, useMemo } from "react"
import {
  Search,
  Phone,
  Mail,
  MessageSquare,
  User,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  Building2,
  Home,
  Briefcase,
} from "lucide-react"
import { AppLayout } from "@/components/app-layout"
import { Topbar } from "@/components/topbar"
import { AuthGuard } from "@/components/auth-guard"
import { useApp } from "@/lib/app-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
import { cn } from "@/lib/utils"

const ITEMS_PER_PAGE = 10

// Tipos de contacto
const tiposContacto = [
  { value: "personal", label: "Personal", icon: User },
  { value: "trabajo", label: "Trabajo", icon: Briefcase },
  { value: "familiar", label: "Familiar", icon: Home },
  { value: "referencia", label: "Referencia", icon: Building2 },
]

export default function ContactosPage() {
  const { clientes, mostrarNotificacion } = useApp()
  const [searchTerm, setSearchTerm] = useState("")
  const [filtroTipo, setFiltroTipo] = useState("todos")
  const [currentPage, setCurrentPage] = useState(1)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedContacto, setSelectedContacto] = useState<any>(null)

  const [contactoForm, setContactoForm] = useState({
    nombre: "",
    telefono: "",
    email: "",
    tipo: "personal",
    relacion: "",
    clienteId: ""
  })

  // Generar lista de contactos desde los clientes
  const contactos = useMemo(() => {
    const items: any[] = []
    
    clientes.forEach(cliente => {
      // Contacto principal
      items.push({
        id: `${cliente.id}-principal`,
        clienteId: cliente.id,
        clienteNombre: `${cliente.nombre} ${cliente.apellido}`,
        nombre: `${cliente.nombre} ${cliente.apellido}`,
        telefono: cliente.telefono,
        telefonoAlt: cliente.telefonoAlt,
        email: cliente.email,
        tipo: "personal",
        relacion: "Titular",
        esPrincipal: true
      })

      // Contactos adicionales simulados (en una app real vendrian de la BD)
      if (cliente.telefonoAlt) {
        items.push({
          id: `${cliente.id}-alt`,
          clienteId: cliente.id,
          clienteNombre: `${cliente.nombre} ${cliente.apellido}`,
          nombre: "Contacto Alternativo",
          telefono: cliente.telefonoAlt,
          email: "",
          tipo: "familiar",
          relacion: "Familiar",
          esPrincipal: false
        })
      }
    })

    return items
  }, [clientes])

  // Filtrar contactos
  const contactosFiltrados = useMemo(() => {
    return contactos.filter(contacto => {
      if (searchTerm) {
        const busqueda = searchTerm.toLowerCase()
        const coincide = 
          contacto.nombre.toLowerCase().includes(busqueda) ||
          contacto.clienteNombre.toLowerCase().includes(busqueda) ||
          contacto.telefono.includes(searchTerm) ||
          contacto.email.toLowerCase().includes(busqueda)
        if (!coincide) return false
      }

      if (filtroTipo !== "todos" && contacto.tipo !== filtroTipo) return false

      return true
    })
  }, [contactos, searchTerm, filtroTipo])

  const totalPages = Math.ceil(contactosFiltrados.length / ITEMS_PER_PAGE)
  const paginatedData = contactosFiltrados.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const handleCreateContacto = () => {
    if (!contactoForm.nombre || !contactoForm.telefono) {
      mostrarNotificacion({
        tipo: "error",
        titulo: "Error",
        mensaje: "Nombre y telefono son obligatorios"
      })
      return
    }

    mostrarNotificacion({
      tipo: "success",
      titulo: "Contacto creado",
      mensaje: `${contactoForm.nombre} ha sido agregado`
    })

    setContactoForm({
      nombre: "",
      telefono: "",
      email: "",
      tipo: "personal",
      relacion: "",
      clienteId: ""
    })
    setIsCreateModalOpen(false)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setFiltroTipo("todos")
    setCurrentPage(1)
  }

  const hasActiveFilters = filtroTipo !== "todos"

  const getTipoIcon = (tipo: string) => {
    const tipoInfo = tiposContacto.find(t => t.value === tipo)
    return tipoInfo?.icon || User
  }

  const getTipoLabel = (tipo: string) => {
    const tipoInfo = tiposContacto.find(t => t.value === tipo)
    return tipoInfo?.label || tipo
  }

  return (
    <AuthGuard>
      <AppLayout>
        <Topbar
          title="Contactos"
          breadcrumbs={[
            { label: "Inicio", href: "/" },
            { label: "Clientes", href: "/clientes" },
            { label: "Contactos" }
          ]}
          showCreate={false}
        />

        <div className="p-6 space-y-4">
          {/* Search and Filter Bar */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[280px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, telefono o email..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
                className="pl-10"
              />
            </div>

            <Select value={filtroTipo} onValueChange={(v) => { setFiltroTipo(v); setCurrentPage(1) }}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                {tiposContacto.map(tipo => (
                  <SelectItem key={tipo.value} value={tipo.value}>{tipo.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-1" />
                Limpiar
              </Button>
            )}

            <Button className="ml-auto" onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Contacto
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-card">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Total Contactos</p>
                <p className="text-2xl font-bold">{contactosFiltrados.length}</p>
              </CardContent>
            </Card>
            <Card className="bg-card">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Personales</p>
                <p className="text-2xl font-bold text-primary">
                  {contactosFiltrados.filter(c => c.tipo === "personal").length}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Familiares</p>
                <p className="text-2xl font-bold">
                  {contactosFiltrados.filter(c => c.tipo === "familiar").length}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Trabajo</p>
                <p className="text-2xl font-bold">
                  {contactosFiltrados.filter(c => c.tipo === "trabajo").length}
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
                    <th className="text-left p-4 font-medium text-muted-foreground">Contacto</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Cliente</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Telefono</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Email</th>
                    <th className="text-center p-4 font-medium text-muted-foreground">Tipo</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Relacion</th>
                    <th className="text-center p-4 font-medium text-muted-foreground">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((contacto) => {
                    const TipoIcon = getTipoIcon(contacto.tipo)
                    return (
                      <tr
                        key={contacto.id}
                        className="border-b border-border hover:bg-muted/50 transition-colors"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className={cn(
                                "font-medium",
                                contacto.esPrincipal ? "bg-primary/10 text-primary" : "bg-muted"
                              )}>
                                {contacto.nombre.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{contacto.nombre}</p>
                              {contacto.esPrincipal && (
                                <Badge variant="outline" className="text-xs">Principal</Badge>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="text-sm">{contacto.clienteNombre}</p>
                        </td>
                        <td className="p-4">
                          <p className="font-mono text-sm">{contacto.telefono}</p>
                          {contacto.telefonoAlt && (
                            <p className="font-mono text-xs text-muted-foreground">{contacto.telefonoAlt}</p>
                          )}
                        </td>
                        <td className="p-4">
                          <p className="text-sm truncate max-w-[200px]">{contacto.email || "-"}</p>
                        </td>
                        <td className="p-4 text-center">
                          <Badge variant="secondary" className="gap-1">
                            <TipoIcon className="h-3 w-3" />
                            {getTipoLabel(contacto.tipo)}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <p className="text-sm">{contacto.relacion}</p>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => {
                                mostrarNotificacion({ tipo: "info", titulo: "Llamando...", mensaje: `Iniciando llamada a ${contacto.telefono}` })
                              }}
                            >
                              <Phone className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => window.open(`https://wa.me/57${contacto.telefono}`)}
                            >
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                            {contacto.email && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => window.open(`mailto:${contacto.email}`)}
                              >
                                <Mail className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                  {paginatedData.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-muted-foreground">
                        <User className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No se encontraron contactos</p>
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
                  Mostrando {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, contactosFiltrados.length)} de {contactosFiltrados.length}
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

        {/* Modal Crear Contacto */}
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Nuevo Contacto</DialogTitle>
              <DialogDescription>
                Agregar un nuevo contacto al sistema
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Cliente Asociado</Label>
                <Select value={contactoForm.clienteId} onValueChange={(v) => setContactoForm({...contactoForm, clienteId: v})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clientes.map(cliente => (
                      <SelectItem key={cliente.id} value={cliente.id}>
                        {cliente.nombre} {cliente.apellido}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Nombre *</Label>
                <Input 
                  value={contactoForm.nombre}
                  onChange={(e) => setContactoForm({...contactoForm, nombre: e.target.value})}
                  placeholder="Nombre completo"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Telefono *</Label>
                  <Input 
                    value={contactoForm.telefono}
                    onChange={(e) => setContactoForm({...contactoForm, telefono: e.target.value})}
                    placeholder="3001234567"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select value={contactoForm.tipo} onValueChange={(v) => setContactoForm({...contactoForm, tipo: v})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {tiposContacto.map(tipo => (
                        <SelectItem key={tipo.value} value={tipo.value}>{tipo.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input 
                  type="email"
                  value={contactoForm.email}
                  onChange={(e) => setContactoForm({...contactoForm, email: e.target.value})}
                  placeholder="contacto@email.com"
                />
              </div>
              <div className="space-y-2">
                <Label>Relacion</Label>
                <Input 
                  value={contactoForm.relacion}
                  onChange={(e) => setContactoForm({...contactoForm, relacion: e.target.value})}
                  placeholder="Esposo, Hermano, Jefe, etc."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancelar</Button>
              <Button onClick={handleCreateContacto}>Crear Contacto</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </AppLayout>
    </AuthGuard>
  )
}
