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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MapPin, Search, Plus, Home, Building2, Briefcase, Edit, Trash2 } from "lucide-react"

const direcciones = [
  { id: 1, cliente: "Carlos Mendoza", tipo: "Residencial", direccion: "Calle 123 #45-67, Bogotá", ciudad: "Bogotá", departamento: "Cundinamarca", principal: true },
  { id: 2, cliente: "Carlos Mendoza", tipo: "Trabajo", direccion: "Av. El Dorado #68-95, Of. 302", ciudad: "Bogotá", departamento: "Cundinamarca", principal: false },
  { id: 3, cliente: "María García", tipo: "Residencial", direccion: "Carrera 50 #32-18", ciudad: "Medellín", departamento: "Antioquia", principal: true },
  { id: 4, cliente: "Juan Pérez", tipo: "Residencial", direccion: "Calle 5 #23-45", ciudad: "Cali", departamento: "Valle del Cauca", principal: true },
  { id: 5, cliente: "Ana López", tipo: "Comercial", direccion: "Centro Comercial Plaza, Local 45", ciudad: "Barranquilla", departamento: "Atlántico", principal: false },
]

const getTipoIcon = (tipo: string) => {
  switch (tipo) {
    case "Residencial": return Home
    case "Trabajo": return Briefcase
    case "Comercial": return Building2
    default: return MapPin
  }
}

export default function DireccionesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filtroTipo, setFiltroTipo] = useState("todos")

  const direccionesFiltradas = direcciones.filter(d => {
    const matchSearch = d.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       d.direccion.toLowerCase().includes(searchTerm.toLowerCase())
    const matchTipo = filtroTipo === "todos" || d.tipo === filtroTipo
    return matchSearch && matchTipo
  })

  return (
    <AuthGuard>
      <AppLayout>
        <Topbar
          title="Direcciones"
          breadcrumbs={[{ label: "Clientes" }, { label: "Direcciones" }]}
        />

        <div className="p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald/10">
                    <MapPin className="h-5 w-5 text-emerald" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{direcciones.length}</p>
                    <p className="text-sm text-muted-foreground">Total direcciones</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-info/10">
                    <Home className="h-5 w-5 text-info" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{direcciones.filter(d => d.tipo === "Residencial").length}</p>
                    <p className="text-sm text-muted-foreground">Residenciales</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-warning/10">
                    <Briefcase className="h-5 w-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{direcciones.filter(d => d.tipo === "Trabajo").length}</p>
                    <p className="text-sm text-muted-foreground">Trabajo</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-special/10">
                    <Building2 className="h-5 w-5 text-special" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{direcciones.filter(d => d.tipo === "Comercial").length}</p>
                    <p className="text-sm text-muted-foreground">Comerciales</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Table */}
          <Card className="bg-card border-border">
            <CardHeader className="border-b border-border">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <CardTitle className="text-foreground">Lista de Direcciones</CardTitle>
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar dirección..."
                      className="pl-9 w-full md:w-64 bg-background"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                    <SelectTrigger className="w-full md:w-40 bg-background">
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="Residencial">Residencial</SelectItem>
                      <SelectItem value="Trabajo">Trabajo</SelectItem>
                      <SelectItem value="Comercial">Comercial</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button className="bg-emerald hover:bg-emerald-bright text-emerald-foreground">
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva Dirección
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Cliente</TableHead>
                    <TableHead className="text-muted-foreground">Tipo</TableHead>
                    <TableHead className="text-muted-foreground">Dirección</TableHead>
                    <TableHead className="text-muted-foreground">Ciudad</TableHead>
                    <TableHead className="text-muted-foreground">Departamento</TableHead>
                    <TableHead className="text-muted-foreground">Estado</TableHead>
                    <TableHead className="text-muted-foreground text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {direccionesFiltradas.map((direccion) => {
                    const TipoIcon = getTipoIcon(direccion.tipo)
                    return (
                      <TableRow key={direccion.id} className="border-border">
                        <TableCell className="font-medium text-foreground">{direccion.cliente}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <TipoIcon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-foreground">{direccion.tipo}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-foreground max-w-xs truncate">{direccion.direccion}</TableCell>
                        <TableCell className="text-foreground">{direccion.ciudad}</TableCell>
                        <TableCell className="text-muted-foreground">{direccion.departamento}</TableCell>
                        <TableCell>
                          {direccion.principal ? (
                            <Badge className="bg-emerald/10 text-emerald border-0">Principal</Badge>
                          ) : (
                            <Badge variant="outline" className="text-muted-foreground">Secundaria</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit className="h-4 w-4 text-muted-foreground" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-destructive">
                              <Trash2 className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    </AuthGuard>
  )
}
