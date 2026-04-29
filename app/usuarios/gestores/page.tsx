"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
  User,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Mail,
  Phone,
  Building2,
  RefreshCw,
  Target,
  TrendingUp,
  Clock,
} from "lucide-react"
import { AppLayout } from "@/components/app-layout"
import { Topbar } from "@/components/topbar"
import { AuthGuard } from "@/components/auth-guard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

const mockGestores = [
  { id: 1, nombre: "Andrés Pérez", email: "andres.perez@krediya.com", telefono: "+57 310 111 2222", sucursal: "Sucursal Chapinero", lider: "Carlos Méndez", financiera: "Krediya", gestionesHoy: 25, metaCumplida: 85, estado: "activo" },
  { id: 2, nombre: "Laura Sánchez", email: "laura.sanchez@krediya.com", telefono: "+57 311 222 3333", sucursal: "Sucursal Usaquén", lider: "Carlos Méndez", financiera: "Krediya", gestionesHoy: 32, metaCumplida: 92, estado: "activo" },
  { id: 3, nombre: "Diego Torres", email: "diego.torres@krediya.com", telefono: "+57 312 333 4444", sucursal: "Sucursal Kennedy", lider: "Carlos Méndez", financiera: "Krediya", gestionesHoy: 18, metaCumplida: 72, estado: "activo" },
  { id: 4, nombre: "Camila Ruiz", email: "camila.ruiz@payjoy.com", telefono: "+57 313 444 5555", sucursal: "Sucursal Medellín", lider: "Ana García", financiera: "PayJoy", gestionesHoy: 28, metaCumplida: 88, estado: "activo" },
  { id: 5, nombre: "Miguel Castro", email: "miguel.castro@alo.com", telefono: "+57 314 555 6666", sucursal: "Sucursal Bucaramanga", lider: "Pedro Martínez", financiera: "ALO", gestionesHoy: 12, metaCumplida: 55, estado: "inactivo" },
  { id: 6, nombre: "Valentina Mora", email: "valentina.mora@krediya.com", telefono: "+57 315 666 7777", sucursal: "Sucursal Chapinero", lider: "Carlos Méndez", financiera: "Krediya", gestionesHoy: 30, metaCumplida: 95, estado: "activo" },
]

export default function GestoresPage() {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [financieraFilter, setFinancieraFilter] = React.useState("all")
  const [estadoFilter, setEstadoFilter] = React.useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)

  const filteredGestores = mockGestores.filter((g) => {
    const matchesSearch = g.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFinanciera = financieraFilter === "all" || g.financiera === financieraFilter
    const matchesEstado = estadoFilter === "all" || g.estado === estadoFilter
    return matchesSearch && matchesFinanciera && matchesEstado
  })

  const totalGestionesHoy = mockGestores.reduce((acc, g) => acc + g.gestionesHoy, 0)
  const promedioMeta = Math.round(mockGestores.reduce((acc, g) => acc + g.metaCumplida, 0) / mockGestores.length)

  return (
    <AuthGuard>
      <AppLayout>
        <Topbar
          title="Gestores"
          breadcrumbs={[{ label: "Usuarios" }, { label: "Gestores" }]}
          showCreate={false}
        />
        <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gestores</h1>
          <p className="text-muted-foreground">
            Administra los gestores de cobranza del sistema
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-emerald hover:bg-emerald/90">
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Gestor
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Gestores</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockGestores.length}</div>
            <p className="text-xs text-muted-foreground">
              {mockGestores.filter(g => g.estado === "activo").length} activos
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gestiones Hoy</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{totalGestionesHoy}</div>
            <p className="text-xs text-muted-foreground">Total realizadas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meta Promedio</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald">{promedioMeta}%</div>
            <p className="text-xs text-muted-foreground">Cumplimiento</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Por debajo meta</CardTitle>
            <Target className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {mockGestores.filter(g => g.metaCumplida < 70).length}
            </div>
            <p className="text-xs text-muted-foreground">{"< 70%"} cumplimiento</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Lista de Gestores</CardTitle>
          <CardDescription>Gestiona los gestores por sucursal y financiera</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={financieraFilter} onValueChange={setFinancieraFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Financiera" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="Krediya">Krediya</SelectItem>
                <SelectItem value="PayJoy">PayJoy</SelectItem>
                <SelectItem value="ALO">ALO</SelectItem>
              </SelectContent>
            </Select>
            <Select value={estadoFilter} onValueChange={setEstadoFilter}>
              <SelectTrigger className="w-full sm:w-[130px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="activo">Activos</SelectItem>
                <SelectItem value="inactivo">Inactivos</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Gestor</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Sucursal</TableHead>
                  <TableHead>Líder</TableHead>
                  <TableHead className="text-center">Gestiones Hoy</TableHead>
                  <TableHead>Meta</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGestores.map((gestor, index) => (
                  <motion.tr
                    key={gestor.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-blue-500/20 text-blue-500 text-sm">
                            {gestor.nombre.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{gestor.nombre}</div>
                          <Badge variant="outline" className="text-xs">{gestor.financiera}</Badge>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm space-y-0.5">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Mail className="h-3 w-3" />{gestor.email}
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Phone className="h-3 w-3" />{gestor.telefono}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Building2 className="h-3 w-3 text-muted-foreground" />
                        {gestor.sucursal}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{gestor.lider}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary" className="bg-blue-500/10 text-blue-500">
                        {gestor.gestionesHoy}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={gestor.metaCumplida} className="h-2 w-16" />
                        <span className={`text-sm font-medium ${gestor.metaCumplida >= 80 ? "text-emerald" : gestor.metaCumplida >= 60 ? "text-yellow-500" : "text-red-500"}`}>
                          {gestor.metaCumplida}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={gestor.estado === "activo" ? "default" : "secondary"}
                        className={gestor.estado === "activo" ? "bg-emerald/20 text-emerald" : ""}>
                        {gestor.estado}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem><Eye className="mr-2 h-4 w-4" />Ver detalles</DropdownMenuItem>
                          <DropdownMenuItem><Edit className="mr-2 h-4 w-4" />Editar</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />Eliminar</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Nuevo Gestor</DialogTitle>
            <DialogDescription>Registra un nuevo gestor de cobranza</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Nombre completo</Label>
              <Input placeholder="Nombre del gestor" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Email</Label>
                <Input type="email" placeholder="email@empresa.com" />
              </div>
              <div className="grid gap-2">
                <Label>Teléfono</Label>
                <Input placeholder="+57 300 000 0000" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Financiera</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="krediya">Krediya</SelectItem>
                    <SelectItem value="payjoy">PayJoy</SelectItem>
                    <SelectItem value="alo">ALO</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Sucursal</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="chapinero">Sucursal Chapinero</SelectItem>
                    <SelectItem value="usaquen">Sucursal Usaquén</SelectItem>
                    <SelectItem value="kennedy">Sucursal Kennedy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Líder asignado</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Seleccionar líder" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Carlos Méndez</SelectItem>
                  <SelectItem value="2">María López</SelectItem>
                  <SelectItem value="3">Ana García</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancelar</Button>
            <Button className="bg-emerald hover:bg-emerald/90">Crear Gestor</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
        </div>
      </AppLayout>
    </AuthGuard>
  )
}
