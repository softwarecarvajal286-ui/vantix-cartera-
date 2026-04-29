import { Cliente, Cuenta, Gestor, Alerta, Gestion } from "./types"

// Gestores
export const gestoresIniciales: Gestor[] = [
  {
    id: "g1",
    nombre: "María García",
    email: "maria.garcia@carterahub.com",
    telefono: "3001234567",
    rol: "gestor",
    cuentasAsignadas: 45,
    metaMensual: 50000000,
    recuperadoMes: 38500000,
    efectividad: 78,
    activo: true
  },
  {
    id: "g2",
    nombre: "Carlos Rodríguez",
    email: "carlos.rodriguez@carterahub.com",
    telefono: "3009876543",
    rol: "gestor",
    cuentasAsignadas: 52,
    metaMensual: 55000000,
    recuperadoMes: 42000000,
    efectividad: 82,
    activo: true
  },
  {
    id: "g3",
    nombre: "Ana Martínez",
    email: "ana.martinez@carterahub.com",
    telefono: "3005551234",
    rol: "supervisor",
    cuentasAsignadas: 28,
    metaMensual: 40000000,
    recuperadoMes: 35000000,
    efectividad: 85,
    activo: true
  },
  {
    id: "g4",
    nombre: "Luis Hernández",
    email: "luis.hernandez@carterahub.com",
    telefono: "3007778899",
    rol: "gestor",
    cuentasAsignadas: 38,
    metaMensual: 45000000,
    recuperadoMes: 29000000,
    efectividad: 68,
    activo: true
  },
  {
    id: "g5",
    nombre: "Patricia López",
    email: "patricia.lopez@carterahub.com",
    telefono: "3002223344",
    rol: "admin",
    cuentasAsignadas: 0,
    metaMensual: 0,
    recuperadoMes: 0,
    efectividad: 0,
    activo: true
  }
]

// Función para generar gestiones
const generarGestiones = (cuentaId: string, cantidad: number): Gestion[] => {
  const resultados: Gestion["resultado"][] = ["contacto_efectivo", "no_contesta", "promesa_pago", "buzon", "negativa"]
  const canales: Gestion["canal"][] = ["telefono", "whatsapp", "email", "sms"]
  const gestores = gestoresIniciales.filter(g => g.rol === "gestor")
  
  return Array.from({ length: cantidad }, (_, i) => {
    const fecha = new Date()
    fecha.setDate(fecha.getDate() - (i * 3 + Math.floor(Math.random() * 5)))
    const gestor = gestores[Math.floor(Math.random() * gestores.length)]
    const resultado = resultados[Math.floor(Math.random() * resultados.length)]
    
    return {
      id: `gest-${cuentaId}-${i}`,
      cuentaId,
      fecha: fecha.toISOString().split("T")[0],
      hora: `${9 + Math.floor(Math.random() * 9)}:${Math.floor(Math.random() * 60).toString().padStart(2, "0")}`,
      canal: canales[Math.floor(Math.random() * canales.length)],
      resultado,
      observaciones: resultado === "contacto_efectivo" 
        ? "Cliente atendió, se explicó situación de mora y opciones de pago."
        : resultado === "promesa_pago"
        ? "Cliente se compromete a realizar pago parcial."
        : resultado === "no_contesta"
        ? "Se intentó contacto sin éxito, se dejará mensaje."
        : "Llamada realizada según protocolo.",
      gestorId: gestor.id,
      gestorNombre: gestor.nombre,
      promesaPago: resultado === "promesa_pago" ? {
        fecha: new Date(fecha.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        monto: Math.floor(Math.random() * 500000) + 200000,
        cumplida: Math.random() > 0.6
      } : undefined,
      siguienteAccion: "Seguimiento telefónico",
      fechaSiguienteAccion: new Date(fecha.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
    }
  })
}

// Clientes con cuentas
export const clientesIniciales: Cliente[] = [
  {
    id: "c1",
    cedula: "1023456789",
    nombre: "Juan Carlos",
    apellido: "Pérez Gómez",
    email: "juancarlos.perez@email.com",
    telefono: "3101234567",
    telefonoAlt: "6012345678",
    direccion: "Calle 45 #12-34, Apto 502",
    ciudad: "Bogotá",
    fechaNacimiento: "1985-03-15",
    ocupacion: "Ingeniero de Sistemas",
    ingresoMensual: 8500000,
    fechaRegistro: "2020-06-15",
    segmento: "premium",
    riesgo: "medio",
    cuentas: [
      {
        id: "cu1",
        clienteId: "c1",
        numeroCredito: "CRE-2023-00145",
        tipoProducto: "credito_consumo",
        montoOriginal: 25000000,
        saldoActual: 18500000,
        saldoMora: 2850000,
        cuotaMensual: 890000,
        diasMora: 45,
        estado: "mora_media",
        fechaDesembolso: "2023-01-15",
        fechaVencimiento: "2026-01-15",
        tasaInteres: 18.5,
        gestorAsignado: "g1",
        ultimaGestion: "2024-01-18",
        proximaGestion: "2024-01-22",
        historialGestiones: generarGestiones("cu1", 8)
      }
    ]
  },
  {
    id: "c2",
    cedula: "52987654",
    nombre: "María Fernanda",
    apellido: "López Torres",
    email: "mariaf.lopez@email.com",
    telefono: "3209876543",
    direccion: "Carrera 15 #78-90",
    ciudad: "Medellín",
    fechaNacimiento: "1990-07-22",
    ocupacion: "Contadora",
    ingresoMensual: 6200000,
    fechaRegistro: "2019-11-20",
    segmento: "standard",
    riesgo: "bajo",
    cuentas: [
      {
        id: "cu2",
        clienteId: "c2",
        numeroCredito: "TC-2022-08976",
        tipoProducto: "tarjeta_credito",
        montoOriginal: 15000000,
        saldoActual: 4200000,
        saldoMora: 380000,
        cuotaMensual: 420000,
        diasMora: 15,
        estado: "mora_temprana",
        fechaDesembolso: "2022-03-10",
        fechaVencimiento: "2027-03-10",
        tasaInteres: 28.5,
        gestorAsignado: "g2",
        ultimaGestion: "2024-01-19",
        proximaGestion: "2024-01-21",
        historialGestiones: generarGestiones("cu2", 3)
      }
    ]
  },
  {
    id: "c3",
    cedula: "79456123",
    nombre: "Roberto",
    apellido: "Sánchez Ruiz",
    email: "roberto.sanchez@email.com",
    telefono: "3157894561",
    telefonoAlt: "3187894562",
    direccion: "Avenida 68 #25-10, Casa 15",
    ciudad: "Cali",
    fechaNacimiento: "1978-12-03",
    ocupacion: "Comerciante",
    ingresoMensual: 12000000,
    fechaRegistro: "2018-05-08",
    segmento: "premium",
    riesgo: "alto",
    cuentas: [
      {
        id: "cu3",
        clienteId: "c3",
        numeroCredito: "HIP-2019-00234",
        tipoProducto: "hipotecario",
        montoOriginal: 280000000,
        saldoActual: 195000000,
        saldoMora: 12500000,
        cuotaMensual: 3200000,
        diasMora: 92,
        estado: "mora_avanzada",
        fechaDesembolso: "2019-08-20",
        fechaVencimiento: "2039-08-20",
        tasaInteres: 12.5,
        gestorAsignado: "g3",
        ultimaGestion: "2024-01-17",
        proximaGestion: "2024-01-20",
        historialGestiones: generarGestiones("cu3", 15)
      },
      {
        id: "cu4",
        clienteId: "c3",
        numeroCredito: "VEH-2021-00567",
        tipoProducto: "vehicular",
        montoOriginal: 45000000,
        saldoActual: 28000000,
        saldoMora: 4200000,
        cuotaMensual: 1450000,
        diasMora: 68,
        estado: "mora_media",
        fechaDesembolso: "2021-05-15",
        fechaVencimiento: "2026-05-15",
        tasaInteres: 16.8,
        gestorAsignado: "g3",
        ultimaGestion: "2024-01-17",
        proximaGestion: "2024-01-20",
        historialGestiones: generarGestiones("cu4", 10)
      }
    ]
  },
  {
    id: "c4",
    cedula: "1098765432",
    nombre: "Andrea",
    apellido: "Martínez Vega",
    email: "andrea.martinez@email.com",
    telefono: "3001112233",
    direccion: "Calle 100 #45-67",
    ciudad: "Bogotá",
    fechaNacimiento: "1995-09-18",
    ocupacion: "Diseñadora Gráfica",
    ingresoMensual: 4800000,
    fechaRegistro: "2022-02-14",
    segmento: "basico",
    riesgo: "critico",
    cuentas: [
      {
        id: "cu5",
        clienteId: "c4",
        numeroCredito: "CRE-2022-00789",
        tipoProducto: "credito_consumo",
        montoOriginal: 8000000,
        saldoActual: 7200000,
        saldoMora: 5800000,
        cuotaMensual: 380000,
        diasMora: 156,
        estado: "critico",
        fechaDesembolso: "2022-04-01",
        fechaVencimiento: "2025-04-01",
        tasaInteres: 22.0,
        gestorAsignado: "g4",
        ultimaGestion: "2024-01-15",
        proximaGestion: "2024-01-18",
        historialGestiones: generarGestiones("cu5", 20)
      }
    ]
  },
  {
    id: "c5",
    cedula: "80123456",
    nombre: "Pedro",
    apellido: "González Mora",
    email: "pedro.gonzalez@email.com",
    telefono: "3184567890",
    direccion: "Transversal 23 #56-78",
    ciudad: "Barranquilla",
    fechaNacimiento: "1982-04-25",
    ocupacion: "Médico",
    ingresoMensual: 15000000,
    fechaRegistro: "2017-09-10",
    segmento: "premium",
    riesgo: "bajo",
    cuentas: [
      {
        id: "cu6",
        clienteId: "c5",
        numeroCredito: "TC-2020-05432",
        tipoProducto: "tarjeta_credito",
        montoOriginal: 30000000,
        saldoActual: 12500000,
        saldoMora: 0,
        cuotaMensual: 850000,
        diasMora: 0,
        estado: "al_dia",
        fechaDesembolso: "2020-11-05",
        fechaVencimiento: "2025-11-05",
        tasaInteres: 26.0,
        gestorAsignado: "g1",
        ultimaGestion: "2024-01-10",
        historialGestiones: []
      }
    ]
  },
  {
    id: "c6",
    cedula: "39876543",
    nombre: "Claudia",
    apellido: "Ramírez Díaz",
    email: "claudia.ramirez@email.com",
    telefono: "3123456789",
    telefonoAlt: "6017654321",
    direccion: "Calle 72 #10-25, Oficina 301",
    ciudad: "Bogotá",
    fechaNacimiento: "1988-11-30",
    ocupacion: "Abogada",
    ingresoMensual: 9500000,
    fechaRegistro: "2019-03-22",
    segmento: "premium",
    riesgo: "medio",
    cuentas: [
      {
        id: "cu7",
        clienteId: "c6",
        numeroCredito: "MIC-2021-00123",
        tipoProducto: "microempresa",
        montoOriginal: 35000000,
        saldoActual: 22000000,
        saldoMora: 3100000,
        cuotaMensual: 1200000,
        diasMora: 38,
        estado: "mora_temprana",
        fechaDesembolso: "2021-07-15",
        fechaVencimiento: "2026-07-15",
        tasaInteres: 19.5,
        gestorAsignado: "g2",
        ultimaGestion: "2024-01-18",
        proximaGestion: "2024-01-21",
        historialGestiones: generarGestiones("cu7", 6)
      }
    ]
  },
  {
    id: "c7",
    cedula: "1045678901",
    nombre: "Santiago",
    apellido: "Vargas Pinto",
    email: "santiago.vargas@email.com",
    telefono: "3056789012",
    direccion: "Carrera 7 #82-45",
    ciudad: "Bogotá",
    fechaNacimiento: "1992-06-08",
    ocupacion: "Arquitecto",
    ingresoMensual: 7200000,
    fechaRegistro: "2021-08-30",
    segmento: "standard",
    riesgo: "alto",
    cuentas: [
      {
        id: "cu8",
        clienteId: "c7",
        numeroCredito: "VEH-2022-00890",
        tipoProducto: "vehicular",
        montoOriginal: 62000000,
        saldoActual: 48000000,
        saldoMora: 8500000,
        cuotaMensual: 1850000,
        diasMora: 120,
        estado: "critico",
        fechaDesembolso: "2022-02-28",
        fechaVencimiento: "2027-02-28",
        tasaInteres: 17.2,
        gestorAsignado: "g4",
        ultimaGestion: "2024-01-16",
        proximaGestion: "2024-01-19",
        historialGestiones: generarGestiones("cu8", 18)
      }
    ]
  },
  {
    id: "c8",
    cedula: "52345678",
    nombre: "Laura",
    apellido: "Castro Mejía",
    email: "laura.castro@email.com",
    telefono: "3198765432",
    direccion: "Diagonal 45 #23-67",
    ciudad: "Pereira",
    fechaNacimiento: "1994-02-14",
    ocupacion: "Psicóloga",
    ingresoMensual: 5500000,
    fechaRegistro: "2020-12-05",
    segmento: "standard",
    riesgo: "bajo",
    cuentas: [
      {
        id: "cu9",
        clienteId: "c8",
        numeroCredito: "CRE-2021-00456",
        tipoProducto: "credito_consumo",
        montoOriginal: 12000000,
        saldoActual: 6800000,
        saldoMora: 520000,
        cuotaMensual: 520000,
        diasMora: 22,
        estado: "mora_temprana",
        fechaDesembolso: "2021-03-20",
        fechaVencimiento: "2024-03-20",
        tasaInteres: 20.0,
        gestorAsignado: "g1",
        ultimaGestion: "2024-01-19",
        proximaGestion: "2024-01-22",
        historialGestiones: generarGestiones("cu9", 4)
      }
    ]
  },
  {
    id: "c9",
    cedula: "79012345",
    nombre: "Fernando",
    apellido: "Reyes Luna",
    email: "fernando.reyes@email.com",
    telefono: "3167890123",
    telefonoAlt: "3177890124",
    direccion: "Calle 50 #30-40, Local 5",
    ciudad: "Bucaramanga",
    fechaNacimiento: "1975-08-20",
    ocupacion: "Empresario",
    ingresoMensual: 25000000,
    fechaRegistro: "2016-04-18",
    segmento: "premium",
    riesgo: "critico",
    cuentas: [
      {
        id: "cu10",
        clienteId: "c9",
        numeroCredito: "MIC-2020-00567",
        tipoProducto: "microempresa",
        montoOriginal: 120000000,
        saldoActual: 95000000,
        saldoMora: 45000000,
        cuotaMensual: 4500000,
        diasMora: 210,
        estado: "castigado",
        fechaDesembolso: "2020-06-01",
        fechaVencimiento: "2025-06-01",
        tasaInteres: 18.0,
        gestorAsignado: "g3",
        ultimaGestion: "2024-01-14",
        proximaGestion: "2024-01-17",
        historialGestiones: generarGestiones("cu10", 25)
      },
      {
        id: "cu11",
        clienteId: "c9",
        numeroCredito: "HIP-2018-00789",
        tipoProducto: "hipotecario",
        montoOriginal: 350000000,
        saldoActual: 280000000,
        saldoMora: 28000000,
        cuotaMensual: 4200000,
        diasMora: 145,
        estado: "critico",
        fechaDesembolso: "2018-09-15",
        fechaVencimiento: "2038-09-15",
        tasaInteres: 11.8,
        gestorAsignado: "g3",
        ultimaGestion: "2024-01-14",
        proximaGestion: "2024-01-17",
        historialGestiones: generarGestiones("cu11", 22)
      }
    ]
  },
  {
    id: "c10",
    cedula: "1087654321",
    nombre: "Valentina",
    apellido: "Ospina Cardona",
    email: "valentina.ospina@email.com",
    telefono: "3043210987",
    direccion: "Carrera 43A #1-50",
    ciudad: "Medellín",
    fechaNacimiento: "1998-01-05",
    ocupacion: "Community Manager",
    ingresoMensual: 3800000,
    fechaRegistro: "2023-01-10",
    segmento: "basico",
    riesgo: "medio",
    cuentas: [
      {
        id: "cu12",
        clienteId: "c10",
        numeroCredito: "TC-2023-01234",
        tipoProducto: "tarjeta_credito",
        montoOriginal: 5000000,
        saldoActual: 4800000,
        saldoMora: 720000,
        cuotaMensual: 280000,
        diasMora: 55,
        estado: "mora_media",
        fechaDesembolso: "2023-02-01",
        fechaVencimiento: "2028-02-01",
        tasaInteres: 29.5,
        gestorAsignado: "g4",
        ultimaGestion: "2024-01-18",
        proximaGestion: "2024-01-21",
        historialGestiones: generarGestiones("cu12", 7)
      }
    ]
  }
]

// Alertas iniciales
export const alertasIniciales: Alerta[] = [
  {
    id: "a1",
    tipo: "promesa_incumplida",
    titulo: "Promesa de pago incumplida",
    descripcion: "Roberto Sánchez no cumplió promesa de pago de $1,200,000 del crédito hipotecario",
    fecha: "2024-01-20",
    leida: false,
    prioridad: "alta",
    clienteId: "c3",
    cuentaId: "cu3"
  },
  {
    id: "a2",
    tipo: "escalamiento",
    titulo: "Cuenta requiere escalamiento",
    descripcion: "Santiago Vargas alcanzó 120 días de mora en crédito vehicular",
    fecha: "2024-01-19",
    leida: false,
    prioridad: "urgente",
    clienteId: "c7",
    cuentaId: "cu8"
  },
  {
    id: "a3",
    tipo: "vencimiento",
    titulo: "Próximo vencimiento de cuota",
    descripcion: "María Fernanda López tiene cuota próxima a vencer en 3 días",
    fecha: "2024-01-19",
    leida: true,
    prioridad: "media",
    clienteId: "c2",
    cuentaId: "cu2"
  },
  {
    id: "a4",
    tipo: "meta",
    titulo: "Meta mensual al 77%",
    descripcion: "María García ha alcanzado el 77% de su meta de recuperación mensual",
    fecha: "2024-01-18",
    leida: true,
    prioridad: "baja"
  },
  {
    id: "a5",
    tipo: "nuevo_caso",
    titulo: "Nuevo caso asignado",
    descripcion: "Se ha asignado el caso de Fernando Reyes a Ana Martínez para revisión especial",
    fecha: "2024-01-17",
    leida: false,
    prioridad: "alta",
    clienteId: "c9"
  }
]
