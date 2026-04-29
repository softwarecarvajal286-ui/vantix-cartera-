"use client"

import * as React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AppLayout } from "@/components/app-layout"
import { Topbar } from "@/components/topbar"
import { AuthGuard } from "@/components/auth-guard"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  HandCoins, Search, Plus, Eye, Phone, MessageSquare, Mail, User, 
  MoreHorizontal, FileText, Calendar, DollarSign, Clock, CheckCircle,
  AlertCircle, TrendingUp, Filter, RefreshCw, ChevronRight, X,
  CreditCard, Target, History, AlertTriangle, Upload, Percent
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import {
  getAcuerdosForFinanciera,
  getFinancieraModuleConfig,
  getGestionesForFinanciera,
  resolveSupportedFinancieraId,
  type AcuerdoMock,
  type GestionMock,
  type SupportedFinancieraId,
} from "@/lib/financiera-module-content"

// Financiera activa (simulada - en producción vendría del contexto)
const financieraActiva = {
  id: "krediya",
  nombre: "Krediya",
  color: "#00C896",
  camposParticulares: ["cuotas_pateadas", "subestado_credito", "mora_total"],
  descuentosActivos: true,
}

// Mock data for gestiones
const gestiones = [
  { 
    id: 1, 
    vendedor: "Pedro Martínez",
    cliente: "Carlos Mendoza",
    clienteApellido: "Mendoza López",
    documento: "1020304050",
    tipo: "Llamada", 
    tipificacion: "Contacto efectivo",
    resultado: "Promesa de pago", 
    fecha: "2024-03-25", 
    hora: "10:30", 
    gestor: "Juan Díaz", 
    monto: 850000,
    obligacion: "OBL-2024-001",
    diasMora: 45,
    saldo: 2500000,
    tieneAcuerdo: true,
    acuerdoId: 1,
    observaciones: "Cliente confirma pago para el 30 de marzo",
    telefono: "+57 310 123 4567",
    correo: "carlos.mendoza@email.com",
    cup: "IMEI-123456789",
    regional: "Bogotá",
    sucursal: "Chapinero",
    directriz: "Directriz A",
    estadoPago: "Pendiente",
    // Campos particulares Krediya
    cuotasPateadas: 2,
    subestadoCredito: "1 cuota mora",
    moraTotal: 850000,
  },
  { 
    id: 2, 
    vendedor: "Ana Rodríguez",
    cliente: "María García",
    clienteApellido: "García Torres",
    documento: "1030405060",
    tipo: "WhatsApp", 
    tipificacion: "No contesta",
    resultado: "Buzón", 
    fecha: "2024-03-25", 
    hora: "11:15", 
    gestor: "Ana Pérez", 
    monto: 0,
    obligacion: "OBL-2024-002",
    diasMora: 30,
    saldo: 1800000,
    tieneAcuerdo: false,
    observaciones: "Sin respuesta después de 3 intentos",
    telefono: "+57 311 234 5678",
    correo: "maria.garcia@email.com",
    cup: "IMEI-234567890",
    regional: "Medellín",
    sucursal: "El Poblado",
    directriz: "Directriz B",
    estadoPago: "Pendiente",
    cuotasPateadas: 0,
    subestadoCredito: "Cero moras",
    moraTotal: 0,
  },
  { 
    id: 3, 
    vendedor: "Luis Gómez",
    cliente: "Juan Pérez",
    clienteApellido: "Pérez Díaz",
    documento: "1040506070",
    tipo: "Visita", 
    tipificacion: "Contacto efectivo",
    resultado: "Promesa de pago", 
    fecha: "2024-03-24", 
    hora: "14:00", 
    gestor: "Juan Díaz", 
    monto: 2500000,
    obligacion: "OBL-2024-003",
    diasMora: 60,
    saldo: 5000000,
    tieneAcuerdo: true,
    acuerdoId: 2,
    observaciones: "Acuerdo en 3 cuotas establecido",
    telefono: "+57 312 345 6789",
    correo: "juan.perez@email.com",
    cup: "IMEI-345678901",
    regional: "Cali",
    sucursal: "Centro",
    directriz: "Directriz A",
    estadoPago: "Pagado parcial",
    cuotasPateadas: 1,
    subestadoCredito: "2 cuotas mora",
    moraTotal: 2500000,
  },
]

// Mock data for acuerdos según lineamientos
const acuerdos = [
  {
    id: 1,
    cliente: "Carlos Mendoza",
    obligacion: "OBL-2024-001",
    valorOriginal: 2800000,
    descuento: 300000,
    descuentoTipo: "fijo", // "fijo" o "porcentaje"
    valorAcordado: 2500000,
    cuotas: 3,
    cuotasPagadas: 1,
    proximaCuota: "2024-04-15",
    montoCuota: 833333,
    estado: "Vigente", // Vigente, Cumplido, Vencido
    fechaCreacion: "2024-03-25",
    fechaPago: "2024-06-15",
    soportePago: null,
  },
  {
    id: 2,
    cliente: "Juan Pérez",
    obligacion: "OBL-2024-003",
    valorOriginal: 5000000,
    descuento: 0,
    descuentoTipo: null,
    valorAcordado: 5000000,
    cuotas: 5,
    cuotasPagadas: 0,
    proximaCuota: "2024-04-01",
    montoCuota: 1000000,
    estado: "Vigente",
    fechaCreacion: "2024-03-24",
    fechaPago: "2024-08-01",
    soportePago: null,
  },
]

const getTipoIcon = (tipo: string) => {
  switch (tipo) {
    case "Llamada": return Phone
    case "WhatsApp": return MessageSquare
    case "Email": return Mail
    case "Visita": return User
    case "SMS": return MessageSquare
    case "Correo": return Mail
    default: return HandCoins
  }
}

const getResultadoStyle = (resultado: string) => {
  if (resultado.includes("Promesa") || resultado.includes("Acuerdo")) return "bg-emerald/10 text-emerald border-emerald/20"
  if (resultado.includes("No contesta") || resultado.includes("Buzón") || resultado.includes("Negación")) return "bg-red-500/10 text-red-500 border-red-500/20"
  return "bg-blue-500/10 text-blue-500 border-blue-500/20"
}

const getMoraStyle = (dias: number) => {
  if (dias <= 30) return "text-yellow-500"
  if (dias <= 60) return "text-orange-500"
  return "text-red-500"
}

const getEstadoAcuerdoStyle = (estado: string) => {
  switch (estado) {
    case "Vigente": return "bg-blue-500/10 text-blue-500 border-blue-500/20"
    case "Cumplido": return "bg-emerald/10 text-emerald border-emerald/20"
    case "Vencido": return "bg-red-500/10 text-red-500 border-red-500/20"
    default: return "bg-muted text-muted-foreground"
  }
}

function getParticularFieldValues(
  financieraId: SupportedFinancieraId,
  gestion: GestionMock,
  formatCurrency: (value: number) => string
): Array<{
  id: string
  label: string
  value: string | string[]
  description: string
  kind: "badge" | "currency" | "number" | "percent" | "list" | "text"
  highlight?: boolean
}> {
  if (financieraId === "krediya") {
    return [
      {
        id: "cuotas_pateadas",
        label: "Cuotas pateadas",
        value: gestion.cuotasPateadas?.toString() ?? "0",
        description: (gestion.cuotasPateadas ?? 0) > 0 ? "Requiere alerta visual" : "Sin alertas activas",
        kind: "number",
        highlight: (gestion.cuotasPateadas ?? 0) > 0,
      },
      {
        id: "subestado_credito",
        label: "Sub-estado del credito",
        value: gestion.subestadoCredito ?? "Sin lectura",
        description: "Lectura operativa del credito",
        kind: "badge",
      },
    ]
  }

  if (financieraId === "payjoy" || financieraId === "alo") {
    return [
      {
        id: "fpd3",
        label: "FPD3",
        value: `${(gestion.fpd3 ?? 0).toFixed(1)}%`,
        description: "First Payment Default a 3 dias",
        kind: "percent",
      },
      {
        id: "fpd7",
        label: "FPD7",
        value: `${(gestion.fpd7 ?? 0).toFixed(1)}%`,
        description: "First Payment Default a 7 dias",
        kind: "percent",
      },
      {
        id: "fpd15",
        label: "FPD15",
        value: `${(gestion.fpd15 ?? 0).toFixed(1)}%`,
        description: "First Payment Default a 15 dias",
        kind: "percent",
      },
    ]
  }

  return [
    {
      id: "estado_solicitud",
      label: "Estado solicitud",
      value: gestion.estadoSolicitud ?? "En proceso",
      description: "Estado actual del flujo",
      kind: "badge",
    },
    {
      id: "cupo_asignado",
      label: "Cupo asignado",
      value: formatCurrency(gestion.cupoAsignado ?? 0),
      description: "Valor total asignado",
      kind: "currency",
    },
    {
      id: "cupo_utilizado",
      label: "Cupo utilizado",
      value: formatCurrency(gestion.cupoUtilizado ?? 0),
      description: "Valor actualmente en uso",
      kind: "currency",
    },
    {
      id: "cupo_disponible",
      label: "Cupo disponible",
      value: formatCurrency(gestion.cupoDisponible ?? 0),
      description: "Saldo libre del cupo",
      kind: "currency",
    },
    {
      id: "score",
      label: "Score",
      value: (gestion.score ?? 0).toString(),
      description: "Score de riesgo del cliente",
      kind: "number",
    },
    {
      id: "documentos",
      label: "Documentos",
      value: gestion.documentos ?? [],
      description: "Estado de documentos obligatorios",
      kind: "list",
    },
    {
      id: "riesgo",
      label: "Riesgo",
      value: gestion.riesgo ?? "Sin clasificar",
      description: "Lectura actual del riesgo",
      kind: "badge",
    },
  ]
}

export default function GestionesCobranzaPage() {
  const { user, selectedFinanciera } = useAuth()
  const activeFinancieraId = resolveSupportedFinancieraId(selectedFinanciera?.id ?? user?.financieraId)
  const financieraActiva = getFinancieraModuleConfig(activeFinancieraId)
  const gestiones = React.useMemo(() => getGestionesForFinanciera(activeFinancieraId), [activeFinancieraId])
  const acuerdos = React.useMemo(() => getAcuerdosForFinanciera(activeFinancieraId), [activeFinancieraId])
  const [searchTerm, setSearchTerm] = useState("")
  const [tipoFilter, setTipoFilter] = useState("all")
  const [resultadoFilter, setResultadoFilter] = useState("all")
  
  // Dialog states
  const [selectedGestion, setSelectedGestion] = useState<GestionMock | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isNewGestionOpen, setIsNewGestionOpen] = useState(false)
  const [isAcuerdoOpen, setIsAcuerdoOpen] = useState(false)
  const [selectedAcuerdo, setSelectedAcuerdo] = useState<AcuerdoMock | null>(null)

  // Form state for new gestion
  const [newGestionForm, setNewGestionForm] = useState({
    telefono: "",
    correo: "",
    tipificacion: "",
    tipoContacto: "",
    fechaGestion: new Date().toISOString().split("T")[0],
    observaciones: "",
    estadoPago: "",
    acuerdoPago: "sin_acuerdo",
    fechaAcuerdo: "",
    fechaPagoAcuerdo: "",
    descuento: "",
    descuentoTipo: "porcentaje",
  })

  React.useEffect(() => {
    setSelectedGestion(null)
    setSelectedAcuerdo(null)
    setIsDetailOpen(false)
    setIsAcuerdoOpen(false)
  }, [activeFinancieraId])

  const gestionesFiltradas = gestiones.filter(g => {
    const matchesSearch = g.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.gestor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.documento.includes(searchTerm)
    const matchesTipo = tipoFilter === "all" || g.tipo === tipoFilter
    const matchesResultado = resultadoFilter === "all" || 
      (resultadoFilter === "efectiva" && g.monto > 0) ||
      (resultadoFilter === "no_efectiva" && g.monto === 0)
    return matchesSearch && matchesTipo && matchesResultado
  })

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value)
  }

  const particularFieldValues = selectedGestion
    ? getParticularFieldValues(activeFinancieraId, selectedGestion, formatCurrency)
    : []

  const handleViewDetail = (gestion: GestionMock) => {
    setSelectedGestion(gestion)
    setIsDetailOpen(true)
  }

  const handleCreateAcuerdo = (gestion: GestionMock) => {
    setSelectedGestion(gestion)
    setIsDetailOpen(false)
    setIsAcuerdoOpen(true)
  }

  const handleViewAcuerdo = (gestion: GestionMock) => {
    const acuerdo = acuerdos.find(a => a.id === gestion.acuerdoId)
    if (acuerdo) {
      setSelectedAcuerdo(acuerdo)
      setIsDetailOpen(false)
    }
  }

  const totalComprometido = gestiones.reduce((acc, g) => acc + g.monto, 0)
  const gestionesEfectivas = gestiones.filter(g => g.monto > 0).length
  const gestionesHoy = gestiones.filter(g => g.fecha === "2024-03-25").length
  const acuerdosVigentes = acuerdos.filter(a => a.estado === "Vigente").length
  const acuerdosCumplidos = acuerdos.filter(a => a.estado === "Cumplido").length
  const acuerdosVencidos = acuerdos.filter(a => a.estado === "Vencido").length

  return (
    <AuthGuard>
      <AppLayout>
        <Topbar
          title="Gestión de Cobranza"
          breadcrumbs={[{ label: "Cobranza" }, { label: "Gestiones" }]}
        />

        <div className="p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-emerald/10">
                    <HandCoins className="h-5 w-5 text-emerald" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{gestiones.length}</p>
                    <p className="text-sm text-muted-foreground">Total gestiones</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-blue-500/10">
                    <Clock className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{gestionesHoy}</p>
                    <p className="text-sm text-muted-foreground">Hoy</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-emerald/10">
                    <CheckCircle className="h-5 w-5 text-emerald" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{gestionesEfectivas}</p>
                    <p className="text-sm text-muted-foreground">Efectivas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-purple-500/10">
                    <FileText className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{acuerdosVigentes}</p>
                    <p className="text-sm text-muted-foreground">Acuerdos vigentes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-orange-500/10">
                    <DollarSign className="h-5 w-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-lg font-bold">{formatCurrency(totalComprometido)}</p>
                    <p className="text-sm text-muted-foreground">Comprometido</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content with Tabs */}
          <Tabs defaultValue="gestiones" className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <TabsList>
                <TabsTrigger value="gestiones" className="gap-2">
                  <HandCoins className="h-4 w-4" />
                  Gestiones
                </TabsTrigger>
                <TabsTrigger value="acuerdos" className="gap-2">
                  <FileText className="h-4 w-4" />
                  Acuerdos de Pago
                </TabsTrigger>
              </TabsList>
              <Button onClick={() => setIsNewGestionOpen(true)} className="bg-emerald hover:bg-emerald/90">
                <Plus className="h-4 w-4 mr-2" />
                Nueva Gestión
              </Button>
            </div>

            {/* Gestiones Tab */}
            <TabsContent value="gestiones">
              <Card>
                <CardHeader className="border-b">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <CardTitle>Lista de Clientes en Mora</CardTitle>
                      <CardDescription>Gestiona las cobranzas de clientes con mora activa</CardDescription>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Vista activa: {financieraActiva.nombre}. El formulario conserva los campos fijos y suma los particulares definidos para esta financiera.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Buscar cliente..."
                          className="pl-9 w-full sm:w-64"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <Select value={tipoFilter} onValueChange={setTipoFilter}>
                        <SelectTrigger className="w-[130px]">
                          <SelectValue placeholder="Tipo contacto" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="Llamada">Llamada</SelectItem>
                          <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                          <SelectItem value="SMS">SMS</SelectItem>
                          <SelectItem value="Email">Correo</SelectItem>
                          <SelectItem value="Visita">Visita</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={resultadoFilter} onValueChange={setResultadoFilter}>
                        <SelectTrigger className="w-[140px]">
                          <Filter className="mr-2 h-4 w-4" />
                          <SelectValue placeholder="Resultado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="efectiva">Efectivas</SelectItem>
                          <SelectItem value="no_efectiva">No efectivas</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="outline" size="icon">
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Obligación</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Tipificación</TableHead>
                        <TableHead>Fecha/Hora</TableHead>
                        <TableHead>Días Mora</TableHead>
                        <TableHead>Saldo</TableHead>
                        <TableHead>Acuerdo</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {gestionesFiltradas.map((gestion, index) => {
                        const TipoIcon = getTipoIcon(gestion.tipo)
                        return (
                          <motion.tr
                            key={gestion.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.03 }}
                            className="group cursor-pointer hover:bg-muted/50"
                            onClick={() => handleViewDetail(gestion)}
                          >
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback className="bg-emerald/10 text-emerald text-xs">
                                    {gestion.cliente.split(" ").map(n => n[0]).join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{gestion.cliente}</p>
                                  <p className="text-xs text-muted-foreground">{gestion.documento}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="font-mono text-xs">
                                {gestion.obligacion}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <TipoIcon className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{gestion.tipo}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={getResultadoStyle(gestion.tipificacion)}>
                                {gestion.tipificacion}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <p>{gestion.fecha}</p>
                                <p className="text-muted-foreground">{gestion.hora}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className={cn("font-medium", getMoraStyle(gestion.diasMora))}>
                                {gestion.diasMora} días
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className="font-medium">
                                {formatCurrency(gestion.saldo)}
                              </span>
                            </TableCell>
                            <TableCell>
                              {gestion.tieneAcuerdo ? (
                                <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/20">
                                  <CheckCircle className="mr-1 h-3 w-3" />
                                  Vigente
                                </Badge>
                              ) : (
                                <Badge variant="secondary">Sin acuerdo</Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                  <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleViewDetail(gestion); }}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    Ver detalle / Gestionar
                                  </DropdownMenuItem>
                                  {gestion.tieneAcuerdo ? (
                                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleViewAcuerdo(gestion); }}>
                                      <FileText className="mr-2 h-4 w-4" />
                                      Ver acuerdo
                                    </DropdownMenuItem>
                                  ) : (
                                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleCreateAcuerdo(gestion); }}>
                                      <Plus className="mr-2 h-4 w-4" />
                                      Crear acuerdo
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>
                                    <History className="mr-2 h-4 w-4" />
                                    Historial cliente
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </motion.tr>
                        )
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Acuerdos Tab */}
            <TabsContent value="acuerdos">
              <Card>
                <CardHeader className="border-b">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <CardTitle>Acuerdos de Pago</CardTitle>
                      <CardDescription>
                        <span className="inline-flex gap-4 mt-1">
                          <Badge variant="outline" className="bg-blue-500/10 text-blue-500">Vigentes: {acuerdosVigentes}</Badge>
                          <Badge variant="outline" className="bg-emerald/10 text-emerald">Cumplidos: {acuerdosCumplidos}</Badge>
                          <Badge variant="outline" className="bg-red-500/10 text-red-500">Vencidos: {acuerdosVencidos}</Badge>
                        </span>
                      </CardDescription>
                    </div>
                    <Button className="bg-emerald hover:bg-emerald/90">
                      <Plus className="h-4 w-4 mr-2" />
                      Nuevo Acuerdo
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Obligación</TableHead>
                        <TableHead>Valor Original</TableHead>
                        <TableHead>Descuento</TableHead>
                        <TableHead>Valor Acordado</TableHead>
                        <TableHead>Progreso</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {acuerdos.map((acuerdo, index) => (
                        <motion.tr
                          key={acuerdo.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="group cursor-pointer hover:bg-muted/50"
                          onClick={() => setSelectedAcuerdo(acuerdo)}
                        >
                          <TableCell className="font-medium">{acuerdo.cliente}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-mono text-xs">
                              {acuerdo.obligacion}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatCurrency(acuerdo.valorOriginal)}</TableCell>
                          <TableCell>
                            {acuerdo.descuento > 0 ? (
                              <span className="text-emerald font-medium">
                                -{formatCurrency(acuerdo.descuento)}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell className="font-medium">{formatCurrency(acuerdo.valorAcordado)}</TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-xs">
                                <span>{acuerdo.cuotasPagadas}/{acuerdo.cuotas} cuotas</span>
                                <span>{Math.round((acuerdo.cuotasPagadas / acuerdo.cuotas) * 100)}%</span>
                              </div>
                              <Progress value={(acuerdo.cuotasPagadas / acuerdo.cuotas) * 100} className="h-2" />
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getEstadoAcuerdoStyle(acuerdo.estado)}>
                              {acuerdo.estado}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
                              Ver detalle
                              <ChevronRight className="ml-1 h-4 w-4" />
                            </Button>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Detail Dialog - Formulario de Gestión Completo */}
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                {selectedGestion && (
                  <>
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-emerald/10 text-emerald">
                        {selectedGestion.cliente.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p>{selectedGestion.cliente} {selectedGestion.clienteApellido}</p>
                      <p className="text-sm font-normal text-muted-foreground">{selectedGestion.documento}</p>
                    </div>
                  </>
                )}
              </DialogTitle>
              <DialogDescription>Formulario de gestión de cobranza</DialogDescription>
            </DialogHeader>
            
            {selectedGestion && (
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-6">
                  {/* Campos fijos - Solo lectura */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                      Información del Cliente (Solo lectura)
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-muted-foreground text-xs">Vendedor</Label>
                        <p className="font-medium">{selectedGestion.vendedor}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground text-xs">Nombres del cliente</Label>
                        <p className="font-medium">{selectedGestion.cliente}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground text-xs">Apellidos del cliente</Label>
                        <p className="font-medium">{selectedGestion.clienteApellido}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground text-xs">Gestor</Label>
                        <p className="font-medium">{user?.name || selectedGestion.gestor}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground text-xs">CUP (IMEI/Referencia)</Label>
                        <p className="font-mono text-sm">{selectedGestion.cup}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground text-xs">Obligación</Label>
                        <Badge variant="outline" className="font-mono">{selectedGestion.obligacion}</Badge>
                      </div>
                      <div>
                        <Label className="text-muted-foreground text-xs">Regional</Label>
                        <p className="font-medium">{selectedGestion.regional}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground text-xs">Sucursal</Label>
                        <p className="font-medium">{selectedGestion.sucursal}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground text-xs">Directriz</Label>
                        <p className="font-medium">{selectedGestion.directriz}</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Campos editables */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                      Datos de Contacto (Editable)
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Teléfono del cliente</Label>
                        <Input defaultValue={selectedGestion.telefono} />
                      </div>
                      <div className="space-y-2">
                        <Label>Correo del cliente</Label>
                        <Input defaultValue={selectedGestion.correo} type="email" />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Campos obligatorios de gestión */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                      Registro de Gestión <span className="text-red-500">*</span>
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Tipificación <span className="text-red-500">*</span></Label>
                        <Select defaultValue={selectedGestion.tipificacion.toLowerCase().replace(" ", "_")}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="contacto_efectivo">Contacto efectivo</SelectItem>
                            <SelectItem value="no_contesta">No contesta</SelectItem>
                            <SelectItem value="buzon">Buzón</SelectItem>
                            <SelectItem value="promesa">Promesa</SelectItem>
                            <SelectItem value="negacion">Negación</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Tipo de contacto <span className="text-red-500">*</span></Label>
                        <Select defaultValue={selectedGestion.tipo.toLowerCase()}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="llamada">Llamada</SelectItem>
                            <SelectItem value="whatsapp">WhatsApp</SelectItem>
                            <SelectItem value="sms">SMS</SelectItem>
                            <SelectItem value="correo">Correo</SelectItem>
                            <SelectItem value="visita">Visita</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Fecha de gestión <span className="text-red-500">*</span></Label>
                        <Input type="date" defaultValue={selectedGestion.fecha} />
                      </div>
                      <div className="space-y-2">
                        <Label>Estado del pago</Label>
                        <Select defaultValue={selectedGestion.estadoPago.toLowerCase().replace(" ", "_")}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pendiente">Pendiente</SelectItem>
                            <SelectItem value="pagado_parcial">Pagado parcial</SelectItem>
                            <SelectItem value="pagado_total">Pagado total</SelectItem>
                            <SelectItem value="incumplimiento">Incumplimiento</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Observaciones <span className="text-red-500">*</span></Label>
                      <Textarea 
                        defaultValue={selectedGestion.observaciones} 
                        placeholder="Descripción detallada de la gestión realizada..."
                        rows={3}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Acuerdo de pago */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                      Acuerdo de Pago
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Acuerdo de pago</Label>
                        <Select defaultValue={selectedGestion.tieneAcuerdo ? "acuerdo_nuevo" : "sin_acuerdo"}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sin_acuerdo">Sin acuerdo</SelectItem>
                            <SelectItem value="acuerdo_nuevo">Acuerdo nuevo</SelectItem>
                            <SelectItem value="renovacion">Renovación</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Fecha de pago del acuerdo</Label>
                        <Input type="date" />
                      </div>
                    </div>
                    {financieraActiva.descuentosActivos && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Descuento</Label>
                          <div className="flex gap-2">
                            <Input type="number" placeholder="0" className="flex-1" />
                            <Select defaultValue="porcentaje">
                              <SelectTrigger className="w-24">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="porcentaje">%</SelectItem>
                                <SelectItem value="fijo">$</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Soporte de pago</Label>
                          <div className="flex gap-2">
                            <Input type="file" className="flex-1" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Campos particulares por financiera */}
                  <div 
                    className="space-y-4 p-4 rounded-lg border-2"
                    style={{ borderColor: financieraActiva.color + "40", backgroundColor: financieraActiva.color + "08" }}
                  >
                    <h4 
                      className="font-semibold text-sm uppercase tracking-wide flex items-center gap-2"
                      style={{ color: financieraActiva.color }}
                    >
                      <div 
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: financieraActiva.color }}
                      />
                      Campos particulares - {financieraActiva.nombre}
                    </h4>

                    <div className={cn(
                      "grid gap-4",
                      financieraActiva.id === "distritec" ? "md:grid-cols-2 xl:grid-cols-3" : "md:grid-cols-3"
                    )}>
                      {particularFieldValues.map((field) => (
                        <div key={field.id} className="rounded-2xl border border-current/10 bg-background/30 p-3">
                          <Label className="text-muted-foreground text-xs">{field.label}</Label>
                          {field.kind === "badge" ? (
                            <div className="mt-2">
                              <Badge variant={field.highlight ? "destructive" : "outline"}>{field.value}</Badge>
                            </div>
                          ) : field.kind === "list" ? (
                            <div className="mt-2 space-y-1">
                              {(field.value as string[]).map((item) => (
                                <p key={item} className="text-sm text-foreground">{item}</p>
                              ))}
                            </div>
                          ) : (
                            <div className="mt-2 flex items-center gap-2">
                              <span className="text-lg font-bold">{field.value}</span>
                              {field.highlight && (
                                <Badge variant="destructive" className="text-xs">Alerta</Badge>
                              )}
                            </div>
                          )}
                          <p className="mt-2 text-xs text-muted-foreground">{field.description}</p>
                        </div>
                      ))}
                    </div>
                    
                    {/* Campos específicos de Krediya */}
                    {false && (
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label className="text-muted-foreground text-xs">Cuotas pateadas</Label>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-lg font-bold">{selectedGestion.cuotasPateadas}</span>
                            {selectedGestion.cuotasPateadas > 0 && (
                              <Badge variant="destructive" className="text-xs">Alerta</Badge>
                            )}
                          </div>
                        </div>
                        <div>
                          <Label className="text-muted-foreground text-xs">Sub-estado del crédito</Label>
                          <Badge variant="outline" className="mt-1">{selectedGestion.subestadoCredito}</Badge>
                        </div>
                        <div>
                          <Label className="text-muted-foreground text-xs">Mora total</Label>
                          <p className="text-lg font-bold text-red-500">{formatCurrency(selectedGestion.moraTotal)}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Información de mora */}
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label className="text-muted-foreground text-xs">Días en mora</Label>
                        <p className={cn("text-2xl font-bold", getMoraStyle(selectedGestion.diasMora))}>
                          {selectedGestion.diasMora} días
                        </p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground text-xs">Saldo pendiente</Label>
                        <p className="text-2xl font-bold">{formatCurrency(selectedGestion.saldo)}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground text-xs">Monto comprometido</Label>
                        <p className="text-2xl font-bold text-emerald">
                          {selectedGestion.monto > 0 ? formatCurrency(selectedGestion.monto) : "-"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            )}
            
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
                Cancelar
              </Button>
              {selectedGestion && !selectedGestion.tieneAcuerdo && (
                <Button variant="outline" onClick={() => handleCreateAcuerdo(selectedGestion)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Crear Acuerdo
                </Button>
              )}
              <Button className="bg-emerald hover:bg-emerald/90">
                <CheckCircle className="mr-2 h-4 w-4" />
                Guardar Gestión
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Create Acuerdo Dialog */}
        <Dialog open={isAcuerdoOpen} onOpenChange={setIsAcuerdoOpen}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Nuevo Acuerdo de Pago</DialogTitle>
              <DialogDescription>
                {selectedGestion && `Crear acuerdo para ${selectedGestion.cliente}`}
              </DialogDescription>
            </DialogHeader>
            {selectedGestion && (
              <div className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Obligación</p>
                      <p className="font-mono">{selectedGestion.obligacion}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Saldo pendiente</p>
                      <p className="font-medium text-emerald">{formatCurrency(selectedGestion.saldo)}</p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label>Valor acordado <span className="text-red-500">*</span></Label>
                    <Input type="number" placeholder="0" defaultValue={selectedGestion.saldo} />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label>Fecha de pago <span className="text-red-500">*</span></Label>
                    <Input type="date" />
                  </div>

                  {financieraActiva.descuentosActivos && (
                    <div className="grid gap-2">
                      <Label>Descuento (opcional)</Label>
                      <div className="flex gap-2">
                        <Input type="number" placeholder="0" className="flex-1" />
                        <Select defaultValue="porcentaje">
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="porcentaje">Porcentaje (%)</SelectItem>
                            <SelectItem value="fijo">Valor fijo ($)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Si aplica descuento, se mostrará el valor original, el descuento y el valor final
                      </p>
                    </div>
                  )}

                  <div className="grid gap-2">
                    <Label>Soporte de pago (opcional)</Label>
                    <Input type="file" />
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAcuerdoOpen(false)}>
                Cancelar
              </Button>
              <Button className="bg-emerald hover:bg-emerald/90">
                <CheckCircle className="mr-2 h-4 w-4" />
                Crear Acuerdo
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Acuerdo Dialog */}
        <Dialog open={!!selectedAcuerdo} onOpenChange={() => setSelectedAcuerdo(null)}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-500" />
                Acuerdo de Pago
              </DialogTitle>
              <DialogDescription>
                {selectedAcuerdo && selectedAcuerdo.cliente}
              </DialogDescription>
            </DialogHeader>
            {selectedAcuerdo && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground text-xs">Obligación</Label>
                    <p className="font-mono">{selectedAcuerdo.obligacion}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Estado</Label>
                    <Badge className={cn("mt-1", getEstadoAcuerdoStyle(selectedAcuerdo.estado))}>
                      {selectedAcuerdo.estado}
                    </Badge>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Valor original</span>
                    <span className="font-medium">{formatCurrency(selectedAcuerdo.valorOriginal)}</span>
                  </div>
                  {selectedAcuerdo.descuento > 0 && (
                    <>
                      <div className="flex justify-between items-center text-emerald">
                        <span>Descuento aplicado</span>
                        <span className="font-medium">-{formatCurrency(selectedAcuerdo.descuento)}</span>
                      </div>
                      <Separator />
                    </>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Valor final acordado</span>
                    <span className="text-xl font-bold">{formatCurrency(selectedAcuerdo.valorAcordado)}</span>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progreso de pago</span>
                      <span>{selectedAcuerdo.cuotasPagadas} de {selectedAcuerdo.cuotas} cuotas</span>
                    </div>
                    <Progress value={(selectedAcuerdo.cuotasPagadas / selectedAcuerdo.cuotas) * 100} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground text-xs">Valor por cuota</Label>
                    <p className="font-medium">{formatCurrency(selectedAcuerdo.montoCuota)}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Próxima cuota</Label>
                    <p className="font-medium flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {selectedAcuerdo.proximaCuota}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Fecha del acuerdo</Label>
                    <p>{selectedAcuerdo.fechaCreacion}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Fecha límite de pago</Label>
                    <p>{selectedAcuerdo.fechaPago}</p>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedAcuerdo(null)}>
                Cerrar
              </Button>
              <Button className="bg-emerald hover:bg-emerald/90">
                <DollarSign className="mr-2 h-4 w-4" />
                Registrar Pago
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* New Gestion Dialog */}
        <Dialog open={isNewGestionOpen} onOpenChange={setIsNewGestionOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Nueva Gestión</DialogTitle>
              <DialogDescription>Registrar una nueva gestión de cobranza</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Cliente / Documento</Label>
                <Input placeholder="Buscar cliente por nombre o documento..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Tipificación <span className="text-red-500">*</span></Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="contacto_efectivo">Contacto efectivo</SelectItem>
                      <SelectItem value="no_contesta">No contesta</SelectItem>
                      <SelectItem value="buzon">Buzón</SelectItem>
                      <SelectItem value="promesa">Promesa</SelectItem>
                      <SelectItem value="negacion">Negación</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Tipo de contacto <span className="text-red-500">*</span></Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="llamada">Llamada</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="correo">Correo</SelectItem>
                      <SelectItem value="visita">Visita</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Fecha de gestión <span className="text-red-500">*</span></Label>
                <Input type="date" defaultValue={new Date().toISOString().split("T")[0]} />
              </div>
              <div className="grid gap-2">
                <Label>Observaciones <span className="text-red-500">*</span></Label>
                <Textarea placeholder="Descripción de la gestión realizada..." rows={3} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNewGestionOpen(false)}>
                Cancelar
              </Button>
              <Button className="bg-emerald hover:bg-emerald/90">
                <Plus className="mr-2 h-4 w-4" />
                Registrar Gestión
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </AppLayout>
    </AuthGuard>
  )
}
