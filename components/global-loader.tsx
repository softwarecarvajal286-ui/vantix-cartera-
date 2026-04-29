"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { brand } from "@/lib/brand"

interface GlobalLoaderProps {
  isLoading?: boolean
  text?: string
  fullScreen?: boolean
  variant?: "default" | "minimal" | "overlay"
}

export function GlobalLoader({ 
  isLoading = true, 
  text = "Cargando...",
  fullScreen = true,
  variant = "default"
}: GlobalLoaderProps) {
  if (!isLoading) return null

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "flex items-center justify-center z-50",
            fullScreen ? "fixed inset-0" : "absolute inset-0",
            variant === "overlay" && "bg-background/80 backdrop-blur-sm",
            variant === "default" && "bg-background"
          )}
        >
          <div className="flex flex-col items-center gap-4">
            {/* Animated Logo */}
            <motion.div 
              className="relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {/* Outer ring */}
              <motion.div
                className="absolute inset-0 h-16 w-16 rounded-2xl border-2 border-[#ff5d52]/25"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
              
              {/* Inner pulsing square */}
              <motion.div
                className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-[#111723] via-[#0a111d] to-[#ff5d52] shadow-lg shadow-[#ff5d52]/20"
                animate={{ 
                  scale: [1, 0.95, 1],
                }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <span className="text-xl font-bold text-white">{brand.shortName}</span>
              </motion.div>
              
              {/* Orbiting dot */}
              <motion.div
                className="absolute h-3 w-3 rounded-full bg-[#ff5d52] shadow-lg shadow-[#ff5d52]/50"
                animate={{
                  rotate: 360,
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                style={{ 
                  top: "50%", 
                  left: "50%",
                  marginTop: -6,
                  marginLeft: -6,
                  transformOrigin: "6px 40px"
                }}
              />
            </motion.div>

            {/* Loading text */}
            {variant !== "minimal" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col items-center gap-1"
              >
                <span className="text-sm font-medium text-foreground">{text}</span>
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="h-1.5 w-1.5 rounded-full bg-[#ff5d52]"
                      animate={{ 
                        opacity: [0.3, 1, 0.3],
                        scale: [0.8, 1, 0.8]
                      }}
                      transition={{ 
                        duration: 0.8, 
                        repeat: Infinity, 
                        delay: i * 0.15 
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Skeleton loader for cards
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn(
      "rounded-xl bg-card border border-border p-5 animate-pulse",
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-3 flex-1">
          <div className="h-4 w-24 bg-muted rounded" />
          <div className="h-8 w-32 bg-muted rounded" />
          <div className="h-3 w-20 bg-muted rounded" />
        </div>
        <div className="h-11 w-11 bg-muted rounded-xl" />
      </div>
    </div>
  )
}

// Page transition wrapper
export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  )
}

// Stagger children animation wrapper
export function StaggerContainer({ 
  children, 
  className,
  delay = 0.05
}: { 
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: delay
          }
        }
      }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ 
  children, 
  className 
}: { 
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { duration: 0.4, ease: "easeOut" }
        }
      }}
    >
      {children}
    </motion.div>
  )
}
