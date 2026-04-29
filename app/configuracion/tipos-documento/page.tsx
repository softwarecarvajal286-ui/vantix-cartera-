"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { FileSpreadsheet, Plus, Search, MoreHorizontal, Edit, Trash2, RefreshCw } from "lucide-react"
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
import { Switch } from "@/components/ui/switch"

const mockTiposDocumento = [
  { id: 1, nombre: "Cédula de Ciudadanía", codigo: "CC", longitud: 10, estado: "activo" },
  { id: 2, nombre: "Cédula de Extranjería", codigo: "CE", longitud: 12, estado: "activo" },
  { id: 3, nombre: "NIT", codigo: "NIT", longitud: 10, estado: "activo" },
  { id: 4, nombre: "Pasaporte", codigo: "PA", longitud: 15, estado: "activo" },
  { id: 5, nombre: "Tarjeta de Identidad", codigo: "TI", longitud: 10, estado: "activo" },
  { id: 6, nombre: "Registro Civil", codigo: "RC", longitud: 12, estado: "inactivo" },
]

export default function TiposDocumentoPage() {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)

  const filteredTipos = mockTiposDocumento.filter((t) =>
    t.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <AuthGuard>
      <AppLayout>
        <Topbar title="Tipos de Documento" breadcrumbs={[{ label: "Configuración" }, { label: "Tipos de Documento" }]} showCreate={false} />
        <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tipos de Documento</h1>
          <p className="text-muted-foreground">Configuración de tipos de documentos de identidad</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-emerald hover:bg-emerald/90">
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Tipo
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tipos</CardTitle>
            <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockTiposDocumento.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activos</CardTitle>
            <FileSpreadsheet className="h-4 w-4 text-emerald" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald">
              {mockTiposDocumento.filter(t => t.estado === "activo").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactivos</CardTitle>
            <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockTiposDocumento.filter(t => t.estado === "inactivo").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Lista de Tipos de Documento</CardTitle>
          <CardDescription>Gestiona los tipos de documentos del sistema</CardDescription>
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
            <Button variant="outline" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead className="text-center">Longitud Máx.</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTipos.map((tipo, index) => (
                  <motion.tr
                    key={tipo.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group"
                  >
                    <TableCell className="font-medium">{tipo.nombre}</TableCell>
                    <TableCell><Badge variant="outline">{tipo.codigo}</Badge></TableCell>
                    <TableCell className="text-center">{tipo.longitud} caracteres</TableCell>
                    <TableCell>
                      <Badge variant={tipo.estado === "activo" ? "default" : "secondary"}
                        className={tipo.estado === "activo" ? "bg-emerald/20 text-emerald" : ""}>
                        {tipo.estado}
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
            <DialogTitle>Nuevo Tipo de Documento</DialogTitle>
            <DialogDescription>Agrega un nuevo tipo de documento</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Nombre</Label>
              <Input placeholder="Nombre del tipo de documento" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Código</Label>
                <Input placeholder="CC" maxLength={3} />
              </div>
              <div className="grid gap-2">
                <Label>Longitud máxima</Label>
                <Input type="number" placeholder="10" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label>Estado activo</Label>
              <Switch defaultChecked />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancelar</Button>
            <Button className="bg-emerald hover:bg-emerald/90">Crear Tipo</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
        </div>
      </AppLayout>
    </AuthGuard>
  )
}
