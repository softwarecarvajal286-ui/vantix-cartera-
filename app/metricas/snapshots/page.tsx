"use client"

import { useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { Topbar } from "@/components/topbar"
import { AuthGuard } from "@/components/auth-guard"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Camera,
  Search,
  Eye,
  Calendar,
  Clock,
  Download,
  Filter,
  CreditCard,
  DollarSign,
  TrendingUp,
  TrendingDown,
  User,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Snapshot {
  id: string
  obligacion: {
    id: string
    numero: string
    cliente: string
  }
  fecha: string
  hora: string
  saldoCapital: number
  saldoMora: number
  diasMora: number
  estado: string
  gestorAsignado: string
  ultimaGestion?: string
  variacionSaldo: number
  variacionMora: number
}

const snapshots: Snapshot[] = [
  {
    id: "SNP-001",
    obligacion: { id: "OBL-001", numero: "CR-2024-001", cliente: "Carlos Mendoza" },
    fecha: "2024-03-25",
    hora: "00:00",
    saldoCapital: 8500000,
    saldoMora: 850000,
    diasMora: 45,
    estado: "Mora Media",
    gestorAsignado: "Juan Díaz",
    ultimaGestion: "2024-03-24",
    variacionSaldo: -5.2,
    variacionMora: 2.1
  },
  {
    id: "SNP-002",
    obligacion: { id: "OBL-002", numero: "CR-2024-002", cliente: "María García" },
    fecha: "2024-03-25",
    hora: "00:00",
    saldoCapital: 6200000,
    saldoMora: 620000,
    diasMora: 32,
    estado: "Mora Temprana",
    gestorAsignado: "Ana Pérez",
    ultimaGestion: "2024-03-23",
    variacionSaldo: 0,
    variacionMora: 8.5
  },
  {
    id: "SNP-003",
    obligacion: { id: "OBL-003", numero: "CR-2024-003", cliente: "Juan Pérez" },
    fecha: "2024-03-25",
    hora: "00:00",
    saldoCapital: 28000000,
    saldoMora: 0,
    diasMora: 0,
    estado: "Al día",
    gestorAsignado: "Juan Díaz",
    ultimaGestion: "2024-03-24",
    variacionSaldo: -4.3,
    variacionMora: 0
  },
  {
    id: "SNP-004",
    obligacion: { id: "OBL-004", numero: "CR-2024-004", cliente: "Ana López" },
    fecha: "2024-03-25",
    hora: "00:00",
    saldoCapital: 1200000,
    saldoMora: 0,
    diasMora: 0,
    estado: "Al día",
    gestorAsignado: "Carlos Ruiz",
    variacionSaldo: -8.1,
    variacionMora: 0
  },
  {
    id: "SNP-005",
    obligacion: { id: "OBL-005", numero: "CR-2024-005", cliente: "Roberto Díaz" },
    fecha: "2024-03-25",
    hora: "00:00",
    saldoCapital: 12000000,
    saldoMora: 2400000,
    diasMora: 75,
    estado: "Mora Avanzada",
    gestorAsignado: "Ana Pérez",
    ultimaGestion: "2024-03-22",
    variacionSaldo: 0,
    variacionMora: 15.2
  },
]

const getEstadoStyle = (estado: string) => {
  switch (estado) {
    case "Al día": return "bg-emerald/10 text-emerald"
    case "Mora Temprana": return "bg-warning/10 text-warning"
    case "Mora Media": return "bg-orange-500/10 text-orange-500"
    case "Mora Avanzada": return "bg-destructive/10 text-destructive"
    case "Crítico": return "bg-destructive/20 text-destructive"
    default: return "bg-muted text-muted-foreground"
  }
}

export default function SnapshotsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filtroEstado, setFiltroEstado] = useState("todos")
  const [selectedSnapshot, setSelectedSnapshot] = useState<Snapshot | null>(null)

  const snapshotsFiltrados = snapshots.filter(s => {
    const matchSearch = 
      s.obligacion.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.obligacion.cliente.toLowerCase().includes(searchTerm.toLowerCase())
    const matchEstado = filtroEstado === "todos" || s.estado === filtroEstado
    return matchSearch && matchEstado
  })

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value)
  }

  const totalSaldoCapital = snapshots.reduce((acc, s) => acc + s.saldoCapital, 0)
  const totalSaldoMora = snapshots.reduce((acc, s) => acc + s.saldoMora, 0)
  const promedioDiasMora = Math.round(snapshots.reduce((acc, s) => acc + s.diasMora, 0) / snapshots.length)

  const estados = [...new Set(snapshots.map(s => s.estado))]

  return (
    <AuthGuard>
      <AppLayout>
        <Topbar
          title="Snapshots"
          breadcrumbs={[{ label: "Métricas" }, { label: "Snapshots" }]}
        />

        <div className="p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald/10">
                    <Camera className="h-5 w-5 text-emerald" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{snapshots.length}</p>
                    <p className="text-sm text-muted-foreground">Obligaciones</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-info/10">
                    <DollarSign className="h-5 w-5 text-info" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{formatCurrency(totalSaldoCapital)}</p>
                    <p className="text-sm text-muted-foreground">Saldo capital</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-destructive/10">
                    <DollarSign className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{formatCurrency(totalSaldoMora)}</p>
                    <p className="text-sm text-muted-foreground">Saldo en mora</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-warning/10">
                    <Clock className="h-5 w-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{promedioDiasMora} días</p>
                    <p className="text-sm text-muted-foreground">Promedio mora</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Table */}
          <Card className="bg-card border-border">
            <CardHeader className="border-b border-border">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    Snapshot de Obligaciones
                  </CardTitle>
                  <CardDescription>Estado actual de las obligaciones al {new Date().toLocaleDateString('es-CO')}</CardDescription>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar obligación..."
                      className="pl-9 bg-background"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                    <SelectTrigger className="w-40 bg-background">
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      {estados.map(e => (
                        <SelectItem key={e} value={e}>{e}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Obligación</TableHead>
                    <TableHead className="text-muted-foreground">Cliente</TableHead>
                    <TableHead className="text-muted-foreground text-right">Saldo Capital</TableHead>
                    <TableHead className="text-muted-foreground text-right">Saldo Mora</TableHead>
                    <TableHead className="text-muted-foreground text-center">Días Mora</TableHead>
                    <TableHead className="text-muted-foreground">Estado</TableHead>
                    <TableHead className="text-muted-foreground">Gestor</TableHead>
                    <TableHead className="text-muted-foreground text-center">Variación</TableHead>
                    <TableHead className="text-muted-foreground text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {snapshotsFiltrados.map((snapshot) => (
                    <TableRow key={snapshot.id} className="border-border">
                      <TableCell className="font-mono text-foreground">{snapshot.obligacion.numero}</TableCell>
                      <TableCell className="font-medium text-foreground">{snapshot.obligacion.cliente}</TableCell>
                      <TableCell className="text-right text-foreground">{formatCurrency(snapshot.saldoCapital)}</TableCell>
                      <TableCell className={cn(
                        "text-right font-medium",
                        snapshot.saldoMora > 0 ? "text-destructive" : "text-muted-foreground"
                      )}>
                        {snapshot.saldoMora > 0 ? formatCurrency(snapshot.saldoMora) : "-"}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={cn(
                          "inline-flex items-center justify-center h-7 px-2 rounded-full font-medium text-sm",
                          snapshot.diasMora === 0 && "bg-emerald/10 text-emerald",
                          snapshot.diasMora > 0 && snapshot.diasMora <= 30 && "bg-warning/10 text-warning",
                          snapshot.diasMora > 30 && snapshot.diasMora <= 60 && "bg-orange-500/10 text-orange-500",
                          snapshot.diasMora > 60 && "bg-destructive/10 text-destructive"
                        )}>
                          {snapshot.diasMora}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn("border-0", getEstadoStyle(snapshot.estado))}>
                          {snapshot.estado}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-foreground">{snapshot.gestorAsignado}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex flex-col items-center gap-1">
                          {snapshot.variacionSaldo !== 0 && (
                            <span className={cn(
                              "flex items-center gap-0.5 text-xs",
                              snapshot.variacionSaldo < 0 ? "text-emerald" : "text-destructive"
                            )}>
                              {snapshot.variacionSaldo < 0 ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
                              {Math.abs(snapshot.variacionSaldo)}%
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedSnapshot(snapshot)}>
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Detail Dialog */}
        <Dialog open={!!selectedSnapshot} onOpenChange={() => setSelectedSnapshot(null)}>
          <DialogContent className="sm:max-w-lg">
            {selectedSnapshot && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    {selectedSnapshot.obligacion.numero}
                  </DialogTitle>
                  <DialogDescription>{selectedSnapshot.obligacion.cliente}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-1">Saldo Capital</p>
                      <p className="text-xl font-bold text-foreground">{formatCurrency(selectedSnapshot.saldoCapital)}</p>
                      {selectedSnapshot.variacionSaldo !== 0 && (
                        <p className={cn(
                          "text-xs flex items-center gap-1 mt-1",
                          selectedSnapshot.variacionSaldo < 0 ? "text-emerald" : "text-destructive"
                        )}>
                          {selectedSnapshot.variacionSaldo < 0 ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
                          {Math.abs(selectedSnapshot.variacionSaldo)}% vs mes anterior
                        </p>
                      )}
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-1">Saldo en Mora</p>
                      <p className={cn(
                        "text-xl font-bold",
                        selectedSnapshot.saldoMora > 0 ? "text-destructive" : "text-foreground"
                      )}>
                        {selectedSnapshot.saldoMora > 0 ? formatCurrency(selectedSnapshot.saldoMora) : "$0"}
                      </p>
                      {selectedSnapshot.variacionMora !== 0 && (
                        <p className={cn(
                          "text-xs flex items-center gap-1 mt-1",
                          selectedSnapshot.variacionMora < 0 ? "text-emerald" : "text-destructive"
                        )}>
                          {selectedSnapshot.variacionMora < 0 ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
                          {Math.abs(selectedSnapshot.variacionMora)}% vs mes anterior
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 bg-muted/50 rounded-lg p-4">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground mb-1">Días Mora</p>
                      <p className={cn(
                        "text-lg font-bold",
                        selectedSnapshot.diasMora === 0 ? "text-emerald" : 
                        selectedSnapshot.diasMora <= 30 ? "text-warning" : "text-destructive"
                      )}>
                        {selectedSnapshot.diasMora}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground mb-1">Estado</p>
                      <Badge className={cn("border-0", getEstadoStyle(selectedSnapshot.estado))}>
                        {selectedSnapshot.estado}
                      </Badge>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground mb-1">Gestor</p>
                      <p className="text-sm font-medium text-foreground">{selectedSnapshot.gestorAsignado}</p>
                    </div>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Última gestión:</span>
                      <span className="text-sm font-medium text-foreground">
                        {selectedSnapshot.ultimaGestion || "Sin gestiones"}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </AppLayout>
    </AuthGuard>
  )
}
