"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
  Phone,
  MessageSquare,
  Mail,
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
  User,
  TrendingUp,
  Filter,
  ChevronRight,
} from "lucide-react"
import { AppLayout } from "@/components/app-layout"
import { Topbar } from "@/components/topbar"
import { StatusBadge } from "@/components/status-badge"
import { useApp } from "@/lib/app-context"
import { Gestion, CanalContacto, ResultadoGestion } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

const canalLabels: Record<CanalContacto, string> = {
  telefono: "Teléfono",
  sms: "SMS",
  email: "Email",
  whatsapp: "WhatsApp",
  visita: "Visita",
  carta: "Carta"
}

const resultadoLabels: Record<ResultadoGestion, string> = {
  contacto_efectivo: "Contacto Efectivo",
  no_contesta: "No Contesta",
  numero_errado: "Número Errado",
  buzon: "Buzón",
  promesa_pago: "Promesa de Pago",
  negativa: "Negativa",
  acuerdo: "Acuerdo",
  pago_realizado: "Pago Realizado"
}

const canalIcons: Record<CanalContacto, React.ReactNode> = {
  telefono: <Phone className="h-4 w-4" />,
  sms: <MessageSquare className="h-4 w-4" />,
  email: <Mail className="h-4 w-4" />,
  whatsapp: <MessageSquare className="h-4 w-4" />,
  visita: <User className="h-4 w-4" />,
  carta: <Mail className="h-4 w-4" />
}

export default function GestionesDiaPage() {
  const router = useRouter()
  const { clientes, gestores } = useApp()
  const [filtroCanal, setFiltroCanal] = useState<string>("todos")
  const [filtroResultado, setFiltroResultado] = useState<string>("todos")
  const [filtroGestor, setFiltroGestor] = useState<string>("todos")

  const hoy = new Date().toISOString().split("T")[0]

  // Obtener todas las gestiones del día
  const gestionesDelDia = useMemo(() => {
    const gestiones: Array<{
      gestion: Gestion
      clienteId: string
      clienteNombre: string
      cuentaId: string
      numeroCredito: string
      saldoMora: number
    }> = []

    clientes.forEach(cliente => {
      cliente.cuentas.forEach(cuenta => {
        cuenta.historialGestiones.forEach(gestion => {
          if (gestion.fecha === hoy) {
            gestiones.push({
              gestion,
              clienteId: cliente.id,
              clienteNombre: `${cliente.nombre} ${cliente.apellido}`,
              cuentaId: cuenta.id,
              numeroCredito: cuenta.numeroCredito,
              saldoMora: cuenta.saldoMora
            })
          }
        })
      })
    })

    // Ordenar por hora (más reciente primero)
    return gestiones.sort((a, b) => b.gestion.hora.localeCompare(a.gestion.hora))
  }, [clientes, hoy])

  // Aplicar filtros
  const gestionesFiltradas = useMemo(() => {
    return gestionesDelDia.filter(item => {
      if (filtroCanal !== "todos" && item.gestion.canal !== filtroCanal) return false
      if (filtroResultado !== "todos" && item.gestion.resultado !== filtroResultado) return false
      if (filtroGestor !== "todos" && item.gestion.gestorId !== filtroGestor) return false
      return true
    })
  }, [gestionesDelDia, filtroCanal, filtroResultado, filtroGestor])

  // Estadísticas del día
  const estadisticasDia = useMemo(() => {
    const total = gestionesDelDia.length
    const efectivas = gestionesDelDia.filter(g => 
      g.gestion.resultado === "contacto_efectivo" || 
      g.gestion.resultado === "promesa_pago" ||
      g.gestion.resultado === "acuerdo" ||
      g.gestion.resultado === "pago_realizado"
    ).length
    const promesas = gestionesDelDia.filter(g => g.gestion.resultado === "promesa_pago").length
    const montoPromesas = gestionesDelDia
      .filter(g => g.gestion.promesaPago)
      .reduce((sum, g) => sum + (g.gestion.promesaPago?.monto || 0), 0)
    
    return { total, efectivas, promesas, montoPromesas }
  }, [gestionesDelDia])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const getResultadoColor = (resultado: ResultadoGestion) => {
    switch (resultado) {
      case "contacto_efectivo":
      case "pago_realizado":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
      case "promesa_pago":
      case "acuerdo":
        return "bg-blue-500/10 text-blue-500 border-blue-500/30"
      case "no_contesta":
      case "buzon":
        return "bg-amber-500/10 text-amber-500 border-amber-500/30"
      case "numero_errado":
      case "negativa":
        return "bg-red-500/10 text-red-500 border-red-500/30"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <AppLayout>
      <Topbar
        title="Gestiones del Día"
        breadcrumbs={[
          { label: "Inicio", href: "/" },
          { label: "Operación" },
          { label: "Gestiones del Día" }
        ]}
        showCreate={false}
      />

      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Gestiones</p>
                  <p className="text-2xl font-bold">{estadisticasDia.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Contactos Efectivos</p>
                  <p className="text-2xl font-bold">{estadisticasDia.efectivas}</p>
                  <p className="text-xs text-muted-foreground">
                    {estadisticasDia.total > 0 
                      ? Math.round((estadisticasDia.efectivas / estadisticasDia.total) * 100)
                      : 0}% efectividad
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Promesas de Pago</p>
                  <p className="text-2xl font-bold">{estadisticasDia.promesas}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Monto Promesas</p>
                  <p className="text-lg font-bold">{formatCurrency(estadisticasDia.montoPromesas)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filtros:</span>
          </div>

          <Select value={filtroCanal} onValueChange={setFiltroCanal}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Canal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los canales</SelectItem>
              {Object.entries(canalLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filtroResultado} onValueChange={setFiltroResultado}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Resultado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              {Object.entries(resultadoLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filtroGestor} onValueChange={setFiltroGestor}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Gestor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              {gestores.filter(g => g.rol === "gestor").map(g => (
                <SelectItem key={g.id} value={g.id}>{g.nombre}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {(filtroCanal !== "todos" || filtroResultado !== "todos" || filtroGestor !== "todos") && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                setFiltroCanal("todos")
                setFiltroResultado("todos")
                setFiltroGestor("todos")
              }}
            >
              Limpiar filtros
            </Button>
          )}

          <span className="text-sm text-muted-foreground ml-auto">
            {gestionesFiltradas.length} gestiones
          </span>
        </div>

        {/* Timeline */}
        <Card className="bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Línea de Tiempo - {new Date().toLocaleDateString("es-CO", { weekday: 'long', day: 'numeric', month: 'long' })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px] pr-4">
              {gestionesFiltradas.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                    <Calendar className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">No hay gestiones registradas hoy</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => router.push("/operacion/cartera")}
                  >
                    Ir a Cartera
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {gestionesFiltradas.map((item, index) => (
                    <div
                      key={item.gestion.id}
                      className="relative pl-8 pb-4"
                    >
                      {/* Timeline line */}
                      {index < gestionesFiltradas.length - 1 && (
                        <div className="absolute left-3 top-6 bottom-0 w-px bg-border" />
                      )}
                      
                      {/* Timeline dot */}
                      <div className={cn(
                        "absolute left-0 top-1 h-6 w-6 rounded-full flex items-center justify-center",
                        item.gestion.resultado === "contacto_efectivo" || item.gestion.resultado === "pago_realizado"
                          ? "bg-emerald-500"
                          : item.gestion.resultado === "promesa_pago" || item.gestion.resultado === "acuerdo"
                          ? "bg-blue-500"
                          : "bg-muted"
                      )}>
                        {canalIcons[item.gestion.canal]}
                      </div>

                      {/* Content */}
                      <button
                        onClick={() => router.push(`/operacion/cartera?cuenta=${item.cuentaId}`)}
                        className="w-full p-4 rounded-lg border border-border bg-card hover:bg-muted/50 transition-all text-left"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium">{item.clienteNombre}</p>
                            <p className="text-sm text-muted-foreground font-mono">{item.numeroCredito}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{canalLabels[item.gestion.canal]}</Badge>
                            <Badge className={cn("border", getResultadoColor(item.gestion.resultado))}>
                              {resultadoLabels[item.gestion.resultado]}
                            </Badge>
                            <span className="text-sm text-muted-foreground">{item.gestion.hora}</span>
                          </div>
                        </div>

                        <p className="text-sm mb-2">{item.gestion.observaciones}</p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Saldo Mora: <span className="text-destructive font-medium">{formatCurrency(item.saldoMora)}</span></span>
                            {item.gestion.promesaPago && (
                              <span>
                                Promesa: <span className="text-blue-500 font-medium">
                                  {formatCurrency(item.gestion.promesaPago.monto)} para {item.gestion.promesaPago.fecha}
                                </span>
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <User className="h-3 w-3" />
                            {item.gestion.gestorNombre}
                            <ChevronRight className="h-4 w-4" />
                          </div>
                        </div>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Quick Stats by Channel */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          {Object.entries(canalLabels).map(([canal, label]) => {
            const count = gestionesDelDia.filter(g => g.gestion.canal === canal).length
            return (
              <Card 
                key={canal}
                className={cn(
                  "bg-card cursor-pointer transition-all hover:border-primary/50",
                  filtroCanal === canal && "border-primary"
                )}
                onClick={() => setFiltroCanal(filtroCanal === canal ? "todos" : canal)}
              >
                <CardContent className="p-3 text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    {canalIcons[canal as CanalContacto]}
                    <span className="text-sm font-medium">{label}</span>
                  </div>
                  <p className="text-xl font-bold">{count}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </AppLayout>
  )
}
