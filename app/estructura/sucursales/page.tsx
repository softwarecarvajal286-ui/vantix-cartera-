"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
  Store,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  MapPin,
  Users,
  Phone,
  Mail,
  RefreshCw,
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

const mockSucursales = [
  { id: 1, nombre: "Sucursal Chapinero", codigo: "SUC-001", regional: "Regional Centro", direccion: "Calle 72 #10-25", ciudad: "Bogotá", telefono: "+57 601 234 5678", gestores: 12, estado: "activo" },
  { id: 2, nombre: "Sucursal Usaquén", codigo: "SUC-002", regional: "Regional Centro", direccion: "Calle 116 #15-30", ciudad: "Bogotá", telefono: "+57 601 345 6789", gestores: 8, estado: "activo" },
  { id: 3, nombre: "Sucursal Kennedy", codigo: "SUC-003", regional: "Regional Centro", direccion: "Av Américas #68-45", ciudad: "Bogotá", telefono: "+57 601 456 7890", gestores: 15, estado: "activo" },
  { id: 4, nombre: "Sucursal Barranquilla Centro", codigo: "SUC-004", regional: "Regional Norte", direccion: "Carrera 45 #72-80", ciudad: "Barranquilla", telefono: "+57 605 567 8901", gestores: 10, estado: "activo" },
  { id: 5, nombre: "Sucursal Cali Sur", codigo: "SUC-005", regional: "Regional Sur", direccion: "Calle 5 #66-40", ciudad: "Cali", telefono: "+57 602 678 9012", gestores: 9, estado: "inactivo" },
]

export default function SucursalesPage() {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [regionalFilter, setRegionalFilter] = React.useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)

  const filteredSucursales = mockSucursales.filter((s) => {
    const matchesSearch = s.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.ciudad.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRegional = regionalFilter === "all" || s.regional === regionalFilter
    return matchesSearch && matchesRegional
  })

  return (
    <AuthGuard>
      <AppLayout>
        <Topbar
          title="Sucursales"
          breadcrumbs={[{ label: "Estructura Comercial" }, { label: "Sucursales" }]}
          showCreate={false}
        />
        <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sucursales</h1>
          <p className="text-muted-foreground">
            Administra las sucursales de cada regional
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-emerald hover:bg-emerald/90">
          <Plus className="mr-2 h-4 w-4" />
          Nueva Sucursal
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sucursales</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockSucursales.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ciudades</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(mockSucursales.map(s => s.ciudad)).size}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gestores</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockSucursales.reduce((acc, s) => acc + s.gestores, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activas</CardTitle>
            <Store className="h-4 w-4 text-emerald" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockSucursales.filter(s => s.estado === "activo").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Lista de Sucursales</CardTitle>
          <CardDescription>Gestiona las sucursales por regional</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, código o ciudad..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={regionalFilter} onValueChange={setRegionalFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Regional" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las regionales</SelectItem>
                <SelectItem value="Regional Centro">Regional Centro</SelectItem>
                <SelectItem value="Regional Norte">Regional Norte</SelectItem>
                <SelectItem value="Regional Sur">Regional Sur</SelectItem>
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
                  <TableHead>Sucursal</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Regional</TableHead>
                  <TableHead>Dirección</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead className="text-center">Gestores</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSucursales.map((sucursal, index) => (
                  <motion.tr
                    key={sucursal.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-emerald/10 flex items-center justify-center">
                          <Store className="h-4 w-4 text-emerald" />
                        </div>
                        <div>
                          <div className="font-medium">{sucursal.nombre}</div>
                          <div className="text-sm text-muted-foreground">{sucursal.ciudad}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{sucursal.codigo}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{sucursal.regional}</Badge>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">{sucursal.direccion}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        {sucursal.telefono}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">{sucursal.gestores}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={sucursal.estado === "activo" ? "default" : "secondary"}
                        className={sucursal.estado === "activo" ? "bg-emerald/20 text-emerald" : ""}>
                        {sucursal.estado}
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
            <DialogTitle>Nueva Sucursal</DialogTitle>
            <DialogDescription>Crea una nueva sucursal para una regional</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Nombre</Label>
              <Input placeholder="Nombre de la sucursal" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Código</Label>
                <Input placeholder="SUC-001" />
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
            <div className="grid gap-2">
              <Label>Dirección</Label>
              <Input placeholder="Dirección completa" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Ciudad</Label>
                <Input placeholder="Ciudad" />
              </div>
              <div className="grid gap-2">
                <Label>Teléfono</Label>
                <Input placeholder="+57 000 000 0000" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancelar</Button>
            <Button className="bg-emerald hover:bg-emerald/90">Crear Sucursal</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
        </div>
      </AppLayout>
    </AuthGuard>
  )
}
