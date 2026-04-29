"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
  GitBranch,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  MapPin,
  Users,
  Building2,
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

const mockRegionales = [
  { id: 1, nombre: "Regional Centro", codigo: "RC-001", financiera: "Krediya", departamento: "Cundinamarca", sucursales: 8, gestores: 45, lider: "Carlos Méndez", estado: "activo" },
  { id: 2, nombre: "Regional Norte", codigo: "RN-001", financiera: "Krediya", departamento: "Atlántico", sucursales: 5, gestores: 28, lider: "María López", estado: "activo" },
  { id: 3, nombre: "Regional Sur", codigo: "RS-001", financiera: "Krediya", departamento: "Valle del Cauca", sucursales: 6, gestores: 32, lider: "Juan Rodríguez", estado: "activo" },
  { id: 4, nombre: "Regional Occidente", codigo: "RO-001", financiera: "PayJoy", departamento: "Antioquia", sucursales: 7, gestores: 38, lider: "Ana García", estado: "activo" },
  { id: 5, nombre: "Regional Oriente", codigo: "RE-001", financiera: "ALO", departamento: "Santander", sucursales: 4, gestores: 22, lider: "Pedro Martínez", estado: "inactivo" },
]

export default function RegionalesPage() {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [financieraFilter, setFinancieraFilter] = React.useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)

  const filteredRegionales = mockRegionales.filter((r) => {
    const matchesSearch = r.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.codigo.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFinanciera = financieraFilter === "all" || r.financiera === financieraFilter
    return matchesSearch && matchesFinanciera
  })

  return (
    <AuthGuard>
      <AppLayout>
        <Topbar
          title="Regionales"
          breadcrumbs={[{ label: "Estructura Comercial" }, { label: "Regionales" }]}
          showCreate={false}
        />
        <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Regionales</h1>
          <p className="text-muted-foreground">
            Administra las regionales de cada financiera
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-emerald hover:bg-emerald/90">
          <Plus className="mr-2 h-4 w-4" />
          Nueva Regional
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Regionales</CardTitle>
            <GitBranch className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockRegionales.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sucursales</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockRegionales.reduce((acc, r) => acc + r.sucursales, 0)}
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
              {mockRegionales.reduce((acc, r) => acc + r.gestores, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activas</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockRegionales.filter(r => r.estado === "activo").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Lista de Regionales</CardTitle>
          <CardDescription>Gestiona las regionales por financiera</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre o código..."
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
                  <TableHead>Regional</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Financiera</TableHead>
                  <TableHead>Departamento</TableHead>
                  <TableHead>Líder</TableHead>
                  <TableHead className="text-center">Sucursales</TableHead>
                  <TableHead className="text-center">Gestores</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRegionales.map((regional, index) => (
                  <motion.tr
                    key={regional.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group"
                  >
                    <TableCell className="font-medium">{regional.nombre}</TableCell>
                    <TableCell className="font-mono text-sm">{regional.codigo}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{regional.financiera}</Badge>
                    </TableCell>
                    <TableCell>{regional.departamento}</TableCell>
                    <TableCell>{regional.lider}</TableCell>
                    <TableCell className="text-center">{regional.sucursales}</TableCell>
                    <TableCell className="text-center">{regional.gestores}</TableCell>
                    <TableCell>
                      <Badge variant={regional.estado === "activo" ? "default" : "secondary"} 
                        className={regional.estado === "activo" ? "bg-emerald/20 text-emerald" : ""}>
                        {regional.estado}
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
            <DialogTitle>Nueva Regional</DialogTitle>
            <DialogDescription>Crea una nueva regional para una financiera</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Nombre</Label>
              <Input placeholder="Nombre de la regional" />
            </div>
            <div className="grid gap-2">
              <Label>Código</Label>
              <Input placeholder="RC-001" />
            </div>
            <div className="grid gap-2">
              <Label>Financiera</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Seleccionar financiera" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="krediya">Krediya</SelectItem>
                  <SelectItem value="payjoy">PayJoy</SelectItem>
                  <SelectItem value="alo">ALO</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Departamento</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Seleccionar departamento" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="cundinamarca">Cundinamarca</SelectItem>
                  <SelectItem value="antioquia">Antioquia</SelectItem>
                  <SelectItem value="valle">Valle del Cauca</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Líder Regional</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Seleccionar líder" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Carlos Méndez</SelectItem>
                  <SelectItem value="2">María López</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancelar</Button>
            <Button className="bg-emerald hover:bg-emerald/90">Crear Regional</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
        </div>
      </AppLayout>
    </AuthGuard>
  )
}
