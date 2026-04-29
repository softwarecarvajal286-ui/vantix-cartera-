"use client"

import { useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { Topbar } from "@/components/topbar"
import { AuthGuard } from "@/components/auth-guard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Wallet, Search, Plus, Eye, TrendingUp } from "lucide-react"

const cupos = [
  { id: 1, cliente: "Carlos Mendoza", cupoAprobado: 20000000, cupoUsado: 15000000, cupoDisponible: 5000000, estado: "Activo" },
  { id: 2, cliente: "María García", cupoAprobado: 10000000, cupoUsado: 8000000, cupoDisponible: 2000000, estado: "Activo" },
  { id: 3, cliente: "Juan Pérez", cupoAprobado: 50000000, cupoUsado: 35000000, cupoDisponible: 15000000, estado: "Activo" },
  { id: 4, cliente: "Ana López", cupoAprobado: 8000000, cupoUsado: 5000000, cupoDisponible: 3000000, estado: "Bloqueado" },
  { id: 5, cliente: "Roberto Díaz", cupoAprobado: 15000000, cupoUsado: 0, cupoDisponible: 15000000, estado: "Nuevo" },
]

export default function CuposPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const cuposFiltrados = cupos.filter(c =>
    c.cliente.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value)
  }

  const getEstadoStyle = (estado: string) => {
    switch (estado) {
      case "Activo": return "bg-emerald/10 text-emerald"
      case "Bloqueado": return "bg-destructive/10 text-destructive"
      case "Nuevo": return "bg-info/10 text-info"
      default: return "bg-muted text-muted-foreground"
    }
  }

  return (
    <AuthGuard>
      <AppLayout>
        <Topbar
          title="Cupos de Crédito"
          breadcrumbs={[{ label: "Créditos" }, { label: "Cupos" }]}
        />

        <div className="p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald/10">
                    <Wallet className="h-5 w-5 text-emerald" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{cupos.length}</p>
                    <p className="text-sm text-muted-foreground">Total cupos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-info/10">
                    <TrendingUp className="h-5 w-5 text-info" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{formatCurrency(cupos.reduce((acc, c) => acc + c.cupoAprobado, 0))}</p>
                    <p className="text-sm text-muted-foreground">Cupo total aprobado</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-warning/10">
                    <Wallet className="h-5 w-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{formatCurrency(cupos.reduce((acc, c) => acc + c.cupoUsado, 0))}</p>
                    <p className="text-sm text-muted-foreground">Cupo utilizado</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald/10">
                    <Wallet className="h-5 w-5 text-emerald" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{formatCurrency(cupos.reduce((acc, c) => acc + c.cupoDisponible, 0))}</p>
                    <p className="text-sm text-muted-foreground">Cupo disponible</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Table */}
          <Card className="bg-card border-border">
            <CardHeader className="border-b border-border">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <CardTitle className="text-foreground">Lista de Cupos</CardTitle>
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar cliente..."
                      className="pl-9 w-full md:w-64 bg-background"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button className="bg-emerald hover:bg-emerald-bright text-emerald-foreground">
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Cupo
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Cliente</TableHead>
                    <TableHead className="text-muted-foreground">Cupo Aprobado</TableHead>
                    <TableHead className="text-muted-foreground">Utilización</TableHead>
                    <TableHead className="text-muted-foreground">Disponible</TableHead>
                    <TableHead className="text-muted-foreground">Estado</TableHead>
                    <TableHead className="text-muted-foreground text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cuposFiltrados.map((cupo) => {
                    const porcentajeUso = (cupo.cupoUsado / cupo.cupoAprobado) * 100
                    return (
                      <TableRow key={cupo.id} className="border-border">
                        <TableCell className="font-medium text-foreground">{cupo.cliente}</TableCell>
                        <TableCell className="text-foreground">{formatCurrency(cupo.cupoAprobado)}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">{formatCurrency(cupo.cupoUsado)}</span>
                              <span className="text-muted-foreground">{porcentajeUso.toFixed(0)}%</span>
                            </div>
                            <Progress value={porcentajeUso} className="h-2" />
                          </div>
                        </TableCell>
                        <TableCell className="font-medium text-emerald">{formatCurrency(cupo.cupoDisponible)}</TableCell>
                        <TableCell>
                          <Badge className={`${getEstadoStyle(cupo.estado)} border-0`}>{cupo.estado}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          </Button>
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
