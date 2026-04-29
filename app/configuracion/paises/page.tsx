"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
  Globe,
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  RefreshCw,
  CheckCircle,
  XCircle,
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
import { Switch } from "@/components/ui/switch"

const mockPaises = [
  { id: 1, nombre: "Colombia", codigo: "CO", codigoTelefono: "+57", departamentos: 32, estado: "activo" },
  { id: 2, nombre: "México", codigo: "MX", codigoTelefono: "+52", departamentos: 32, estado: "activo" },
  { id: 3, nombre: "Perú", codigo: "PE", codigoTelefono: "+51", departamentos: 25, estado: "activo" },
  { id: 4, nombre: "Ecuador", codigo: "EC", codigoTelefono: "+593", departamentos: 24, estado: "inactivo" },
  { id: 5, nombre: "Chile", codigo: "CL", codigoTelefono: "+56", departamentos: 16, estado: "activo" },
]

export default function PaisesPage() {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)

  const filteredPaises = mockPaises.filter((p) =>
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <AuthGuard>
      <AppLayout>
        <Topbar
          title="Países"
          breadcrumbs={[{ label: "Configuración" }, { label: "Países" }]}
          showCreate={false}
        />
        <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Países</h1>
          <p className="text-muted-foreground">Configuración de países disponibles</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-emerald hover:bg-emerald/90">
          <Plus className="mr-2 h-4 w-4" />
          Nuevo País
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Países</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockPaises.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activos</CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald">
              {mockPaises.filter(p => p.estado === "activo").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departamentos</CardTitle>
            <Globe className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">
              {mockPaises.reduce((acc, p) => acc + p.departamentos, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Lista de Países</CardTitle>
          <CardDescription>Gestiona los países del sistema</CardDescription>
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
                  <TableHead>País</TableHead>
                  <TableHead>Código ISO</TableHead>
                  <TableHead>Código Teléfono</TableHead>
                  <TableHead className="text-center">Departamentos</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPaises.map((pais, index) => (
                  <motion.tr
                    key={pais.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-emerald/10 flex items-center justify-center">
                          <Globe className="h-4 w-4 text-emerald" />
                        </div>
                        <span className="font-medium">{pais.nombre}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{pais.codigo}</Badge>
                    </TableCell>
                    <TableCell className="font-mono">{pais.codigoTelefono}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">{pais.departamentos}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={pais.estado === "activo" ? "default" : "secondary"}
                        className={pais.estado === "activo" ? "bg-emerald/20 text-emerald" : ""}>
                        {pais.estado === "activo" ? <CheckCircle className="mr-1 h-3 w-3" /> : <XCircle className="mr-1 h-3 w-3" />}
                        {pais.estado}
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
            <DialogTitle>Nuevo País</DialogTitle>
            <DialogDescription>Agrega un nuevo país al sistema</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Nombre</Label>
              <Input placeholder="Nombre del país" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Código ISO</Label>
                <Input placeholder="CO" maxLength={2} />
              </div>
              <div className="grid gap-2">
                <Label>Código teléfono</Label>
                <Input placeholder="+57" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label>Estado activo</Label>
              <Switch defaultChecked />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancelar</Button>
            <Button className="bg-emerald hover:bg-emerald/90">Crear País</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
        </div>
      </AppLayout>
    </AuthGuard>
  )
}
