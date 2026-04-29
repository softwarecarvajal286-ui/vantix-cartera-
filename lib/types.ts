"use client"

export type EstadoCuenta = "al_dia" | "mora_temprana" | "mora_media" | "mora_avanzada" | "critico" | "castigado"
export type TipoProducto = "credito_consumo" | "tarjeta_credito" | "hipotecario" | "vehicular" | "microempresa"
export type EstadoGestion = "pendiente" | "en_proceso" | "contactado" | "promesa_pago" | "acuerdo" | "escalado" | "cerrado"
export type CanalContacto = "telefono" | "sms" | "email" | "whatsapp" | "visita" | "carta"
export type ResultadoGestion = "contacto_efectivo" | "no_contesta" | "numero_errado" | "buzon" | "promesa_pago" | "negativa" | "acuerdo" | "pago_realizado"

export interface Cliente {
  id: string
  cedula: string
  nombre: string
  apellido: string
  email: string
  telefono: string
  telefonoAlt?: string
  direccion: string
  ciudad: string
  fechaNacimiento: string
  ocupacion: string
  ingresoMensual: number
  fechaRegistro: string
  segmento: "premium" | "standard" | "basico"
  riesgo: "bajo" | "medio" | "alto" | "critico"
  cuentas: Cuenta[]
}

export interface Cuenta {
  id: string
  clienteId: string
  numeroCredito: string
  tipoProducto: TipoProducto
  montoOriginal: number
  saldoActual: number
  saldoMora: number
  cuotaMensual: number
  diasMora: number
  estado: EstadoCuenta
  fechaDesembolso: string
  fechaVencimiento: string
  tasaInteres: number
  gestorAsignado: string
  ultimaGestion?: string
  proximaGestion?: string
  historialGestiones: Gestion[]
}

export interface Gestion {
  id: string
  cuentaId: string
  fecha: string
  hora: string
  canal: CanalContacto
  resultado: ResultadoGestion
  observaciones: string
  gestorId: string
  gestorNombre: string
  promesaPago?: {
    fecha: string
    monto: number
    cumplida?: boolean
  }
  siguienteAccion?: string
  fechaSiguienteAccion?: string
}

export interface Gestor {
  id: string
  nombre: string
  email: string
  telefono: string
  rol: "gestor" | "supervisor" | "admin"
  cuentasAsignadas: number
  metaMensual: number
  recuperadoMes: number
  efectividad: number
  activo: boolean
}

export interface Alerta {
  id: string
  tipo: "vencimiento" | "promesa_incumplida" | "escalamiento" | "meta" | "nuevo_caso"
  titulo: string
  descripcion: string
  fecha: string
  leida: boolean
  prioridad: "baja" | "media" | "alta" | "urgente"
  clienteId?: string
  cuentaId?: string
}

export interface Notificacion {
  id: string
  tipo: "success" | "error" | "warning" | "info"
  titulo: string
  mensaje: string
  timestamp: number
}

export interface FiltrosCartera {
  busqueda: string
  estado: EstadoCuenta | "todos"
  tipoProducto: TipoProducto | "todos"
  gestor: string | "todos"
  diasMoraMin: number | null
  diasMoraMax: number | null
  montoMin: number | null
  montoMax: number | null
}

export interface KPI {
  titulo: string
  valor: string | number
  cambio?: number
  tendencia?: "up" | "down" | "neutral"
  periodo?: string
}
