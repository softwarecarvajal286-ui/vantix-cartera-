"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { AppLayout } from "@/components/app-layout"
import { Topbar } from "@/components/topbar"
import { AuthGuard } from "@/components/auth-guard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  FileText, Search, Plus, Eye, CheckCircle, Clock, XCircle, 
  Calendar, DollarSign, RefreshCw
} from "lucide-react"
import { cn } from "@/lib/utils"

// Acuerdos data
const acuerdos = [
  { 
    id: "ACU-001", 
    cliente: "Carlos Mendoza", 
    obligacion: "OBL-2024-001",
    valorOriginal: 5800000,
    descuento: 300000,
    descuentoTipo: "fijo",
    valorAcordado: 5500000, 
    cuotas: 6, 
    cuotasPagadas: 4,
    fechaAcuerdo: "2024-03-01", 
    fechaPago: "2024-09-01", 
    proximaCuota: "2024-04-15",
    montoCuota: 916667,
    estado: "Vigente",
    soportePago: null,
  },
  { 
    id: "ACU-002", 
    cliente: "María García", 
    obligacion: "OBL-2024-002",
    valorOriginal: 3200000,
    descuento: 0,
    descuentoTipo: null,
    valorAcordado: 3200000, 
    cuotas: 4, 
    cuotasPagadas: 4,
    fechaAcuerdo: "2024-02-15", 
    fechaPago: "2024-06-15", 
    proximaCuota: null,
    montoCuota: 800000,
    estado: "Cumplido",
    soportePago: "comprobante_002.pdf",
  },
  { 
    id: "ACU-003", 
    cliente: "Juan Pérez", 
    obligacion: "OBL-2024-003",
    valorOriginal: 8500000,
    descuento: 500000,
    descuentoTipo: "fijo",
    valorAcordado: 8000000, 
    cuotas: 12, 
    cuotasPagadas: 3,
    fechaAcuerdo: "2024-01-10", 
    fechaPago: "2025-01-10", 
    proximaCuota: "2024-04-10",
    montoCuota: 666667,
    estado: "Vencido",
    soportePago: null,
  },
  { 
    id: "ACU-004", 
    cliente: "Ana López", 
    obligacion: "OBL-2024-004",
    valorOriginal: 2500000,
    descuento: 250000,
    descuentoTipo: "porcentaje",
    valorAcordado: 2250000, 
    cuotas: 3, 
    cuotasPagadas: 1,
    fechaAcuerdo: "2024-03-20", 
    fechaPago: "2024-06-20", 
    proximaCuota: "2024-04-20",
    montoCuota: 750000,
    estado: "Vigente",
    soportePago: null,
  },
  { 
    id: "ACU-005", 
    cliente: "Roberto Díaz", 
    obligacion: "OBL-2024-005",
    valorOriginal: 4000000,
    descuento: 0,
    descuentoTipo: null,
    valorAcordado: 4000000, 
    cuotas: 6, 
    cuotasPagadas: 6,
    fechaAcuerdo: "2023-12-01", 
    fechaPago: "2024-06-01",
    proximaCuota: null,
    montoCuota: 666667,
    estado: "Cumplido",
    soportePago: "comprobante_005.pdf",
  },
]

// Minimalist state styles - only slate tones with subtle accent
const getEstadoStyle = (estado: string) => {
  switch (estado) {
    case "Vigente": return "bg-slate-100 text-slate-700 border-slate-200"
    case "Cumplido": return "bg-emerald-50 text-emerald-700 border-emerald-200"
    case "Vencido": return "bg-slate-800 text-white border-slate-800"
    default: return "bg-slate-100 text-slate-600 border-slate-200"
  }
}

const getEstadoIcon = (estado: string) => {
  switch (estado) {
    case "Vigente": return Clock
    case "Cumplido": return CheckCircle
    case "Vencido": return XCircle
    default: return FileText
  }
}

export default function AcuerdosPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [estadoFilter, setEstadoFilter] = useState("all")
  const [selectedAcuerdo, setSelectedAcuerdo] = useState<typeof acuerdos[0] | null>(null)
  const [isNewAcuerdoOpen, setIsNewAcuerdoOpen] = useState(false)

  const acuerdosFiltrados = acuerdos.filter(a => {
    const matchesSearch = a.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.obligacion.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesEstado = estadoFilter === "all" || a.estado === estadoFilter
    return matchesSearch && matchesEstado
  })

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value)
  }

  const vigentes = acuerdos.filter(a => a.estado === "Vigente").length
  const cumplidos = acuerdos.filter(a => a.estado === "Cumplido").length
  const vencidos = acuerdos.filter(a => a.estado === "Vencido").length
  const totalAcordado = acuerdos.reduce((acc, a) => acc + a.valorAcordado, 0)

  return (
    <AuthGuard>
      <AppLayout>
        <Topbar
          title="Acuerdos de Pago"
          breadcrumbs={[{ label: "Cobranza" }, { label: "Acuerdos de Pago" }]}
        />

        <div className="p-6 space-y-6">
          {/* Stats - Minimalist glass cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass-card rounded-xl p-5 border-l-4 border-l-slate-400">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Total</p>
              <p className="text-3xl font-semibold text-slate-900 mt-1">{acuerdos.length}</p>
              <p className="text-xs text-slate-400 mt-1">Acuerdos registrados</p>
            </div>
            <div className="glass-card rounded-xl p-5 border-l-4 border-l-slate-500">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Vigentes</p>
              <p className="text-3xl font-semibold text-slate-900 mt-1">{vigentes}</p>
              <p className="text-xs text-slate-400 mt-1">En proceso</p>
            </div>
            <div className="glass-card rounded-xl p-5 border-l-4 border-l-emerald-500">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Cumplidos</p>
              <p className="text-3xl font-semibold text-slate-900 mt-1">{cumplidos}</p>
              <p className="text-xs text-slate-400 mt-1">Completados</p>
            </div>
            <div className="glass-card rounded-xl p-5 border-l-4 border-l-slate-800">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Vencidos</p>
              <p className="text-3xl font-semibold text-slate-900 mt-1">{vencidos}</p>
              <p className="text-xs text-slate-400 mt-1">Requieren atención</p>
            </div>
          </div>

          {/* Total acordado - Featured card */}
          <div className="glass-card rounded-xl p-6 border-l-4 border-l-violet-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Valor Total Acordado</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{formatCurrency(totalAcordado)}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-violet-50 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-violet-600" />
              </div>
            </div>
          </div>

          {/* Tabs and filters */}
          <Tabs defaultValue="all" onValueChange={setEstadoFilter}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <TabsList className="bg-white/60 backdrop-blur-sm border border-slate-200/60">
                <TabsTrigger value="all" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white">
                  Todos ({acuerdos.length})
                </TabsTrigger>
                <TabsTrigger value="Vigente" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white">
                  Vigentes ({vigentes})
                </TabsTrigger>
                <TabsTrigger value="Cumplido" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white">
                  Cumplidos ({cumplidos})
                </TabsTrigger>
                <TabsTrigger value="Vencido" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white">
                  Vencidos ({vencidos})
                </TabsTrigger>
              </TabsList>
              <Button 
                className="bg-slate-900 hover:bg-slate-800 text-white" 
                onClick={() => setIsNewAcuerdoOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Acuerdo
              </Button>
            </div>
          </Tabs>

          {/* Table */}
          <Card className="glass-card border-slate-200/60 overflow-hidden">
            <CardHeader className="border-b border-slate-200/60 bg-white/40">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <CardTitle className="text-slate-900 text-lg font-semibold">Lista de Acuerdos</CardTitle>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Buscar..."
                      className="pl-9 w-full md:w-56 bg-white/70 border-slate-200/60 focus:border-slate-400"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" size="icon" className="border-slate-200/60 bg-white/50">
                    <RefreshCw className="h-4 w-4 text-slate-600" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-200/60 bg-slate-50/50 hover:bg-slate-50/50">
                    <TableHead className="text-slate-500 font-medium text-xs uppercase tracking-wide">ID</TableHead>
                    <TableHead className="text-slate-500 font-medium text-xs uppercase tracking-wide">Cliente</TableHead>
                    <TableHead className="text-slate-500 font-medium text-xs uppercase tracking-wide">Obligación</TableHead>
                    <TableHead className="text-slate-500 font-medium text-xs uppercase tracking-wide">Valor Original</TableHead>
                    <TableHead className="text-slate-500 font-medium text-xs uppercase tracking-wide">Descuento</TableHead>
                    <TableHead className="text-slate-500 font-medium text-xs uppercase tracking-wide">Valor Final</TableHead>
                    <TableHead className="text-slate-500 font-medium text-xs uppercase tracking-wide">Progreso</TableHead>
                    <TableHead className="text-slate-500 font-medium text-xs uppercase tracking-wide">Fecha Pago</TableHead>
                    <TableHead className="text-slate-500 font-medium text-xs uppercase tracking-wide">Estado</TableHead>
                    <TableHead className="text-slate-500 font-medium text-xs uppercase tracking-wide text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {acuerdosFiltrados.map((acuerdo, index) => {
                    const EstadoIcon = getEstadoIcon(acuerdo.estado)
                    const progreso = Math.round((acuerdo.cuotasPagadas / acuerdo.cuotas) * 100)
                    return (
                      <motion.tr
                        key={acuerdo.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="border-slate-200/60 group cursor-pointer hover:bg-slate-50/80 transition-colors"
                        onClick={() => setSelectedAcuerdo(acuerdo)}
                      >
                        <TableCell className="font-mono text-sm text-slate-600">{acuerdo.id}</TableCell>
                        <TableCell className="font-medium text-slate-900">{acuerdo.cliente}</TableCell>
                        <TableCell>
                          <span className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                            {acuerdo.obligacion}
                          </span>
                        </TableCell>
                        <TableCell className="text-slate-700 tabular-nums">{formatCurrency(acuerdo.valorOriginal)}</TableCell>
                        <TableCell>
                          {acuerdo.descuento > 0 ? (
                            <span className="text-emerald-600 font-medium tabular-nums">
                              -{formatCurrency(acuerdo.descuento)}
                            </span>
                          ) : (
                            <span className="text-slate-300">-</span>
                          )}
                        </TableCell>
                        <TableCell className="font-semibold text-slate-900 tabular-nums">{formatCurrency(acuerdo.valorAcordado)}</TableCell>
                        <TableCell>
                          <div className="space-y-1.5 min-w-[90px]">
                            <div className="flex items-center justify-between text-xs text-slate-500">
                              <span>{acuerdo.cuotasPagadas}/{acuerdo.cuotas}</span>
                              <span className="font-medium">{progreso}%</span>
                            </div>
                            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-slate-600 rounded-full transition-all"
                                style={{ width: `${progreso}%` }}
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-500 text-sm">{acuerdo.fechaPago}</TableCell>
                        <TableCell>
                          <Badge className={cn("gap-1 font-medium text-xs", getEstadoStyle(acuerdo.estado))}>
                            <EstadoIcon className="h-3 w-3" />
                            {acuerdo.estado}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-slate-900"
                            onClick={(e) => { e.stopPropagation(); setSelectedAcuerdo(acuerdo); }}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Ver
                          </Button>
                        </TableCell>
                      </motion.tr>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* View Acuerdo Dialog */}
        <Dialog open={!!selectedAcuerdo} onOpenChange={() => setSelectedAcuerdo(null)}>
          <DialogContent className="sm:max-w-[600px] bg-white/95 backdrop-blur-xl border-slate-200">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-slate-900">
                <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center">
                  <FileText className="h-4 w-4 text-slate-600" />
                </div>
                Detalle del Acuerdo
              </DialogTitle>
              <DialogDescription className="text-slate-500">
                {selectedAcuerdo && `${selectedAcuerdo.id} - ${selectedAcuerdo.cliente}`}
              </DialogDescription>
            </DialogHeader>
            {selectedAcuerdo && (
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-slate-400 text-xs uppercase tracking-wide">ID Acuerdo</Label>
                    <p className="font-mono text-slate-900 mt-1">{selectedAcuerdo.id}</p>
                  </div>
                  <div>
                    <Label className="text-slate-400 text-xs uppercase tracking-wide">Obligación</Label>
                    <p className="font-mono text-slate-600 mt-1 text-sm">{selectedAcuerdo.obligacion}</p>
                  </div>
                  <div>
                    <Label className="text-slate-400 text-xs uppercase tracking-wide">Estado</Label>
                    <Badge className={cn("mt-1", getEstadoStyle(selectedAcuerdo.estado))}>
                      {selectedAcuerdo.estado}
                    </Badge>
                  </div>
                </div>

                {/* Value breakdown */}
                <div className="bg-slate-50 rounded-xl p-5 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Valor original</span>
                    <span className="font-medium text-slate-700 tabular-nums">{formatCurrency(selectedAcuerdo.valorOriginal)}</span>
                  </div>
                  {selectedAcuerdo.descuento > 0 && (
                    <>
                      <div className="flex justify-between items-center text-emerald-600">
                        <span className="flex items-center gap-2">
                          Descuento aplicado
                          {selectedAcuerdo.descuentoTipo === "porcentaje" && (
                            <span className="text-xs bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded">
                              {Math.round((selectedAcuerdo.descuento / selectedAcuerdo.valorOriginal) * 100)}%
                            </span>
                          )}
                        </span>
                        <span className="font-medium tabular-nums">-{formatCurrency(selectedAcuerdo.descuento)}</span>
                      </div>
                      <Separator className="bg-slate-200" />
                    </>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-900">Valor final acordado</span>
                    <span className="text-xl font-bold text-slate-900 tabular-nums">{formatCurrency(selectedAcuerdo.valorAcordado)}</span>
                  </div>
                </div>

                {/* Payment progress */}
                <div className="space-y-3">
                  <Label className="text-slate-400 text-xs uppercase tracking-wide">Progreso de pago</Label>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">{selectedAcuerdo.cuotasPagadas} de {selectedAcuerdo.cuotas} cuotas pagadas</span>
                    <span className="font-semibold text-slate-900">{Math.round((selectedAcuerdo.cuotasPagadas / selectedAcuerdo.cuotas) * 100)}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-slate-700 rounded-full transition-all"
                      style={{ width: `${(selectedAcuerdo.cuotasPagadas / selectedAcuerdo.cuotas) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-400 text-xs uppercase tracking-wide">Valor por cuota</Label>
                    <p className="font-medium text-slate-900 mt-1 tabular-nums">{formatCurrency(selectedAcuerdo.montoCuota)}</p>
                  </div>
                  {selectedAcuerdo.proximaCuota && (
                    <div>
                      <Label className="text-slate-400 text-xs uppercase tracking-wide">Próxima cuota</Label>
                      <p className="font-medium text-slate-900 mt-1 flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        {selectedAcuerdo.proximaCuota}
                      </p>
                    </div>
                  )}
                  <div>
                    <Label className="text-slate-400 text-xs uppercase tracking-wide">Fecha del acuerdo</Label>
                    <p className="text-slate-700 mt-1">{selectedAcuerdo.fechaAcuerdo}</p>
                  </div>
                  <div>
                    <Label className="text-slate-400 text-xs uppercase tracking-wide">Fecha límite de pago</Label>
                    <p className="text-slate-700 mt-1">{selectedAcuerdo.fechaPago}</p>
                  </div>
                </div>

                {selectedAcuerdo.soportePago && (
                  <div className="flex items-center justify-between p-3 border border-slate-200 rounded-xl bg-slate-50">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-slate-400" />
                      <span className="text-sm text-slate-700">{selectedAcuerdo.soportePago}</span>
                    </div>
                    <Button variant="outline" size="sm" className="border-slate-200">
                      <Eye className="h-4 w-4 mr-1" />
                      Ver
                    </Button>
                  </div>
                )}
              </div>
            )}
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setSelectedAcuerdo(null)} className="border-slate-200">
                Cerrar
              </Button>
              {selectedAcuerdo?.estado === "Vigente" && (
                <Button className="bg-slate-900 hover:bg-slate-800 text-white">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Registrar Pago
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* New Acuerdo Dialog */}
        <Dialog open={isNewAcuerdoOpen} onOpenChange={setIsNewAcuerdoOpen}>
          <DialogContent className="sm:max-w-[550px] bg-white/95 backdrop-blur-xl border-slate-200">
            <DialogHeader>
              <DialogTitle className="text-slate-900">Nuevo Acuerdo de Pago</DialogTitle>
              <DialogDescription className="text-slate-500">
                Crear un nuevo acuerdo de pago para un cliente
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid gap-2">
                <Label className="text-slate-700">Cliente / Obligación <span className="text-slate-400">*</span></Label>
                <Input 
                  placeholder="Buscar por nombre o número de obligación..." 
                  className="bg-slate-50 border-slate-200 focus:border-slate-400"
                />
              </div>
              
              <div className="grid gap-2">
                <Label className="text-slate-700">Valor acordado <span className="text-slate-400">*</span></Label>
                <Input 
                  type="number" 
                  placeholder="0" 
                  className="bg-slate-50 border-slate-200 focus:border-slate-400"
                />
              </div>
              
              <div className="grid gap-2">
                <Label className="text-slate-700">Fecha de pago <span className="text-slate-400">*</span></Label>
                <Input 
                  type="date" 
                  className="bg-slate-50 border-slate-200 focus:border-slate-400"
                />
              </div>

              <div className="grid gap-2">
                <Label className="text-slate-700">Descuento (opcional)</Label>
                <div className="flex gap-2">
                  <Input 
                    type="number" 
                    placeholder="0" 
                    className="flex-1 bg-slate-50 border-slate-200 focus:border-slate-400" 
                  />
                  <Select defaultValue="porcentaje">
                    <SelectTrigger className="w-32 bg-slate-50 border-slate-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="porcentaje">Porcentaje (%)</SelectItem>
                      <SelectItem value="fijo">Valor fijo ($)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-xs text-slate-400">
                  El descuento solo aplica si la financiera tiene esta opción activa
                </p>
              </div>

              <div className="grid gap-2">
                <Label className="text-slate-700">Soporte de pago (opcional)</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    type="file" 
                    className="flex-1 bg-slate-50 border-slate-200" 
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNewAcuerdoOpen(false)} className="border-slate-200">
                Cancelar
              </Button>
              <Button className="bg-slate-900 hover:bg-slate-800 text-white">
                <CheckCircle className="mr-2 h-4 w-4" />
                Crear Acuerdo
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </AppLayout>
    </AuthGuard>
  )
}
