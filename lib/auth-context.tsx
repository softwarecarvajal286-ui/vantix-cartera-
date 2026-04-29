"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

// Roles del sistema según lineamientos
export type UserRole = "Admin" | "Líder" | "Gestor" | "Vendedor"

// Financieras disponibles
export interface Financiera {
  id: string
  nombre: string
  color: string
}

export const FINANCIERAS: Financiera[] = [
  { id: "krediya", nombre: "Krediya", color: "#00C896" },
  { id: "payjoy", nombre: "PayJoy", color: "#4DA6FF" },
  { id: "alo", nombre: "ALO Credit", color: "#FFB347" },
  { id: "distritec", nombre: "Distribuciones Distritec", color: "#9B5CFF" },
]

interface User {
  id: string
  name: string
  email: string
  role: UserRole
  financieraId: string | null // null para Admin (ve todas)
  financiera?: Financiera
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  canAccessModule: (module: string) => boolean
  selectedFinancieraId: string
  selectedFinanciera: Financiera | null
  setSelectedFinancieraId: (financieraId: string) => void
  getVisibleFinancieras: () => Financiera[]
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined)
const MOCK_LOGIN_DELAY_MS = 120
const FINANCIERA_STORAGE_KEY = "carterahub_financiera"

function resolveFinancieraIdForUser(user: User | null, storedFinancieraId?: string | null) {
  if (!user) {
    return storedFinancieraId || FINANCIERAS[0].id
  }

  if (user.role === "Admin") {
    return storedFinancieraId || user.financieraId || user.financiera?.id || FINANCIERAS[0].id
  }

  return user.financieraId || user.financiera?.id || FINANCIERAS[0].id
}

// Credenciales de prueba por rol
const USERS_DB: Record<string, { password: string; user: User }> = {
  admin: {
    password: "1234567890",
    user: {
      id: "1",
      name: "Administrador",
      email: "admin@carterahub.com",
      role: "Admin",
      financieraId: null, // Admin ve todas las financieras
    }
  },
  lider: {
    password: "1234567890",
    user: {
      id: "2",
      name: "María García",
      email: "maria.garcia@carterahub.com",
      role: "Líder",
      financieraId: "krediya",
      financiera: FINANCIERAS[0],
    }
  },
  gestor: {
    password: "1234567890",
    user: {
      id: "3",
      name: "Juan Díaz",
      email: "juan.diaz@carterahub.com",
      role: "Gestor",
      financieraId: "krediya",
      financiera: FINANCIERAS[0],
    }
  },
  vendedor: {
    password: "1234567890",
    user: {
      id: "4",
      name: "Carlos Mendoza",
      email: "carlos.mendoza@carterahub.com",
      role: "Vendedor",
      financieraId: "payjoy",
      financiera: FINANCIERAS[1],
    }
  },
}

// Permisos por módulo según rol
const MODULE_PERMISSIONS: Record<string, UserRole[]> = {
  dashboard: ["Admin", "Líder", "Gestor", "Vendedor"],
  cobranza: ["Admin", "Líder", "Gestor"],
  acuerdos: ["Admin", "Líder", "Gestor"],
  clientes: ["Admin", "Líder", "Gestor", "Vendedor"],
  metricas: ["Admin", "Líder"],
  notificaciones: ["Admin", "Líder", "Gestor", "Vendedor"],
  financieras: ["Admin"],
  usuarios: ["Admin"],
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [selectedFinancieraId, setSelectedFinancieraIdState] = React.useState(FINANCIERAS[0].id)
  const router = useRouter()

  React.useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem("carterahub_user")
    const storedFinanciera = localStorage.getItem(FINANCIERA_STORAGE_KEY)
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as User
        setUser(parsedUser)
        const resolvedFinancieraId = resolveFinancieraIdForUser(parsedUser, storedFinanciera)
        setSelectedFinancieraIdState(resolvedFinancieraId)
        localStorage.setItem(FINANCIERA_STORAGE_KEY, resolvedFinancieraId)
      } catch {
        localStorage.removeItem("carterahub_user")
      }
    } else if (storedFinanciera) {
      setSelectedFinancieraIdState(storedFinanciera)
    }
    setIsLoading(false)
  }, [])

  const setSelectedFinancieraId = React.useCallback((financieraId: string) => {
    if (user && user.role !== "Admin") return
    setSelectedFinancieraIdState(financieraId)
    localStorage.setItem(FINANCIERA_STORAGE_KEY, financieraId)
  }, [user])

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    
    // Keep a tiny delay so the UI still shows feedback without feeling sluggish.
    await new Promise(resolve => setTimeout(resolve, MOCK_LOGIN_DELAY_MS))
    
    const credentials = USERS_DB[username.toLowerCase()]
    if (credentials && credentials.password === password) {
      setUser(credentials.user)
      localStorage.setItem("carterahub_user", JSON.stringify(credentials.user))
      const defaultFinancieraId = resolveFinancieraIdForUser(
        credentials.user,
        localStorage.getItem(FINANCIERA_STORAGE_KEY)
      )
      setSelectedFinancieraIdState(defaultFinancieraId)
      localStorage.setItem(FINANCIERA_STORAGE_KEY, defaultFinancieraId)
      setIsLoading(false)
      return true
    }
    
    setIsLoading(false)
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("carterahub_user")
    router.push("/login")
  }

  const canAccessModule = (module: string): boolean => {
    if (!user) return false
    const allowedRoles = MODULE_PERMISSIONS[module]
    if (!allowedRoles) return true // Si no está definido, permitir
    return allowedRoles.includes(user.role)
  }

  const getVisibleFinancieras = (): Financiera[] => {
    if (!user) return FINANCIERAS
    if (user.role === "Admin") return FINANCIERAS
    return FINANCIERAS.filter((financiera) => financiera.id === (user.financieraId || user.financiera?.id))
  }

  const selectedFinanciera = React.useMemo(
    () => FINANCIERAS.find((financiera) => financiera.id === selectedFinancieraId) ?? FINANCIERAS[0],
    [selectedFinancieraId]
  )

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        canAccessModule,
        selectedFinancieraId,
        selectedFinanciera,
        setSelectedFinancieraId,
        getVisibleFinancieras,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
