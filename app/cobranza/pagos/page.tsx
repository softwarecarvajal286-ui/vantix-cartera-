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
import { CreditCard, Search, Eye, DollarSign, TrendingUp, Calendar, CheckCircle } from "lucide-react"

const pagos = [
  { id: "PAG-001", cliente: "Carlos Mendoza", obligacion: "OBL-001", monto: 850000, fecha: "2024-03-25", metodo: "PSE", estado: "Aplicado" },
  { id: "PAG-002", cliente: "María García", obligacion: "OBL-002", monto: 520000, fecha: "2024-03-24", metodo: "Efectivo", estado: "Aplicado" },
  { id: "PAG-003", cliente: "Juan Pérez", obligacion: "OBL-003", monto: 1200000, fecha: "2024-03-24", metodo: "Transferencia", estado: "Pendiente" },
  { id: "PAG-004", cliente: "Ana López", obligacion: "OBL-004", monto: 350000, fecha: "2024-03-23", metodo: "Tarjeta", estado: "Aplicado" },
  { id: "PAG-005", cliente: "Roberto Díaz", obligacion: "OBL-005", monto: 980000, fecha: "2024-03-22", metodo: "PSE", estado: "Reversado" },
]

const getEstadoStyle = (estado: string) => {
  switch (estado) {
    case "Aplicado": return "bg-emerald/10 text-emerald"
    case "Pendiente": return "bg-warning/10 text-warning"
    case "Reversado": return "bg-destructive/10 text-destructive"
    default: return "bg-muted text-muted-foreground"
  }
}

export default function PagosPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const pagosFiltrados = pagos.filter(p =>
    p.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value)
  }

  const totalRecaudado = pagos.filter(p => p.estado === "Aplicado").reduce((acc, p) => acc + p.monto, 0)

  return (
    <AuthGuard>
      <AppLayout>
        <Topbar
          title="Información de Pagos"
          breadcrumbs={[{ label: "Cobranza" }, { label: "Pagos" }]}
        />

        <div className="p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald/10">
                    <CreditCard className="h-5 w-5 text-emerald" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{pagos.length}</p>
                    <p className="text-sm text-muted-foreground">Total pagos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-info/10">
                    <DollarSign className="h-5 w-5 text-info" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{formatCurrency(totalRecaudado)}</p>
                    <p className="text-sm text-muted-foreground">Total recaudado</p>
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
                    <p className="text-2xl font-bold text-foreground">{pagos.filter(p => p.estado === "Aplicado").length}</p>
                    <p className="text-sm text-muted-foreground">Aplicados</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-warning/10">
                    <Calendar className="h-5 w-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{pagos.filter(p => p.estado === "Pendiente").length}</p>
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
                <CardTitle className="text-foreground">Historial de Pagos</CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar pago..."
                    className="pl-9 w-full md:w-64 bg-background"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">ID Pago</TableHead>
                    <TableHead className="text-muted-foreground">Cliente</TableHead>
                    <TableHead className="text-muted-foreground">Obligación</TableHead>
                    <TableHead className="text-muted-foreground">Monto</TableHead>
                    <TableHead className="text-muted-foreground">Fecha</TableHead>
                    <TableHead className="text-muted-foreground">Método</TableHead>
                    <TableHead className="text-muted-foreground">Estado</TableHead>
                    <TableHead className="text-muted-foreground text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pagosFiltrados.map((pago) => (
                    <TableRow key={pago.id} className="border-border">
                      <TableCell className="font-mono text-foreground">{pago.id}</TableCell>
                      <TableCell className="font-medium text-foreground">{pago.cliente}</TableCell>
                      <TableCell className="font-mono text-muted-foreground">{pago.obligacion}</TableCell>
                      <TableCell className="font-medium text-foreground">{formatCurrency(pago.monto)}</TableCell>
                      <TableCell className="text-muted-foreground">{pago.fecha}</TableCell>
                      <TableCell className="text-foreground">{pago.metodo}</TableCell>
                      <TableCell>
                        <Badge className={`${getEstadoStyle(pago.estado)} border-0`}>{pago.estado}</Badge>
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
