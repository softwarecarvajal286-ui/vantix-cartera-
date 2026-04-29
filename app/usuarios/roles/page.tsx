"use client"

import { useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { Topbar } from "@/components/topbar"
import { AuthGuard } from "@/components/auth-guard"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Shield,
  Search,
  Plus,
  Edit,
  Users,
  Settings,
  Eye,
  Trash2,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Rol {
  id: string
  nombre: string
  descripcion: string
  permisos: string[]
  usuariosAsignados: number
  activo: boolean
}

const roles: Rol[] = [
  {
    id: "ROL-001",
    nombre: "Administrador",
    descripcion: "Acceso completo al sistema",
    permisos: ["dashboard.view", "clientes.view", "clientes.create", "clientes.edit", "clientes.delete", "obligaciones.view", "cobranza.manage", "acuerdos.create", "metricas.view", "usuarios.manage", "permisos.manage", "carga.execute", "notificaciones.view", "configuracion.manage"],
    usuariosAsignados: 2,
    activo: true
  },
  {
    id: "ROL-002",
    nombre: "Líder",
    descripcion: "Supervisión de equipos de gestión",
    permisos: ["dashboard.view", "clientes.view", "clientes.create", "clientes.edit", "obligaciones.view", "cobranza.manage", "acuerdos.create", "metricas.view", "notificaciones.view"],
    usuariosAsignados: 3,
    activo: true
  },
  {
    id: "ROL-003",
    nombre: "Gestor",
    descripcion: "Gestión de cobranza y clientes",
    permisos: ["dashboard.view", "clientes.view", "obligaciones.view", "cobranza.manage", "acuerdos.create", "notificaciones.view"],
    usuariosAsignados: 15,
    activo: true
  },
  {
    id: "ROL-004",
    nombre: "Consultor",
    descripcion: "Solo lectura de información",
    permisos: ["dashboard.view", "clientes.view", "obligaciones.view", "metricas.view"],
    usuariosAsignados: 5,
    activo: true
  },
  {
    id: "ROL-005",
    nombre: "Cargador",
    descripcion: "Carga masiva de datos",
    permisos: ["dashboard.view", "carga.execute", "notificaciones.view"],
    usuariosAsignados: 1,
    activo: false
  },
]

const todosLosPermisos = [
  { codigo: "dashboard.view", nombre: "Ver Dashboard", modulo: "Dashboard" },
  { codigo: "clientes.view", nombre: "Ver Clientes", modulo: "Clientes" },
  { codigo: "clientes.create", nombre: "Crear Clientes", modulo: "Clientes" },
  { codigo: "clientes.edit", nombre: "Editar Clientes", modulo: "Clientes" },
  { codigo: "clientes.delete", nombre: "Eliminar Clientes", modulo: "Clientes" },
  { codigo: "obligaciones.view", nombre: "Ver Obligaciones", modulo: "Créditos" },
  { codigo: "cobranza.manage", nombre: "Gestionar Cobranza", modulo: "Cobranza" },
  { codigo: "acuerdos.create", nombre: "Crear Acuerdos", modulo: "Cobranza" },
  { codigo: "metricas.view", nombre: "Ver Métricas", modulo: "Métricas" },
  { codigo: "usuarios.manage", nombre: "Gestionar Usuarios", modulo: "Usuarios" },
  { codigo: "permisos.manage", nombre: "Gestionar Permisos", modulo: "Usuarios" },
  { codigo: "carga.execute", nombre: "Cargar Datos", modulo: "Carga" },
  { codigo: "notificaciones.view", nombre: "Ver Notificaciones", modulo: "Notificaciones" },
  { codigo: "configuracion.manage", nombre: "Configurar Sistema", modulo: "Configuración" },
]

const getRolStyle = (nombre: string) => {
  switch (nombre) {
    case "Administrador": return "bg-special/10 text-special"
    case "Líder": return "bg-warning/10 text-warning"
    case "Gestor": return "bg-info/10 text-info"
    case "Consultor": return "bg-emerald/10 text-emerald"
    default: return "bg-muted text-muted-foreground"
  }
}

export default function RolesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [selectedRol, setSelectedRol] = useState<Rol | null>(null)
  const [isEditOpen, setIsEditOpen] = useState(false)

  const rolesFiltrados = roles.filter(r =>
    r.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalUsuarios = roles.reduce((acc, r) => acc + r.usuariosAsignados, 0)

  return (
    <AuthGuard>
      <AppLayout>
        <Topbar
          title="Roles"
          breadcrumbs={[{ label: "Usuarios" }, { label: "Roles" }]}
        />

        <div className="p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald/10">
                    <Shield className="h-5 w-5 text-emerald" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{roles.length}</p>
                    <p className="text-sm text-muted-foreground">Total roles</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-info/10">
                    <Users className="h-5 w-5 text-info" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{totalUsuarios}</p>
                    <p className="text-sm text-muted-foreground">Usuarios asignados</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-warning/10">
                    <Settings className="h-5 w-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{todosLosPermisos.length}</p>
                    <p className="text-sm text-muted-foreground">Permisos disponibles</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="bg-card border-border">
            <CardHeader className="border-b border-border">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-foreground">Gestión de Roles</CardTitle>
                  <CardDescription>Administra los roles y sus permisos</CardDescription>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar rol..."
                      className="pl-9 bg-background"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button className="bg-emerald hover:bg-emerald-bright text-emerald-foreground" onClick={() => setIsCreateOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Rol
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rolesFiltrados.map((rol) => (
                  <Card 
                    key={rol.id} 
                    className={cn(
                      "bg-muted/30 border-border hover:border-emerald/50 transition-colors cursor-pointer",
                      !rol.activo && "opacity-60"
                    )}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className={cn("p-2 rounded-lg", getRolStyle(rol.nombre))}>
                            <Shield className="h-4 w-4" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">{rol.nombre}</h3>
                            <p className="text-xs text-muted-foreground">{rol.descripcion}</p>
                          </div>
                        </div>
                        {!rol.activo && (
                          <Badge className="bg-muted text-muted-foreground border-0 text-xs">
                            Inactivo
                          </Badge>
                        )}
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Permisos:</span>
                          <Badge variant="outline" className="text-xs">
                            {rol.permisos.length} de {todosLosPermisos.length}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Usuarios:</span>
                          <span className="font-medium text-foreground">{rol.usuariosAsignados}</span>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => setSelectedRol(rol)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Ver
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => { setSelectedRol(rol); setIsEditOpen(true) }}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Create Dialog */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Nuevo Rol</DialogTitle>
              <DialogDescription>
                Crea un nuevo rol y asigna permisos
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Nombre del rol</Label>
                <Input placeholder="Ej: Supervisor" />
              </div>
              <div className="space-y-2">
                <Label>Descripción</Label>
                <Input placeholder="Descripción del rol" />
              </div>
              <div className="space-y-2">
                <Label>Permisos</Label>
                <ScrollArea className="h-[200px] border rounded-lg p-3">
                  <div className="space-y-3">
                    {Object.entries(
                      todosLosPermisos.reduce((acc, p) => {
                        if (!acc[p.modulo]) acc[p.modulo] = []
                        acc[p.modulo].push(p)
                        return acc
                      }, {} as Record<string, typeof todosLosPermisos>)
                    ).map(([modulo, permisos]) => (
                      <div key={modulo}>
                        <p className="text-sm font-medium text-foreground mb-2">{modulo}</p>
                        <div className="space-y-2 ml-2">
                          {permisos.map(p => (
                            <div key={p.codigo} className="flex items-center gap-2">
                              <Checkbox id={p.codigo} />
                              <label htmlFor={p.codigo} className="text-sm text-muted-foreground cursor-pointer">
                                {p.nombre}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancelar</Button>
              <Button className="bg-emerald hover:bg-emerald-bright text-emerald-foreground">
                Crear rol
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Dialog */}
        <Dialog open={!!selectedRol && !isEditOpen} onOpenChange={() => setSelectedRol(null)}>
          <DialogContent className="sm:max-w-lg">
            {selectedRol && (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-3">
                    <div className={cn("p-2 rounded-lg", getRolStyle(selectedRol.nombre))}>
                      <Shield className="h-5 w-5" />
                    </div>
                    <div>
                      <DialogTitle>{selectedRol.nombre}</DialogTitle>
                      <DialogDescription>{selectedRol.descripcion}</DialogDescription>
                    </div>
                  </div>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/50 rounded-lg p-4 text-center">
                      <p className="text-sm text-muted-foreground mb-1">Permisos</p>
                      <p className="text-2xl font-bold text-foreground">{selectedRol.permisos.length}</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4 text-center">
                      <p className="text-sm text-muted-foreground mb-1">Usuarios</p>
                      <p className="text-2xl font-bold text-foreground">{selectedRol.usuariosAsignados}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Permisos asignados</Label>
                    <ScrollArea className="h-[200px] border rounded-lg p-3">
                      <div className="space-y-1">
                        {selectedRol.permisos.map(codigo => {
                          const permiso = todosLosPermisos.find(p => p.codigo === codigo)
                          return (
                            <div key={codigo} className="flex items-center gap-2 text-sm py-1">
                              <Badge variant="outline" className="text-xs">{permiso?.modulo}</Badge>
                              <span className="text-foreground">{permiso?.nombre}</span>
                            </div>
                          )
                        })}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setSelectedRol(null)}>Cerrar</Button>
                  <Button 
                    className="bg-emerald hover:bg-emerald-bright text-emerald-foreground"
                    onClick={() => setIsEditOpen(true)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditOpen} onOpenChange={(open) => { setIsEditOpen(open); if (!open) setSelectedRol(null) }}>
          <DialogContent className="sm:max-w-lg">
            {selectedRol && (
              <>
                <DialogHeader>
                  <DialogTitle>Editar Rol: {selectedRol.nombre}</DialogTitle>
                  <DialogDescription>
                    Modifica los permisos asignados a este rol
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Nombre del rol</Label>
                    <Input defaultValue={selectedRol.nombre} />
                  </div>
                  <div className="space-y-2">
                    <Label>Descripción</Label>
                    <Input defaultValue={selectedRol.descripcion} />
                  </div>
                  <div className="space-y-2">
                    <Label>Permisos</Label>
                    <ScrollArea className="h-[200px] border rounded-lg p-3">
                      <div className="space-y-3">
                        {Object.entries(
                          todosLosPermisos.reduce((acc, p) => {
                            if (!acc[p.modulo]) acc[p.modulo] = []
                            acc[p.modulo].push(p)
                            return acc
                          }, {} as Record<string, typeof todosLosPermisos>)
                        ).map(([modulo, permisos]) => (
                          <div key={modulo}>
                            <p className="text-sm font-medium text-foreground mb-2">{modulo}</p>
                            <div className="space-y-2 ml-2">
                              {permisos.map(p => (
                                <div key={p.codigo} className="flex items-center gap-2">
                                  <Checkbox 
                                    id={`edit-${p.codigo}`} 
                                    defaultChecked={selectedRol.permisos.includes(p.codigo)}
                                  />
                                  <label htmlFor={`edit-${p.codigo}`} className="text-sm text-muted-foreground cursor-pointer">
                                    {p.nombre}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => { setIsEditOpen(false); setSelectedRol(null) }}>
                    Cancelar
                  </Button>
                  <Button className="bg-emerald hover:bg-emerald-bright text-emerald-foreground">
                    Guardar cambios
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
