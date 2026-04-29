"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
  Compass,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  FileText,
  CheckCircle,
  XCircle,
  RefreshCw,
  AlertTriangle,
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
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const mockDirectrices = [
  { id: 1, nombre: "Política de Cobranza Estándar", codigo: "DIR-001", tipo: "Cobranza", descripcion: "Directrices para gestión de cartera vencida hasta 30 días", financiera: "Krediya", prioridad: "alta", estado: "activo", fechaCreacion: "2024-01-15" },
  { id: 2, nombre: "Protocolo de Acuerdos de Pago", codigo: "DIR-002", tipo: "Acuerdos", descripcion: "Lineamientos para establecer acuerdos de pago con clientes", financiera: "Krediya", prioridad: "alta", estado: "activo", fechaCreacion: "2024-02-01" },
  { id: 3, nombre: "Escalamiento de Mora", codigo: "DIR-003", tipo: "Cobranza", descripcion: "Proceso de escalamiento según días de mora", financiera: "PayJoy", prioridad: "media", estado: "activo", fechaCreacion: "2024-01-20" },
  { id: 4, nombre: "Gestión de Clientes VIP", codigo: "DIR-004", tipo: "Atención", descripcion: "Protocolo especial para clientes de alto valor", financiera: "ALO", prioridad: "alta", estado: "activo", fechaCreacion: "2024-03-10" },
  { id: 5, nombre: "Política de Descuentos", codigo: "DIR-005", tipo: "Comercial", descripcion: "Lineamientos para aplicar descuentos en negociaciones", financiera: "Krediya", prioridad: "baja", estado: "inactivo", fechaCreacion: "2023-12-01" },
]

const prioridadColors = {
  alta: "bg-red-500/20 text-red-500",
  media: "bg-yellow-500/20 text-yellow-500",
  baja: "bg-blue-500/20 text-blue-500",
}

export default function DirectricesPage() {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [tipoFilter, setTipoFilter] = React.useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)

  const filteredDirectrices = mockDirectrices.filter((d) => {
    const matchesSearch = d.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.codigo.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTipo = tipoFilter === "all" || d.tipo === tipoFilter
    return matchesSearch && matchesTipo
  })

  return (
    <AuthGuard>
      <AppLayout>
        <Topbar
          title="Directrices"
          breadcrumbs={[{ label: "Estructura Comercial" }, { label: "Directrices" }]}
          showCreate={false}
        />
        <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Directrices</h1>
          <p className="text-muted-foreground">
            Políticas y lineamientos de gestión por financiera
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-emerald hover:bg-emerald/90">
          <Plus className="mr-2 h-4 w-4" />
          Nueva Directriz
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Directrices</CardTitle>
            <Compass className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockDirectrices.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prioridad Alta</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {mockDirectrices.filter(d => d.prioridad === "alta").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activas</CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald">
              {mockDirectrices.filter(d => d.estado === "activo").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tipos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(mockDirectrices.map(d => d.tipo)).size}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Lista de Directrices</CardTitle>
          <CardDescription>Gestiona las políticas y lineamientos</CardDescription>
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
            <Select value={tipoFilter} onValueChange={setTipoFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="Cobranza">Cobranza</SelectItem>
                <SelectItem value="Acuerdos">Acuerdos</SelectItem>
                <SelectItem value="Atención">Atención</SelectItem>
                <SelectItem value="Comercial">Comercial</SelectItem>
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
                  <TableHead>Directriz</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Financiera</TableHead>
                  <TableHead>Prioridad</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDirectrices.map((directriz, index) => (
                  <motion.tr
                    key={directriz.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group"
                  >
                    <TableCell>
                      <div>
                        <div className="font-medium">{directriz.nombre}</div>
                        <div className="text-sm text-muted-foreground max-w-[300px] truncate">
                          {directriz.descripcion}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{directriz.codigo}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{directriz.tipo}</Badge>
                    </TableCell>
                    <TableCell>{directriz.financiera}</TableCell>
                    <TableCell>
                      <Badge className={prioridadColors[directriz.prioridad as keyof typeof prioridadColors]}>
                        {directriz.prioridad}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={directriz.estado === "activo" ? "default" : "secondary"}
                        className={directriz.estado === "activo" ? "bg-emerald/20 text-emerald" : ""}>
                        {directriz.estado === "activo" ? <CheckCircle className="mr-1 h-3 w-3" /> : <XCircle className="mr-1 h-3 w-3" />}
                        {directriz.estado}
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
            <DialogTitle>Nueva Directriz</DialogTitle>
            <DialogDescription>Crea una nueva política o lineamiento</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Nombre</Label>
              <Input placeholder="Nombre de la directriz" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Código</Label>
                <Input placeholder="DIR-001" />
              </div>
              <div className="grid gap-2">
                <Label>Tipo</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cobranza">Cobranza</SelectItem>
                    <SelectItem value="acuerdos">Acuerdos</SelectItem>
                    <SelectItem value="atencion">Atención</SelectItem>
                    <SelectItem value="comercial">Comercial</SelectItem>
                  </SelectContent>
                </Select>
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
                <Label>Prioridad</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alta">Alta</SelectItem>
                    <SelectItem value="media">Media</SelectItem>
                    <SelectItem value="baja">Baja</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Descripción</Label>
              <Textarea placeholder="Descripción detallada de la directriz..." rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancelar</Button>
            <Button className="bg-emerald hover:bg-emerald/90">Crear Directriz</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
        </div>
      </AppLayout>
    </AuthGuard>
  )
}
