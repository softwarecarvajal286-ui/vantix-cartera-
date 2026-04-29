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
import { FileCheck, Plus, Edit, CheckCircle } from "lucide-react"

const documentosRequeridos = [
  { id: 1, nombre: "Cédula de ciudadanía", tipo: "Identificación", obligatorio: true, formatos: "PDF, JPG" },
  { id: 2, nombre: "Comprobante de ingresos", tipo: "Financiero", obligatorio: true, formatos: "PDF" },
  { id: 3, nombre: "Extractos bancarios", tipo: "Financiero", obligatorio: true, formatos: "PDF" },
  { id: 4, nombre: "Carta laboral", tipo: "Laboral", obligatorio: true, formatos: "PDF" },
  { id: 5, nombre: "Declaración de renta", tipo: "Financiero", obligatorio: false, formatos: "PDF" },
  { id: 6, nombre: "Referencias comerciales", tipo: "Referencia", obligatorio: false, formatos: "PDF" },
]

export default function DocumentosSolicitudPage() {
  return (
    <AuthGuard>
      <AppLayout>
        <Topbar
          title="Documentos de Solicitud"
          breadcrumbs={[{ label: "Solicitudes" }, { label: "Documentos" }]}
        />

        <div className="p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald/10">
                    <FileCheck className="h-5 w-5 text-emerald" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{documentosRequeridos.length}</p>
                    <p className="text-sm text-muted-foreground">Tipos de documento</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-destructive/10">
                    <CheckCircle className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{documentosRequeridos.filter(d => d.obligatorio).length}</p>
                    <p className="text-sm text-muted-foreground">Obligatorios</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-info/10">
                    <FileCheck className="h-5 w-5 text-info" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{documentosRequeridos.filter(d => !d.obligatorio).length}</p>
                    <p className="text-sm text-muted-foreground">Opcionales</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Table */}
          <Card className="bg-card border-border">
            <CardHeader className="border-b border-border">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <CardTitle className="text-foreground">Documentos Requeridos</CardTitle>
                <Button className="bg-emerald hover:bg-emerald-bright text-emerald-foreground">
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Documento
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Nombre</TableHead>
                    <TableHead className="text-muted-foreground">Tipo</TableHead>
                    <TableHead className="text-muted-foreground">Formatos</TableHead>
                    <TableHead className="text-muted-foreground">Obligatorio</TableHead>
                    <TableHead className="text-muted-foreground text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documentosRequeridos.map((doc) => (
                    <TableRow key={doc.id} className="border-border">
                      <TableCell className="font-medium text-foreground">{doc.nombre}</TableCell>
                      <TableCell className="text-foreground">{doc.tipo}</TableCell>
                      <TableCell className="text-muted-foreground">{doc.formatos}</TableCell>
                      <TableCell>
                        {doc.obligatorio ? (
                          <Badge className="bg-destructive/10 text-destructive border-0">Obligatorio</Badge>
                        ) : (
                          <Badge variant="outline" className="text-muted-foreground">Opcional</Badge>
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
