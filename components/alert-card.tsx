"use client"

import * as React from "react"
import { LucideIcon, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface AlertItem {
  id: string | number
  title: string
  description: string
  count?: number
  priority: "critical" | "warning" | "info"
  icon: LucideIcon
  onClick?: () => void
}

interface AlertCardProps {
  title: string
  alerts: AlertItem[]
  className?: string
}

const priorityStyles = {
  critical: {
    iconBg: "bg-destructive/10",
    iconColor: "text-destructive",
    countBg: "bg-destructive",
    countText: "text-white",
  },
  warning: {
    iconBg: "bg-warning/10",
    iconColor: "text-warning",
    countBg: "bg-warning",
    countText: "text-black",
  },
  info: {
    iconBg: "bg-info/10",
    iconColor: "text-info",
    countBg: "bg-info",
    countText: "text-white",
  },
}

export function AlertCard({ title, alerts, className }: AlertCardProps) {
  return (
    <Card className={cn("bg-card border-border", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {alerts.map((alert) => {
          const styles = priorityStyles[alert.priority]
          return (
            <Button
              key={alert.id}
              variant="ghost"
              className="w-full justify-start h-auto py-3 px-3 hover:bg-accent"
              onClick={alert.onClick}
            >
              <div className="flex items-center gap-3 w-full">
                <div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg shrink-0",
                    styles.iconBg
                  )}
                >
                  <alert.icon className={cn("h-4 w-4", styles.iconColor)} />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-sm font-medium text-card-foreground truncate">
                    {alert.title}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {alert.description}
                  </p>
                </div>
                {alert.count !== undefined && (
                  <span
                    className={cn(
                      "flex h-6 min-w-[24px] items-center justify-center rounded-full px-2 text-xs font-semibold",
                      styles.countBg,
                      styles.countText
                    )}
                  >
                    {alert.count}
                  </span>
                )}
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
              </div>
            </Button>
          )
        })}
      </CardContent>
    </Card>
  )
}
