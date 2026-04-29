"use client"

import React, { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import { Cliente, Cuenta, Gestor, Alerta, Gestion, Notificacion, FiltrosCartera, EstadoCuenta, TipoProducto, CanalContacto, ResultadoGestion } from "./types"
import { clientesIniciales, gestoresIniciales, alertasIniciales } from "./mock-data"

interface AppContextType {
  // Data
  clientes: Cliente[]
  gestores: Gestor[]
  alertas: Alerta[]
  notificaciones: Notificacion[]
  
  // Filters
  filtrosCartera: FiltrosCartera
  setFiltrosCartera: React.Dispatch<React.SetStateAction<FiltrosCartera>>
  
  // Cliente CRUD
  agregarCliente: (cliente: Omit<Cliente, "id" | "fechaRegistro" | "cuentas">) => Cliente
  actualizarCliente: (id: string, datos: Partial<Cliente>) => void
  eliminarCliente: (id: string) => void
  obtenerCliente: (id: string) => Cliente | undefined
  
  // Cuenta CRUD
  agregarCuenta: (clienteId: string, cuenta: Omit<Cuenta, "id" | "clienteId" | "historialGestiones">) => Cuenta | null
  actualizarCuenta: (clienteId: string, cuentaId: string, datos: Partial<Cuenta>) => void
  eliminarCuenta: (clienteId: string, cuentaId: string) => void
  obtenerCuenta: (cuentaId: string) => { cliente: Cliente; cuenta: Cuenta } | undefined
  
  // Gestiones
  agregarGestion: (cuentaId: string, gestion: Omit<Gestion, "id" | "cuentaId">) => Gestion | null
  
  // Alertas
  marcarAlertaLeida: (id: string) => void
  eliminarAlerta: (id: string) => void
  agregarAlerta: (alerta: Omit<Alerta, "id">) => void
  
  // Notificaciones
  mostrarNotificacion: (notificacion: Omit<Notificacion, "id" | "timestamp">) => void
  cerrarNotificacion: (id: string) => void
  
  // Gestores
  asignarGestor: (cuentaId: string, gestorId: string) => void
  
  // KPIs
  calcularKPIs: () => {
    totalCartera: number
    totalMora: number
    cuentasEnMora: number
    cuentasCriticas: number
    tasaRecuperacion: number
    efectividadPromedio: number
    promesasCumplidas: number
    gestionesHoy: number
  }
  
  // Filtered data
  obtenerCuentasFiltradas: () => { cliente: Cliente; cuenta: Cuenta }[]
  obtenerClientesFiltrados: (busqueda: string) => Cliente[]
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [clientes, setClientes] = useState<Cliente[]>(clientesIniciales)
  const [gestores, setGestores] = useState<Gestor[]>(gestoresIniciales)
  const [alertas, setAlertas] = useState<Alerta[]>(alertasIniciales)
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([])
  const [filtrosCartera, setFiltrosCartera] = useState<FiltrosCartera>({
    busqueda: "",
    estado: "todos",
    tipoProducto: "todos",
    gestor: "todos",
    diasMoraMin: null,
    diasMoraMax: null,
    montoMin: null,
    montoMax: null
  })

  // Notificación helper
  const mostrarNotificacion = useCallback((notificacion: Omit<Notificacion, "id" | "timestamp">) => {
    const nuevaNotificacion: Notificacion = {
      ...notificacion,
      id: `notif-${Date.now()}`,
      timestamp: Date.now()
    }
    setNotificaciones(prev => [...prev, nuevaNotificacion])
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      setNotificaciones(prev => prev.filter(n => n.id !== nuevaNotificacion.id))
    }, 5000)
  }, [])

  const cerrarNotificacion = useCallback((id: string) => {
    setNotificaciones(prev => prev.filter(n => n.id !== id))
  }, [])

  // Cliente CRUD
  const agregarCliente = useCallback((clienteData: Omit<Cliente, "id" | "fechaRegistro" | "cuentas">) => {
    const nuevoCliente: Cliente = {
      ...clienteData,
      id: `c${Date.now()}`,
      fechaRegistro: new Date().toISOString().split("T")[0],
      cuentas: []
    }
    setClientes(prev => [...prev, nuevoCliente])
    mostrarNotificacion({
      tipo: "success",
      titulo: "Cliente creado",
      mensaje: `${nuevoCliente.nombre} ${nuevoCliente.apellido} ha sido registrado exitosamente`
    })
    return nuevoCliente
  }, [mostrarNotificacion])

  const actualizarCliente = useCallback((id: string, datos: Partial<Cliente>) => {
    setClientes(prev => prev.map(c => c.id === id ? { ...c, ...datos } : c))
    mostrarNotificacion({
      tipo: "success",
      titulo: "Cliente actualizado",
      mensaje: "Los datos del cliente han sido actualizados"
    })
  }, [mostrarNotificacion])

  const eliminarCliente = useCallback((id: string) => {
    const cliente = clientes.find(c => c.id === id)
    setClientes(prev => prev.filter(c => c.id !== id))
    mostrarNotificacion({
      tipo: "info",
      titulo: "Cliente eliminado",
      mensaje: cliente ? `${cliente.nombre} ${cliente.apellido} ha sido eliminado` : "Cliente eliminado"
    })
  }, [clientes, mostrarNotificacion])

  const obtenerCliente = useCallback((id: string) => {
    return clientes.find(c => c.id === id)
  }, [clientes])

  // Cuenta CRUD
  const agregarCuenta = useCallback((clienteId: string, cuentaData: Omit<Cuenta, "id" | "clienteId" | "historialGestiones">) => {
    const nuevaCuenta: Cuenta = {
      ...cuentaData,
      id: `cu${Date.now()}`,
      clienteId,
      historialGestiones: []
    }
    
    setClientes(prev => prev.map(c => {
      if (c.id === clienteId) {
        return { ...c, cuentas: [...c.cuentas, nuevaCuenta] }
      }
      return c
    }))
    
    // Actualizar contador del gestor
    setGestores(prev => prev.map(g => {
      if (g.id === cuentaData.gestorAsignado) {
        return { ...g, cuentasAsignadas: g.cuentasAsignadas + 1 }
      }
      return g
    }))
    
    mostrarNotificacion({
      tipo: "success",
      titulo: "Cuenta creada",
      mensaje: `Crédito ${nuevaCuenta.numeroCredito} registrado exitosamente`
    })
    
    return nuevaCuenta
  }, [mostrarNotificacion])

  const actualizarCuenta = useCallback((clienteId: string, cuentaId: string, datos: Partial<Cuenta>) => {
    setClientes(prev => prev.map(c => {
      if (c.id === clienteId) {
        return {
          ...c,
          cuentas: c.cuentas.map(cu => cu.id === cuentaId ? { ...cu, ...datos } : cu)
        }
      }
      return c
    }))
    mostrarNotificacion({
      tipo: "success",
      titulo: "Cuenta actualizada",
      mensaje: "Los datos de la cuenta han sido actualizados"
    })
  }, [mostrarNotificacion])

  const eliminarCuenta = useCallback((clienteId: string, cuentaId: string) => {
    let gestorId: string | undefined
    
    setClientes(prev => prev.map(c => {
      if (c.id === clienteId) {
        const cuenta = c.cuentas.find(cu => cu.id === cuentaId)
        gestorId = cuenta?.gestorAsignado
        return {
          ...c,
          cuentas: c.cuentas.filter(cu => cu.id !== cuentaId)
        }
      }
      return c
    }))
    
    // Actualizar contador del gestor
    if (gestorId) {
      setGestores(prev => prev.map(g => {
        if (g.id === gestorId) {
          return { ...g, cuentasAsignadas: Math.max(0, g.cuentasAsignadas - 1) }
        }
        return g
      }))
    }
    
    mostrarNotificacion({
      tipo: "info",
      titulo: "Cuenta eliminada",
      mensaje: "La cuenta ha sido eliminada del sistema"
    })
  }, [mostrarNotificacion])

  const obtenerCuenta = useCallback((cuentaId: string) => {
    for (const cliente of clientes) {
      const cuenta = cliente.cuentas.find(c => c.id === cuentaId)
      if (cuenta) {
        return { cliente, cuenta }
      }
    }
    return undefined
  }, [clientes])

  // Gestiones
  const agregarGestion = useCallback((cuentaId: string, gestionData: Omit<Gestion, "id" | "cuentaId">) => {
    const nuevaGestion: Gestion = {
      ...gestionData,
      id: `gest-${Date.now()}`,
      cuentaId
    }
    
    setClientes(prev => prev.map(c => ({
      ...c,
      cuentas: c.cuentas.map(cu => {
        if (cu.id === cuentaId) {
          return {
            ...cu,
            historialGestiones: [nuevaGestion, ...cu.historialGestiones],
            ultimaGestion: nuevaGestion.fecha,
            proximaGestion: nuevaGestion.fechaSiguienteAccion
          }
        }
        return cu
      })
    })))
    
    mostrarNotificacion({
      tipo: "success",
      titulo: "Gestión registrada",
      mensaje: `Gestión por ${gestionData.canal} registrada exitosamente`
    })
    
    // Crear alerta si es promesa de pago
    if (gestionData.resultado === "promesa_pago" && gestionData.promesaPago) {
      agregarAlerta({
        tipo: "vencimiento",
        titulo: "Nueva promesa de pago",
        descripcion: `Promesa de pago por $${gestionData.promesaPago.monto.toLocaleString()} para el ${gestionData.promesaPago.fecha}`,
        fecha: nuevaGestion.fecha,
        leida: false,
        prioridad: "media",
        cuentaId
      })
    }
    
    return nuevaGestion
  }, [mostrarNotificacion])

  // Alertas
  const marcarAlertaLeida = useCallback((id: string) => {
    setAlertas(prev => prev.map(a => a.id === id ? { ...a, leida: true } : a))
  }, [])

  const eliminarAlerta = useCallback((id: string) => {
    setAlertas(prev => prev.filter(a => a.id !== id))
  }, [])

  const agregarAlerta = useCallback((alertaData: Omit<Alerta, "id">) => {
    const nuevaAlerta: Alerta = {
      ...alertaData,
      id: `a${Date.now()}`
    }
    setAlertas(prev => [nuevaAlerta, ...prev])
  }, [])

  // Gestores
  const asignarGestor = useCallback((cuentaId: string, gestorId: string) => {
    let gestorAnteriorId: string | undefined
    
    setClientes(prev => prev.map(c => ({
      ...c,
      cuentas: c.cuentas.map(cu => {
        if (cu.id === cuentaId) {
          gestorAnteriorId = cu.gestorAsignado
          return { ...cu, gestorAsignado: gestorId }
        }
        return cu
      })
    })))
    
    // Actualizar contadores de gestores
    setGestores(prev => prev.map(g => {
      if (g.id === gestorAnteriorId) {
        return { ...g, cuentasAsignadas: Math.max(0, g.cuentasAsignadas - 1) }
      }
      if (g.id === gestorId) {
        return { ...g, cuentasAsignadas: g.cuentasAsignadas + 1 }
      }
      return g
    }))
    
    const gestor = gestores.find(g => g.id === gestorId)
    mostrarNotificacion({
      tipo: "success",
      titulo: "Gestor asignado",
      mensaje: `La cuenta ha sido asignada a ${gestor?.nombre || "nuevo gestor"}`
    })
  }, [gestores, mostrarNotificacion])

  // KPIs
  const calcularKPIs = useCallback(() => {
    const todasLasCuentas = clientes.flatMap(c => c.cuentas)
    const cuentasEnMora = todasLasCuentas.filter(c => c.diasMora > 0)
    const cuentasCriticas = todasLasCuentas.filter(c => c.estado === "critico" || c.estado === "castigado")
    
    const totalCartera = todasLasCuentas.reduce((sum, c) => sum + c.saldoActual, 0)
    const totalMora = todasLasCuentas.reduce((sum, c) => sum + c.saldoMora, 0)
    
    const gestoresActivos = gestores.filter(g => g.rol === "gestor" && g.activo)
    const efectividadPromedio = gestoresActivos.length > 0
      ? gestoresActivos.reduce((sum, g) => sum + g.efectividad, 0) / gestoresActivos.length
      : 0
    
    const totalRecuperado = gestoresActivos.reduce((sum, g) => sum + g.recuperadoMes, 0)
    const totalMeta = gestoresActivos.reduce((sum, g) => sum + g.metaMensual, 0)
    const tasaRecuperacion = totalMeta > 0 ? (totalRecuperado / totalMeta) * 100 : 0
    
    // Contar promesas cumplidas
    let promesasCumplidas = 0
    let totalPromesas = 0
    todasLasCuentas.forEach(cuenta => {
      cuenta.historialGestiones.forEach(g => {
        if (g.promesaPago) {
          totalPromesas++
          if (g.promesaPago.cumplida) promesasCumplidas++
        }
      })
    })
    
    // Gestiones de hoy (simuladas)
    const gestionesHoy = Math.floor(Math.random() * 20) + 15
    
    return {
      totalCartera,
      totalMora,
      cuentasEnMora: cuentasEnMora.length,
      cuentasCriticas: cuentasCriticas.length,
      tasaRecuperacion,
      efectividadPromedio,
      promesasCumplidas: totalPromesas > 0 ? Math.round((promesasCumplidas / totalPromesas) * 100) : 0,
      gestionesHoy
    }
  }, [clientes, gestores])

  // Filtered data
  const obtenerCuentasFiltradas = useCallback(() => {
    const resultado: { cliente: Cliente; cuenta: Cuenta }[] = []
    
    clientes.forEach(cliente => {
      cliente.cuentas.forEach(cuenta => {
        // Busqueda
        if (filtrosCartera.busqueda) {
          const busqueda = filtrosCartera.busqueda.toLowerCase()
          const coincide = 
            cliente.nombre.toLowerCase().includes(busqueda) ||
            cliente.apellido.toLowerCase().includes(busqueda) ||
            cliente.cedula.includes(busqueda) ||
            cuenta.numeroCredito.toLowerCase().includes(busqueda)
          if (!coincide) return
        }
        
        // Estado
        if (filtrosCartera.estado !== "todos" && cuenta.estado !== filtrosCartera.estado) return
        
        // Tipo producto
        if (filtrosCartera.tipoProducto !== "todos" && cuenta.tipoProducto !== filtrosCartera.tipoProducto) return
        
        // Gestor
        if (filtrosCartera.gestor !== "todos" && cuenta.gestorAsignado !== filtrosCartera.gestor) return
        
        // Días mora
        if (filtrosCartera.diasMoraMin !== null && cuenta.diasMora < filtrosCartera.diasMoraMin) return
        if (filtrosCartera.diasMoraMax !== null && cuenta.diasMora > filtrosCartera.diasMoraMax) return
        
        // Monto
        if (filtrosCartera.montoMin !== null && cuenta.saldoMora < filtrosCartera.montoMin) return
        if (filtrosCartera.montoMax !== null && cuenta.saldoMora > filtrosCartera.montoMax) return
        
        resultado.push({ cliente, cuenta })
      })
    })
    
    // Ordenar por días de mora descendente
    return resultado.sort((a, b) => b.cuenta.diasMora - a.cuenta.diasMora)
  }, [clientes, filtrosCartera])

  const obtenerClientesFiltrados = useCallback((busqueda: string) => {
    if (!busqueda) return clientes
    
    const busquedaLower = busqueda.toLowerCase()
    return clientes.filter(c => 
      c.nombre.toLowerCase().includes(busquedaLower) ||
      c.apellido.toLowerCase().includes(busquedaLower) ||
      c.cedula.includes(busqueda) ||
      c.email.toLowerCase().includes(busquedaLower)
    )
  }, [clientes])

  return (
    <AppContext.Provider value={{
      clientes,
      gestores,
      alertas,
      notificaciones,
      filtrosCartera,
      setFiltrosCartera,
      agregarCliente,
      actualizarCliente,
      eliminarCliente,
      obtenerCliente,
      agregarCuenta,
      actualizarCuenta,
      eliminarCuenta,
      obtenerCuenta,
      agregarGestion,
      marcarAlertaLeida,
      eliminarAlerta,
      agregarAlerta,
      mostrarNotificacion,
      cerrarNotificacion,
      asignarGestor,
      calcularKPIs,
      obtenerCuentasFiltradas,
      obtenerClientesFiltrados
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}
