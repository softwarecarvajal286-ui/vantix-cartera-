"use client"

import * as React from "react"
import {
  X,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CreditCard,
  FileText,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Building,
  Smartphone,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StatusBadge } from "@/components/status-badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface ClientDrawerProps {
  isOpen: boolean
  onClose: () => void
  client: {
    id: string
    name: string
    document: string
    phone: string
    email: string
    address: string
    city: string
    status: "al-dia" | "mora" | "pendiente"
    financiera: string
    deviceTag?: string
    imei?: string
    obligation: {
      id: string
      value: number
      balance: number
      daysOverdue: number
      status: string
      dueDate: string
    }
    gestiones: {
      id: string
      date: string
      type: string
      result: string
      notes: string
      gestor: string
    }[]
    acuerdos: {
      id: string
      value: number
      dueDate: string
      status: "vigente" | "cumplido" | "incumplido" | "vencido"
    }[]
    pagos: {
      id: string
      value: number
      date: string
      method: string
    }[]
  } | null
}

export function ClientDrawer({ isOpen, onClose, client }: ClientDrawerProps) {
  if (!client) return null

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value)
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 transition-opacity",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed right-0 top-0 z-50 h-full w-full max-w-lg bg-card border-l border-border shadow-xl transition-transform duration-300",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div>
            <h2 className="text-lg font-semibold text-card-foreground">{client.name}</h2>
            <p className="text-sm text-muted-foreground">{client.document}</p>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge variant={client.status} />
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-180px)]">
          <Tabs defaultValue="resumen" className="w-full">
            <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent p-0">
              <TabsTrigger
                value="resumen"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald data-[state=active]:bg-transparent"
              >
                Resumen
              </TabsTrigger>
              <TabsTrigger
                value="gestiones"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald data-[state=active]:bg-transparent"
              >
                Gestiones
              </TabsTrigger>
              <TabsTrigger
                value="acuerdos"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald data-[state=active]:bg-transparent"
              >
                Acuerdos
              </TabsTrigger>
              <TabsTrigger
                value="pagos"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald data-[state=active]:bg-transparent"
              >
                Pagos
              </TabsTrigger>
            </TabsList>

            <TabsContent value="resumen" className="p-4 space-y-6">
              {/* Contact Info */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">Información de contacto</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{client.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{client.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{client.address}, {client.city}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span>{client.financiera}</span>
                  </div>
                  {client.deviceTag && (
                    <div className="flex items-center gap-3 text-sm">
                      <Smartphone className="h-4 w-4 text-muted-foreground" />
                      <span>{client.deviceTag}</span>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Obligation Info */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">Obligación activa</h3>
                <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">ID Obligación</span>
                    <span className="text-sm font-medium">{client.obligation.id}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Valor total</span>
                    <span className="text-sm font-medium">{formatCurrency(client.obligation.value)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Saldo pendiente</span>
                    <span className="text-sm font-semibold text-destructive">
                      {formatCurrency(client.obligation.balance)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Días de mora</span>
                    <span className={cn(
                      "text-sm font-medium",
                      client.obligation.daysOverdue > 30 ? "text-destructive" : 
                      client.obligation.daysOverdue > 0 ? "text-warning" : "text-emerald"
                    )}>
                      {client.obligation.daysOverdue} días
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Fecha vencimiento</span>
                    <span className="text-sm">{client.obligation.dueDate}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 rounded-lg bg-muted/30">
                  <p className="text-2xl font-bold text-card-foreground">{client.gestiones.length}</p>
                  <p className="text-xs text-muted-foreground">Gestiones</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted/30">
                  <p className="text-2xl font-bold text-card-foreground">{client.acuerdos.length}</p>
                  <p className="text-xs text-muted-foreground">Acuerdos</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted/30">
                  <p className="text-2xl font-bold text-card-foreground">{client.pagos.length}</p>
                  <p className="text-xs text-muted-foreground">Pagos</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="gestiones" className="p-4">
              <div className="space-y-4">
                {client.gestiones.map((gestion) => (
                  <div
                    key={gestion.id}
                    className="relative pl-6 pb-4 border-l-2 border-border last:pb-0"
                  >
                    <div className="absolute -left-1.5 top-0 h-3 w-3 rounded-full bg-emerald" />
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{gestion.type}</span>
                        <span className="text-xs text-muted-foreground">{gestion.date}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{gestion.result}</p>
                      <p className="text-xs text-muted-foreground italic">{gestion.notes}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <User className="h-3 w-3" />
                        {gestion.gestor}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="acuerdos" className="p-4">
              <div className="space-y-3">
                {client.acuerdos.map((acuerdo) => (
                  <div
                    key={acuerdo.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{formatCurrency(acuerdo.value)}</p>
                      <p className="text-xs text-muted-foreground">Vence: {acuerdo.dueDate}</p>
                    </div>
                    <StatusBadge variant={acuerdo.status} />
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="pagos" className="p-4">
              <div className="space-y-3">
                {client.pagos.map((pago) => (
                  <div
                    key={pago.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald/10">
                        <CheckCircle className="h-4 w-4 text-emerald" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{formatCurrency(pago.value)}</p>
                        <p className="text-xs text-muted-foreground">{pago.method}</p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{pago.date}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </ScrollArea>

        {/* Footer Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-card">
          <div className="flex gap-3">
            <Button className="flex-1 bg-emerald hover:bg-emerald-bright text-primary-foreground">
              <MessageSquare className="h-4 w-4 mr-2" />
              Registrar gestión
            </Button>
            <Button variant="outline" className="flex-1">
              <FileText className="h-4 w-4 mr-2" />
              Crear acuerdo
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
