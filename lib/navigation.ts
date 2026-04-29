import {
  BarChart3,
  Bell,
  Calculator,
  Clock,
  EyeOff,
  FileText,
  HandCoins,
  Landmark,
  LayoutDashboard,
  Shield,
  Star,
  Target,
  TrendingUp,
  Upload,
  User,
  UserCog,
  UserPlus,
  Users,
  Users2,
} from "lucide-react"

export interface NavChild {
  title: string
  href: string
  icon: React.ElementType
}

export interface NavItem {
  id: string
  title: string
  href?: string
  icon: React.ElementType
  roles?: string[]
  children?: NavChild[]
}

export const navItems: NavItem[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    roles: ["Admin", "Lider", "Gestor", "Vendedor"],
  },
  {
    id: "cobranza",
    title: "Gestion de Cobranza",
    href: "/cobranza/gestiones",
    icon: HandCoins,
    roles: ["Admin", "Lider", "Gestor"],
  },
  {
    id: "acuerdos",
    title: "Acuerdos de Pago",
    href: "/cobranza/acuerdos",
    icon: FileText,
    roles: ["Admin", "Lider", "Gestor"],
  },
  {
    id: "clientes",
    title: "Clientes",
    icon: Users,
    roles: ["Admin", "Lider", "Gestor", "Vendedor"],
    children: [
      { title: "Lista de clientes", href: "/clientes", icon: Users },
      { title: "Crear cliente", href: "/clientes/crear", icon: UserPlus },
      { title: "Importar Excel", href: "/carga/importar", icon: Upload },
    ],
  },
  {
    id: "metricas",
    title: "Metricas",
    icon: BarChart3,
    roles: ["Admin", "Lider"],
    children: [
      { title: "KPIs generales", href: "/metricas/indicadores", icon: Target },
      { title: "Rendimiento gestores", href: "/metricas/historico", icon: TrendingUp },
      { title: "Metricas particulares", href: "/metricas/metas", icon: Star },
    ],
  },
  {
    id: "notificaciones",
    title: "Notificaciones",
    icon: Bell,
    roles: ["Admin", "Lider", "Gestor", "Vendedor"],
    children: [
      { title: "Todas", href: "/notificaciones", icon: Bell },
      { title: "Pendientes", href: "/notificaciones/pendientes", icon: EyeOff },
      { title: "Recientes", href: "/notificaciones/recientes", icon: Clock },
    ],
  },
  {
    id: "simulador-cuotas",
    title: "Simulador de Cuotas",
    href: "/simulador/cuotas",
    icon: Calculator,
    roles: ["Admin", "Lider", "Gestor", "Vendedor"],
  },
  {
    id: "financieras",
    title: "Financieras",
    href: "/estructura/financieras",
    icon: Landmark,
    roles: ["Admin"],
  },
  {
    id: "usuarios",
    title: "Usuarios",
    icon: UserCog,
    roles: ["Admin"],
    children: [
      { title: "Lista de usuarios", href: "/usuarios", icon: Users },
      { title: "Asignar roles", href: "/usuarios/roles", icon: Shield },
      { title: "Gestores", href: "/usuarios/gestores", icon: User },
      { title: "Lideres", href: "/usuarios/lideres", icon: Users2 },
    ],
  },
]
