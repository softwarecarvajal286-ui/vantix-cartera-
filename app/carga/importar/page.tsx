"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, Clock, X, FileUp } from "lucide-react"
import { AppLayout } from "@/components/app-layout"
import { Topbar } from "@/components/topbar"
import { AuthGuard } from "@/components/auth-guard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

const recentImports = [
  { id: 1, archivo: "clientes_enero_2024.xlsx", tabla: "clientes", registros: 1250, estado: "completado", fecha: "2024-01-15" },
  { id: 2, archivo: "obligaciones_batch.csv", tabla: "obligaciones", registros: 5420, estado: "completado", fecha: "2024-01-14" },
  { id: 3, archivo: "gestiones_dia.xlsx", tabla: "gestiones", registros: 890, estado: "error", fecha: "2024-01-13" },
  { id: 4, archivo: "pagos_masivos.csv", tabla: "pagos", registros: 2100, estado: "procesando", fecha: "2024-01-13" },
]

export default function ImportarPage() {
  const [isDragging, setIsDragging] = React.useState(false)
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null)
  const [selectedTabla, setSelectedTabla] = React.useState("")
  const [uploadProgress, setUploadProgress] = React.useState(0)
  const [isUploading, setIsUploading] = React.useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      setSelectedFile(files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      setSelectedFile(files[0])
    }
  }

  const handleUpload = () => {
    if (!selectedFile || !selectedTabla) return
    setIsUploading(true)
    setUploadProgress(0)
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  return (
    <AuthGuard>
      <AppLayout>
        <Topbar
          title="Importar Información"
          breadcrumbs={[{ label: "Carga de Datos" }, { label: "Importar" }]}
          showCreate={false}
        />
        <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Importar Información</h1>
        <p className="text-muted-foreground">Carga masiva de datos desde archivos Excel o CSV</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upload Area */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Cargar Archivo</CardTitle>
            <CardDescription>Arrastra un archivo o haz clic para seleccionar</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
                isDragging ? "border-emerald bg-emerald/5" : "border-muted-foreground/25 hover:border-emerald/50",
                selectedFile && "border-emerald bg-emerald/5"
              )}
              onClick={() => document.getElementById("file-input")?.click()}
            >
              <input
                id="file-input"
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileSelect}
                className="hidden"
              />
              {selectedFile ? (
                <div className="space-y-2">
                  <FileSpreadsheet className="h-12 w-12 mx-auto text-emerald" />
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                  >
                    <X className="mr-1 h-4 w-4" />
                    Quitar archivo
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="font-medium">Arrastra tu archivo aquí</p>
                  <p className="text-sm text-muted-foreground">
                    Soporta archivos .xlsx, .xls y .csv
                  </p>
                </div>
              )}
            </div>

            <div className="grid gap-2">
              <Label>Tabla destino</Label>
              <Select value={selectedTabla} onValueChange={setSelectedTabla}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tabla" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="clientes">Clientes</SelectItem>
                  <SelectItem value="obligaciones">Obligaciones</SelectItem>
                  <SelectItem value="gestiones">Gestiones</SelectItem>
                  <SelectItem value="pagos">Pagos</SelectItem>
                  <SelectItem value="acuerdos">Acuerdos de pago</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Procesando...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} />
              </div>
            )}

            <Button 
              className="w-full bg-emerald hover:bg-emerald/90"
              disabled={!selectedFile || !selectedTabla || isUploading}
              onClick={handleUpload}
            >
              <FileUp className="mr-2 h-4 w-4" />
              {isUploading ? "Procesando..." : "Iniciar Carga"}
            </Button>
          </CardContent>
        </Card>

        {/* Recent Imports */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Importaciones Recientes</CardTitle>
            <CardDescription>Últimas cargas realizadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentImports.map((imp, index) => (
                <motion.div
                  key={imp.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "h-10 w-10 rounded-lg flex items-center justify-center",
                      imp.estado === "completado" ? "bg-emerald/10" :
                      imp.estado === "error" ? "bg-red-500/10" : "bg-blue-500/10"
                    )}>
                      {imp.estado === "completado" ? (
                        <CheckCircle className="h-5 w-5 text-emerald" />
                      ) : imp.estado === "error" ? (
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      ) : (
                        <Clock className="h-5 w-5 text-blue-500 animate-pulse" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{imp.archivo}</p>
                      <p className="text-xs text-muted-foreground">
                        {imp.tabla} &bull; {imp.registros.toLocaleString()} registros
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={
                      imp.estado === "completado" ? "default" :
                      imp.estado === "error" ? "destructive" : "secondary"
                    } className={imp.estado === "completado" ? "bg-emerald/20 text-emerald" : ""}>
                      {imp.estado}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(imp.fecha).toLocaleDateString("es-CO")}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Importaciones</CardTitle>
            <Upload className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">Este mes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Registros Cargados</CardTitle>
            <FileSpreadsheet className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">45.2K</div>
            <p className="text-xs text-muted-foreground">Este mes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Exitosas</CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald">98.5%</div>
            <p className="text-xs text-muted-foreground">Tasa de éxito</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Errores</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">3</div>
            <p className="text-xs text-muted-foreground">Pendientes de revisión</p>
          </CardContent>
        </Card>
      </div>
        </div>
      </AppLayout>
    </AuthGuard>
  )
}
