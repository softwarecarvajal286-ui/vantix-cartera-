"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Columns, Search, Eye, Database, Table2, RefreshCw, ChevronRight } from "lucide-react"
import { AppLayout } from "@/components/app-layout"
import { Topbar } from "@/components/topbar"
import { AuthGuard } from "@/components/auth-guard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

const mockTablas = [
  { id: 1, nombre: "clientes", descripcion: "Información de clientes", columnas: 15, registros: 45230 },
  { id: 2, nombre: "obligaciones", descripcion: "Obligaciones crediticias", columnas: 22, registros: 128450 },
  { id: 3, nombre: "gestiones", descripcion: "Gestiones de cobranza", columnas: 18, registros: 892100 },
  { id: 4, nombre: "acuerdos_pago", descripcion: "Acuerdos de pago", columnas: 12, registros: 23450 },
  { id: 5, nombre: "usuarios", descripcion: "Usuarios del sistema", columnas: 10, registros: 350 },
  { id: 6, nombre: "financieras", descripcion: "Entidades financieras", columnas: 8, registros: 4 },
  { id: 7, nombre: "notificaciones", descripcion: "Notificaciones del sistema", columnas: 9, registros: 156780 },
]

const mockColumnas = [
  { nombre: "id", tipo: "INTEGER", nullable: false, pk: true },
  { nombre: "nombre", tipo: "VARCHAR(100)", nullable: false, pk: false },
  { nombre: "documento", tipo: "VARCHAR(20)", nullable: false, pk: false },
  { nombre: "tipo_documento", tipo: "VARCHAR(5)", nullable: false, pk: false },
  { nombre: "email", tipo: "VARCHAR(255)", nullable: true, pk: false },
  { nombre: "telefono", tipo: "VARCHAR(20)", nullable: true, pk: false },
  { nombre: "direccion", tipo: "TEXT", nullable: true, pk: false },
  { nombre: "ciudad", tipo: "VARCHAR(100)", nullable: true, pk: false },
  { nombre: "estado", tipo: "VARCHAR(20)", nullable: false, pk: false },
  { nombre: "fecha_creacion", tipo: "TIMESTAMP", nullable: false, pk: false },
]

export default function TablasPage() {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [selectedTabla, setSelectedTabla] = React.useState<typeof mockTablas[0] | null>(null)
  const [isColumnsDialogOpen, setIsColumnsDialogOpen] = React.useState(false)

  const filteredTablas = mockTablas.filter((t) =>
    t.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <AuthGuard>
      <AppLayout>
        <Topbar title="Tablas Dinámicas" breadcrumbs={[{ label: "Configuración" }, { label: "Tablas Dinámicas" }]} showCreate={false} />
        <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tablas Dinámicas</h1>
          <p className="text-muted-foreground">Explorador de estructura de base de datos</p>
        </div>
        <Button variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Actualizar Schema
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tablas</CardTitle>
            <Table2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockTablas.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Columnas</CardTitle>
            <Columns className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">
              {mockTablas.reduce((acc, t) => acc + t.columnas, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Registros</CardTitle>
            <Database className="h-4 w-4 text-emerald" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald">
              {(mockTablas.reduce((acc, t) => acc + t.registros, 0) / 1000).toFixed(0)}K
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tabla Mayor</CardTitle>
            <Database className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-orange-500 truncate">
              {mockTablas.reduce((prev, current) => prev.registros > current.registros ? prev : current).nombre}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Estructura de Tablas</CardTitle>
          <CardDescription>Explora las tablas y columnas de la base de datos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar tabla..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tabla</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead className="text-center">Columnas</TableHead>
                  <TableHead className="text-center">Registros</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTablas.map((tabla, index) => (
                  <motion.tr
                    key={tabla.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group cursor-pointer hover:bg-muted/50"
                    onClick={() => { setSelectedTabla(tabla); setIsColumnsDialogOpen(true); }}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Table2 className="h-4 w-4 text-emerald" />
                        <span className="font-mono font-medium">{tabla.nombre}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{tabla.descripcion}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline">{tabla.columnas}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">{tabla.registros.toLocaleString()}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
                        <Eye className="mr-1 h-4 w-4" />
                        Ver columnas
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isColumnsDialogOpen} onOpenChange={setIsColumnsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Table2 className="h-5 w-5 text-emerald" />
              <span className="font-mono">{selectedTabla?.nombre}</span>
            </DialogTitle>
            <DialogDescription>{selectedTabla?.descripcion}</DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[400px]">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Columna</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="text-center">Nullable</TableHead>
                    <TableHead className="text-center">PK</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockColumnas.map((col, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-mono text-sm">{col.nombre}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono text-xs">{col.tipo}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {col.nullable ? (
                          <Badge variant="secondary">SI</Badge>
                        ) : (
                          <Badge className="bg-red-500/20 text-red-500">NO</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {col.pk && <Badge className="bg-emerald/20 text-emerald">PK</Badge>}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
        </div>
      </AppLayout>
    </AuthGuard>
  )
}
