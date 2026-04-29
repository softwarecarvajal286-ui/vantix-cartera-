"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { History, Search, Filter, Download, Eye, CheckCircle, AlertCircle, Clock, RefreshCw } from "lucide-react"
import { AppLayout } from "@/components/app-layout"
import { Topbar } from "@/components/topbar"
import { AuthGuard } from "@/components/auth-guard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"

const mockHistorial = [
  { id: 1, archivo: "clientes_enero_2024.xlsx", tipo: "archivo", tabla: "clientes", registros: 1250, exitosos: 1248, errores: 2, usuario: "Carlos Méndez", estado: "completado", fecha: "2024-01-15 14:30:00", duracion: "45s" },
  { id: 2, archivo: "API /api/obligaciones", tipo: "api", tabla: "obligaciones", registros: 5420, exitosos: 5420, errores: 0, usuario: "Sistema", estado: "completado", fecha: "2024-01-14 10:15:00", duracion: "2m 15s" },
  { id: 3, archivo: "gestiones_batch.csv", tipo: "archivo", tabla: "gestiones", registros: 890, exitosos: 0, errores: 890, usuario: "María López", estado: "error", fecha: "2024-01-13 16:45:00", duracion: "12s" },
  { id: 4, archivo: "pagos_masivos.csv", tipo: "archivo", tabla: "pagos", registros: 2100, exitosos: 1800, errores: 0, usuario: "Juan Rodríguez", estado: "procesando", fecha: "2024-01-13 09:00:00", duracion: "-" },
  { id: 5, archivo: "API /api/clientes", tipo: "api", tabla: "clientes", registros: 350, exitosos: 350, errores: 0, usuario: "Sistema", estado: "completado", fecha: "2024-01-12 11:30:00", duracion: "18s" },
]

export default function HistorialPage() {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [estadoFilter, setEstadoFilter] = React.useState("all")
  const [tipoFilter, setTipoFilter] = React.useState("all")
  const [selectedCarga, setSelectedCarga] = React.useState<typeof mockHistorial[0] | null>(null)

  const filteredHistorial = mockHistorial.filter((h) => {
    const matchesSearch = h.archivo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.tabla.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesEstado = estadoFilter === "all" || h.estado === estadoFilter
    const matchesTipo = tipoFilter === "all" || h.tipo === tipoFilter
    return matchesSearch && matchesEstado && matchesTipo
  })

  const totalRegistros = mockHistorial.reduce((acc, h) => acc + h.registros, 0)
  const totalExitosos = mockHistorial.reduce((acc, h) => acc + h.exitosos, 0)
  const totalErrores = mockHistorial.reduce((acc, h) => acc + h.errores, 0)

  return (
    <AuthGuard>
      <AppLayout>
        <Topbar title="Historial de Cargas" breadcrumbs={[{ label: "Carga de Datos" }, { label: "Historial" }]} showCreate={false} />
        <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Historial de Cargas</h1>
          <p className="text-muted-foreground">Registro de todas las importaciones realizadas</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Exportar Historial
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cargas</CardTitle>
            <History className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockHistorial.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Registros Procesados</CardTitle>
            <History className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{totalRegistros.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Exitosos</CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald">{totalExitosos.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {((totalExitosos / totalRegistros) * 100).toFixed(1)}% tasa de éxito
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Errores</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{totalErrores}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Historial Completo</CardTitle>
          <CardDescription>Todas las cargas de datos realizadas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por archivo o tabla..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={estadoFilter} onValueChange={setEstadoFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="completado">Completado</SelectItem>
                <SelectItem value="procesando">Procesando</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>
            <Select value={tipoFilter} onValueChange={setTipoFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="archivo">Archivo</SelectItem>
                <SelectItem value="api">API</SelectItem>
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
                  <TableHead>Origen</TableHead>
                  <TableHead>Tabla</TableHead>
                  <TableHead className="text-center">Registros</TableHead>
                  <TableHead className="text-center">Exitosos</TableHead>
                  <TableHead className="text-center">Errores</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHistorial.map((carga, index) => (
                  <motion.tr
                    key={carga.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group"
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={carga.tipo === "api" ? "bg-blue-500/10 text-blue-500" : ""}>
                          {carga.tipo}
                        </Badge>
                        <span className="font-medium text-sm truncate max-w-[200px]">{carga.archivo}</span>
                      </div>
                    </TableCell>
                    <TableCell><Badge variant="secondary">{carga.tabla}</Badge></TableCell>
                    <TableCell className="text-center">{carga.registros.toLocaleString()}</TableCell>
                    <TableCell className="text-center text-emerald">{carga.exitosos.toLocaleString()}</TableCell>
                    <TableCell className="text-center text-red-500">{carga.errores}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{carga.usuario}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={carga.estado === "completado" ? "default" : carga.estado === "error" ? "destructive" : "secondary"}
                        className={carga.estado === "completado" ? "bg-emerald/20 text-emerald" : ""}
                      >
                        {carga.estado === "procesando" && <Clock className="mr-1 h-3 w-3 animate-pulse" />}
                        {carga.estado}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(carga.fecha).toLocaleString("es-CO")}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="opacity-0 group-hover:opacity-100"
                        onClick={() => setSelectedCarga(carga)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedCarga} onOpenChange={() => setSelectedCarga(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Detalle de Carga</DialogTitle>
            <DialogDescription>{selectedCarga?.archivo}</DialogDescription>
          </DialogHeader>
          {selectedCarga && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Tabla destino</p>
                  <p className="font-medium">{selectedCarga.tabla}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Tipo</p>
                  <Badge variant="outline">{selectedCarga.tipo}</Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Usuario</p>
                  <p className="font-medium">{selectedCarga.usuario}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Duración</p>
                  <p className="font-medium">{selectedCarga.duracion}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progreso</span>
                  <span>{((selectedCarga.exitosos / selectedCarga.registros) * 100).toFixed(1)}%</span>
                </div>
                <Progress value={(selectedCarga.exitosos / selectedCarga.registros) * 100} />
              </div>
              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <Card>
                  <CardContent className="pt-4 text-center">
                    <div className="text-xl font-bold">{selectedCarga.registros}</div>
                    <p className="text-xs text-muted-foreground">Total</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4 text-center">
                    <div className="text-xl font-bold text-emerald">{selectedCarga.exitosos}</div>
                    <p className="text-xs text-muted-foreground">Exitosos</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4 text-center">
                    <div className="text-xl font-bold text-red-500">{selectedCarga.errores}</div>
                    <p className="text-xs text-muted-foreground">Errores</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
        </div>
      </AppLayout>
    </AuthGuard>
  )
}
