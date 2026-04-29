"use client"

import { useApp } from "@/lib/app-context"
import { X, CheckCircle2, AlertCircle, AlertTriangle, Info } from "lucide-react"
import { cn } from "@/lib/utils"

export function NotificationToast() {
  const { notificaciones, cerrarNotificacion } = useApp()

  if (notificaciones.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {notificaciones.map((notif) => (
        <div
          key={notif.id}
          className={cn(
            "flex items-start gap-3 p-4 rounded-lg shadow-lg border animate-in slide-in-from-right-5 duration-300",
            notif.tipo === "success" && "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400",
            notif.tipo === "error" && "bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400",
            notif.tipo === "warning" && "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400",
            notif.tipo === "info" && "bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400"
          )}
        >
          <div className="shrink-0 mt-0.5">
            {notif.tipo === "success" && <CheckCircle2 className="h-5 w-5" />}
            {notif.tipo === "error" && <AlertCircle className="h-5 w-5" />}
            {notif.tipo === "warning" && <AlertTriangle className="h-5 w-5" />}
            {notif.tipo === "info" && <Info className="h-5 w-5" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm">{notif.titulo}</p>
            <p className="text-sm opacity-80 mt-0.5">{notif.mensaje}</p>
          </div>
          <button
            onClick={() => cerrarNotificacion(notif.id)}
            className="shrink-0 p-1 hover:bg-foreground/10 rounded transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
