"use client"

import { useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { Topbar } from "@/components/topbar"
import { AuthGuard } from "@/components/auth-guard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import {
  Users,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Shield,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Calendar,
  Building,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Usuario {
  id: string
  nombre: string
  email: string
  telefono: string
  rol: string
  financiera: string
  estado: "activo" | "inactivo"
  fechaCreacion: string
  ultimoAcceso?: string
}

const usuarios: Usuario[] = [
  {
    id: "USR-001",
    nombre: "Juan Díaz",
    email: "juan.diaz@krediya.com",
    telefono: "3001234567",
    rol: "Gestor",
    financiera: "Krediya",
    estado: "activo",
    fechaCreacion: "2024-01-15",
    ultimoAcceso: "2024-03-25"
  },
  {
    id: "USR-002",
    nombre: "Ana Pérez",
    email: "ana.perez@krediya.com",
    telefono: "3009876543",
    rol: "Gestor",
    financiera: "Krediya",
    estado: "activo",
    fechaCreacion: "2024-01-20",
    ultimoAcceso: "2024-03-25"
  },
  {
    id: "USR-003",
    nombre: "Carlos Ruiz",
    email: "carlos.ruiz@krediya.com",
    telefono: "3005551234",
    rol: "Líder",
    financiera: "Krediya",
    estado: "activo",
    fechaCreacion: "2023-11-10",
    ultimoAcceso: "2024-03-24"
  },
  {
    id: "USR-004",
    nombre: "María Torres",
    email: "maria.torres@payjoy.com",
    telefono: "3007778899",
    rol: "Gestor",
    financiera: "PayJoy",
    estado: "activo",
    fechaCreacion: "2024-02-01",
    ultimoAcceso: "2024-03-25"
  },
  {
    id: "USR-005",
    nombre: "Roberto López",
    email: "roberto.lopez@krediya.com",
    telefono: "3004443322",
    rol: "Administrador",
    financiera: "Krediya",
    estado: "activo",
    fechaCreacion: "2023-06-15",
    ultimoAcceso: "2024-03-25"
  },
  {
    id: "USR-006",
    nombre: "Laura Sánchez",
    email: "laura.sanchez@alo.com",
    telefono: "3002221100",
    rol: "Gestor",
    financiera: "ALO",
    estado: "inactivo",
    fechaCreacion: "2023-09-20"
  },
]

const getRolStyle = (rol: string) => {
  switch (rol) {
    case "Administrador": return "bg-special/10 text-special"
    case "Líder": return "bg-warning/10 text-warning"
    case "Gestor": return "bg-info/10 text-info"
    default: return "bg-muted text-muted-foreground"
  }
}

export default function UsuariosPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filtroRol, setFiltroRol] = useState("todos")
  const [filtroEstado, setFiltroEstado] = useState("todos")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null)

  const usuariosFiltrados = usuarios.filter(u => {
    const matchSearch = 
      u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchRol = filtroRol === "todos" || u.rol === filtroRol
    const matchEstado = filtroEstado === "todos" || u.estado === filtroEstado
    return matchSearch && matchRol && matchEstado
  })

  const activos = usuarios.filter(u => u.estado === "activo").length
  const roles = [...new Set(usuarios.map(u => u.rol))]

  return (
    <AuthGuard>
      <AppLayout>
        <Topbar
          title="Usuarios"
          breadcrumbs={[{ label: "Usuarios" }, { label: "Lista" }]}
        />

        <div className="p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald/10">
                    <Users className="h-5 w-5 text-emerald" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{usuarios.length}</p>
                    <p className="text-sm text-muted-foreground">Total usuarios</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald/10">
                    <UserCheck className="h-5 w-5 text-emerald" />
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
                    <UserX className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{usuarios.length - activos}</p>
                    <p className="text-sm text-muted-foreground">Inactivos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-info/10">
                    <Shield className="h-5 w-5 text-info" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{roles.length}</p>
                    <p className="text-sm text-muted-foreground">Roles</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Table */}
          <Card className="bg-card border-border">
            <CardHeader className="border-b border-border">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <CardTitle className="text-foreground">Lista de Usuarios</CardTitle>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar usuario..."
                      className="pl-9 bg-background"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={filtroRol} onValueChange={setFiltroRol}>
                    <SelectTrigger className="w-32 bg-background">
                      <SelectValue placeholder="Rol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      {roles.map(r => (
                        <SelectItem key={r} value={r}>{r}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                    <SelectTrigger className="w-32 bg-background">
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="activo">Activos</SelectItem>
                      <SelectItem value="inactivo">Inactivos</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button className="bg-emerald hover:bg-emerald-bright text-emerald-foreground" onClick={() => setIsCreateOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Usuario
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Usuario</TableHead>
                    <TableHead className="text-muted-foreground">Email</TableHead>
                    <TableHead className="text-muted-foreground">Rol</TableHead>
                    <TableHead className="text-muted-foreground">Financiera</TableHead>
                    <TableHead className="text-muted-foreground">Estado</TableHead>
                    <TableHead className="text-muted-foreground">Último acceso</TableHead>
                    <TableHead className="text-muted-foreground text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usuariosFiltrados.map((usuario) => (
                    <TableRow key={usuario.id} className="border-border">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className="bg-emerald/20 text-emerald text-sm">
                              {usuario.nombre.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-foreground">{usuario.nombre}</p>
                            <p className="text-xs text-muted-foreground">{usuario.telefono}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-foreground">{usuario.email}</TableCell>
                      <TableCell>
                        <Badge className={cn("border-0", getRolStyle(usuario.rol))}>
                          {usuario.rol}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-foreground">{usuario.financiera}</TableCell>
                      <TableCell>
                        <Badge className={cn(
                          "border-0",
                          usuario.estado === "activo" ? "bg-emerald/10 text-emerald" : "bg-muted text-muted-foreground"
                        )}>
                          {usuario.estado === "activo" ? "Activo" : "Inactivo"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {usuario.ultimoAcceso || "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSelectedUsuario(usuario)}>
                              <Eye className="h-4 w-4 mr-2" />
                              Ver detalle
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive focus:text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Create Dialog */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Nuevo Usuario</DialogTitle>
              <DialogDescription>
                Crea un nuevo usuario en el sistema
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Nombre completo</Label>
                <Input placeholder="Nombre del usuario" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" placeholder="email@ejemplo.com" />
                </div>
                <div className="space-y-2">
                  <Label>Teléfono</Label>
                  <Input placeholder="3001234567" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Rol</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map(r => (
                        <SelectItem key={r} value={r}>{r}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Financiera</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Krediya">Krediya</SelectItem>
                      <SelectItem value="PayJoy">PayJoy</SelectItem>
                      <SelectItem value="ALO">ALO</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Contraseña temporal</Label>
                <Input type="password" placeholder="********" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancelar</Button>
              <Button className="bg-emerald hover:bg-emerald-bright text-emerald-foreground">
                Crear usuario
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Detail Dialog */}
        <Dialog open={!!selectedUsuario} onOpenChange={() => setSelectedUsuario(null)}>
          <DialogContent className="sm:max-w-lg">
            {selectedUsuario && (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-14 w-14">
                      <AvatarFallback className="bg-emerald/20 text-emerald text-lg">
                        {selectedUsuario.nombre.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <DialogTitle>{selectedUsuario.nombre}</DialogTitle>
                      <DialogDescription className="flex items-center gap-2 mt-1">
                        <Badge className={cn("border-0", getRolStyle(selectedUsuario.rol))}>
                          {selectedUsuario.rol}
                        </Badge>
                        <Badge className={cn(
                          "border-0",
                          selectedUsuario.estado === "activo" ? "bg-emerald/10 text-emerald" : "bg-muted text-muted-foreground"
                        )}>
                          {selectedUsuario.estado === "activo" ? "Activo" : "Inactivo"}
                        </Badge>
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-3 bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Email:</span>
                      <span className="text-sm font-medium text-foreground">{selectedUsuario.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Teléfono:</span>
                      <span className="text-sm font-medium text-foreground">{selectedUsuario.telefono}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Financiera:</span>
                      <span className="text-sm font-medium text-foreground">{selectedUsuario.financiera}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Fecha creación:</span>
                      <span className="text-sm font-medium text-foreground">{selectedUsuario.fechaCreacion}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Último acceso:</span>
                      <span className="text-sm font-medium text-foreground">{selectedUsuario.ultimoAcceso || "Nunca"}</span>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setSelectedUsuario(null)}>Cerrar</Button>
                  <Button className="bg-emerald hover:bg-emerald-bright text-emerald-foreground">
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
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
