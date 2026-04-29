"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Building, Plus, Search, MoreHorizontal, Edit, Trash2, RefreshCw, Filter } from "lucide-react"
import { AppLayout } from "@/components/app-layout"
import { Topbar } from "@/components/topbar"
import { AuthGuard } from "@/components/auth-guard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const mockMunicipios = [
  { id: 1, nombre: "Bogotá D.C.", codigo: "11001", departamento: "Cundinamarca", pais: "Colombia", estado: "activo" },
  { id: 2, nombre: "Medellín", codigo: "05001", departamento: "Antioquia", pais: "Colombia", estado: "activo" },
  { id: 3, nombre: "Cali", codigo: "76001", departamento: "Valle del Cauca", pais: "Colombia", estado: "activo" },
  { id: 4, nombre: "Barranquilla", codigo: "08001", departamento: "Atlántico", pais: "Colombia", estado: "activo" },
  { id: 5, nombre: "Cartagena", codigo: "13001", departamento: "Bolívar", pais: "Colombia", estado: "activo" },
  { id: 6, nombre: "Bucaramanga", codigo: "68001", departamento: "Santander", pais: "Colombia", estado: "activo" },
  { id: 7, nombre: "Soacha", codigo: "25754", departamento: "Cundinamarca", pais: "Colombia", estado: "activo" },
  { id: 8, nombre: "Envigado", codigo: "05266", departamento: "Antioquia", pais: "Colombia", estado: "activo" },
]

export default function MunicipiosPage() {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [deptoFilter, setDeptoFilter] = React.useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)

  const filteredMunicipios = mockMunicipios.filter((m) => {
    const matchesSearch = m.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.codigo.includes(searchTerm)
    const matchesDepto = deptoFilter === "all" || m.departamento === deptoFilter
    return matchesSearch && matchesDepto
  })

  return (
    <AuthGuard>
      <AppLayout>
        <Topbar title="Municipios" breadcrumbs={[{ label: "Configuración" }, { label: "Municipios" }]} showCreate={false} />
        <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Municipios</h1>
          <p className="text-muted-foreground">Configuración de municipios por departamento</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-emerald hover:bg-emerald/90">
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Municipio
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Municipios</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMunicipios.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departamentos</CardTitle>
            <Building className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">
              {new Set(mockMunicipios.map(m => m.departamento)).size}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activos</CardTitle>
            <Building className="h-4 w-4 text-emerald" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald">
              {mockMunicipios.filter(m => m.estado === "activo").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Lista de Municipios</CardTitle>
          <CardDescription>Gestiona los municipios del sistema</CardDescription>
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
            <Select value={deptoFilter} onValueChange={setDeptoFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Departamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="Cundinamarca">Cundinamarca</SelectItem>
                <SelectItem value="Antioquia">Antioquia</SelectItem>
                <SelectItem value="Valle del Cauca">Valle del Cauca</SelectItem>
                <SelectItem value="Atlántico">Atlántico</SelectItem>
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
                  <TableHead>Municipio</TableHead>
                  <TableHead>Código DANE</TableHead>
                  <TableHead>Departamento</TableHead>
                  <TableHead>País</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMunicipios.map((municipio, index) => (
                  <motion.tr
                    key={municipio.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group"
                  >
                    <TableCell className="font-medium">{municipio.nombre}</TableCell>
                    <TableCell><Badge variant="outline" className="font-mono">{municipio.codigo}</Badge></TableCell>
                    <TableCell>{municipio.departamento}</TableCell>
                    <TableCell>{municipio.pais}</TableCell>
                    <TableCell>
                      <Badge className="bg-emerald/20 text-emerald">{municipio.estado}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
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
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Nuevo Municipio</DialogTitle>
            <DialogDescription>Agrega un nuevo municipio</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Nombre</Label>
              <Input placeholder="Nombre del municipio" />
            </div>
            <div className="grid gap-2">
              <Label>Código DANE</Label>
              <Input placeholder="00000" maxLength={5} />
            </div>
            <div className="grid gap-2">
              <Label>Departamento</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="cundinamarca">Cundinamarca</SelectItem>
                  <SelectItem value="antioquia">Antioquia</SelectItem>
                  <SelectItem value="valle">Valle del Cauca</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancelar</Button>
            <Button className="bg-emerald hover:bg-emerald/90">Crear Municipio</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
        </div>
      </AppLayout>
    </AuthGuard>
  )
}
