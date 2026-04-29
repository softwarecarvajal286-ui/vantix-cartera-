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
import { FileText, Search, Plus, Eye, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"

const solicitudes = [
  { id: "SOL-001", cliente: "Carlos Mendoza", tipo: "Crédito Personal", monto: 15000000, fecha: "2024-03-25", estado: "En revisión", analista: "Ana Pérez" },
  { id: "SOL-002", cliente: "María García", tipo: "Aumento de cupo", monto: 5000000, fecha: "2024-03-24", estado: "Aprobada", analista: "Juan Díaz" },
  { id: "SOL-003", cliente: "Juan Pérez", tipo: "Crédito Vehicular", monto: 45000000, fecha: "2024-03-24", estado: "Documentos pendientes", analista: "Ana Pérez" },
  { id: "SOL-004", cliente: "Ana López", tipo: "Refinanciación", monto: 8000000, fecha: "2024-03-23", estado: "Rechazada", analista: "Carlos Ruiz" },
  { id: "SOL-005", cliente: "Roberto Díaz", tipo: "Crédito Personal", monto: 10000000, fecha: "2024-03-22", estado: "Aprobada", analista: "Juan Díaz" },
]

const getEstadoStyle = (estado: string) => {
  switch (estado) {
    case "Aprobada": return "bg-emerald/10 text-emerald"
    case "Rechazada": return "bg-destructive/10 text-destructive"
    case "En revisión": return "bg-info/10 text-info"
    case "Documentos pendientes": return "bg-warning/10 text-warning"
    default: return "bg-muted text-muted-foreground"
  }
}

export default function SolicitudesPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const solicitudesFiltradas = solicitudes.filter(s =>
    s.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value)
  }

  return (
    <AuthGuard>
      <AppLayout>
        <Topbar
          title="Solicitudes"
          breadcrumbs={[{ label: "Solicitudes" }]}
        />

        <div className="p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald/10">
                    <FileText className="h-5 w-5 text-emerald" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{solicitudes.length}</p>
                    <p className="text-sm text-muted-foreground">Total solicitudes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-info/10">
                    <Clock className="h-5 w-5 text-info" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{solicitudes.filter(s => s.estado === "En revisión").length}</p>
                    <p className="text-sm text-muted-foreground">En revisión</p>
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
                    <p className="text-2xl font-bold text-foreground">{solicitudes.filter(s => s.estado === "Aprobada").length}</p>
                    <p className="text-sm text-muted-foreground">Aprobadas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-warning/10">
                    <AlertCircle className="h-5 w-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{solicitudes.filter(s => s.estado === "Documentos pendientes").length}</p>
                    <p className="text-sm text-muted-foreground">Docs. pendientes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Table */}
          <Card className="bg-card border-border">
            <CardHeader className="border-b border-border">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <CardTitle className="text-foreground">Lista de Solicitudes</CardTitle>
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar solicitud..."
                      className="pl-9 w-full md:w-64 bg-background"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button className="bg-emerald hover:bg-emerald-bright text-emerald-foreground">
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva Solicitud
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">ID</TableHead>
                    <TableHead className="text-muted-foreground">Cliente</TableHead>
                    <TableHead className="text-muted-foreground">Tipo</TableHead>
                    <TableHead className="text-muted-foreground">Monto</TableHead>
                    <TableHead className="text-muted-foreground">Fecha</TableHead>
                    <TableHead className="text-muted-foreground">Estado</TableHead>
                    <TableHead className="text-muted-foreground">Analista</TableHead>
                    <TableHead className="text-muted-foreground text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {solicitudesFiltradas.map((sol) => (
                    <TableRow key={sol.id} className="border-border">
                      <TableCell className="font-mono text-foreground">{sol.id}</TableCell>
                      <TableCell className="font-medium text-foreground">{sol.cliente}</TableCell>
                      <TableCell className="text-foreground">{sol.tipo}</TableCell>
                      <TableCell className="text-foreground">{formatCurrency(sol.monto)}</TableCell>
                      <TableCell className="text-muted-foreground">{sol.fecha}</TableCell>
                      <TableCell>
                        <Badge className={`${getEstadoStyle(sol.estado)} border-0`}>{sol.estado}</Badge>
                      </TableCell>
                      <TableCell className="text-foreground">{sol.analista}</TableCell>
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
