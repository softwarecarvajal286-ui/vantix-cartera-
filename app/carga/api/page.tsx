"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Database, Copy, Check, Play, Clock, CheckCircle, AlertCircle, Code, Key, RefreshCw } from "lucide-react"
import { AppLayout } from "@/components/app-layout"
import { Topbar } from "@/components/topbar"
import { AuthGuard } from "@/components/auth-guard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

const endpoints = [
  { method: "POST", path: "/api/clientes", descripcion: "Insertar clientes masivamente", estado: "activo" },
  { method: "POST", path: "/api/obligaciones", descripcion: "Insertar obligaciones", estado: "activo" },
  { method: "POST", path: "/api/gestiones", descripcion: "Registrar gestiones", estado: "activo" },
  { method: "POST", path: "/api/pagos", descripcion: "Registrar pagos", estado: "activo" },
  { method: "GET", path: "/api/clientes/{id}", descripcion: "Obtener cliente por ID", estado: "activo" },
  { method: "GET", path: "/api/mapping", descripcion: "Obtener mapeo de campos", estado: "activo" },
]

const recentCalls = [
  { id: 1, endpoint: "/api/clientes", method: "POST", registros: 500, duracion: "2.3s", estado: "success", fecha: "2024-01-15 14:30" },
  { id: 2, endpoint: "/api/obligaciones", method: "POST", registros: 1200, duracion: "5.1s", estado: "success", fecha: "2024-01-15 14:25" },
  { id: 3, endpoint: "/api/gestiones", method: "POST", registros: 350, duracion: "1.8s", estado: "error", fecha: "2024-01-15 14:20" },
]

export default function ApiPage() {
  const [copied, setCopied] = React.useState(false)
  const [selectedEndpoint, setSelectedEndpoint] = React.useState("")
  const apiKey = "sk_live_CarteraHub_xxxxxxxxxxxxxxxxxxxxxxx"

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <AuthGuard>
      <AppLayout>
        <Topbar
          title="API Global"
          breadcrumbs={[{ label: "Carga de Datos" }, { label: "API Global" }]}
          showCreate={false}
        />
        <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">API Global</h1>
        <p className="text-muted-foreground">Integración de datos mediante API REST</p>
      </div>

      {/* API Key Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Key className="h-5 w-5 text-emerald" />
            API Key
          </CardTitle>
          <CardDescription>Tu clave de acceso para la API</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input 
              value={apiKey} 
              readOnly 
              className="font-mono text-sm"
              type="password"
            />
            <Button 
              variant="outline" 
              onClick={() => copyToClipboard(apiKey)}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Regenerar
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Endpoints */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Endpoints Disponibles</CardTitle>
            <CardDescription>Rutas de la API para integración</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {endpoints.map((endpoint, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => setSelectedEndpoint(endpoint.path)}
                >
                  <div className="flex items-center gap-3">
                    <Badge 
                      variant="outline"
                      className={endpoint.method === "GET" ? "bg-blue-500/10 text-blue-500 border-blue-500/20" : "bg-emerald/10 text-emerald border-emerald/20"}
                    >
                      {endpoint.method}
                    </Badge>
                    <div>
                      <p className="font-mono text-sm">{endpoint.path}</p>
                      <p className="text-xs text-muted-foreground">{endpoint.descripcion}</p>
                    </div>
                  </div>
                  <Badge className="bg-emerald/20 text-emerald">{endpoint.estado}</Badge>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* API Tester */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Probar API</CardTitle>
            <CardDescription>Envía una solicitud de prueba</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="request">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="request">Request</TabsTrigger>
                <TabsTrigger value="response">Response</TabsTrigger>
              </TabsList>
              <TabsContent value="request" className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label>Método</Label>
                    <Select defaultValue="POST">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GET">GET</SelectItem>
                        <SelectItem value="POST">POST</SelectItem>
                        <SelectItem value="PUT">PUT</SelectItem>
                        <SelectItem value="PATCH">PATCH</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2">
                    <Label>Endpoint</Label>
                    <Input 
                      value={selectedEndpoint || "/api/clientes"} 
                      onChange={(e) => setSelectedEndpoint(e.target.value)}
                      className="font-mono text-sm"
                    />
                  </div>
                </div>
                <div>
                  <Label>Body (JSON)</Label>
                  <Textarea 
                    placeholder='{"data": [...]}'
                    className="font-mono text-sm h-32"
                  />
                </div>
                <Button className="w-full bg-emerald hover:bg-emerald/90">
                  <Play className="mr-2 h-4 w-4" />
                  Ejecutar
                </Button>
              </TabsContent>
              <TabsContent value="response">
                <div className="bg-muted rounded-lg p-4 font-mono text-sm h-48 overflow-auto">
                  <pre className="text-muted-foreground">
{`{
  "success": true,
  "message": "Operación completada",
  "data": {
    "inserted": 500,
    "updated": 0,
    "errors": 0
  }
}`}
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Recent API Calls */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Llamadas Recientes</CardTitle>
          <CardDescription>Historial de solicitudes a la API</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentCalls.map((call, index) => (
              <motion.div
                key={call.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 rounded-lg border"
              >
                <div className="flex items-center gap-4">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    call.estado === "success" ? "bg-emerald/10" : "bg-red-500/10"
                  }`}>
                    {call.estado === "success" ? (
                      <CheckCircle className="h-4 w-4 text-emerald" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-emerald/10 text-emerald">{call.method}</Badge>
                      <span className="font-mono text-sm">{call.endpoint}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {call.registros} registros &bull; {call.duracion}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={call.estado === "success" ? "default" : "destructive"} 
                    className={call.estado === "success" ? "bg-emerald/20 text-emerald" : ""}>
                    {call.estado}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">{call.fecha}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
        </div>
      </AppLayout>
    </AuthGuard>
  )
}
