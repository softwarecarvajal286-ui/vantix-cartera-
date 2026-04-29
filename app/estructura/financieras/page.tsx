"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
  Landmark,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Building2,
  Users,
  MapPin,
  CheckCircle,
  XCircle,
  RefreshCw,
  Settings,
  Bell,
  BarChart3,
  Lock,
  Unlock,
  MessageSquare,
} from "lucide-react"
import { AppLayout } from "@/components/app-layout"
import { Topbar } from "@/components/topbar"
import { AuthGuard } from "@/components/auth-guard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

// Campos fijos de gestión (no se pueden desactivar)
const camposFijos = [
  { id: "vendedor", nombre: "Vendedor", tipo: "Texto", editable: false },
  { id: "nombres_cliente", nombre: "Nombres del cliente", tipo: "Texto", editable: false },
  { id: "apellidos_cliente", nombre: "Apellidos del cliente", tipo: "Texto", editable: false },
  { id: "gestor", nombre: "Gestor", tipo: "Texto", editable: false },
  { id: "telefono_cliente", nombre: "Teléfono del cliente", tipo: "Teléfono", editable: true },
  { id: "correo_cliente", nombre: "Correo del cliente", tipo: "Email", editable: true },
  { id: "tipificacion", nombre: "Tipificación", tipo: "Select", editable: true, obligatorio: true },
  { id: "tipo_contacto", nombre: "Tipo de contacto", tipo: "Select", editable: true, obligatorio: true },
  { id: "fecha_gestion", nombre: "Fecha de gestión", tipo: "Date", editable: true, obligatorio: true },
  { id: "observaciones", nombre: "Observaciones", tipo: "Textarea", editable: true, obligatorio: true },
  { id: "estado_pago", nombre: "Estado del pago", tipo: "Select", editable: true },
  { id: "acuerdo_pago", nombre: "Acuerdo de pago", tipo: "Select", editable: true },
  { id: "fecha_acuerdo", nombre: "Fecha acuerdo de pago", tipo: "Date", editable: true, condicional: true },
  { id: "fecha_pago_acuerdo", nombre: "Fecha de pago del acuerdo", tipo: "Date", editable: true, condicional: true },
  { id: "soporte_pago", nombre: "Soporte de pago", tipo: "Archivo", editable: true },
  { id: "cup", nombre: "CUP", tipo: "Texto", editable: false },
  { id: "regional", nombre: "Regional", tipo: "Texto", editable: false },
  { id: "sucursal", nombre: "Sucursal", tipo: "Texto", editable: false },
  { id: "directriz", nombre: "Directriz", tipo: "Texto", editable: false },
  { id: "descuento", nombre: "Descuento", tipo: "Número", editable: true, configurable: true },
]

// Campos particulares por financiera (pre-personalizados)
const camposParticulares = {
  payjoy: [
    { id: "fpd3", nombre: "FPD3", tipo: "Porcentaje", descripcion: "First Payment Default a 3 días" },
    { id: "fpd7", nombre: "FPD7", tipo: "Porcentaje", descripcion: "First Payment Default a 7 días" },
    { id: "fpd15", nombre: "FPD15", tipo: "Porcentaje", descripcion: "First Payment Default a 15 días" },
  ],
  alo: [
    { id: "fpd3", nombre: "FPD3", tipo: "Porcentaje", descripcion: "First Payment Default a 3 días" },
    { id: "fpd7", nombre: "FPD7", tipo: "Porcentaje", descripcion: "First Payment Default a 7 días" },
    { id: "fpd15", nombre: "FPD15", tipo: "Porcentaje", descripcion: "First Payment Default a 15 días" },
  ],
  krediya: [
    { id: "cuotas_pateadas", nombre: "Cuotas pateadas", tipo: "Número + Badge", descripcion: "Si tiene cuotas pateadas, mostrar alerta visual" },
    { id: "subestado_credito", nombre: "Sub-estado del crédito", tipo: "Badge", descripcion: "1 cuota mora, cero moras, etc." },
  ],
  distritec: [
    { id: "estado_solicitud", nombre: "Estado solicitud", tipo: "Badge", descripcion: "En proceso, aprobado, rechazado" },
    { id: "cupo_asignado", nombre: "Cupo asignado", tipo: "Moneda", descripcion: "Cupo total asignado al cliente" },
    { id: "cupo_utilizado", nombre: "Cupo utilizado", tipo: "Moneda", descripcion: "Cupo actualmente en uso" },
    { id: "cupo_disponible", nombre: "Cupo disponible", tipo: "Moneda", descripcion: "Cupo restante" },
    { id: "score", nombre: "Score", tipo: "Número", descripcion: "Score de riesgo del cliente" },
    { id: "documentos", nombre: "Documentos", tipo: "Lista", descripcion: "Cédula, RUT, extractos — completo o faltante" },
    { id: "riesgo", nombre: "Riesgo", tipo: "Badge", descripcion: "Bajo, medio, alto" },
  ],
}

// Notificaciones particulares por financiera
const notificacionesParticulares = {
  payjoy: [
    { id: "alerta_fpd7", nombre: "Alerta FPD7", descripcion: "Crédito próximo a sobrepasar FPD7" },
    { id: "alerta_fpd15", nombre: "Alerta FPD15", descripcion: "Crédito próximo a sobrepasar FPD15" },
    { id: "promesa_cumplida", nombre: "Promesa cumplida/incumplida", descripcion: "El cliente cumplió o incumplió promesa" },
  ],
  alo: [
    { id: "alerta_fpd7", nombre: "Alerta FPD7", descripcion: "Crédito próximo a sobrepasar FPD7" },
    { id: "alerta_fpd15", nombre: "Alerta FPD15", descripcion: "Crédito próximo a sobrepasar FPD15" },
    { id: "promesa_cumplida", nombre: "Promesa cumplida/incumplida", descripcion: "El cliente cumplió o incumplió promesa" },
  ],
  krediya: [
    { id: "cambio_subestado", nombre: "Cambio de subestado", descripcion: "Cliente pasó de Al día a Mora" },
    { id: "cuota_pateada", nombre: "Cuota pateada detectada", descripcion: "Detección de cuota pateada" },
    { id: "pago_realizado", nombre: "Pago realizado", descripcion: "Pago registrado por el cliente" },
    { id: "inconsistencia", nombre: "Inconsistencia detectada", descripcion: "Detección y corrección de inconsistencias" },
  ],
  distritec: [
    { id: "doc_incompleta", nombre: "Documentación incompleta", descripcion: "Faltan documentos del cliente" },
    { id: "pago_whatsapp", nombre: "Confirmación pago WhatsApp", descripcion: "Confirmación de pago por WhatsApp" },
    { id: "aprobacion_cliente", nombre: "Aprobación de cliente", descripcion: "Cliente aprobado para crédito" },
    { id: "alerta_cartera", nombre: "Alertas de cartera", descripcion: "Clientes sin gestión, RC pendiente" },
  ],
}

// Métricas particulares por financiera
const metricasParticulares = {
  payjoy: [
    { id: "fpd_general", nombre: "FPDs General", descripcion: "Porcentaje de FPD3, FPD7, FPD15" },
    { id: "mora_tienda", nombre: "Mora por tienda", descripcion: "Propias vs Socios vs Agentes" },
    { id: "meta_8_9", nombre: "Meta inferior 8.9%", descripcion: "Umbral de alerta para FPDs" },
  ],
  alo: [
    { id: "fpd_general", nombre: "FPDs General", descripcion: "Porcentaje de FPD3, FPD7, FPD15" },
    { id: "mora_tienda", nombre: "Mora por tienda", descripcion: "Propias vs Socios vs Agentes" },
    { id: "meta_8_9", nombre: "Meta inferior 8.9%", descripcion: "Umbral de alerta para FPDs" },
  ],
  krediya: [
    { id: "cuotas_pateadas_total", nombre: "Cuotas pateadas total", descripcion: "Total de cuotas pateadas" },
    { id: "mora_total_metrica", nombre: "Mora total", descripcion: "Total de cartera vencida" },
    { id: "dinero_ciclado", nombre: "Dinero ciclado", descripcion: "Total y por cliente" },
    { id: "segmentacion_tienda", nombre: "Segmentación por tienda", descripcion: "Propias, socios, agentes" },
  ],
  distritec: [
    { id: "cupos_metrica", nombre: "Cupos", descripcion: "Asignado, utilizado, disponible" },
    { id: "ivp", nombre: "IVP", descripcion: "Indicador de Venta a Plazo" },
    { id: "calificacion_cliente", nombre: "Calificación cliente", descripcion: "A, B, C, D" },
    { id: "metas_recaudo", nombre: "Metas de recaudo", descripcion: "Cumplimiento de metas" },
    { id: "distribucion_cartera", nombre: "Distribución de cartera", descripcion: "Cartera total vs vencida" },
    { id: "solicitudes_pendientes", nombre: "Solicitudes pendientes", descripcion: "Sin resolver" },
  ],
}

const mockFinancieras = [
  {
    id: 1,
    codigo: "krediya",
    nombre: "Krediya",
    nit: "900.123.456-7",
    direccion: "Calle 100 #15-20, Bogotá",
    telefono: "+57 601 234 5678",
    email: "contacto@krediya.com",
    estado: "activo",
    regionales: 5,
    sucursales: 25,
    gestores: 120,
    color: "#00C896",
    fechaCreacion: "2020-01-15",
    descripcion: "Financiera especializada en créditos de consumo",
    modulosActivos: ["cobranza", "notificaciones", "metricas"],
    descuentosActivos: true,
    camposActivos: ["cuotas_pateadas", "subestado_credito", "mora_total"],
    notificacionesActivas: ["cambio_subestado", "cuota_pateada", "pago_realizado"],
    metricasActivas: ["cuotas_pateadas_total", "mora_total_metrica", "dinero_ciclado"],
  },
  {
    id: 2,
    codigo: "payjoy",
    nombre: "PayJoy",
    nit: "901.234.567-8",
    direccion: "Carrera 7 #72-13, Bogotá",
    telefono: "+57 601 345 6789",
    email: "info@payjoy.com",
    estado: "activo",
    regionales: 3,
    sucursales: 15,
    gestores: 80,
    color: "#4DA6FF",
    fechaCreacion: "2019-06-20",
    descripcion: "Financiamiento de dispositivos móviles",
    modulosActivos: ["cobranza", "notificaciones", "metricas"],
    descuentosActivos: true,
    camposActivos: ["fpd3", "fpd7", "fpd15"],
    notificacionesActivas: ["alerta_fpd7", "alerta_fpd15", "promesa_cumplida"],
    metricasActivas: ["fpd_general", "mora_tienda", "meta_8_9"],
  },
  {
    id: 3,
    codigo: "alo",
    nombre: "ALO Credit",
    nit: "902.345.678-9",
    direccion: "Avenida El Dorado #68-51, Bogotá",
    telefono: "+57 601 456 7890",
    email: "contacto@alo.com.co",
    estado: "activo",
    regionales: 4,
    sucursales: 18,
    gestores: 95,
    color: "#FFB347",
    fechaCreacion: "2021-03-10",
    descripcion: "Créditos de consumo y libranza",
    modulosActivos: ["cobranza", "notificaciones", "metricas"],
    descuentosActivos: false,
    camposActivos: ["fpd3", "fpd7", "fpd15"],
    notificacionesActivas: ["alerta_fpd7", "alerta_fpd15"],
    metricasActivas: ["fpd_general", "mora_tienda"],
  },
  {
    id: 4,
    codigo: "distritec",
    nombre: "Distribuciones Distritec",
    nit: "903.456.789-0",
    direccion: "Calle 26 #92-32, Bogotá",
    telefono: "+57 601 567 8901",
    email: "admin@distritec.co",
    estado: "activo",
    regionales: 2,
    sucursales: 8,
    gestores: 35,
    color: "#9B5CFF",
    fechaCreacion: "2018-11-05",
    descripcion: "Distribución y financiamiento de productos",
    modulosActivos: ["cobranza", "notificaciones", "metricas", "adquisicion"],
    descuentosActivos: true,
    camposActivos: ["estado_solicitud", "cupo_asignado", "cupo_utilizado", "cupo_disponible", "score", "documentos", "riesgo"],
    notificacionesActivas: ["doc_incompleta", "pago_whatsapp", "aprobacion_cliente", "alerta_cartera"],
    metricasActivas: ["cupos_metrica", "ivp", "calificacion_cliente", "metas_recaudo"],
  },
]

// Ajustes de cumplimiento segun lineamientos UI/UX.
camposParticulares.krediya = camposParticulares.krediya.filter(
  (campo) => campo.id === "cuotas_pateadas" || campo.id === "subestado_credito"
)

notificacionesParticulares.distritec = [
  { id: "doc_incompleta", nombre: "Documentacion incompleta", descripcion: "Faltan documentos del cliente" },
  { id: "confirmacion_pago_whatsapp", nombre: "Confirmacion pago WhatsApp", descripcion: "Confirmacion de pago por WhatsApp" },
  { id: "aprobacion_cliente", nombre: "Aprobacion de cliente", descripcion: "Aprobacion de creacion del cliente" },
  { id: "alerta_cartera", nombre: "Alertas de cartera", descripcion: "Clientes sin gestion, RC pendiente y conciliacion mensual" },
  { id: "recordatorio_vencimiento_whatsapp", nombre: "Recordatorios por WhatsApp", descripcion: "Confirmaciones de pago y recordatorios de vencimiento" },
]

metricasParticulares.payjoy = [
  { id: "fpd3_metrica", nombre: "FPD3", descripcion: "Indicador First Payment Default a 3 dias" },
  { id: "fpd7_metrica", nombre: "FPD7", descripcion: "Indicador First Payment Default a 7 dias" },
  { id: "fpd15_metrica", nombre: "FPD15", descripcion: "Indicador First Payment Default a 15 dias" },
  { id: "mora_tienda", nombre: "Mora por tienda", descripcion: "Propias vs socios vs agentes" },
  { id: "meta_8_9", nombre: "Meta inferior 8.9%", descripcion: "Umbral de alerta para FPDs" },
]

metricasParticulares.alo = [
  { id: "fpd3_metrica", nombre: "FPD3", descripcion: "Indicador First Payment Default a 3 dias" },
  { id: "fpd7_metrica", nombre: "FPD7", descripcion: "Indicador First Payment Default a 7 dias" },
  { id: "fpd15_metrica", nombre: "FPD15", descripcion: "Indicador First Payment Default a 15 dias" },
  { id: "mora_tienda", nombre: "Mora por tienda", descripcion: "Propias vs socios vs agentes" },
  { id: "meta_8_9", nombre: "Meta inferior 8.9%", descripcion: "Umbral de alerta para FPDs" },
]

metricasParticulares.krediya = [
  { id: "cuotas_pateadas_total", nombre: "Cuotas pateadas total", descripcion: "Total de cuotas pateadas" },
  { id: "mora_total_metrica", nombre: "Mora total", descripcion: "Total de cartera vencida" },
  { id: "dinero_ciclado_total_metrica", nombre: "Dinero ciclado total", descripcion: "Total dinero ciclado general" },
  { id: "dinero_ciclado_cliente_metrica", nombre: "Dinero ciclado por cliente", descripcion: "Indicador individual por cliente" },
  { id: "segmentacion_tienda", nombre: "Segmentacion por tienda", descripcion: "Propias, socios y agentes" },
]

metricasParticulares.distritec = [
  { id: "cupo_asignado_metrica", nombre: "Cupo asignado", descripcion: "Valor total asignado al cliente" },
  { id: "cupo_utilizado_metrica", nombre: "Cupo utilizado", descripcion: "Valor actualmente en uso" },
  { id: "cupo_disponible_metrica", nombre: "Cupo disponible", descripcion: "Cupo restante" },
  { id: "ivp", nombre: "IVP", descripcion: "Indicador de Venta a Plazo" },
  { id: "calificacion_cliente", nombre: "Calificacion cliente", descripcion: "A, B, C o D" },
  { id: "metas_recaudo", nombre: "Metas de recaudo", descripcion: "Cumplimiento de metas" },
  { id: "distribucion_cartera", nombre: "Distribucion de cartera", descripcion: "Cartera total vs vencida" },
  { id: "solicitudes_pendientes", nombre: "Solicitudes pendientes", descripcion: "Solicitudes sin resolver" },
  { id: "con_acuerdo", nombre: "Con acuerdo", descripcion: "Clientes con acuerdo vigente" },
]

mockFinancieras[0].camposActivos = ["cuotas_pateadas", "subestado_credito"]
mockFinancieras[0].metricasActivas = ["cuotas_pateadas_total", "mora_total_metrica", "dinero_ciclado_total_metrica", "segmentacion_tienda"]
mockFinancieras[1].metricasActivas = ["fpd3_metrica", "fpd7_metrica", "fpd15_metrica", "mora_tienda", "meta_8_9"]
mockFinancieras[2].metricasActivas = ["fpd3_metrica", "fpd7_metrica", "fpd15_metrica", "mora_tienda"]
mockFinancieras[3].notificacionesActivas = ["doc_incompleta", "confirmacion_pago_whatsapp", "aprobacion_cliente", "alerta_cartera", "recordatorio_vencimiento_whatsapp"]
mockFinancieras[3].metricasActivas = ["cupo_asignado_metrica", "cupo_utilizado_metrica", "cupo_disponible_metrica", "ivp", "calificacion_cliente", "metas_recaudo", "con_acuerdo"]

export default function FinancierasPage() {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)
  const [selectedFinanciera, setSelectedFinanciera] = React.useState<typeof mockFinancieras[0] | null>(null)
  const [isConfigDialogOpen, setIsConfigDialogOpen] = React.useState(false)
  const [configTab, setConfigTab] = React.useState("campos")

  // Estado para la configuración de la financiera
  const [configState, setConfigState] = React.useState<{
    camposActivos: string[]
    notificacionesActivas: string[]
    metricasActivas: string[]
    descuentosActivos: boolean
  }>({
    camposActivos: [],
    notificacionesActivas: [],
    metricasActivas: [],
    descuentosActivos: false,
  })

  const filteredFinancieras = mockFinancieras.filter((f) => {
    const matchesSearch = f.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.nit.includes(searchTerm)
    const matchesStatus = statusFilter === "all" || f.estado === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleOpenConfig = (financiera: typeof mockFinancieras[0]) => {
    setSelectedFinanciera(financiera)
    setConfigState({
      camposActivos: financiera.camposActivos,
      notificacionesActivas: financiera.notificacionesActivas,
      metricasActivas: financiera.metricasActivas,
      descuentosActivos: financiera.descuentosActivos,
    })
    setIsConfigDialogOpen(true)
  }

  const toggleCampo = (campoId: string) => {
    setConfigState(prev => ({
      ...prev,
      camposActivos: prev.camposActivos.includes(campoId)
        ? prev.camposActivos.filter(c => c !== campoId)
        : [...prev.camposActivos, campoId]
    }))
  }

  const toggleNotificacion = (notifId: string) => {
    setConfigState(prev => ({
      ...prev,
      notificacionesActivas: prev.notificacionesActivas.includes(notifId)
        ? prev.notificacionesActivas.filter(n => n !== notifId)
        : [...prev.notificacionesActivas, notifId]
    }))
  }

  const toggleMetrica = (metricaId: string) => {
    setConfigState(prev => ({
      ...prev,
      metricasActivas: prev.metricasActivas.includes(metricaId)
        ? prev.metricasActivas.filter(m => m !== metricaId)
        : [...prev.metricasActivas, metricaId]
    }))
  }

  const getCamposParaFinanciera = (codigo: string) => {
    return camposParticulares[codigo as keyof typeof camposParticulares] || []
  }

  const getNotificacionesParaFinanciera = (codigo: string) => {
    return notificacionesParticulares[codigo as keyof typeof notificacionesParticulares] || []
  }

  const getMetricasParaFinanciera = (codigo: string) => {
    return metricasParticulares[codigo as keyof typeof metricasParticulares] || []
  }

  return (
    <AuthGuard>
      <AppLayout>
        <Topbar
          title="Financieras"
          breadcrumbs={[{ label: "Administración" }, { label: "Financieras" }]}
          showCreate={false}
        />
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Financieras</h1>
              <p className="text-muted-foreground">
                Crear, editar y configurar campos, notificaciones y métricas por financiera
              </p>
            </div>
            <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-emerald hover:bg-emerald/90">
              <Plus className="mr-2 h-4 w-4" />
              Nueva Financiera
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Financieras</CardTitle>
                <Landmark className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockFinancieras.length}</div>
                <p className="text-xs text-muted-foreground">
                  {mockFinancieras.filter(f => f.estado === "activo").length} activas
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Regionales</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {mockFinancieras.reduce((acc, f) => acc + f.regionales, 0)}
                </div>
                <p className="text-xs text-muted-foreground">En todas las financieras</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sucursales</CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {mockFinancieras.reduce((acc, f) => acc + f.sucursales, 0)}
                </div>
                <p className="text-xs text-muted-foreground">Total en el sistema</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Gestores</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {mockFinancieras.reduce((acc, f) => acc + f.gestores, 0)}
                </div>
                <p className="text-xs text-muted-foreground">Gestores activos</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Lista de Financieras</CardTitle>
              <CardDescription>Gestiona y configura las entidades financieras del sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nombre o NIT..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="activo">Activo</SelectItem>
                    <SelectItem value="inactivo">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Financiera</TableHead>
                      <TableHead>NIT</TableHead>
                      <TableHead className="text-center">Gestores</TableHead>
                      <TableHead className="text-center">Campos</TableHead>
                      <TableHead className="text-center">Descuentos</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFinancieras.map((financiera, index) => (
                      <motion.tr
                        key={financiera.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="group"
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div
                              className="h-10 w-10 rounded-lg flex items-center justify-center text-white font-bold"
                              style={{ backgroundColor: financiera.color }}
                            >
                              {financiera.nombre.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-medium">{financiera.nombre}</div>
                              <div className="text-sm text-muted-foreground">{financiera.descripcion}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{financiera.nit}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline">{financiera.gestores}</Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="secondary">{financiera.camposActivos.length} activos</Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          {financiera.descuentosActivos ? (
                            <Badge className="bg-emerald/20 text-emerald">Activo</Badge>
                          ) : (
                            <Badge variant="secondary">Inactivo</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={financiera.estado === "activo" ? "default" : "secondary"}
                            className={financiera.estado === "activo" ? "bg-emerald/20 text-emerald hover:bg-emerald/30" : ""}
                          >
                            {financiera.estado === "activo" ? (
                              <CheckCircle className="mr-1 h-3 w-3" />
                            ) : (
                              <XCircle className="mr-1 h-3 w-3" />
                            )}
                            {financiera.estado}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleOpenConfig(financiera)}>
                                <Settings className="mr-2 h-4 w-4" />
                                Configurar campos
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                Ver detalles
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Create Dialog */}
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Nueva Financiera</DialogTitle>
                <DialogDescription>
                  Registra una nueva entidad financiera en el sistema
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="nombre">Nombre de la financiera</Label>
                  <Input id="nombre" placeholder="Nombre de la financiera" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="descripcion">Descripción breve</Label>
                  <Textarea id="descripcion" placeholder="Descripción de la financiera..." rows={2} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="nit">NIT</Label>
                    <Input id="nit" placeholder="000.000.000-0" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="color">Color identificador</Label>
                    <Input id="color" type="color" defaultValue="#00C896" className="h-10" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="direccion">Dirección</Label>
                  <Input id="direccion" placeholder="Dirección principal" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="telefono">Teléfono</Label>
                    <Input id="telefono" placeholder="+57 000 000 0000" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="contacto@empresa.com" />
                  </div>
                </div>
                <Separator />
                <div className="space-y-3">
                  <Label>Módulos a activar</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="text-sm">Gestión de Cobranza</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="text-sm">Notificaciones</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="text-sm">Métricas</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="text-sm">Adquisición (opcional)</span>
                      <Switch />
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <span className="text-sm font-medium">Descuentos en acuerdos</span>
                    <p className="text-xs text-muted-foreground">Permitir aplicar descuentos en acuerdos de pago</p>
                  </div>
                  <Switch />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button className="bg-emerald hover:bg-emerald/90">
                  Crear Financiera
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Configuration Dialog */}
          <Dialog open={isConfigDialogOpen} onOpenChange={setIsConfigDialogOpen}>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  {selectedFinanciera && (
                    <>
                      <div
                        className="h-10 w-10 rounded-lg flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: selectedFinanciera.color }}
                      >
                        {selectedFinanciera.nombre.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <span>Configurar {selectedFinanciera.nombre}</span>
                        <p className="text-sm font-normal text-muted-foreground">
                          Activa o desactiva campos, notificaciones y métricas
                        </p>
                      </div>
                    </>
                  )}
                </DialogTitle>
              </DialogHeader>

              {selectedFinanciera && (
                <Tabs value={configTab} onValueChange={setConfigTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="campos" className="gap-2">
                      <Settings className="h-4 w-4" />
                      Campos de gestión
                    </TabsTrigger>
                    <TabsTrigger value="notificaciones" className="gap-2">
                      <Bell className="h-4 w-4" />
                      Notificaciones
                    </TabsTrigger>
                    <TabsTrigger value="metricas" className="gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Métricas
                    </TabsTrigger>
                  </TabsList>

                  <div className="mt-4 rounded-2xl border border-border/70 bg-muted/30 p-4">
                    <p className="text-sm font-medium">Regla base del mockup</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      La interfaz es unica para todas las financieras. Lo configurable aqui son los campos
                      pre-personalizados, las notificaciones y las metricas particulares activas para cada entidad.
                    </p>
                  </div>

                  <ScrollArea className="h-[400px] mt-4">
                    <TabsContent value="campos" className="space-y-4 mt-0">
                      {/* Campos fijos */}
                      <div>
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <Lock className="h-4 w-4 text-muted-foreground" />
                          Campos fijos (no se pueden desactivar)
                        </h4>
                        <div className="space-y-2">
                          {camposFijos.map((campo) => (
                            <div
                              key={campo.id}
                              className="flex items-center justify-between p-3 border rounded-lg bg-muted/30"
                            >
                              <div className="flex items-center gap-3">
                                <Lock className="h-4 w-4 text-muted-foreground" />
                                <div>
                                  <span className="text-sm font-medium">{campo.nombre}</span>
                                  <div className="flex gap-2 mt-0.5">
                                    <Badge variant="outline" className="text-xs">{campo.tipo}</Badge>
                                    {campo.obligatorio && (
                                      <Badge variant="secondary" className="text-xs">Obligatorio</Badge>
                                    )}
                                    {campo.condicional && (
                                      <Badge variant="secondary" className="text-xs">Condicional</Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <Switch checked disabled />
                            </div>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      {/* Campos particulares */}
                      <div>
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <Unlock className="h-4 w-4 text-emerald" />
                          Campos pre-personalizados (activar/desactivar)
                        </h4>
                        <p className="mb-3 text-xs text-muted-foreground">
                          Aqui solo aparecen campos aprobados en el catalogo pre-personalizado de la financiera.
                        </p>
                        <div className="space-y-2">
                          {getCamposParaFinanciera(selectedFinanciera.codigo).map((campo) => (
                            <div
                              key={campo.id}
                              className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30 transition-colors"
                            >
                              <div>
                                <span className="text-sm font-medium">{campo.nombre}</span>
                                <p className="text-xs text-muted-foreground">{campo.descripcion}</p>
                                <Badge variant="outline" className="text-xs mt-1">{campo.tipo}</Badge>
                              </div>
                              <Switch
                                checked={configState.camposActivos.includes(campo.id)}
                                onCheckedChange={() => toggleCampo(campo.id)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      {/* Descuentos */}
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <span className="font-medium">Descuentos en acuerdos de pago</span>
                          <p className="text-sm text-muted-foreground">
                            Permitir aplicar descuento (% o valor fijo) al crear acuerdos
                          </p>
                        </div>
                        <Switch
                          checked={configState.descuentosActivos}
                          onCheckedChange={(checked) => setConfigState(prev => ({ ...prev, descuentosActivos: checked }))}
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="notificaciones" className="space-y-4 mt-0">
                      <div>
                        <h4 className="font-medium mb-3">Notificaciones particulares</h4>
                        <div className="space-y-2">
                          {getNotificacionesParaFinanciera(selectedFinanciera.codigo).map((notif) => (
                            <div
                              key={notif.id}
                              className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30 transition-colors"
                            >
                              <div>
                                <span className="text-sm font-medium">{notif.nombre}</span>
                                <p className="text-xs text-muted-foreground">{notif.descripcion}</p>
                              </div>
                              <Switch
                                checked={configState.notificacionesActivas.includes(notif.id)}
                                onCheckedChange={() => toggleNotificacion(notif.id)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="metricas" className="space-y-4 mt-0">
                      <div>
                        <h4 className="font-medium mb-3">Métricas particulares</h4>
                        <div className="space-y-2">
                          {getMetricasParaFinanciera(selectedFinanciera.codigo).map((metrica) => (
                            <div
                              key={metrica.id}
                              className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30 transition-colors"
                            >
                              <div>
                                <span className="text-sm font-medium">{metrica.nombre}</span>
                                <p className="text-xs text-muted-foreground">{metrica.descripcion}</p>
                              </div>
                              <Switch
                                checked={configState.metricasActivas.includes(metrica.id)}
                                onCheckedChange={() => toggleMetrica(metrica.id)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                  </ScrollArea>

                  <div className="mt-4 rounded-2xl border border-dashed border-border/80 bg-background/65 p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Solicitar campo personalizado</p>
                        <p className="text-sm text-muted-foreground">
                          Si una financiera necesita un campo fuera de la lista pre-personalizada, el admin puede
                          solicitar su incorporacion al catalogo.
                        </p>
                      </div>
                      <Button variant="outline" className="gap-2 sm:self-start">
                        <MessageSquare className="h-4 w-4" />
                        Solicitar campo personalizado
                      </Button>
                    </div>
                  </div>
                </Tabs>
              )}

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsConfigDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button className="bg-emerald hover:bg-emerald/90">
                  Guardar configuración
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </AppLayout>
    </AuthGuard>
  )
}
