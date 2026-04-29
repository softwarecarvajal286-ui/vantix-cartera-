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
import { CreditCard, Search, Eye, DollarSign, AlertTriangle, CheckCircle, Clock } from "lucide-react"

const obligaciones = [
  { id: "OBL-001", cliente: "Carlos Mendoza", producto: "Crédito Personal", monto: 15000000, saldo: 8500000, cuotas: "12/24", estado: "Al día", mora: 0 },
  { id: "OBL-002", cliente: "María García", producto: "Crédito Consumo", monto: 8000000, saldo: 6200000, cuotas: "6/18", estado: "En mora", mora: 45 },
  { id: "OBL-003", cliente: "Juan Pérez", producto: "Crédito Vehicular", monto: 35000000, saldo: 28000000, cuotas: "8/48", estado: "Al día", mora: 0 },
  { id: "OBL-004", cliente: "Ana López", producto: "Crédito Personal", monto: 5000000, saldo: 1200000, cuotas: "20/24", estado: "Al día", mora: 0 },
  { id: "OBL-005", cliente: "Roberto Díaz", producto: "Crédito Consumo", monto: 12000000, saldo: 12000000, cuotas: "0/12", estado: "Nuevo", mora: 0 },
]

const getEstadoStyle = (estado: string) => {
  switch (estado) {
    case "Al día": return "bg-emerald/10 text-emerald"
    case "En mora": return "bg-destructive/10 text-destructive"
    case "Nuevo": return "bg-info/10 text-info"
    default: return "bg-muted text-muted-foreground"
  }
}

export default function ObligacionesPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const obligacionesFiltradas = obligaciones.filter(o =>
    o.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value)
  }

  const totalSaldo = obligaciones.reduce((acc, o) => acc + o.saldo, 0)
  const totalMora = obligaciones.filter(o => o.mora > 0).length

  return (
    <AuthGuard>
      <AppLayout>
        <Topbar
          title="Obligaciones"
          breadcrumbs={[{ label: "Créditos" }, { label: "Obligaciones" }]}
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
                    <p className="text-2xl font-bold text-foreground">{obligaciones.length}</p>
                    <p className="text-sm text-muted-foreground">Obligaciones activas</p>
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
                    <p className="text-2xl font-bold text-foreground">{formatCurrency(totalSaldo)}</p>
                    <p className="text-sm text-muted-foreground">Saldo total</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-destructive/10">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{totalMora}</p>
                    <p className="text-sm text-muted-foreground">En mora</p>
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
                    <p className="text-2xl font-bold text-foreground">{obligaciones.filter(o => o.estado === "Al día").length}</p>
                    <p className="text-sm text-muted-foreground">Al día</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Table */}
          <Card className="bg-card border-border">
            <CardHeader className="border-b border-border">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <CardTitle className="text-foreground">Lista de Obligaciones</CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar obligación..."
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
                    <TableHead className="text-muted-foreground">ID</TableHead>
                    <TableHead className="text-muted-foreground">Cliente</TableHead>
                    <TableHead className="text-muted-foreground">Producto</TableHead>
                    <TableHead className="text-muted-foreground">Monto Original</TableHead>
                    <TableHead className="text-muted-foreground">Saldo</TableHead>
                    <TableHead className="text-muted-foreground">Cuotas</TableHead>
                    <TableHead className="text-muted-foreground">Estado</TableHead>
                    <TableHead className="text-muted-foreground">Días Mora</TableHead>
                    <TableHead className="text-muted-foreground text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {obligacionesFiltradas.map((obl) => (
                    <TableRow key={obl.id} className="border-border">
                      <TableCell className="font-mono text-foreground">{obl.id}</TableCell>
                      <TableCell className="font-medium text-foreground">{obl.cliente}</TableCell>
                      <TableCell className="text-foreground">{obl.producto}</TableCell>
                      <TableCell className="text-foreground">{formatCurrency(obl.monto)}</TableCell>
                      <TableCell className="font-medium text-foreground">{formatCurrency(obl.saldo)}</TableCell>
                      <TableCell className="text-muted-foreground">{obl.cuotas}</TableCell>
                      <TableCell>
                        <Badge className={`${getEstadoStyle(obl.estado)} border-0`}>{obl.estado}</Badge>
                      </TableCell>
                      <TableCell>
                        {obl.mora > 0 ? (
                          <span className="text-destructive font-medium">{obl.mora} días</span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
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
