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
import { Scale, Search, Plus, FileText, AlertTriangle, CheckCircle, Eye } from "lucide-react"

const casosLegales = [
  { id: 1, cliente: "Carlos Mendoza", tipo: "Demanda", estado: "En proceso", fechaInicio: "2024-01-15", monto: 5500000, abogado: "Dr. Ramírez" },
  { id: 2, cliente: "María García", tipo: "Cobro jurídico", estado: "Activo", fechaInicio: "2024-02-20", monto: 3200000, abogado: "Dra. López" },
  { id: 3, cliente: "Juan Pérez", tipo: "Acuerdo legal", estado: "Cerrado", fechaInicio: "2023-11-10", monto: 1800000, abogado: "Dr. Martínez" },
  { id: 4, cliente: "Ana López", tipo: "Demanda", estado: "Pendiente", fechaInicio: "2024-03-05", monto: 8900000, abogado: "Dr. Ramírez" },
]

const getEstadoColor = (estado: string) => {
  switch (estado) {
    case "Activo": return "bg-info/10 text-info"
    case "En proceso": return "bg-warning/10 text-warning"
    case "Cerrado": return "bg-emerald/10 text-emerald"
    case "Pendiente": return "bg-muted text-muted-foreground"
    default: return "bg-muted text-muted-foreground"
  }
}

export default function LegalPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const casosFiltrados = casosLegales.filter(c =>
    c.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.tipo.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value)
  }

  return (
    <AuthGuard>
      <AppLayout>
        <Topbar
          title="Información Legal"
          breadcrumbs={[{ label: "Clientes" }, { label: "Información Legal" }]}
        />

        <div className="p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald/10">
                    <Scale className="h-5 w-5 text-emerald" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{casosLegales.length}</p>
                    <p className="text-sm text-muted-foreground">Total casos</p>
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
                    <p className="text-2xl font-bold text-foreground">{casosLegales.filter(c => c.estado === "Activo" || c.estado === "En proceso").length}</p>
                    <p className="text-sm text-muted-foreground">Casos activos</p>
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
                    <p className="text-2xl font-bold text-foreground">{casosLegales.filter(c => c.estado === "Cerrado").length}</p>
                    <p className="text-sm text-muted-foreground">Casos cerrados</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-special/10">
                    <FileText className="h-5 w-5 text-special" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{formatCurrency(casosLegales.reduce((acc, c) => acc + c.monto, 0))}</p>
                    <p className="text-sm text-muted-foreground">Monto total</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Table */}
          <Card className="bg-card border-border">
            <CardHeader className="border-b border-border">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <CardTitle className="text-foreground">Casos Legales</CardTitle>
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar caso..."
                      className="pl-9 w-full md:w-64 bg-background"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button className="bg-emerald hover:bg-emerald-bright text-emerald-foreground">
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Caso
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
                    <TableHead className="text-muted-foreground">Estado</TableHead>
                    <TableHead className="text-muted-foreground">Fecha Inicio</TableHead>
                    <TableHead className="text-muted-foreground">Monto</TableHead>
                    <TableHead className="text-muted-foreground">Abogado</TableHead>
                    <TableHead className="text-muted-foreground text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {casosFiltrados.map((caso) => (
                    <TableRow key={caso.id} className="border-border">
                      <TableCell className="font-medium text-foreground">{caso.cliente}</TableCell>
                      <TableCell className="text-foreground">{caso.tipo}</TableCell>
                      <TableCell>
                        <Badge className={`${getEstadoColor(caso.estado)} border-0`}>{caso.estado}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{caso.fechaInicio}</TableCell>
                      <TableCell className="text-foreground font-medium">{formatCurrency(caso.monto)}</TableCell>
                      <TableCell className="text-foreground">{caso.abogado}</TableCell>
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
