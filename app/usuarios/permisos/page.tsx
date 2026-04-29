"use client"

import { useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { Topbar } from "@/components/topbar"
import { AuthGuard } from "@/components/auth-guard"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
import {
  Shield,
  Search,
  Plus,
  Edit,
  Lock,
  Unlock,
  Eye,
  FileText,
  Users,
  CreditCard,
  Settings,
  BarChart3,
  Bell,
  Upload,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Permiso {
  id: string
  nombre: string
  codigo: string
  descripcion: string
  modulo: string
  activo: boolean
}

const permisos: Permiso[] = [
  { id: "PER-001", nombre: "Ver Dashboard", codigo: "dashboard.view", descripcion: "Acceso al panel principal", modulo: "Dashboard", activo: true },
  { id: "PER-002", nombre: "Ver Clientes", codigo: "clientes.view", descripcion: "Ver lista de clientes", modulo: "Clientes", activo: true },
  { id: "PER-003", nombre: "Crear Clientes", codigo: "clientes.create", descripcion: "Crear nuevos clientes", modulo: "Clientes", activo: true },
  { id: "PER-004", nombre: "Editar Clientes", codigo: "clientes.edit", descripcion: "Modificar datos de clientes", modulo: "Clientes", activo: true },
  { id: "PER-005", nombre: "Eliminar Clientes", codigo: "clientes.delete", descripcion: "Eliminar clientes del sistema", modulo: "Clientes", activo: false },
  { id: "PER-006", nombre: "Ver Obligaciones", codigo: "obligaciones.view", descripcion: "Ver obligaciones de crédito", modulo: "Créditos", activo: true },
  { id: "PER-007", nombre: "Gestionar Cobranza", codigo: "cobranza.manage", descripcion: "Realizar gestiones de cobranza", modulo: "Cobranza", activo: true },
  { id: "PER-008", nombre: "Crear Acuerdos", codigo: "acuerdos.create", descripcion: "Crear acuerdos de pago", modulo: "Cobranza", activo: true },
  { id: "PER-009", nombre: "Ver Métricas", codigo: "metricas.view", descripcion: "Acceso a indicadores y métricas", modulo: "Métricas", activo: true },
  { id: "PER-010", nombre: "Gestionar Usuarios", codigo: "usuarios.manage", descripcion: "Administrar usuarios del sistema", modulo: "Usuarios", activo: true },
  { id: "PER-011", nombre: "Gestionar Permisos", codigo: "permisos.manage", descripcion: "Configurar permisos y roles", modulo: "Usuarios", activo: true },
  { id: "PER-012", nombre: "Cargar Datos", codigo: "carga.execute", descripcion: "Realizar cargas masivas", modulo: "Carga", activo: true },
  { id: "PER-013", nombre: "Ver Notificaciones", codigo: "notificaciones.view", descripcion: "Ver centro de notificaciones", modulo: "Notificaciones", activo: true },
  { id: "PER-014", nombre: "Configurar Sistema", codigo: "configuracion.manage", descripcion: "Acceso a configuración general", modulo: "Configuración", activo: false },
]

const getModuloIcon = (modulo: string) => {
  switch (modulo) {
    case "Dashboard": return BarChart3
    case "Clientes": return Users
    case "Créditos": return CreditCard
    case "Cobranza": return FileText
    case "Métricas": return BarChart3
    case "Usuarios": return Users
    case "Carga": return Upload
    case "Notificaciones": return Bell
    case "Configuración": return Settings
    default: return Shield
  }
}

const getModuloStyle = (modulo: string) => {
  switch (modulo) {
    case "Dashboard": return "bg-emerald/10 text-emerald"
    case "Clientes": return "bg-info/10 text-info"
    case "Créditos": return "bg-warning/10 text-warning"
    case "Cobranza": return "bg-special/10 text-special"
    case "Métricas": return "bg-emerald/10 text-emerald"
    case "Usuarios": return "bg-info/10 text-info"
    case "Carga": return "bg-warning/10 text-warning"
    case "Notificaciones": return "bg-special/10 text-special"
    case "Configuración": return "bg-destructive/10 text-destructive"
    default: return "bg-muted text-muted-foreground"
  }
}

export default function PermisosPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filtroModulo, setFiltroModulo] = useState("todos")
  const [filtroEstado, setFiltroEstado] = useState("todos")
  const [permisosList, setPermisosList] = useState(permisos)
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const permisosFiltrados = permisosList.filter(p => {
    const matchSearch = 
      p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.codigo.toLowerCase().includes(searchTerm.toLowerCase())
    const matchModulo = filtroModulo === "todos" || p.modulo === filtroModulo
    const matchEstado = filtroEstado === "todos" || 
      (filtroEstado === "activos" && p.activo) ||
      (filtroEstado === "inactivos" && !p.activo)
    return matchSearch && matchModulo && matchEstado
  })

  const togglePermiso = (id: string) => {
    setPermisosList(prev => 
      prev.map(p => p.id === id ? { ...p, activo: !p.activo } : p)
    )
  }

  const modulos = [...new Set(permisos.map(p => p.modulo))]
  const activos = permisosList.filter(p => p.activo).length

  return (
    <AuthGuard>
      <AppLayout>
        <Topbar
          title="Permisos"
          breadcrumbs={[{ label: "Usuarios" }, { label: "Permisos" }]}
        />

        <div className="p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald/10">
                    <Shield className="h-5 w-5 text-emerald" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{permisosList.length}</p>
                    <p className="text-sm text-muted-foreground">Total permisos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald/10">
                    <Unlock className="h-5 w-5 text-emerald" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{activos}</p>
                    <p className="text-sm text-muted-foreground">Activos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-destructive/10">
                    <Lock className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{permisosList.length - activos}</p>
                    <p className="text-sm text-muted-foreground">Inactivos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-info/10">
                    <Settings className="h-5 w-5 text-info" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{modulos.length}</p>
                    <p className="text-sm text-muted-foreground">Módulos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Table */}
          <Card className="bg-card border-border">
            <CardHeader className="border-b border-border">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-foreground">Gestión de Permisos</CardTitle>
                  <CardDescription>Administra los permisos del sistema</CardDescription>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar permiso..."
                      className="pl-9 bg-background"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={filtroModulo} onValueChange={setFiltroModulo}>
                    <SelectTrigger className="w-36 bg-background">
                      <SelectValue placeholder="Módulo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      {modulos.map(m => (
                        <SelectItem key={m} value={m}>{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                    <SelectTrigger className="w-32 bg-background">
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="activos">Activos</SelectItem>
                      <SelectItem value="inactivos">Inactivos</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button className="bg-emerald hover:bg-emerald-bright text-emerald-foreground" onClick={() => setIsCreateOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Permiso
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Permiso</TableHead>
                    <TableHead className="text-muted-foreground">Código</TableHead>
                    <TableHead className="text-muted-foreground">Módulo</TableHead>
                    <TableHead className="text-muted-foreground">Descripción</TableHead>
                    <TableHead className="text-muted-foreground text-center">Estado</TableHead>
                    <TableHead className="text-muted-foreground text-center">Acción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {permisosFiltrados.map((permiso) => {
                    const ModuloIcon = getModuloIcon(permiso.modulo)
                    return (
                      <TableRow key={permiso.id} className="border-border">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className={cn("p-2 rounded-lg", getModuloStyle(permiso.modulo))}>
                              <ModuloIcon className="h-4 w-4" />
                            </div>
                            <span className="font-medium text-foreground">{permiso.nombre}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="text-sm bg-muted px-2 py-1 rounded text-foreground">
                            {permiso.codigo}
                          </code>
                        </TableCell>
                        <TableCell>
                          <Badge className={cn("border-0", getModuloStyle(permiso.modulo))}>
                            {permiso.modulo}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground max-w-[200px] truncate">
                          {permiso.descripcion}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className={cn(
                            "border-0",
                            permiso.activo ? "bg-emerald/10 text-emerald" : "bg-muted text-muted-foreground"
                          )}>
                            {permiso.activo ? "Activo" : "Inactivo"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Switch
                            checked={permiso.activo}
                            onCheckedChange={() => togglePermiso(permiso.id)}
                            className="data-[state=checked]:bg-emerald"
                          />
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Create Dialog */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Nuevo Permiso</DialogTitle>
              <DialogDescription>
                Crea un nuevo permiso en el sistema
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Nombre</Label>
                <Input placeholder="Nombre del permiso" />
              </div>
              <div className="space-y-2">
                <Label>Código</Label>
                <Input placeholder="modulo.accion" />
              </div>
              <div className="space-y-2">
                <Label>Módulo</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar módulo" />
                  </SelectTrigger>
                  <SelectContent>
                    {modulos.map(m => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Descripción</Label>
                <Input placeholder="Descripción del permiso" />
              </div>
              <div className="flex items-center justify-between">
                <Label>Activo por defecto</Label>
                <Switch defaultChecked className="data-[state=checked]:bg-emerald" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancelar</Button>
              <Button className="bg-emerald hover:bg-emerald-bright text-emerald-foreground">
                Crear permiso
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </AppLayout>
    </AuthGuard>
  )
}
