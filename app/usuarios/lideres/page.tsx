"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
  Users2,
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
  Star,
  TrendingUp,
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

const mockLideres = [
  { id: 1, nombre: "Carlos Méndez", email: "carlos.mendez@krediya.com", telefono: "+57 300 123 4567", regional: "Regional Centro", financiera: "Krediya", gestores: 15, metaCumplida: 92, estado: "activo" },
  { id: 2, nombre: "María López", email: "maria.lopez@krediya.com", telefono: "+57 301 234 5678", regional: "Regional Norte", financiera: "Krediya", gestores: 10, metaCumplida: 88, estado: "activo" },
  { id: 3, nombre: "Juan Rodríguez", email: "juan.rodriguez@krediya.com", telefono: "+57 302 345 6789", regional: "Regional Sur", financiera: "Krediya", gestores: 12, metaCumplida: 95, estado: "activo" },
  { id: 4, nombre: "Ana García", email: "ana.garcia@payjoy.com", telefono: "+57 303 456 7890", regional: "Regional Occidente", financiera: "PayJoy", gestores: 14, metaCumplida: 78, estado: "activo" },
  { id: 5, nombre: "Pedro Martínez", email: "pedro.martinez@alo.com", telefono: "+57 304 567 8901", regional: "Regional Oriente", financiera: "ALO", gestores: 8, metaCumplida: 65, estado: "inactivo" },
]

export default function LideresPage() {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [financieraFilter, setFinancieraFilter] = React.useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)

  const filteredLideres = mockLideres.filter((l) => {
    const matchesSearch = l.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFinanciera = financieraFilter === "all" || l.financiera === financieraFilter
    return matchesSearch && matchesFinanciera
  })

  return (
    <AuthGuard>
      <AppLayout>
        <Topbar
          title="Líderes"
          breadcrumbs={[{ label: "Usuarios" }, { label: "Líderes" }]}
          showCreate={false}
        />
        <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Líderes</h1>
          <p className="text-muted-foreground">
            Administra los líderes regionales del sistema
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-emerald hover:bg-emerald/90">
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Líder
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Líderes</CardTitle>
            <Users2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockLideres.length}</div>
            <p className="text-xs text-muted-foreground">
              {mockLideres.filter(l => l.estado === "activo").length} activos
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gestores a cargo</CardTitle>
            <Users2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockLideres.reduce((acc, l) => acc + l.gestores, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meta Promedio</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald">
              {Math.round(mockLideres.reduce((acc, l) => acc + l.metaCumplida, 0) / mockLideres.length)}%
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Performer</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold truncate">
              {mockLideres.reduce((prev, current) => prev.metaCumplida > current.metaCumplida ? prev : current).nombre}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Lista de Líderes</CardTitle>
          <CardDescription>Gestiona los líderes por regional y financiera</CardDescription>
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
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Financiera" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="Krediya">Krediya</SelectItem>
                <SelectItem value="PayJoy">PayJoy</SelectItem>
                <SelectItem value="ALO">ALO</SelectItem>
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
                  <TableHead>Líder</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Regional</TableHead>
                  <TableHead>Financiera</TableHead>
                  <TableHead className="text-center">Gestores</TableHead>
                  <TableHead>Meta Cumplida</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLideres.map((lider, index) => (
                  <motion.tr
                    key={lider.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-emerald/20 text-emerald text-sm">
                            {lider.nombre.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="font-medium">{lider.nombre}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Mail className="h-3 w-3" />{lider.email}
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Phone className="h-3 w-3" />{lider.telefono}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Building2 className="h-3 w-3 text-muted-foreground" />
                        {lider.regional}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{lider.financiera}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">{lider.gestores}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={lider.metaCumplida} className="h-2 w-20" />
                        <span className={`text-sm font-medium ${lider.metaCumplida >= 80 ? "text-emerald" : lider.metaCumplida >= 60 ? "text-yellow-500" : "text-red-500"}`}>
                          {lider.metaCumplida}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={lider.estado === "activo" ? "default" : "secondary"}
                        className={lider.estado === "activo" ? "bg-emerald/20 text-emerald" : ""}>
                        {lider.estado}
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
            <DialogTitle>Nuevo Líder</DialogTitle>
            <DialogDescription>Registra un nuevo líder regional</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Nombre completo</Label>
              <Input placeholder="Nombre del líder" />
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
                <Label>Regional</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="centro">Regional Centro</SelectItem>
                    <SelectItem value="norte">Regional Norte</SelectItem>
                    <SelectItem value="sur">Regional Sur</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancelar</Button>
            <Button className="bg-emerald hover:bg-emerald/90">Crear Líder</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
        </div>
      </AppLayout>
    </AuthGuard>
  )
}
