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
import { Users2, Search, Plus, User, Briefcase, Heart, Phone, MessageSquare } from "lucide-react"

const referencias = [
  { id: 1, cliente: "Carlos Mendoza", nombre: "Pedro Mendoza", parentesco: "Familiar", telefono: "300-123-4567", verificado: true },
  { id: 2, cliente: "Carlos Mendoza", nombre: "Ana Martínez", parentesco: "Laboral", telefono: "310-987-6543", verificado: true },
  { id: 3, cliente: "María García", nombre: "Luis García", parentesco: "Familiar", telefono: "320-456-7890", verificado: false },
  { id: 4, cliente: "Juan Pérez", nombre: "Roberto Díaz", parentesco: "Personal", telefono: "315-111-2222", verificado: true },
  { id: 5, cliente: "Ana López", nombre: "Carmen Ruiz", parentesco: "Laboral", telefono: "318-333-4444", verificado: false },
]

const getParentescoIcon = (parentesco: string) => {
  switch (parentesco) {
    case "Familiar": return Heart
    case "Laboral": return Briefcase
    case "Personal": return User
    default: return Users2
  }
}

export default function ReferenciasPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filtroParentesco, setFiltroParentesco] = useState("todos")

  const referenciasFiltradas = referencias.filter(r => {
    const matchSearch = r.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       r.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    const matchParentesco = filtroParentesco === "todos" || r.parentesco === filtroParentesco
    return matchSearch && matchParentesco
  })

  return (
    <AuthGuard>
      <AppLayout>
        <Topbar
          title="Referencias"
          breadcrumbs={[{ label: "Clientes" }, { label: "Referencias" }]}
        />

        <div className="p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald/10">
                    <Users2 className="h-5 w-5 text-emerald" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{referencias.length}</p>
                    <p className="text-sm text-muted-foreground">Total referencias</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-destructive/10">
                    <Heart className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{referencias.filter(r => r.parentesco === "Familiar").length}</p>
                    <p className="text-sm text-muted-foreground">Familiares</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-info/10">
                    <Briefcase className="h-5 w-5 text-info" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{referencias.filter(r => r.parentesco === "Laboral").length}</p>
                    <p className="text-sm text-muted-foreground">Laborales</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald/10">
                    <Users2 className="h-5 w-5 text-emerald" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{referencias.filter(r => r.verificado).length}</p>
                    <p className="text-sm text-muted-foreground">Verificadas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Table */}
          <Card className="bg-card border-border">
            <CardHeader className="border-b border-border">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <CardTitle className="text-foreground">Lista de Referencias</CardTitle>
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar referencia..."
                      className="pl-9 w-full md:w-64 bg-background"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={filtroParentesco} onValueChange={setFiltroParentesco}>
                    <SelectTrigger className="w-full md:w-40 bg-background">
                      <SelectValue placeholder="Parentesco" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="Familiar">Familiar</SelectItem>
                      <SelectItem value="Laboral">Laboral</SelectItem>
                      <SelectItem value="Personal">Personal</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button className="bg-emerald hover:bg-emerald-bright text-emerald-foreground">
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva Referencia
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Cliente</TableHead>
                    <TableHead className="text-muted-foreground">Nombre</TableHead>
                    <TableHead className="text-muted-foreground">Parentesco</TableHead>
                    <TableHead className="text-muted-foreground">Teléfono</TableHead>
                    <TableHead className="text-muted-foreground">Estado</TableHead>
                    <TableHead className="text-muted-foreground text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {referenciasFiltradas.map((ref) => {
                    const ParentescoIcon = getParentescoIcon(ref.parentesco)
                    return (
                      <TableRow key={ref.id} className="border-border">
                        <TableCell className="font-medium text-foreground">{ref.cliente}</TableCell>
                        <TableCell className="text-foreground">{ref.nombre}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <ParentescoIcon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-foreground">{ref.parentesco}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-foreground">{ref.telefono}</TableCell>
                        <TableCell>
                          {ref.verificado ? (
                            <Badge className="bg-emerald/10 text-emerald border-0">Verificado</Badge>
                          ) : (
                            <Badge variant="outline" className="text-warning border-warning/30">Pendiente</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MessageSquare className="h-4 w-4 text-emerald" />
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
