"use client"

import { useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { Topbar } from "@/components/topbar"
import { AuthGuard } from "@/components/auth-guard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Users, Search, Plus, Eye, Building2, CheckCircle, AlertTriangle } from "lucide-react"

const pagadores = [
  { id: 1, nit: "900123456-1", nombre: "Empresa ABC S.A.S", tipo: "Empresa", empleados: 150, convenio: true, estado: "Activo" },
  { id: 2, nit: "800987654-2", nombre: "Comercializadora XYZ", tipo: "Empresa", empleados: 45, convenio: true, estado: "Activo" },
  { id: 3, nit: "901234567-3", nombre: "Servicios Integrales Ltda", tipo: "Empresa", empleados: 80, convenio: false, estado: "Pendiente" },
  { id: 4, nit: "890456123-4", nombre: "Industrias del Norte", tipo: "Empresa", empleados: 320, convenio: true, estado: "Activo" },
  { id: 5, nit: "123456789", nombre: "Carlos Mendoza", tipo: "Independiente", empleados: 0, convenio: false, estado: "Activo" },
]

export default function PagadoresPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const pagadoresFiltrados = pagadores.filter(p =>
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.nit.includes(searchTerm)
  )

  const getEstadoStyle = (estado: string) => {
    switch (estado) {
      case "Activo": return "bg-emerald/10 text-emerald"
      case "Pendiente": return "bg-warning/10 text-warning"
      default: return "bg-muted text-muted-foreground"
    }
  }

  return (
    <AuthGuard>
      <AppLayout>
        <Topbar
          title="Pagadores"
          breadcrumbs={[{ label: "Créditos" }, { label: "Pagadores" }]}
        />

        <div className="p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald/10">
                    <Users className="h-5 w-5 text-emerald" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{pagadores.length}</p>
                    <p className="text-sm text-muted-foreground">Total pagadores</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-info/10">
                    <Building2 className="h-5 w-5 text-info" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{pagadores.filter(p => p.tipo === "Empresa").length}</p>
                    <p className="text-sm text-muted-foreground">Empresas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald/10">
                    <CheckCircle className="h-5 w-5 text-emerald" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{pagadores.filter(p => p.convenio).length}</p>
                    <p className="text-sm text-muted-foreground">Con convenio</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-warning/10">
                    <AlertTriangle className="h-5 w-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{pagadores.filter(p => p.estado === "Pendiente").length}</p>
                    <p className="text-sm text-muted-foreground">Pendientes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Table */}
          <Card className="bg-card border-border">
            <CardHeader className="border-b border-border">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <CardTitle className="text-foreground">Lista de Pagadores</CardTitle>
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar pagador..."
                      className="pl-9 w-full md:w-64 bg-background"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button className="bg-emerald hover:bg-emerald-bright text-emerald-foreground">
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Pagador
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">NIT/Cédula</TableHead>
                    <TableHead className="text-muted-foreground">Nombre</TableHead>
                    <TableHead className="text-muted-foreground">Tipo</TableHead>
                    <TableHead className="text-muted-foreground">Empleados</TableHead>
                    <TableHead className="text-muted-foreground">Convenio</TableHead>
                    <TableHead className="text-muted-foreground">Estado</TableHead>
                    <TableHead className="text-muted-foreground text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pagadoresFiltrados.map((pagador) => (
                    <TableRow key={pagador.id} className="border-border">
                      <TableCell className="font-mono text-foreground">{pagador.nit}</TableCell>
                      <TableCell className="font-medium text-foreground">{pagador.nombre}</TableCell>
                      <TableCell className="text-foreground">{pagador.tipo}</TableCell>
                      <TableCell className="text-muted-foreground">{pagador.empleados > 0 ? pagador.empleados : "-"}</TableCell>
                      <TableCell>
                        {pagador.convenio ? (
                          <Badge className="bg-emerald/10 text-emerald border-0">Sí</Badge>
                        ) : (
                          <Badge variant="outline" className="text-muted-foreground">No</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getEstadoStyle(pagador.estado)} border-0`}>{pagador.estado}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    </AuthGuard>
  )
}
