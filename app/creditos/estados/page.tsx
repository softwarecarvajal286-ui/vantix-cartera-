"use client"

import { AppLayout } from "@/components/app-layout"
import { Topbar } from "@/components/topbar"
import { AuthGuard } from "@/components/auth-guard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CheckCircle, Plus, Edit, Circle, AlertCircle, XCircle, Clock, Pause, Archive } from "lucide-react"

const estados = [
  { id: 1, codigo: "ACT", nombre: "Activo", descripcion: "Crédito vigente con pagos al día", color: "#00C896", icono: "check", count: 1250 },
  { id: 2, codigo: "MOR", nombre: "En mora", descripcion: "Crédito con pagos atrasados", color: "#DC2626", icono: "alert", count: 89 },
  { id: 3, codigo: "PRE", nombre: "Pre-jurídico", descripcion: "En etapa de cobro pre-jurídico", color: "#F59E0B", icono: "clock", count: 45 },
  { id: 4, codigo: "JUR", nombre: "Jurídico", descripcion: "En proceso de cobro jurídico", color: "#EF4444", icono: "x", count: 23 },
  { id: 5, codigo: "CAS", nombre: "Castigado", descripcion: "Crédito castigado por incobrabilidad", color: "#6B7280", icono: "archive", count: 156 },
  { id: 6, codigo: "PAG", nombre: "Pagado", descripcion: "Crédito cancelado totalmente", color: "#10B981", icono: "check", count: 2340 },
  { id: 7, codigo: "SUS", nombre: "Suspendido", descripcion: "Crédito temporalmente suspendido", color: "#8B5CF6", icono: "pause", count: 12 },
]

const getIconComponent = (icono: string) => {
  switch (icono) {
    case "check": return CheckCircle
    case "alert": return AlertCircle
    case "clock": return Clock
    case "x": return XCircle
    case "archive": return Archive
    case "pause": return Pause
    default: return Circle
  }
}

export default function EstadosCreditoPage() {
  return (
    <AuthGuard>
      <AppLayout>
        <Topbar
          title="Estados de Crédito"
          breadcrumbs={[{ label: "Créditos" }, { label: "Estados" }]}
        />

        <div className="p-6 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {estados.map((estado) => {
              const IconComponent = getIconComponent(estado.icono)
              return (
                <Card key={estado.id} className="bg-card border-border">
                  <CardContent className="p-4 text-center">
                    <div 
                      className="mx-auto mb-2 p-2 rounded-full w-fit"
                      style={{ backgroundColor: `${estado.color}20` }}
                    >
                      <IconComponent className="h-5 w-5" style={{ color: estado.color }} />
                    </div>
                    <p className="text-2xl font-bold text-foreground">{estado.count}</p>
                    <p className="text-xs text-muted-foreground">{estado.nombre}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Table */}
          <Card className="bg-card border-border">
            <CardHeader className="border-b border-border">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <CardTitle className="text-foreground">Configuración de Estados</CardTitle>
                <Button className="bg-emerald hover:bg-emerald-bright text-emerald-foreground">
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Estado
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Código</TableHead>
                    <TableHead className="text-muted-foreground">Nombre</TableHead>
                    <TableHead className="text-muted-foreground">Descripción</TableHead>
                    <TableHead className="text-muted-foreground">Color</TableHead>
                    <TableHead className="text-muted-foreground">Créditos</TableHead>
                    <TableHead className="text-muted-foreground text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {estados.map((estado) => {
                    const IconComponent = getIconComponent(estado.icono)
                    return (
                      <TableRow key={estado.id} className="border-border">
                        <TableCell className="font-mono text-foreground">{estado.codigo}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <IconComponent className="h-4 w-4" style={{ color: estado.color }} />
                            <span className="font-medium text-foreground">{estado.nombre}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground max-w-xs truncate">{estado.descripcion}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-4 h-4 rounded-full border border-border"
                              style={{ backgroundColor: estado.color }}
                            />
                            <span className="text-xs font-mono text-muted-foreground">{estado.color}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-foreground">{estado.count}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="h-4 w-4 text-muted-foreground" />
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
