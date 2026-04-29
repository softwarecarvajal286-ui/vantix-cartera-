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
import { FileSpreadsheet, Plus, Edit, CheckCircle, XCircle } from "lucide-react"

const tipos = [
  { id: 1, codigo: "CP", nombre: "Crédito Personal", descripcion: "Crédito de libre inversión", activo: true, requiereDocumentos: true },
  { id: 2, codigo: "CV", nombre: "Crédito Vehicular", descripcion: "Financiación para vehículos", activo: true, requiereDocumentos: true },
  { id: 3, codigo: "AC", nombre: "Aumento de Cupo", descripcion: "Incremento de línea de crédito", activo: true, requiereDocumentos: false },
  { id: 4, codigo: "RF", nombre: "Refinanciación", descripcion: "Reestructuración de deuda", activo: true, requiereDocumentos: true },
  { id: 5, codigo: "CC", nombre: "Crédito Consumo", descripcion: "Financiación para compras", activo: false, requiereDocumentos: true },
]

export default function TiposSolicitudPage() {
  return (
    <AuthGuard>
      <AppLayout>
        <Topbar
          title="Tipos de Solicitud"
          breadcrumbs={[{ label: "Solicitudes" }, { label: "Tipos" }]}
        />

        <div className="p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald/10">
                    <FileSpreadsheet className="h-5 w-5 text-emerald" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{tipos.length}</p>
                    <p className="text-sm text-muted-foreground">Total tipos</p>
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
                    <p className="text-2xl font-bold text-foreground">{tipos.filter(t => t.activo).length}</p>
                    <p className="text-sm text-muted-foreground">Activos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-muted">
                    <XCircle className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{tipos.filter(t => !t.activo).length}</p>
                    <p className="text-sm text-muted-foreground">Inactivos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Table */}
          <Card className="bg-card border-border">
            <CardHeader className="border-b border-border">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <CardTitle className="text-foreground">Configuración de Tipos</CardTitle>
                <Button className="bg-emerald hover:bg-emerald-bright text-emerald-foreground">
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Tipo
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
                    <TableHead className="text-muted-foreground">Documentos</TableHead>
                    <TableHead className="text-muted-foreground">Estado</TableHead>
                    <TableHead className="text-muted-foreground text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tipos.map((tipo) => (
                    <TableRow key={tipo.id} className="border-border">
                      <TableCell className="font-mono text-foreground">{tipo.codigo}</TableCell>
                      <TableCell className="font-medium text-foreground">{tipo.nombre}</TableCell>
                      <TableCell className="text-muted-foreground">{tipo.descripcion}</TableCell>
                      <TableCell>
                        {tipo.requiereDocumentos ? (
                          <Badge className="bg-info/10 text-info border-0">Requeridos</Badge>
                        ) : (
                          <Badge variant="outline" className="text-muted-foreground">Opcionales</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {tipo.activo ? (
                          <Badge className="bg-emerald/10 text-emerald border-0">Activo</Badge>
                        ) : (
                          <Badge variant="outline" className="text-muted-foreground">Inactivo</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4 text-muted-foreground" />
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
