"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { CheckCircle, Plus, Search, MoreHorizontal, Edit, Trash2, AlertTriangle, Shield, RefreshCw, Play } from "lucide-react"
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
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

const mockValidaciones = [
  { id: 1, nombre: "Documento único", tabla: "clientes", campo: "documento", tipo: "unique", descripcion: "El documento debe ser único", estado: "activo", erroresRecientes: 12 },
  { id: 2, nombre: "Email válido", tabla: "clientes", campo: "email", tipo: "format", descripcion: "Formato de email válido", estado: "activo", erroresRecientes: 5 },
  { id: 3, nombre: "Monto positivo", tabla: "obligaciones", campo: "monto", tipo: "range", descripcion: "El monto debe ser mayor a 0", estado: "activo", erroresRecientes: 0 },
  { id: 4, nombre: "Fecha válida", tabla: "gestiones", campo: "fecha", tipo: "date", descripcion: "Fecha en formato válido", estado: "activo", erroresRecientes: 8 },
  { id: 5, nombre: "Estado permitido", tabla: "acuerdos_pago", campo: "estado", tipo: "enum", descripcion: "Solo valores permitidos", estado: "activo", erroresRecientes: 2 },
  { id: 6, nombre: "Teléfono formato", tabla: "clientes", campo: "telefono", tipo: "format", descripcion: "Formato de teléfono colombiano", estado: "inactivo", erroresRecientes: 0 },
]

const tipoColors = {
  unique: "bg-purple-500/20 text-purple-500",
  format: "bg-blue-500/20 text-blue-500",
  range: "bg-orange-500/20 text-orange-500",
  date: "bg-emerald/20 text-emerald",
  enum: "bg-pink-500/20 text-pink-500",
}

export default function ValidacionesPage() {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [tablaFilter, setTablaFilter] = React.useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)

  const filteredValidaciones = mockValidaciones.filter((v) => {
    const matchesSearch = v.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.campo.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTabla = tablaFilter === "all" || v.tabla === tablaFilter
    return matchesSearch && matchesTabla
  })

  const totalErrores = mockValidaciones.reduce((acc, v) => acc + v.erroresRecientes, 0)

  return (
    <AuthGuard>
      <AppLayout>
        <Topbar title="Validaciones" breadcrumbs={[{ label: "Carga de Datos" }, { label: "Validaciones" }]} showCreate={false} />
        <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Validaciones</h1>
          <p className="text-muted-foreground">Reglas de validación para importación de datos</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-emerald hover:bg-emerald/90">
          <Plus className="mr-2 h-4 w-4" />
          Nueva Validación
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Validaciones</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockValidaciones.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activas</CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald">
              {mockValidaciones.filter(v => v.estado === "activo").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tablas Cubiertas</CardTitle>
            <Shield className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">
              {new Set(mockValidaciones.map(v => v.tabla)).size}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Errores Recientes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{totalErrores}</div>
            <p className="text-xs text-muted-foreground">Últimas 24 horas</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Reglas de Validación</CardTitle>
          <CardDescription>Gestiona las reglas de validación para cargas de datos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre o campo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={tablaFilter} onValueChange={setTablaFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Tabla" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las tablas</SelectItem>
                <SelectItem value="clientes">clientes</SelectItem>
                <SelectItem value="obligaciones">obligaciones</SelectItem>
                <SelectItem value="gestiones">gestiones</SelectItem>
                <SelectItem value="acuerdos_pago">acuerdos_pago</SelectItem>
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
                  <TableHead>Validación</TableHead>
                  <TableHead>Tabla</TableHead>
                  <TableHead>Campo</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-center">Errores</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredValidaciones.map((validacion, index) => (
                  <motion.tr
                    key={validacion.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group"
                  >
                    <TableCell>
                      <div>
                        <div className="font-medium">{validacion.nombre}</div>
                        <div className="text-sm text-muted-foreground">{validacion.descripcion}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">{validacion.tabla}</Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{validacion.campo}</TableCell>
                    <TableCell>
                      <Badge className={tipoColors[validacion.tipo as keyof typeof tipoColors]}>
                        {validacion.tipo}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {validacion.erroresRecientes > 0 ? (
                        <Badge variant="destructive">{validacion.erroresRecientes}</Badge>
                      ) : (
                        <Badge variant="secondary">0</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={validacion.estado === "activo" ? "default" : "secondary"}
                        className={validacion.estado === "activo" ? "bg-emerald/20 text-emerald" : ""}>
                        {validacion.estado}
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
            <DialogTitle>Nueva Validación</DialogTitle>
            <DialogDescription>Crea una nueva regla de validación</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Nombre</Label>
              <Input placeholder="Nombre de la validación" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Tabla</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="clientes">clientes</SelectItem>
                    <SelectItem value="obligaciones">obligaciones</SelectItem>
                    <SelectItem value="gestiones">gestiones</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Campo</Label>
                <Input placeholder="nombre_campo" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Tipo de validación</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Seleccionar tipo" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="unique">Único</SelectItem>
                  <SelectItem value="format">Formato</SelectItem>
                  <SelectItem value="range">Rango</SelectItem>
                  <SelectItem value="date">Fecha</SelectItem>
                  <SelectItem value="enum">Lista de valores</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Descripción</Label>
              <Textarea placeholder="Descripción de la validación" rows={2} />
            </div>
            <div className="flex items-center justify-between">
              <Label>Estado activo</Label>
              <Switch defaultChecked />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancelar</Button>
            <Button className="bg-emerald hover:bg-emerald/90">Crear Validación</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
        </div>
      </AppLayout>
    </AuthGuard>
  )
}
