"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Save,
  User,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  CreditCard,
  AlertTriangle,
} from "lucide-react"
import { AppLayout } from "@/components/app-layout"
import { Topbar } from "@/components/topbar"
import { AuthGuard } from "@/components/auth-guard"
import { useApp } from "@/lib/app-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export default function CrearClientePage() {
  const router = useRouter()
  const { agregarCliente, mostrarNotificacion } = useApp()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [clienteForm, setClienteForm] = useState({
    cedula: "",
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    telefonoAlt: "",
    direccion: "",
    ciudad: "",
    fechaNacimiento: "",
    ocupacion: "",
    ingresoMensual: "",
    segmento: "standard" as "premium" | "standard" | "basico",
    riesgo: "medio" as "bajo" | "medio" | "alto" | "critico"
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!clienteForm.cedula.trim()) newErrors.cedula = "La cedula es obligatoria"
    if (!clienteForm.nombre.trim()) newErrors.nombre = "El nombre es obligatorio"
    if (!clienteForm.apellido.trim()) newErrors.apellido = "El apellido es obligatorio"
    if (!clienteForm.email.trim()) {
      newErrors.email = "El email es obligatorio"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clienteForm.email)) {
      newErrors.email = "El email no es valido"
    }
    if (!clienteForm.telefono.trim()) newErrors.telefono = "El telefono es obligatorio"
    if (!clienteForm.direccion.trim()) newErrors.direccion = "La direccion es obligatoria"
    if (!clienteForm.ciudad.trim()) newErrors.ciudad = "La ciudad es obligatoria"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validateForm()) {
      mostrarNotificacion({
        tipo: "error",
        titulo: "Error de validacion",
        mensaje: "Por favor complete todos los campos obligatorios"
      })
      return
    }

    setIsSubmitting(true)

    setTimeout(() => {
      agregarCliente({
        ...clienteForm,
        ingresoMensual: parseFloat(clienteForm.ingresoMensual) || 0
      })

      mostrarNotificacion({
        tipo: "success",
        titulo: "Cliente creado",
        mensaje: `${clienteForm.nombre} ${clienteForm.apellido} ha sido registrado exitosamente`
      })

      router.push("/clientes")
    }, 500)
  }

  const updateField = (field: string, value: string) => {
    setClienteForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  return (
    <AuthGuard>
      <AppLayout>
        <Topbar
          title="Crear Cliente"
          breadcrumbs={[
            { label: "Inicio", href: "/" },
            { label: "Clientes", href: "/clientes" },
            { label: "Crear" }
          ]}
          showCreate={false}
        />

        <div className="p-6 max-w-4xl mx-auto space-y-6">
          {/* Header Actions */}
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? "Guardando..." : "Guardar Cliente"}
            </Button>
          </div>

          {/* Informacion Personal */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Informacion Personal
              </CardTitle>
              <CardDescription>Datos basicos del cliente</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cedula">Cedula *</Label>
                  <Input
                    id="cedula"
                    placeholder="1234567890"
                    value={clienteForm.cedula}
                    onChange={(e) => updateField("cedula", e.target.value)}
                    className={errors.cedula ? "border-destructive" : ""}
                  />
                  {errors.cedula && <p className="text-xs text-destructive">{errors.cedula}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre *</Label>
                  <Input
                    id="nombre"
                    placeholder="Juan"
                    value={clienteForm.nombre}
                    onChange={(e) => updateField("nombre", e.target.value)}
                    className={errors.nombre ? "border-destructive" : ""}
                  />
                  {errors.nombre && <p className="text-xs text-destructive">{errors.nombre}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apellido">Apellido *</Label>
                  <Input
                    id="apellido"
                    placeholder="Perez"
                    value={clienteForm.apellido}
                    onChange={(e) => updateField("apellido", e.target.value)}
                    className={errors.apellido ? "border-destructive" : ""}
                  />
                  {errors.apellido && <p className="text-xs text-destructive">{errors.apellido}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fechaNacimiento">Fecha de Nacimiento</Label>
                  <Input
                    id="fechaNacimiento"
                    type="date"
                    value={clienteForm.fechaNacimiento}
                    onChange={(e) => updateField("fechaNacimiento", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ocupacion">Ocupacion</Label>
                  <Input
                    id="ocupacion"
                    placeholder="Ingeniero, Contador, etc."
                    value={clienteForm.ocupacion}
                    onChange={(e) => updateField("ocupacion", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informacion de Contacto */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary" />
                Informacion de Contacto
              </CardTitle>
              <CardDescription>Datos de contacto del cliente</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="telefono">Telefono Principal *</Label>
                  <Input
                    id="telefono"
                    placeholder="3001234567"
                    value={clienteForm.telefono}
                    onChange={(e) => updateField("telefono", e.target.value)}
                    className={errors.telefono ? "border-destructive" : ""}
                  />
                  {errors.telefono && <p className="text-xs text-destructive">{errors.telefono}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefonoAlt">Telefono Alternativo</Label>
                  <Input
                    id="telefonoAlt"
                    placeholder="3109876543"
                    value={clienteForm.telefonoAlt}
                    onChange={(e) => updateField("telefonoAlt", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="juan.perez@email.com"
                  value={clienteForm.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Direccion */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Direccion
              </CardTitle>
              <CardDescription>Ubicacion del cliente</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="direccion">Direccion *</Label>
                <Input
                  id="direccion"
                  placeholder="Calle 123 # 45-67, Barrio Centro"
                  value={clienteForm.direccion}
                  onChange={(e) => updateField("direccion", e.target.value)}
                  className={errors.direccion ? "border-destructive" : ""}
                />
                {errors.direccion && <p className="text-xs text-destructive">{errors.direccion}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="ciudad">Ciudad *</Label>
                <Input
                  id="ciudad"
                  placeholder="Bogota"
                  value={clienteForm.ciudad}
                  onChange={(e) => updateField("ciudad", e.target.value)}
                  className={errors.ciudad ? "border-destructive" : ""}
                />
                {errors.ciudad && <p className="text-xs text-destructive">{errors.ciudad}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Informacion Financiera */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Informacion Financiera
              </CardTitle>
              <CardDescription>Datos economicos y clasificacion</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ingresoMensual">Ingreso Mensual</Label>
                  <Input
                    id="ingresoMensual"
                    type="number"
                    placeholder="3500000"
                    value={clienteForm.ingresoMensual}
                    onChange={(e) => updateField("ingresoMensual", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Segmento</Label>
                  <Select 
                    value={clienteForm.segmento} 
                    onValueChange={(v) => updateField("segmento", v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="basico">Basico</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Nivel de Riesgo</Label>
                  <Select 
                    value={clienteForm.riesgo} 
                    onValueChange={(v) => updateField("riesgo", v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bajo">Bajo</SelectItem>
                      <SelectItem value="medio">Medio</SelectItem>
                      <SelectItem value="alto">Alto</SelectItem>
                      <SelectItem value="critico">Critico</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => router.back()}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? "Guardando..." : "Crear Cliente"}
            </Button>
          </div>
        </div>
      </AppLayout>
    </AuthGuard>
  )
}
