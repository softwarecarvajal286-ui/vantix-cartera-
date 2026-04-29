"use client"

export type SupportedFinancieraId = "krediya" | "payjoy" | "alo" | "distritec"

export type IndicatorUnit = "porcentaje" | "moneda" | "numero"
export type IndicatorTrend = "subiendo" | "bajando" | "estable"
export type NotificationType = "info" | "warning" | "success" | "error"

export interface ParticularGestionFieldDefinition {
  id: string
  label: string
  description: string
  kind: "badge" | "currency" | "number" | "percent" | "list" | "text"
}

export interface FinancieraIndicatorSeed {
  id: string
  nombre: string
  descripcion: string
  valor: number
  meta: number
  unidad: IndicatorUnit
  tendencia: IndicatorTrend
  variacion: number
  categoria: string
  periodo: string
  particular?: boolean
}

export interface FinancieraNotificationSeed {
  id: string
  tipo: NotificationType
  motivo: string
  titulo: string
  mensaje: string
  fecha: string
  hora: string
  leida: boolean
  accion?: string
  cliente?: { id: string; nombre: string }
  gestor?: { id: string; nombre: string }
  obligacion?: { id: string; numero: string }
  particular?: boolean
}

export interface GestionMock {
  id: number
  financieraId: SupportedFinancieraId
  vendedor: string
  cliente: string
  clienteApellido: string
  documento: string
  tipo: string
  tipificacion: string
  resultado: string
  fecha: string
  hora: string
  gestor: string
  monto: number
  obligacion: string
  diasMora: number
  saldo: number
  tieneAcuerdo: boolean
  acuerdoId?: number
  observaciones: string
  telefono: string
  correo: string
  cup: string
  regional: string
  sucursal: string
  directriz: string
  estadoPago: string
  cuotasPateadas?: number
  subestadoCredito?: string
  fpd3?: number
  fpd7?: number
  fpd15?: number
  estadoSolicitud?: string
  cupoAsignado?: number
  cupoUtilizado?: number
  cupoDisponible?: number
  score?: number
  documentos?: string[]
  riesgo?: string
}

export interface AcuerdoMock {
  id: number
  financieraId: SupportedFinancieraId
  cliente: string
  obligacion: string
  valorOriginal: number
  descuento: number
  descuentoTipo: "fijo" | "porcentaje" | null
  valorAcordado: number
  cuotas: number
  cuotasPagadas: number
  proximaCuota: string
  montoCuota: number
  estado: "Vigente" | "Cumplido" | "Vencido"
  fechaCreacion: string
  fechaPago: string
  soportePago: string | null
}

interface FinancieraModuleConfig {
  id: SupportedFinancieraId
  nombre: string
  color: string
  descuentosActivos: boolean
  gestionFields: ParticularGestionFieldDefinition[]
  particularIndicators: FinancieraIndicatorSeed[]
  particularNotifications: FinancieraNotificationSeed[]
}

const GENERIC_INDICATORS: FinancieraIndicatorSeed[] = [
  {
    id: "gen-indicador-principal",
    nombre: "% del indicador principal",
    descripcion: "Porcentaje del indicador principal de cartera",
    valor: 73.4,
    meta: 80,
    unidad: "porcentaje",
    tendencia: "subiendo",
    variacion: 2.8,
    categoria: "Generales",
    periodo: "Abril 2026",
  },
  {
    id: "gen-rendimiento-gestores",
    nombre: "Rendimiento de gestores",
    descripcion: "Gestionados, recaudo y cumplimiento por gestor",
    valor: 84,
    meta: 90,
    unidad: "porcentaje",
    tendencia: "subiendo",
    variacion: 4.1,
    categoria: "Gestion",
    periodo: "Abril 2026",
  },
  {
    id: "gen-recaudo",
    nombre: "Recaudo",
    descripcion: "Total recaudado en el periodo",
    valor: 186500000,
    meta: 210000000,
    unidad: "moneda",
    tendencia: "subiendo",
    variacion: 6.2,
    categoria: "Cobranza",
    periodo: "Abril 2026",
  },
  {
    id: "gen-meta",
    nombre: "Meta de recaudo",
    descripcion: "Meta general y porcentaje de cumplimiento",
    valor: 88,
    meta: 100,
    unidad: "porcentaje",
    tendencia: "subiendo",
    variacion: 3.7,
    categoria: "Cobranza",
    periodo: "Abril 2026",
  },
  {
    id: "gen-clientes-activos",
    nombre: "Clientes activos",
    descripcion: "Total de clientes activos en la financiera",
    valor: 1426,
    meta: 1500,
    unidad: "numero",
    tendencia: "estable",
    variacion: 1.3,
    categoria: "Cartera",
    periodo: "Abril 2026",
  },
  {
    id: "gen-clientes-mora",
    nombre: "Clientes en mora",
    descripcion: "Clientes con dias de mora superiores a cero",
    valor: 214,
    meta: 190,
    unidad: "numero",
    tendencia: "bajando",
    variacion: -4.8,
    categoria: "Cartera",
    periodo: "Abril 2026",
  },
  {
    id: "gen-criticos",
    nombre: "Criticos (+30 dias)",
    descripcion: "Clientes con mas de 30 dias de mora",
    valor: 63,
    meta: 50,
    unidad: "numero",
    tendencia: "bajando",
    variacion: -6.1,
    categoria: "Riesgo",
    periodo: "Abril 2026",
  },
]

const GENERIC_NOTIFICATIONS: FinancieraNotificationSeed[] = [
  {
    id: "gen-notif-1",
    tipo: "warning",
    motivo: "Clientes sin gestion",
    titulo: "Clientes sin gestion reciente",
    mensaje: "Hay 18 clientes en mora sin contacto durante los ultimos 3 dias.",
    fecha: "2026-04-29",
    hora: "08:10",
    leida: false,
    accion: "Ver cartera",
  },
  {
    id: "gen-notif-2",
    tipo: "info",
    motivo: "Pagos pendientes hoy",
    titulo: "Acuerdos con pago programado hoy",
    mensaje: "Se registran 6 acuerdos con fecha de cumplimiento para hoy.",
    fecha: "2026-04-29",
    hora: "07:25",
    leida: false,
    accion: "Ver acuerdos",
  },
  {
    id: "gen-notif-3",
    tipo: "error",
    motivo: "Acuerdos vencidos",
    titulo: "Acuerdo vencido sin soporte",
    mensaje: "El acuerdo ACU-204 vencio sin evidencia de pago registrada.",
    fecha: "2026-04-28",
    hora: "17:40",
    leida: true,
    accion: "Revisar acuerdo",
  },
  {
    id: "gen-notif-4",
    tipo: "success",
    motivo: "Alerta de pago",
    titulo: "Pago registrado correctamente",
    mensaje: "Se detecto un pago confirmado y conciliado para la obligacion CR-9821.",
    fecha: "2026-04-28",
    hora: "13:05",
    leida: true,
    accion: "Ver pago",
  },
  {
    id: "gen-notif-5",
    tipo: "error",
    motivo: "Alza en indicador establecido",
    titulo: "Indicador por encima del umbral",
    mensaje: "La mora critica supero el umbral configurado para el frente activo.",
    fecha: "2026-04-27",
    hora: "18:20",
    leida: false,
    accion: "Ver indicadores",
  },
]

const MODULE_CONFIG: Record<SupportedFinancieraId, FinancieraModuleConfig> = {
  krediya: {
    id: "krediya",
    nombre: "Krediya",
    color: "#00C896",
    descuentosActivos: true,
    gestionFields: [
      { id: "cuotas_pateadas", label: "Cuotas pateadas", description: "Alerta visual si el cliente tiene cuotas pateadas", kind: "number" },
      { id: "subestado_credito", label: "Sub-estado del credito", description: "Estado operativo del credito", kind: "badge" },
    ],
    particularIndicators: [
      { id: "kr-1", nombre: "Cuotas pateadas total", descripcion: "Total de cuotas pateadas detectadas", valor: 41, meta: 30, unidad: "numero", tendencia: "bajando", variacion: -8.1, categoria: "Krediya", periodo: "Abril 2026", particular: true },
      { id: "kr-2", nombre: "Mora total", descripcion: "Total de cartera vencida", valor: 522000000, meta: 470000000, unidad: "moneda", tendencia: "bajando", variacion: -3.4, categoria: "Krediya", periodo: "Abril 2026", particular: true },
      { id: "kr-3", nombre: "Dinero ciclado total", descripcion: "Total dinero ciclado general", valor: 138000000, meta: 125000000, unidad: "moneda", tendencia: "subiendo", variacion: 5.9, categoria: "Krediya", periodo: "Abril 2026", particular: true },
      { id: "kr-4", nombre: "Dinero ciclado por cliente", descripcion: "Promedio de dinero ciclado individual", valor: 1245000, meta: 1100000, unidad: "moneda", tendencia: "subiendo", variacion: 4.4, categoria: "Krediya", periodo: "Abril 2026", particular: true },
      { id: "kr-5", nombre: "Segmentacion por tienda", descripcion: "Peso de propias, socios y agentes", valor: 67, meta: 70, unidad: "porcentaje", tendencia: "estable", variacion: 1.1, categoria: "Krediya", periodo: "Abril 2026", particular: true },
    ],
    particularNotifications: [
      { id: "kr-n1", tipo: "warning", motivo: "Cambio subestado", titulo: "Cliente cambio de subestado", mensaje: "Un cliente paso de al dia a mora en la lectura de esta manana.", fecha: "2026-04-29", hora: "08:45", leida: false, accion: "Ver cliente", particular: true },
      { id: "kr-n2", tipo: "error", motivo: "Cuota pateada", titulo: "Cuota pateada detectada", mensaje: "Se detecto una cuota pateada en una obligacion prioritaria.", fecha: "2026-04-29", hora: "09:12", leida: false, accion: "Gestionar", particular: true },
      { id: "kr-n3", tipo: "success", motivo: "Pago realizado", titulo: "Pago realizado por el cliente", mensaje: "Se confirmo un pago reciente en una cuenta con mora activa.", fecha: "2026-04-28", hora: "14:30", leida: true, accion: "Ver pago", particular: true },
      { id: "kr-n4", tipo: "info", motivo: "Inconsistencia", titulo: "Inconsistencia corregida", mensaje: "Se ajusto una inconsistencia entre saldo visible y lectura operativa.", fecha: "2026-04-27", hora: "16:10", leida: true, accion: "Ver detalle", particular: true },
    ],
  },
  payjoy: {
    id: "payjoy",
    nombre: "PayJoy",
    color: "#4DA6FF",
    descuentosActivos: true,
    gestionFields: [
      { id: "fpd3", label: "FPD3", description: "First Payment Default a 3 dias", kind: "percent" },
      { id: "fpd7", label: "FPD7", description: "First Payment Default a 7 dias", kind: "percent" },
      { id: "fpd15", label: "FPD15", description: "First Payment Default a 15 dias", kind: "percent" },
    ],
    particularIndicators: [
      { id: "pj-1", nombre: "FPD3", descripcion: "First Payment Default a 3 dias", valor: 4.6, meta: 5.5, unidad: "porcentaje", tendencia: "bajando", variacion: -0.8, categoria: "PayJoy", periodo: "Abril 2026", particular: true },
      { id: "pj-2", nombre: "FPD7", descripcion: "First Payment Default a 7 dias", valor: 6.1, meta: 7.2, unidad: "porcentaje", tendencia: "bajando", variacion: -1.1, categoria: "PayJoy", periodo: "Abril 2026", particular: true },
      { id: "pj-3", nombre: "FPD15", descripcion: "First Payment Default a 15 dias", valor: 8.4, meta: 8.9, unidad: "porcentaje", tendencia: "bajando", variacion: -0.5, categoria: "PayJoy", periodo: "Abril 2026", particular: true },
      { id: "pj-4", nombre: "Mora por tienda", descripcion: "Comportamiento entre propias, socios y agentes", valor: 76, meta: 82, unidad: "porcentaje", tendencia: "subiendo", variacion: 3.4, categoria: "PayJoy", periodo: "Abril 2026", particular: true },
      { id: "pj-5", nombre: "Meta inferior 8.9%", descripcion: "Control del umbral de alerta de FPDs", valor: 8.4, meta: 8.9, unidad: "porcentaje", tendencia: "subiendo", variacion: 0.6, categoria: "PayJoy", periodo: "Abril 2026", particular: true },
    ],
    particularNotifications: [
      { id: "pj-n1", tipo: "warning", motivo: "Alerta FPD7", titulo: "Credito cerca de FPD7", mensaje: "Una cuenta esta proxima a sobrepasar el umbral FPD7.", fecha: "2026-04-29", hora: "09:00", leida: false, accion: "Ver credito", particular: true },
      { id: "pj-n2", tipo: "warning", motivo: "Alerta FPD15", titulo: "Credito cerca de FPD15", mensaje: "Un credito presenta riesgo de sobrepasar FPD15.", fecha: "2026-04-28", hora: "15:20", leida: true, accion: "Ver cartera", particular: true },
      { id: "pj-n3", tipo: "success", motivo: "Promesa de pago", titulo: "Promesa cumplida", mensaje: "Un cliente cumplio su compromiso dentro del rango esperado.", fecha: "2026-04-28", hora: "10:40", leida: true, accion: "Ver detalle", particular: true },
    ],
  },
  alo: {
    id: "alo",
    nombre: "ALO Credit",
    color: "#FFB347",
    descuentosActivos: false,
    gestionFields: [
      { id: "fpd3", label: "FPD3", description: "First Payment Default a 3 dias", kind: "percent" },
      { id: "fpd7", label: "FPD7", description: "First Payment Default a 7 dias", kind: "percent" },
      { id: "fpd15", label: "FPD15", description: "First Payment Default a 15 dias", kind: "percent" },
    ],
    particularIndicators: [
      { id: "alo-1", nombre: "FPD3", descripcion: "First Payment Default a 3 dias", valor: 5.1, meta: 5.9, unidad: "porcentaje", tendencia: "bajando", variacion: -0.3, categoria: "ALO", periodo: "Abril 2026", particular: true },
      { id: "alo-2", nombre: "FPD7", descripcion: "First Payment Default a 7 dias", valor: 6.8, meta: 7.8, unidad: "porcentaje", tendencia: "bajando", variacion: -0.6, categoria: "ALO", periodo: "Abril 2026", particular: true },
      { id: "alo-3", nombre: "FPD15", descripcion: "First Payment Default a 15 dias", valor: 8.6, meta: 8.9, unidad: "porcentaje", tendencia: "estable", variacion: 0.1, categoria: "ALO", periodo: "Abril 2026", particular: true },
      { id: "alo-4", nombre: "Mora por tienda", descripcion: "Comportamiento entre propias, socios y agentes", valor: 72, meta: 79, unidad: "porcentaje", tendencia: "subiendo", variacion: 2.7, categoria: "ALO", periodo: "Abril 2026", particular: true },
      { id: "alo-5", nombre: "Meta inferior 8.9%", descripcion: "Control del umbral de alerta de FPDs", valor: 8.6, meta: 8.9, unidad: "porcentaje", tendencia: "subiendo", variacion: 0.2, categoria: "ALO", periodo: "Abril 2026", particular: true },
    ],
    particularNotifications: [
      { id: "alo-n1", tipo: "warning", motivo: "Alerta FPD7", titulo: "Credito cerca de FPD7", mensaje: "Una cuenta de ALO esta cerca de sobrepasar FPD7.", fecha: "2026-04-29", hora: "08:55", leida: false, accion: "Ver credito", particular: true },
      { id: "alo-n2", tipo: "warning", motivo: "Alerta FPD15", titulo: "Credito cerca de FPD15", mensaje: "Se activo una alerta preventiva sobre FPD15.", fecha: "2026-04-28", hora: "16:25", leida: true, accion: "Ver cartera", particular: true },
      { id: "alo-n3", tipo: "success", motivo: "Promesa de pago", titulo: "Promesa revisada", mensaje: "Se confirmo el resultado de una promesa de pago del cliente.", fecha: "2026-04-27", hora: "11:30", leida: true, accion: "Ver detalle", particular: true },
    ],
  },
  distritec: {
    id: "distritec",
    nombre: "Distribuciones Distritec",
    color: "#9B5CFF",
    descuentosActivos: true,
    gestionFields: [
      { id: "estado_solicitud", label: "Estado solicitud", description: "En proceso, aprobado o rechazado", kind: "badge" },
      { id: "cupo_asignado", label: "Cupo asignado", description: "Valor total asignado al cliente", kind: "currency" },
      { id: "cupo_utilizado", label: "Cupo utilizado", description: "Valor en uso actualmente", kind: "currency" },
      { id: "cupo_disponible", label: "Cupo disponible", description: "Saldo libre sobre el cupo", kind: "currency" },
      { id: "score", label: "Score", description: "Score de riesgo del cliente", kind: "number" },
      { id: "documentos", label: "Documentos", description: "Estado de documentos requeridos", kind: "list" },
      { id: "riesgo", label: "Riesgo", description: "Riesgo actual del cliente", kind: "badge" },
    ],
    particularIndicators: [
      { id: "dt-1", nombre: "Cupo asignado", descripcion: "Valor total asignado a clientes", valor: 98000000, meta: 90000000, unidad: "moneda", tendencia: "subiendo", variacion: 5.2, categoria: "Distritec", periodo: "Abril 2026", particular: true },
      { id: "dt-2", nombre: "Cupo utilizado", descripcion: "Valor actualmente en uso", valor: 61200000, meta: 65000000, unidad: "moneda", tendencia: "estable", variacion: 1.1, categoria: "Distritec", periodo: "Abril 2026", particular: true },
      { id: "dt-3", nombre: "Cupo disponible", descripcion: "Cupo restante para operacion", valor: 36800000, meta: 30000000, unidad: "moneda", tendencia: "subiendo", variacion: 3.8, categoria: "Distritec", periodo: "Abril 2026", particular: true },
      { id: "dt-4", nombre: "IVP", descripcion: "Indicador de venta a plazo", valor: 69, meta: 74, unidad: "porcentaje", tendencia: "subiendo", variacion: 2.4, categoria: "Distritec", periodo: "Abril 2026", particular: true },
      { id: "dt-5", nombre: "Metas de recaudo", descripcion: "Cumplimiento de metas del frente", valor: 91, meta: 100, unidad: "porcentaje", tendencia: "subiendo", variacion: 6.4, categoria: "Distritec", periodo: "Abril 2026", particular: true },
      { id: "dt-6", nombre: "Distribucion de cartera", descripcion: "Cartera total frente a vencida", valor: 78, meta: 82, unidad: "porcentaje", tendencia: "estable", variacion: 0.9, categoria: "Distritec", periodo: "Abril 2026", particular: true },
      { id: "dt-7", nombre: "Solicitudes pendientes", descripcion: "Solicitudes sin resolver", valor: 19, meta: 12, unidad: "numero", tendencia: "bajando", variacion: -3.2, categoria: "Distritec", periodo: "Abril 2026", particular: true },
      { id: "dt-8", nombre: "Con acuerdo", descripcion: "Clientes con acuerdo vigente", valor: 34, meta: 28, unidad: "numero", tendencia: "subiendo", variacion: 4.5, categoria: "Distritec", periodo: "Abril 2026", particular: true },
    ],
    particularNotifications: [
      { id: "dt-n1", tipo: "warning", motivo: "Documentacion incompleta", titulo: "Documentacion pendiente", mensaje: "Un cliente de Distritec tiene documentos incompletos para continuar el flujo.", fecha: "2026-04-29", hora: "08:30", leida: false, accion: "Ver solicitud", particular: true },
      { id: "dt-n2", tipo: "success", motivo: "Pago WhatsApp", titulo: "Confirmacion de pago recibida", mensaje: "Llego una confirmacion de pago por WhatsApp desde el flujo comercial.", fecha: "2026-04-28", hora: "12:15", leida: true, accion: "Ver soporte", particular: true },
      { id: "dt-n3", tipo: "info", motivo: "Aprobacion cliente", titulo: "Cliente aprobado", mensaje: "Se aprobo la creacion de un nuevo cliente para financiacion.", fecha: "2026-04-28", hora: "10:05", leida: true, accion: "Ver cliente", particular: true },
      { id: "dt-n4", tipo: "error", motivo: "Alerta cartera", titulo: "Alerta de cartera activa", mensaje: "Hay clientes sin gestion, RC pendiente o conciliacion mensual en espera.", fecha: "2026-04-27", hora: "17:35", leida: false, accion: "Ver alertas", particular: true },
      { id: "dt-n5", tipo: "info", motivo: "Recordatorio WhatsApp", titulo: "Recordatorio de vencimiento enviado", mensaje: "Se programo un recordatorio de vencimiento y confirmacion de pago por WhatsApp.", fecha: "2026-04-27", hora: "09:50", leida: true, accion: "Ver historial", particular: true },
    ],
  },
}

const GESTIONES_MOCK: GestionMock[] = [
  {
    id: 1,
    financieraId: "krediya",
    vendedor: "Pedro Martinez",
    cliente: "Carlos Mendoza",
    clienteApellido: "Mendoza Lopez",
    documento: "1020304050",
    tipo: "Llamada",
    tipificacion: "Contacto efectivo",
    resultado: "Promesa de pago",
    fecha: "2026-04-29",
    hora: "10:30",
    gestor: "Juan Diaz",
    monto: 850000,
    obligacion: "OBL-2026-001",
    diasMora: 45,
    saldo: 2500000,
    tieneAcuerdo: true,
    acuerdoId: 1,
    observaciones: "Cliente confirma pago para fin de semana.",
    telefono: "+57 310 123 4567",
    correo: "carlos.mendoza@email.com",
    cup: "IMEI-123456789",
    regional: "Bogota",
    sucursal: "Chapinero",
    directriz: "Directriz A",
    estadoPago: "Pendiente",
    cuotasPateadas: 2,
    subestadoCredito: "1 cuota mora",
  },
  {
    id: 2,
    financieraId: "krediya",
    vendedor: "Ana Rodriguez",
    cliente: "Maria Garcia",
    clienteApellido: "Garcia Torres",
    documento: "1030405060",
    tipo: "WhatsApp",
    tipificacion: "No contesta",
    resultado: "Buzon",
    fecha: "2026-04-29",
    hora: "11:15",
    gestor: "Juan Diaz",
    monto: 0,
    obligacion: "OBL-2026-002",
    diasMora: 30,
    saldo: 1800000,
    tieneAcuerdo: false,
    observaciones: "Sin respuesta despues de 3 intentos.",
    telefono: "+57 311 234 5678",
    correo: "maria.garcia@email.com",
    cup: "IMEI-234567890",
    regional: "Medellin",
    sucursal: "El Poblado",
    directriz: "Directriz B",
    estadoPago: "Pendiente",
    cuotasPateadas: 0,
    subestadoCredito: "Cero moras",
  },
  {
    id: 3,
    financieraId: "payjoy",
    vendedor: "Sofia Ruiz",
    cliente: "Andres Lopez",
    clienteApellido: "Lopez Rojas",
    documento: "1040506070",
    tipo: "Llamada",
    tipificacion: "Promesa",
    resultado: "Seguimiento preventivo",
    fecha: "2026-04-29",
    hora: "09:05",
    gestor: "Camila Rios",
    monto: 420000,
    obligacion: "PJ-2026-031",
    diasMora: 7,
    saldo: 1200000,
    tieneAcuerdo: true,
    acuerdoId: 3,
    observaciones: "Cliente con seguimiento preventivo por cercania a FPD7.",
    telefono: "+57 312 333 1212",
    correo: "andres.lopez@email.com",
    cup: "SERIAL-PJ-901",
    regional: "Bogota",
    sucursal: "Fontibon",
    directriz: "Seguimiento preventivo",
    estadoPago: "Pendiente",
    fpd3: 3.2,
    fpd7: 6.8,
    fpd15: 8.4,
  },
  {
    id: 4,
    financieraId: "payjoy",
    vendedor: "Diana Ocampo",
    cliente: "Paula Torres",
    clienteApellido: "Torres Gomez",
    documento: "1050607080",
    tipo: "WhatsApp",
    tipificacion: "Contacto efectivo",
    resultado: "Promesa de pago",
    fecha: "2026-04-28",
    hora: "15:40",
    gestor: "Camila Rios",
    monto: 560000,
    obligacion: "PJ-2026-032",
    diasMora: 12,
    saldo: 1680000,
    tieneAcuerdo: false,
    observaciones: "Cliente responde y acepta monitoreo hasta FPD15.",
    telefono: "+57 320 888 4444",
    correo: "paula.torres@email.com",
    cup: "SERIAL-PJ-902",
    regional: "Cali",
    sucursal: "Chipichape",
    directriz: "Control FPD",
    estadoPago: "Pagado parcial",
    fpd3: 4.1,
    fpd7: 7.0,
    fpd15: 8.7,
  },
  {
    id: 5,
    financieraId: "alo",
    vendedor: "Miguel Ortega",
    cliente: "Laura Naranjo",
    clienteApellido: "Naranjo Salas",
    documento: "1060708090",
    tipo: "SMS",
    tipificacion: "No contesta",
    resultado: "Monitoreo automatico",
    fecha: "2026-04-29",
    hora: "08:40",
    gestor: "Pedro Martinez",
    monto: 0,
    obligacion: "ALO-2026-018",
    diasMora: 9,
    saldo: 980000,
    tieneAcuerdo: false,
    observaciones: "Cuenta bajo observacion por comportamiento FPD.",
    telefono: "+57 310 777 9898",
    correo: "laura.naranjo@email.com",
    cup: "SERIAL-ALO-301",
    regional: "Barranquilla",
    sucursal: "Norte",
    directriz: "Control FPD",
    estadoPago: "Pendiente",
    fpd3: 4.9,
    fpd7: 6.9,
    fpd15: 8.8,
  },
  {
    id: 6,
    financieraId: "alo",
    vendedor: "Nicolas Duarte",
    cliente: "Julian Castro",
    clienteApellido: "Castro Ruiz",
    documento: "1070809010",
    tipo: "Llamada",
    tipificacion: "Contacto efectivo",
    resultado: "Promesa de pago",
    fecha: "2026-04-28",
    hora: "16:20",
    gestor: "Pedro Martinez",
    monto: 310000,
    obligacion: "ALO-2026-019",
    diasMora: 14,
    saldo: 1420000,
    tieneAcuerdo: true,
    acuerdoId: 4,
    observaciones: "Se pacta pago sin descuento por politica de la financiera.",
    telefono: "+57 315 222 0044",
    correo: "julian.castro@email.com",
    cup: "SERIAL-ALO-302",
    regional: "Bucaramanga",
    sucursal: "Cabecera",
    directriz: "Seguimiento intensivo",
    estadoPago: "Pendiente",
    fpd3: 5.2,
    fpd7: 7.4,
    fpd15: 8.6,
  },
  {
    id: 7,
    financieraId: "distritec",
    vendedor: "Valeria Pardo",
    cliente: "Comercial Atlas",
    clienteApellido: "SAS",
    documento: "900555444",
    tipo: "Correo",
    tipificacion: "Contacto efectivo",
    resultado: "Revision documental",
    fecha: "2026-04-29",
    hora: "09:50",
    gestor: "Sergio Leon",
    monto: 0,
    obligacion: "DST-2026-101",
    diasMora: 22,
    saldo: 4300000,
    tieneAcuerdo: false,
    observaciones: "Se solicita completar documentos y validar cupo disponible.",
    telefono: "+57 601 400 2200",
    correo: "cartera@atlas.com",
    cup: "REF-DST-101",
    regional: "Bogota",
    sucursal: "Puente Aranda",
    directriz: "Validacion documental",
    estadoPago: "Pendiente",
    estadoSolicitud: "En proceso",
    cupoAsignado: 12000000,
    cupoUtilizado: 8700000,
    cupoDisponible: 3300000,
    score: 741,
    documentos: ["Cedula: completo", "RUT: faltante", "Extractos: completo"],
    riesgo: "Medio",
  },
  {
    id: 8,
    financieraId: "distritec",
    vendedor: "Daniel Perez",
    cliente: "Distribuciones Nova",
    clienteApellido: "Ltda",
    documento: "901777222",
    tipo: "Visita",
    tipificacion: "Promesa",
    resultado: "Negociacion en curso",
    fecha: "2026-04-28",
    hora: "13:30",
    gestor: "Sergio Leon",
    monto: 950000,
    obligacion: "DST-2026-102",
    diasMora: 18,
    saldo: 5200000,
    tieneAcuerdo: true,
    acuerdoId: 5,
    observaciones: "Cliente con cupo activo y documentos completos.",
    telefono: "+57 601 488 2300",
    correo: "finanzas@nova.com",
    cup: "REF-DST-102",
    regional: "Medellin",
    sucursal: "Itagui",
    directriz: "Seguimiento comercial",
    estadoPago: "Pagado parcial",
    estadoSolicitud: "Aprobado",
    cupoAsignado: 15000000,
    cupoUtilizado: 9200000,
    cupoDisponible: 5800000,
    score: 812,
    documentos: ["Cedula: completo", "RUT: completo", "Extractos: completo"],
    riesgo: "Bajo",
  },
]

const ACUERDOS_MOCK: AcuerdoMock[] = [
  {
    id: 1,
    financieraId: "krediya",
    cliente: "Carlos Mendoza",
    obligacion: "OBL-2026-001",
    valorOriginal: 2800000,
    descuento: 300000,
    descuentoTipo: "fijo",
    valorAcordado: 2500000,
    cuotas: 3,
    cuotasPagadas: 1,
    proximaCuota: "2026-05-15",
    montoCuota: 833333,
    estado: "Vigente",
    fechaCreacion: "2026-04-29",
    fechaPago: "2026-06-15",
    soportePago: null,
  },
  {
    id: 3,
    financieraId: "payjoy",
    cliente: "Andres Lopez",
    obligacion: "PJ-2026-031",
    valorOriginal: 1200000,
    descuento: 120000,
    descuentoTipo: "porcentaje",
    valorAcordado: 1080000,
    cuotas: 2,
    cuotasPagadas: 0,
    proximaCuota: "2026-05-06",
    montoCuota: 540000,
    estado: "Vigente",
    fechaCreacion: "2026-04-29",
    fechaPago: "2026-05-20",
    soportePago: null,
  },
  {
    id: 4,
    financieraId: "alo",
    cliente: "Julian Castro",
    obligacion: "ALO-2026-019",
    valorOriginal: 1420000,
    descuento: 0,
    descuentoTipo: null,
    valorAcordado: 1420000,
    cuotas: 2,
    cuotasPagadas: 0,
    proximaCuota: "2026-05-08",
    montoCuota: 710000,
    estado: "Vigente",
    fechaCreacion: "2026-04-28",
    fechaPago: "2026-05-28",
    soportePago: null,
  },
  {
    id: 5,
    financieraId: "distritec",
    cliente: "Distribuciones Nova",
    obligacion: "DST-2026-102",
    valorOriginal: 5200000,
    descuento: 250000,
    descuentoTipo: "fijo",
    valorAcordado: 4950000,
    cuotas: 3,
    cuotasPagadas: 1,
    proximaCuota: "2026-05-12",
    montoCuota: 1650000,
    estado: "Vigente",
    fechaCreacion: "2026-04-28",
    fechaPago: "2026-07-12",
    soportePago: null,
  },
]

export function resolveSupportedFinancieraId(financieraId?: string | null): SupportedFinancieraId {
  if (financieraId === "payjoy" || financieraId === "alo" || financieraId === "distritec") {
    return financieraId
  }

  return "krediya"
}

export function getFinancieraModuleConfig(financieraId?: string | null) {
  return MODULE_CONFIG[resolveSupportedFinancieraId(financieraId)]
}

export function getGenericIndicators() {
  return GENERIC_INDICATORS
}

export function getParticularIndicators(financieraId?: string | null) {
  return getFinancieraModuleConfig(financieraId).particularIndicators
}

export function getIndicatorsForFinanciera(financieraId?: string | null) {
  return [...GENERIC_INDICATORS, ...getParticularIndicators(financieraId)]
}

export function getGenericNotifications() {
  return GENERIC_NOTIFICATIONS
}

export function getNotificationsForFinanciera(financieraId?: string | null) {
  const config = getFinancieraModuleConfig(financieraId)
  return [...GENERIC_NOTIFICATIONS, ...config.particularNotifications]
}

export function getGestionesForFinanciera(financieraId?: string | null) {
  const resolved = resolveSupportedFinancieraId(financieraId)
  return GESTIONES_MOCK.filter((gestion) => gestion.financieraId === resolved)
}

export function getAcuerdosForFinanciera(financieraId?: string | null) {
  const resolved = resolveSupportedFinancieraId(financieraId)
  return ACUERDOS_MOCK.filter((acuerdo) => acuerdo.financieraId === resolved)
}
