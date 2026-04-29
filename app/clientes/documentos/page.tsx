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
import { FileCheck, Search, Plus, FileText, Download, Eye, Trash2, Upload } from "lucide-react"

const documentos = [
  { id: 1, cliente: "Carlos Mendoza", tipo: "Cédula", nombre: "cedula_mendoza.pdf", fechaCarga: "2024-01-10", tamaño: "245 KB", verificado: true },
  { id: 2, cliente: "Carlos Mendoza", tipo: "Comprobante ingresos", nombre: "ingresos_2024.pdf", fechaCarga: "2024-01-12", tamaño: "512 KB", verificado: true },
  { id: 3, cliente: "María García", tipo: "Cédula", nombre: "cedula_garcia.pdf", fechaCarga: "2024-02-05", tamaño: "198 KB", verificado: false },
  { id: 4, cliente: "Juan Pérez", tipo: "Extracto bancario", nombre: "extracto_marzo.pdf", fechaCarga: "2024-03-15", tamaño: "1.2 MB", verificado: true },
  { id: 5, cliente: "Ana López", tipo: "Contrato laboral", nombre: "contrato_lopez.pdf", fechaCarga: "2024-03-20", tamaño: "890 KB", verificado: false },
]

export default function DocumentosPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const documentosFiltrados = documentos.filter(d =>
    d.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <AuthGuard>
      <AppLayout>
        <Topbar
          title="Documentación"
          breadcrumbs={[{ label: "Clientes" }, { label: "Documentación" }]}
        />

        <div className="p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald/10">
                    <FileCheck className="h-5 w-5 text-emerald" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{documentos.length}</p>
                    <p className="text-sm text-muted-foreground">Total documentos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald/10">
                    <FileCheck className="h-5 w-5 text-emerald" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{documentos.filter(d => d.verificado).length}</p>
                    <p className="text-sm text-muted-foreground">Verificados</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-warning/10">
                    <FileText className="h-5 w-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{documentos.filter(d => !d.verificado).length}</p>
                    <p className="text-sm text-muted-foreground">Pendientes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-info/10">
                    <Upload className="h-5 w-5 text-info" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">3.0 MB</p>
                    <p className="text-sm text-muted-foreground">Almacenamiento</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Table */}
          <Card className="bg-card border-border">
            <CardHeader className="border-b border-border">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <CardTitle className="text-foreground">Lista de Documentos</CardTitle>
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar documento..."
                      className="pl-9 w-full md:w-64 bg-background"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button className="bg-emerald hover:bg-emerald-bright text-emerald-foreground">
                    <Plus className="h-4 w-4 mr-2" />
                    Subir Documento
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
                    <TableHead className="text-muted-foreground">Archivo</TableHead>
                    <TableHead className="text-muted-foreground">Fecha Carga</TableHead>
                    <TableHead className="text-muted-foreground">Tamaño</TableHead>
                    <TableHead className="text-muted-foreground">Estado</TableHead>
                    <TableHead className="text-muted-foreground text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documentosFiltrados.map((doc) => (
                    <TableRow key={doc.id} className="border-border">
                      <TableCell className="font-medium text-foreground">{doc.cliente}</TableCell>
                      <TableCell className="text-foreground">{doc.tipo}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="text-foreground">{doc.nombre}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{doc.fechaCarga}</TableCell>
                      <TableCell className="text-muted-foreground">{doc.tamaño}</TableCell>
                      <TableCell>
                        {doc.verificado ? (
                          <Badge className="bg-emerald/10 text-emerald border-0">Verificado</Badge>
                        ) : (
                          <Badge variant="outline" className="text-warning border-warning/30">Pendiente</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Download className="h-4 w-4 text-info" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-destructive">
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </div>
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
