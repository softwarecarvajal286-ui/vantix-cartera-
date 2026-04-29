"use client"

import dynamic from "next/dynamic"
import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { AppLayout } from "@/components/app-layout"
import { Topbar } from "@/components/topbar"
import { KpiCard } from "@/components/kpi-card"
import { useApp } from "@/lib/app-context"
import { useAuth } from "@/lib/auth-context"
import { brand } from "@/lib/brand"
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCheck,
  Clock3,
  CreditCard,
  Flame,
  FileText,
  Filter,
  Gauge,
  Handshake,
  Info,
  MessageSquareText,
  PhoneCall,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UserCircle,
  Users,
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

const DashboardCharts = dynamic(
  () => import("@/components/dashboard-charts").then((mod) => mod.DashboardCharts),
  {
    ssr: false,
    loading: () => <DashboardChartsFallback />,
  }
)

function DashboardChartsFallback() {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
      <div className="glass-panel rounded-[30px] p-5 sm:p-6 xl:col-span-3">
        <div className="mb-4 h-5 w-40 animate-pulse rounded bg-slate-200/70 dark:bg-white/10" />
        <div className="h-[240px] animate-pulse rounded-[24px] bg-slate-200/55 dark:bg-white/5" />
      </div>
      <div className="glass-panel rounded-[30px] p-5 sm:p-6 xl:col-span-2">
        <div className="mb-4 h-5 w-32 animate-pulse rounded bg-slate-200/70 dark:bg-white/10" />
        <div className="h-[240px] animate-pulse rounded-[24px] bg-slate-200/55 dark:bg-white/5" />
      </div>
    </div>
  )
}

function normalizeText(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
}

function toTimestamp(date?: string, hour?: string) {
  if (!date) return 0
  const value = hour ? `${date}T${hour}:00` : `${date}T00:00:00`
  return new Date(value).getTime()
}

const USER_PORTRAIT_SRC =
  "https://images.pexels.com/photos/10532718/pexels-photo-10532718.jpeg?cs=srgb&dl=pexels-lombejr-10532718.jpg&fm=jpg"

export default function DashboardPage() {
  const router = useRouter()
  const { user, selectedFinanciera } = useAuth()
  const { clientes, gestores, calcularKPIs, mostrarNotificacion } = useApp()
  const [filtroGestor, setFiltroGestor] = useState("todos")
  const [filtroFinanciera, setFiltroFinanciera] = useState("todos")
  const [filtroPeriodo, setFiltroPeriodo] = useState("hoy")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedEstados, setSelectedEstados] = useState<string[]>(["todos"])

  const kpis = useMemo(() => calcularKPIs(), [calcularKPIs])
  const normalizedRole = normalizeText(user?.role ?? "")

  const allPortfolio = useMemo(
    () => clientes.flatMap((cliente) => cliente.cuentas.map((cuenta) => ({ cliente, cuenta }))),
    [clientes]
  )

  const linkedGestor = useMemo(() => {
    if (!user) return null

    const firstName = normalizeText(user.name.split(" ")[0] ?? "")
    const email = normalizeText(user.email)

    if (normalizedRole === "gestor") {
      return (
        gestores.find((gestor) => normalizeText(gestor.email) === email) ||
        gestores.find((gestor) => normalizeText(gestor.nombre).includes(firstName)) ||
        gestores.find((gestor) => gestor.rol === "gestor") ||
        null
      )
    }

    if (normalizedRole === "lider") {
      return gestores.find((gestor) => gestor.rol === "supervisor") || null
    }

    if (normalizedRole === "admin") {
      return gestores.find((gestor) => gestor.rol === "admin") || null
    }

    return gestores.find((gestor) => normalizeText(gestor.nombre).includes(firstName)) || null
  }, [gestores, normalizedRole, user])

  const visiblePortfolio = useMemo(() => {
    if (!user) return allPortfolio

    if (normalizedRole === "admin") return allPortfolio

    if (normalizedRole === "lider") {
      return allPortfolio.filter(
        ({ cuenta }) =>
          cuenta.diasMora >= 30 || cuenta.estado === "critico" || cuenta.estado === "castigado"
      )
    }

    if (normalizedRole === "gestor" && linkedGestor) {
      return allPortfolio.filter(({ cuenta }) => cuenta.gestorAsignado === linkedGestor.id)
    }

    if (normalizedRole === "vendedor") {
      return allPortfolio.filter(({ cliente, cuenta }) => {
        return cliente.segmento !== "basico" || cuenta.estado === "al_dia" || cuenta.diasMora < 45
      })
    }

    return allPortfolio
  }, [allPortfolio, linkedGestor, normalizedRole, user])

  const userGestiones = useMemo(() => {
    return visiblePortfolio
      .flatMap(({ cliente, cuenta }) =>
        cuenta.historialGestiones.map((gestion) => ({
          cliente,
          cuenta,
          gestion,
        }))
      )
      .sort((a, b) => toTimestamp(b.gestion.fecha, b.gestion.hora) - toTimestamp(a.gestion.fecha, a.gestion.hora))
  }, [visiblePortfolio])

  const recentGestiones = userGestiones.slice(0, 4)

  const nextActions = useMemo(() => {
    return visiblePortfolio
      .filter(({ cuenta }) => Boolean(cuenta.proximaGestion))
      .sort((a, b) => toTimestamp(a.cuenta.proximaGestion) - toTimestamp(b.cuenta.proximaGestion))
      .slice(0, 3)
  }, [visiblePortfolio])

  const userStats = useMemo(() => {
    const totalClientes = new Set(visiblePortfolio.map(({ cliente }) => cliente.id)).size
    const totalCarteraVisible = visiblePortfolio.reduce((sum, item) => sum + item.cuenta.saldoActual, 0)
    const totalMoraVisible = visiblePortfolio.reduce((sum, item) => sum + item.cuenta.saldoMora, 0)
    const casosCriticos = visiblePortfolio.filter(
      ({ cuenta }) => cuenta.estado === "critico" || cuenta.estado === "castigado"
    ).length
    const promesasActivas = userGestiones.filter(
      ({ gestion }) => gestion.promesaPago && !gestion.promesaPago.cumplida
    ).length
    const nextActionCount = visiblePortfolio.filter(({ cuenta }) => Boolean(cuenta.proximaGestion)).length

    return {
      totalClientes,
      totalCarteraVisible,
      totalMoraVisible,
      casosCriticos,
      promesasActivas,
      nextActionCount,
    }
  }, [userGestiones, visiblePortfolio])

  const profileSummary = useMemo(() => {
    if (!user) {
      return {
        roleLabel: "Operador",
        headline: "Tu operacion central en una sola vista.",
        description: brand.slogan,
      }
    }

    if (normalizedRole === "admin") {
      return {
        roleLabel: "Vision ejecutiva",
        headline: "Gobierna la operacion completa con foco en metas y riesgo.",
        description:
          "Supervisa cartera, equipos y resultados desde una portada pensada para priorizar decisiones y oportunidades.",
      }
    }

    if (normalizedRole === "lider") {
      return {
        roleLabel: "Lider de operacion",
        headline: "Tus frentes criticos y el rendimiento del equipo, primero.",
        description:
          "Accede a la lectura diaria del negocio, identifica cuellos de botella y acompana la recuperacion con contexto claro.",
      }
    }

    if (normalizedRole === "gestor") {
      return {
        roleLabel: "Gestor activo",
        headline: "Tu agenda, tus clientes y tus gestiones listos para ejecutar.",
        description:
          "Todo tu frente de trabajo organizado alrededor de tu rendimiento, los casos urgentes y las siguientes acciones.",
      }
    }

    return {
      roleLabel: "Vista comercial",
      headline: "Seguimiento comercial con visibilidad de cartera y recuperacion.",
      description:
        "Prioriza clientes, revisa actividad reciente y detecta oportunidades de avance sin salir de tu inicio personal.",
    }
  }, [normalizedRole, user])

  const distribucionCartera = useMemo(() => {
    const todas = clientes.flatMap((cliente) => cliente.cuentas)
    const alDia = todas.filter((cuenta) => cuenta.diasMora === 0).length
    const mora1_30 = todas.filter((cuenta) => cuenta.diasMora > 0 && cuenta.diasMora <= 30).length
    const mora31_60 = todas.filter((cuenta) => cuenta.diasMora > 30 && cuenta.diasMora <= 60).length
    const mora61_90 = todas.filter((cuenta) => cuenta.diasMora > 60 && cuenta.diasMora <= 90).length
    const mora90plus = todas.filter((cuenta) => cuenta.diasMora > 90).length

    return [
      { name: "Al dia", value: alDia },
      { name: "1-30 dias", value: mora1_30 },
      { name: "31-60 dias", value: mora31_60 },
      { name: "61-90 dias", value: mora61_90 },
      { name: "+90 dias", value: mora90plus },
    ]
  }, [clientes])

  const rendimientoGestores = useMemo(() => {
    return gestores
      .filter((gestor) => gestor.rol === "gestor")
      .sort((a, b) => b.efectividad - a.efectividad)
      .slice(0, 4)
      .map((gestor) => ({
        name: gestor.nombre.split(" ")[0],
        value: gestor.efectividad,
      }))
  }, [gestores])

  const recaudoData = [
    { name: "Lun", value: 1200000, meta: 1000000 },
    { name: "Mar", value: 1100000, meta: 1000000 },
    { name: "Mie", value: 900000, meta: 1000000 },
    { name: "Jue", value: 1300000, meta: 1000000 },
    { name: "Vie", value: 1600000, meta: 1000000 },
    { name: "Sab", value: 1750000, meta: 1000000 },
    { name: "Dom", value: 1400000, meta: 1000000 },
  ]

  const commandStats = [
    { label: "Recuperacion", value: `${kpis.tasaRecuperacion.toFixed(1)}%` },
    { label: "Promesas", value: `${kpis.promesasCumplidas}%` },
    { label: "Gestiones", value: `${kpis.gestionesHoy}` },
  ]

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
      mostrarNotificacion({
        tipo: "success",
        titulo: "Datos actualizados",
        mensaje: "Los indicadores clave fueron sincronizados.",
      })
    }, 250)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const gestorColors = ["bg-[#ff5d52]", "bg-amber-500", "bg-slate-900 dark:bg-slate-200", "bg-sky-500"]

  return (
    <AuthGuard>
      <AppLayout>
        <Topbar
          title="Inicio"
          breadcrumbs={[{ label: "Inicio" }, { label: user?.name ?? brand.name }]}
          showCreate={false}
        />

        <div className="space-y-5">
          <section className="glass-panel relative overflow-hidden rounded-[36px] p-5 sm:p-6 xl:p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(255,93,82,0.08),transparent_22%)]" />
            <div className="relative z-10 grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_340px_minmax(0,0.94fr)] xl:items-center">
              <div className="space-y-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-white/56">
                    <Sparkles className="h-3.5 w-3.5 text-[#ff5d52]" />
                    {profileSummary.roleLabel}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-white/56">
                    {linkedGestor?.activo ? <BadgeCheck className="h-3.5 w-3.5 text-emerald-500" /> : <ShieldAlert className="h-3.5 w-3.5 text-[#ff5d52]" />}
                    {linkedGestor?.activo ? "Operacion activa" : "Vista central"}
                  </span>
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Hola, {user?.name?.split(" ")[0] ?? "equipo"}
                  </p>
                  <h2 className="mt-3 max-w-3xl text-balance text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl xl:text-[3.35rem] xl:leading-[1.02]">
                    {profileSummary.headline}
                  </h2>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-400">
                    {profileSummary.description}
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <UserSignalTile
                    icon={BriefcaseBusiness}
                    label="Clientes visibles"
                    value={userStats.totalClientes.toString()}
                    detail="Frente activo"
                  />
                  <UserSignalTile
                    icon={CreditCard}
                    label="Cartera visible"
                    value={formatCurrency(userStats.totalCarteraVisible)}
                    detail="Saldo administrado"
                  />
                  <UserSignalTile
                    icon={Flame}
                    label="Gestiones en foco"
                    value={userStats.nextActionCount.toString()}
                    detail="Siguientes acciones"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    className="h-11 rounded-2xl border border-[#ff7b71] bg-[linear-gradient(135deg,#ff5d52,#ff7d57)] text-white shadow-[0_18px_34px_rgba(255,95,82,0.24)] hover:brightness-105"
                    onClick={() => router.push("/operacion/cartera")}
                  >
                    Abrir cartera
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="h-11 rounded-2xl border-slate-200/70 bg-[rgba(232,238,245,0.82)] text-slate-700 hover:bg-[rgba(238,243,248,0.94)] hover:text-slate-950 dark:border-white/14 dark:bg-white/[0.08] dark:text-slate-100 dark:hover:bg-white/[0.12]"
                    onClick={() => router.push("/cobranza/gestiones")}
                  >
                    Ver mis gestiones
                    <MessageSquareText className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="relative mx-auto w-full max-w-[320px]">
                <div className="absolute -left-5 top-10 hidden h-28 w-28 rounded-full bg-[#ff5d52]/14 blur-3xl lg:block" />
                <div className="absolute -right-4 bottom-10 hidden h-28 w-28 rounded-full bg-sky-400/10 blur-3xl lg:block" />
                <div className="relative aspect-[4/5] overflow-hidden rounded-[34px] border border-white/16 bg-[linear-gradient(180deg,rgba(14,20,31,0.18),rgba(14,20,31,0.56))] shadow-[0_30px_70px_rgba(15,23,42,0.22)]">
                  <img
                    src={USER_PORTRAIT_SRC}
                    alt={user?.name ?? "Usuario Vantyx"}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.08),rgba(15,23,42,0.58))]" />
                  <div className="absolute left-4 right-4 top-4 flex items-center justify-between">
                    <span className="rounded-full border border-white/20 bg-black/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-md">
                      {brand.shortName} profile
                    </span>
                    <span className="rounded-full border border-white/20 bg-white/14 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-md">
                      {user?.role ?? "Operador"}
                    </span>
                  </div>
                  <div className="absolute inset-x-4 bottom-4 rounded-[24px] border border-white/18 bg-black/28 p-4 text-white shadow-[0_18px_42px_rgba(15,23,42,0.28)] backdrop-blur-xl">
                    <p className="text-lg font-semibold">{user?.name ?? brand.name}</p>
                    <p className="mt-1 text-sm text-white/72">{user?.email ?? brand.slogan}</p>
                    <div className="mt-3 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.14em] text-white/62">
                      <span className="rounded-full border border-white/12 bg-white/10 px-2.5 py-1">
                        {linkedGestor?.rol ?? user?.role ?? "Operador"}
                      </span>
                      <span className="rounded-full border border-white/12 bg-white/10 px-2.5 py-1">
                        {selectedFinanciera?.nombre ?? user?.financiera?.nombre ?? "Vista global"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <UserMetricCard
                  title="Rendimiento del mes"
                  value={`${linkedGestor?.efectividad ?? Math.round(kpis.efectividadPromedio)}%`}
                  detail="Efectividad operativa"
                  accent="success"
                />
                <UserMetricCard
                  title="Recuperado"
                  value={formatCurrency(linkedGestor?.recuperadoMes ?? userStats.totalMoraVisible)}
                  detail={linkedGestor ? `Meta ${formatCurrency(linkedGestor.metaMensual)}` : "Recuperacion visible"}
                  accent="primary"
                />
                <UserMetricCard
                  title="Casos criticos"
                  value={userStats.casosCriticos.toString()}
                  detail={`${userStats.promesasActivas} promesas activas`}
                  accent="warning"
                />
              </div>
            </div>

            <div className="relative z-10 mt-6 grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
              <div className="mirror-tile rounded-[28px] p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-950 dark:text-white">Actividad reciente</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Ultimas gestiones y conversaciones visibles para tu rol.
                    </p>
                  </div>
                  <Activity className="h-4 w-4 text-[#ff5d52]" />
                </div>

                <div className="mt-4 space-y-3">
                  {recentGestiones.map(({ cliente, cuenta, gestion }) => (
                    <ActivityFeedItem
                      key={gestion.id}
                      clientName={`${cliente.nombre} ${cliente.apellido}`}
                      account={cuenta.numeroCredito}
                      channel={gestion.canal}
                      outcome={gestion.resultado}
                      date={gestion.fecha}
                    />
                  ))}
                </div>
              </div>

              <div className="mirror-tile rounded-[28px] p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-950 dark:text-white">Siguiente foco</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Casos y acciones para priorizar desde el arranque.
                    </p>
                  </div>
                  <CheckCheck className="h-4 w-4 text-emerald-500" />
                </div>

                <div className="mt-4 space-y-3">
                  {nextActions.map(({ cliente, cuenta }) => (
                    <PriorityFocusItem
                      key={cuenta.id}
                      clientName={`${cliente.nombre} ${cliente.apellido}`}
                      actionDate={cuenta.proximaGestion ?? cuenta.ultimaGestion ?? "Sin fecha"}
                      amount={formatCurrency(cuenta.saldoMora)}
                      riskLabel={`${cuenta.diasMora} dias de mora`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>

          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0 space-y-5">
            <section className="grid gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(280px,0.75fr)]">
              <div className="glass-panel rounded-[32px] p-5 sm:p-6">
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="max-w-2xl">
                      <span className="inline-flex rounded-full border border-white/12 bg-white/8 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-white/46">
                        panel operativo
                      </span>
                      <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                        Contexto general del negocio y lectura tactica del dia.
                      </h2>
                      <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500 dark:text-slate-400">
                        Manten a la mano la fotografia completa de cartera, recuperacion,
                        rendimiento y seguimiento para complementar tu vista personal de inicio.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        variant="outline"
                        className="h-11 rounded-2xl border-slate-200/70 bg-[rgba(232,238,245,0.82)] text-slate-700 hover:bg-[rgba(238,243,248,0.94)] hover:text-slate-950 dark:border-white/14 dark:bg-white/[0.08] dark:text-slate-100 dark:hover:bg-white/[0.12]"
                      >
                        <RefreshCw className={cn("mr-2 h-4 w-4", isRefreshing && "animate-spin")} />
                        Actualizar
                      </Button>

                      <Drawer>
                        <DrawerTrigger asChild>
                          <Button
                            variant="outline"
                            className="h-11 rounded-2xl border-slate-200/70 bg-[rgba(232,238,245,0.82)] text-slate-700 hover:bg-[rgba(238,243,248,0.94)] hover:text-slate-950 dark:border-white/14 dark:bg-white/[0.08] dark:text-slate-100 dark:hover:bg-white/[0.12] xl:hidden"
                          >
                            <Filter className="mr-2 h-4 w-4" />
                            Filtros
                          </Button>
                        </DrawerTrigger>
                        <DrawerContent className="border-white/70 bg-white/96 dark:border-white/10 dark:bg-[#0d131e]">
                          <DrawerHeader>
                            <DrawerTitle>Filtros del dashboard</DrawerTitle>
                            <DrawerDescription>
                              Ajusta el periodo, financiera, gestor y estado de cuenta.
                            </DrawerDescription>
                          </DrawerHeader>
                          <div className="px-4 pb-5">
                            <DashboardFiltersPanel
                              filtroGestor={filtroGestor}
                              setFiltroGestor={setFiltroGestor}
                              filtroFinanciera={filtroFinanciera}
                              setFiltroFinanciera={setFiltroFinanciera}
                              filtroPeriodo={filtroPeriodo}
                              setFiltroPeriodo={setFiltroPeriodo}
                              selectedEstados={selectedEstados}
                              setSelectedEstados={setSelectedEstados}
                              gestores={gestores}
                              rendimientoGestores={rendimientoGestores}
                              gestorColors={gestorColors}
                            />
                          </div>
                        </DrawerContent>
                      </Drawer>

                      <Button
                        className="h-11 rounded-2xl border border-[#ff7b71] bg-[linear-gradient(135deg,#ff5d52,#ff7d57)] text-white shadow-[0_18px_34px_rgba(255,95,82,0.24)] hover:brightness-105"
                        onClick={() => router.push("/operacion/cartera")}
                      >
                        Ver cartera
                        <ArrowUpRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    {commandStats.map((stat) => (
                      <div
                        key={stat.label}
                        className="mirror-tile rounded-[24px] px-4 py-4 backdrop-blur-xl"
                      >
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-white/46">
                          {stat.label}
                        </p>
                        <p className="mt-3 text-2xl font-semibold text-slate-950 dark:text-white">
                          {stat.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="glass-panel rounded-[32px] p-5 sm:p-6">
                <div className="flex items-center gap-2">
                  <span className="rounded-full border border-white/12 bg-white/8 p-2 text-[#ff5d52]">
                    <Gauge className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-950 dark:text-white">
                      Pulso operativo
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Resumen tactico del dia
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  <SignalRow
                    title="Cartera activa"
                    value={formatCurrency(kpis.totalCartera)}
                    detail="Volumen consolidado"
                    accent="red"
                  />
                  <SignalRow
                    title="Casos criticos"
                    value={`${kpis.cuentasCriticas}`}
                    detail="Seguimiento prioritario"
                    accent="dark"
                  />
                  <SignalRow
                    title="Top gestor"
                    value={rendimientoGestores[0]?.name ?? "N/A"}
                    detail={`${rendimientoGestores[0]?.value ?? 0}% efectividad`}
                    accent="green"
                  />
                </div>
              </div>
            </section>

            <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
              <KpiCard
                title="Total cartera"
                value={formatCurrency(kpis.totalCartera)}
                change={2.5}
                changeLabel="vs mes anterior"
                icon={FileText}
                variant="primary"
                size="large"
                onClick={() => router.push("/operacion/cartera")}
              />
              <KpiCard
                title="En mora"
                value={formatCurrency(kpis.totalMora)}
                change={-3.1}
                changeLabel="vs mes anterior"
                icon={AlertTriangle}
                variant="danger"
                size="large"
                onClick={() => router.push("/operacion/cartera?estado=mora")}
              />
              <KpiCard
                title="Recuperacion"
                value={`${kpis.tasaRecuperacion.toFixed(1)}%`}
                change={5.2}
                changeLabel="vs mes anterior"
                icon={TrendingUp}
                variant="success"
                size="large"
              />
              <KpiCard
                title="Gestiones hoy"
                value={kpis.gestionesHoy.toString()}
                change={12}
                changeLabel="vs ayer"
                icon={PhoneCall}
                variant="warning"
                size="large"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
              <KpiCard
                title="Cuentas en mora"
                value={kpis.cuentasEnMora.toString()}
                change={-5}
                changeLabel="vs semana anterior"
                icon={Users}
                variant="default"
                onClick={() => router.push("/operacion/cartera")}
              />
              <div className="relative">
                <KpiCard
                  title="Casos criticos"
                  value={kpis.cuentasCriticas.toString()}
                  change={-2}
                  changeLabel="vs ayer"
                  icon={Info}
                  variant="secondary"
                  onClick={() => router.push("/operacion/cartera?estado=critico")}
                />
                <button className="absolute right-4 top-4 rounded-full border border-white/10 bg-white/60 p-1.5 shadow-sm hover:bg-white/80 dark:bg-white/[0.04] dark:hover:bg-white/[0.08]">
                  <Info className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                </button>
              </div>
              <KpiCard
                title="Efectividad"
                value={`${kpis.efectividadPromedio.toFixed(0)}%`}
                change={3.8}
                changeLabel="vs semana anterior"
                icon={Handshake}
                variant="teal"
              />
              <KpiCard
                title="Promesas"
                value={`${kpis.promesasCumplidas}%`}
                change={8}
                changeLabel="vs mes anterior"
                icon={Clock3}
                variant="purple"
              />
            </div>

            <DashboardCharts
              recaudoData={recaudoData}
              distribucionCartera={distribucionCartera}
            />
          </div>

          <aside className="hidden xl:block">
            <DashboardFiltersPanel
              className="sticky top-4"
              filtroGestor={filtroGestor}
              setFiltroGestor={setFiltroGestor}
              filtroFinanciera={filtroFinanciera}
              setFiltroFinanciera={setFiltroFinanciera}
              filtroPeriodo={filtroPeriodo}
              setFiltroPeriodo={setFiltroPeriodo}
              selectedEstados={selectedEstados}
              setSelectedEstados={setSelectedEstados}
              gestores={gestores}
              rendimientoGestores={rendimientoGestores}
              gestorColors={gestorColors}
            />
          </aside>
        </div>
        </div>
      </AppLayout>
    </AuthGuard>
  )
}

function UserSignalTile({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: React.ElementType
  label: string
  value: string
  detail: string
}) {
  return (
    <div className="mirror-tile rounded-[24px] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            {label}
          </p>
          <p className="mt-3 text-xl font-semibold text-slate-950 dark:text-white">{value}</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{detail}</p>
        </div>
        <span className="rounded-2xl border border-white/12 bg-white/12 p-2.5 text-[#ff5d52]">
          <Icon className="h-4 w-4" />
        </span>
      </div>
    </div>
  )
}

function UserMetricCard({
  title,
  value,
  detail,
  accent,
}: {
  title: string
  value: string
  detail: string
  accent: "primary" | "success" | "warning"
}) {
  const accentClass =
    accent === "success"
      ? "from-emerald-400/14 to-emerald-100/4"
      : accent === "warning"
        ? "from-amber-400/14 to-amber-100/4"
        : "from-[#ff5d52]/16 to-[#ffb4ad]/6"

  return (
    <div className="mirror-tile relative overflow-hidden rounded-[26px] p-5">
      <div className={cn("absolute inset-x-0 top-0 h-1 bg-gradient-to-r", accentClass)} />
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{title}</p>
      <p className="mt-4 text-2xl font-semibold text-slate-950 dark:text-white">{value}</p>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{detail}</p>
    </div>
  )
}

function ActivityFeedItem({
  clientName,
  account,
  channel,
  outcome,
  date,
}: {
  clientName: string
  account: string
  channel: string
  outcome: string
  date: string
}) {
  return (
    <div className="mirror-tile-soft flex items-start gap-3 rounded-[22px] p-3.5">
      <div className="mt-0.5 rounded-2xl border border-white/12 bg-white/12 p-2 text-[#ff5d52]">
        <MessageSquareText className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-slate-900 dark:text-white">{clientName}</p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {account} · {channel.replace("_", " ")}
        </p>
      </div>
      <div className="text-right">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
          {outcome.replace("_", " ")}
        </p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{date}</p>
      </div>
    </div>
  )
}

function PriorityFocusItem({
  clientName,
  actionDate,
  amount,
  riskLabel,
}: {
  clientName: string
  actionDate: string
  amount: string
  riskLabel: string
}) {
  return (
    <div className="mirror-tile-soft rounded-[22px] p-3.5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-900 dark:text-white">{clientName}</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Proxima gestion: {actionDate}
          </p>
        </div>
        <div className="rounded-full border border-white/12 bg-white/12 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#ff5d52]">
          {riskLabel}
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-slate-500 dark:text-slate-400">Saldo mora</span>
        <span className="text-sm font-semibold text-slate-950 dark:text-white">{amount}</span>
      </div>
    </div>
  )
}

function SignalRow({
  title,
  value,
  detail,
  accent,
}: {
  title: string
  value: string
  detail: string
  accent: "red" | "dark" | "green"
}) {
  const accentClass =
    accent === "red"
      ? "from-[#ff5d52] to-[#ffb4ad]"
      : accent === "green"
        ? "from-emerald-400 to-emerald-200"
        : "from-slate-900 to-slate-600 dark:from-white dark:to-slate-300"

  return (
    <div className="mirror-tile rounded-[24px] p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <p className="mt-2 text-lg font-semibold text-slate-950 dark:text-white">{value}</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{detail}</p>
        </div>
        <div className={cn("h-12 w-1 rounded-full bg-gradient-to-b", accentClass)} />
      </div>
    </div>
  )
}

function DashboardFiltersPanel({
  className,
  filtroGestor,
  setFiltroGestor,
  filtroFinanciera,
  setFiltroFinanciera,
  filtroPeriodo,
  setFiltroPeriodo,
  selectedEstados,
  setSelectedEstados,
  gestores,
  rendimientoGestores,
  gestorColors,
}: {
  className?: string
  filtroGestor: string
  setFiltroGestor: (value: string) => void
  filtroFinanciera: string
  setFiltroFinanciera: (value: string) => void
  filtroPeriodo: string
  setFiltroPeriodo: (value: string) => void
  selectedEstados: string[]
  setSelectedEstados: React.Dispatch<React.SetStateAction<string[]>>
  gestores: Array<{ id: string; nombre: string; rol: string }>
  rendimientoGestores: Array<{ name: string; value: number }>
  gestorColors: string[]
}) {
  return (
    <div className={cn("glass-panel rounded-[30px] p-5 sm:p-6", className)}>
      <div className="flex items-center gap-2">
        <div className="rounded-full border border-white/12 bg-white/8 p-2 text-[#ff5d52]">
          <Filter className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-950 dark:text-white">Filtros</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Control contextual</p>
        </div>
      </div>

      <div className="mt-6 space-y-5">
        <FilterField label="Periodo" icon={<CalendarDays className="h-3.5 w-3.5" />}>
          <Select value={filtroPeriodo} onValueChange={setFiltroPeriodo}>
            <SelectTrigger className="h-11 rounded-2xl border-slate-200/70 bg-[rgba(232,238,245,0.82)] text-sm text-slate-700 shadow-[0_12px_28px_rgba(148,163,184,0.08)] dark:border-white/14 dark:bg-white/[0.08] dark:text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-white/75 bg-[rgba(246,248,252,0.94)] dark:border-white/14 dark:bg-[#111827]/94">
              <SelectItem value="hoy">Hoy</SelectItem>
              <SelectItem value="semana">Esta semana</SelectItem>
              <SelectItem value="mes">Este mes</SelectItem>
              <SelectItem value="trimestre">Trimestre</SelectItem>
            </SelectContent>
          </Select>
        </FilterField>

        <FilterField label="Financiera" icon={<Building2 className="h-3.5 w-3.5" />}>
          <Select value={filtroFinanciera} onValueChange={setFiltroFinanciera}>
            <SelectTrigger className="h-11 rounded-2xl border-slate-200/70 bg-[rgba(232,238,245,0.82)] text-sm text-slate-700 shadow-[0_12px_28px_rgba(148,163,184,0.08)] dark:border-white/14 dark:bg-white/[0.08] dark:text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-white/75 bg-[rgba(246,248,252,0.94)] dark:border-white/14 dark:bg-[#111827]/94">
              <SelectItem value="todos">Todas</SelectItem>
              <SelectItem value="krediya">Krediya</SelectItem>
              <SelectItem value="payjoy">PayJoy</SelectItem>
              <SelectItem value="alo">ALO</SelectItem>
            </SelectContent>
          </Select>
        </FilterField>

        <FilterField label="Gestor" icon={<UserCircle className="h-3.5 w-3.5" />}>
          <Select value={filtroGestor} onValueChange={setFiltroGestor}>
            <SelectTrigger className="h-11 rounded-2xl border-slate-200/70 bg-[rgba(232,238,245,0.82)] text-sm text-slate-700 shadow-[0_12px_28px_rgba(148,163,184,0.08)] dark:border-white/14 dark:bg-white/[0.08] dark:text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-white/75 bg-[rgba(246,248,252,0.94)] dark:border-white/14 dark:bg-[#111827]/94">
              <SelectItem value="todos">Todos</SelectItem>
              {gestores
                .filter((gestor) => gestor.rol === "gestor")
                .map((gestor) => (
                  <SelectItem key={gestor.id} value={gestor.id}>
                    {gestor.nombre}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </FilterField>

        <div className="space-y-3">
          <Label className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            Estado de cuenta
          </Label>
          <div className="space-y-2.5">
            {[
              { id: "todos", label: "Todos" },
              { id: "al_dia", label: "Al dia" },
              { id: "mora", label: "En mora" },
              { id: "critico", label: "Critico" },
              { id: "castigado", label: "Castigado" },
            ].map((estado) => (
              <div
                key={estado.id}
                className="mirror-tile-soft flex items-center gap-2.5 rounded-2xl px-3 py-2.5"
              >
                <Checkbox
                  id={estado.id}
                  checked={selectedEstados.includes(estado.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      if (estado.id === "todos") {
                        setSelectedEstados(["todos"])
                      } else {
                        setSelectedEstados((prev) => [...prev.filter((value) => value !== "todos"), estado.id])
                      }
                    } else {
                      setSelectedEstados((prev) => prev.filter((value) => value !== estado.id))
                    }
                  }}
                  className="border-slate-300 data-[state=checked]:border-[#ff5d52] data-[state=checked]:bg-[#ff5d52] dark:border-slate-600"
                />
                <Label htmlFor={estado.id} className="cursor-pointer text-sm text-slate-600 dark:text-slate-300">
                  {estado.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="mirror-tile-soft rounded-[26px] p-4">
          <div className="mb-4 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[#ff5d52]" />
            <Label className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              Top gestores
            </Label>
          </div>
          <div className="space-y-3">
            {rendimientoGestores.map((gestor, index) => (
              <div key={gestor.name} className="flex items-center gap-3">
                <span className="w-4 text-xs text-slate-500">{index + 1}</span>
                <div className="flex-1">
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-300">{gestor.name}</span>
                    <span className="text-sm font-medium text-slate-950 dark:text-white">
                      {gestor.value}%
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-white/8">
                    <div
                      className={cn("h-full rounded-full transition-all", gestorColors[index])}
                      style={{ width: `${gestor.value}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function FilterField({
  label,
  icon,
  children,
}: {
  label: string
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
        {icon}
        {label}
      </Label>
      {children}
    </div>
  )
}
