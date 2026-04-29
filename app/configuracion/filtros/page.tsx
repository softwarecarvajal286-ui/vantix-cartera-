"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Filter, Plus, Search, MoreHorizontal, Edit, Trash2, Play, Code, RefreshCw } from "lucide-react"
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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const mockFiltros = [
  { id: 1, nombre: "Clientes con mora > 30 días", tabla: "clientes", condiciones: 3, ultimoUso: "2024-01-15", estado: "activo" },
  { id: 2, nombre: "Obligaciones vencidas", tabla: "obligaciones", condiciones: 5, ultimoUso: "2024-01-14", estado: "activo" },
  { id: 3, nombre: "Gestiones sin seguimiento", tabla: "gestiones", condiciones: 2, ultimoUso: "2024-01-13", estado: "activo" },
  { id: 4, nombre: "Acuerdos incumplidos", tabla: "acuerdos_pago", condiciones: 4, ultimoUso: "2024-01-12", estado: "activo" },
  { id: 5, nombre: "Clientes sin contacto", tabla: "clientes", condiciones: 2, ultimoUso: "2024-01-10", estado: "inactivo" },
]

export default function FiltrosPage() {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)

  const filteredFiltros = mockFiltros.filter((f) =>
    f.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.tabla.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <AuthGuard>
      <AppLayout>
        <Topbar title="Filtros Avanzados" breadcrumbs={[{ label: "Configuración" }, { label: "Filtros Avanzados" }]} showCreate={false} />
        <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Filtros Avanzados</h1>
          <p className="text-muted-foreground">Consultas personalizadas para análisis de datos</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-emerald hover:bg-emerald/90">
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Filtro
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Filtros</CardTitle>
            <Filter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockFiltros.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activos</CardTitle>
            <Filter className="h-4 w-4 text-emerald" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald">
              {mockFiltros.filter(f => f.estado === "activo").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tablas Cubiertas</CardTitle>
            <Code className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">
              {new Set(mockFiltros.map(f => f.tabla)).size}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Condiciones</CardTitle>
            <Filter className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">
              {mockFiltros.reduce((acc, f) => acc + f.condiciones, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Lista de Filtros</CardTitle>
          <CardDescription>Gestiona los filtros de consulta personalizados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar filtro..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Tabla</TableHead>
                  <TableHead className="text-center">Condiciones</TableHead>
                  <TableHead>Último uso</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFiltros.map((filtro, index) => (
                  <motion.tr
                    key={filtro.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group"
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-blue-500" />
                        <span className="font-medium">{filtro.nombre}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">{filtro.tabla}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">{filtro.condiciones}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(filtro.ultimoUso).toLocaleDateString("es-CO")}
                    </TableCell>
                    <TableCell>
                      <Badge variant={filtro.estado === "activo" ? "default" : "secondary"}
                        className={filtro.estado === "activo" ? "bg-emerald/20 text-emerald" : ""}>
                        {filtro.estado}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 text-emerald">
                          <Play className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem><Play className="mr-2 h-4 w-4" />Ejecutar</DropdownMenuItem>
                            <DropdownMenuItem><Edit className="mr-2 h-4 w-4" />Editar</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />Eliminar</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
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
            <DialogTitle>Nuevo Filtro</DialogTitle>
            <DialogDescription>Crea una consulta personalizada</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Nombre del filtro</Label>
              <Input placeholder="Nombre descriptivo" />
            </div>
            <div className="grid gap-2">
              <Label>Tabla base</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Seleccionar tabla" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="clientes">clientes</SelectItem>
                  <SelectItem value="obligaciones">obligaciones</SelectItem>
                  <SelectItem value="gestiones">gestiones</SelectItem>
                  <SelectItem value="acuerdos_pago">acuerdos_pago</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Condiciones (SQL WHERE)</Label>
              <Textarea 
                placeholder="estado = 'activo' AND dias_mora > 30"
                rows={4}
                className="font-mono text-sm"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancelar</Button>
            <Button className="bg-emerald hover:bg-emerald/90">Crear Filtro</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
        </div>
      </AppLayout>
    </AuthGuard>
  )
}
