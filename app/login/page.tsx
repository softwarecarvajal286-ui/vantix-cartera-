"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  ArrowRight,
  CirclePlay,
  Eye,
  EyeOff,
  Facebook,
  Globe,
  Linkedin,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Volume2,
  VolumeX,
} from "lucide-react"

import { BrandLockup } from "@/components/brand-mark"
import { BrandMascot } from "@/components/brand-mascot"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { brand } from "@/lib/brand"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"

const BACKGROUND_VIDEO_URL = "https://www.pexels.com/download/video/8201290/"

const demoProfiles = [
  {
    id: "admin",
    role: "Admin",
    caption: "Control total",
    username: "admin",
  },
  {
    id: "lider",
    role: "Lider",
    caption: "Vista regional",
    username: "lider",
  },
  {
    id: "gestor",
    role: "Gestor",
    caption: "Operacion diaria",
    username: "gestor",
  },
  {
    id: "vendedor",
    role: "Vendedor",
    caption: "Vista comercial",
    username: "vendedor",
  },
] as const

const trustMarks = ["Nexora Bank", "Atlas Capital", "Orbit Finance", "Redline Risk"]

function DemoAccessButton({
  role,
  caption,
  isActive,
  onClick,
}: {
  role: string
  caption: string
  isActive: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group rounded-[18px] border px-3.5 py-2.5 text-left transition-all duration-300 backdrop-blur-md",
        isActive
          ? "border-[#ff7a70]/55 bg-white/36 shadow-[0_18px_36px_rgba(255,93,82,0.18)]"
          : "border-white/18 bg-white/12 hover:border-white/28 hover:bg-white/18"
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-[13px] font-semibold text-slate-900">{role}</span>
        {isActive && (
          <span className="rounded-full border border-[#ff8a7f]/60 bg-[#ff695b] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
            activo
          </span>
        )}
      </div>
      <p className="mt-1 text-[10px] text-slate-500">{caption}</p>
    </button>
  )
}

function SocialButton({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/14 text-slate-600 backdrop-blur-md transition-colors duration-300 hover:bg-white/22 hover:text-slate-900"
    >
      {children}
    </button>
  )
}

export default function LoginPage() {
  const router = useRouter()
  const { login, isAuthenticated, isLoading } = useAuth()

  const [username, setUsername] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [rememberMe, setRememberMe] = React.useState(true)
  const [showPassword, setShowPassword] = React.useState(false)
  const [message, setMessage] = React.useState<string | null>(null)
  const [selectedProfile, setSelectedProfile] = React.useState<string | null>(null)
  const [isMuted, setIsMuted] = React.useState(true)

  const videoRef = React.useRef<HTMLVideoElement | null>(null)

  React.useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/")
    }
  }, [isAuthenticated, isLoading, router])

  const applyDemoProfile = React.useCallback((profileId: string) => {
    const profile = demoProfiles.find((item) => item.id === profileId)
    if (!profile) return

    setSelectedProfile(profileId)
    setUsername(profile.username)
    setPassword("1234567890")
    setMessage(null)
  }, [])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage(null)

    const success = await login(username, password)
    if (success) {
      router.replace("/")
      return
    }

    setMessage("No pudimos validar tus credenciales. Usa un acceso demo o intenta nuevamente.")
  }

  const toggleVideoSound = async () => {
    const video = videoRef.current
    if (!video) return

    const nextMuted = !isMuted
    video.muted = nextMuted
    setIsMuted(nextMuted)

    if (video.paused) {
      try {
        await video.play()
      } catch {
        setIsMuted(true)
        video.muted = true
      }
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#04050b] text-white">
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src={BACKGROUND_VIDEO_URL} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(160,88,255,0.28),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,93,82,0.18),transparent_28%),linear-gradient(90deg,rgba(3,6,12,0.86)_0%,rgba(6,9,18,0.58)_44%,rgba(6,9,18,0.18)_68%,rgba(240,238,233,0.18)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,15,0.18),rgba(2,6,15,0.42))]" />
      </div>

      <div className="relative z-10 grid min-h-screen w-full gap-4 px-4 py-4 sm:px-6 sm:py-6 md:grid-cols-[minmax(0,1fr)_360px] md:gap-6 lg:grid-cols-[minmax(0,1fr)_400px] lg:px-8 xl:grid-cols-[minmax(0,1fr)_440px] xl:px-10 2xl:px-12">
        <section className="relative hidden min-h-[calc(100vh-3rem)] flex-col justify-between overflow-hidden rounded-[34px] p-7 md:flex lg:p-8 xl:p-12">
          <div className="absolute inset-0 rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0))]" />
          <div className="absolute inset-y-10 left-6 hidden text-[8rem] font-semibold tracking-[-0.08em] text-white/5 xl:block">
            {brand.shortName}
          </div>

          <div className="relative z-10 flex items-start justify-between gap-6">
            <div className="flex items-center gap-5">
              <BrandLockup inverted showSlogan className="gap-4" size="lg" />
              <span className="hidden h-8 w-px bg-white/14 xl:block" />
              <span className="hidden text-xs uppercase tracking-[0.38em] text-white/52 xl:block">
                Plataforma de cobranza
              </span>
            </div>
            <div className="rounded-full border border-white/16 bg-white/8 px-4 py-2 text-[11px] uppercase tracking-[0.35em] text-white/72 backdrop-blur-md">
              selected work
            </div>
          </div>

          <div className="relative z-10 max-w-[760px]">
            <span className="mb-6 inline-flex h-1.5 w-12 rounded-full bg-[linear-gradient(90deg,#7c54ff,#ff6a5b)]" />
            <h1 className="max-w-[760px] text-4xl font-semibold leading-[0.96] tracking-[-0.06em] text-white lg:text-5xl xl:text-[5.75rem]">
              Control total.
              <br />
              Riesgo bajo.
              <br />
              <span className="bg-[linear-gradient(90deg,#8f63ff_0%,#d96dba_48%,#ff7659_100%)] bg-clip-text text-transparent">
                Mejores resultados.
              </span>
            </h1>
            <p className="mt-6 max-w-[560px] text-lg leading-relaxed text-white/76 xl:text-xl">
              {brand.slogan} Gestiona cartera, riesgo y recaudo desde una experiencia operativa mas
              clara, veloz y premium.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                className="group inline-flex items-center gap-4 rounded-full border border-white/18 bg-black/24 px-5 py-3 text-sm font-medium text-white/88 backdrop-blur-md transition-all duration-300 hover:border-white/28 hover:bg-black/34"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#9f7bff]/50 bg-[#0a0f1a]/80 text-[#a678ff] shadow-[0_0_30px_rgba(159,123,255,0.18)]">
                  <CirclePlay className="h-5 w-5 fill-current" />
                </span>
                Ver como funciona
              </button>
              <div className="rounded-full border border-white/14 bg-white/8 px-5 py-3 text-sm text-white/66 backdrop-blur-md">
                Suite premium para banca, financieras y equipos de recaudo.
              </div>
            </div>
          </div>

          <div className="relative z-10 flex items-end justify-between gap-8">
            <div className="w-full max-w-[680px] rounded-[28px] border border-white/14 bg-[linear-gradient(180deg,rgba(10,14,24,0.54),rgba(10,14,24,0.28))] px-6 py-5 shadow-[0_30px_90px_rgba(0,0,0,0.26)] backdrop-blur-xl">
              <div className="flex flex-wrap items-center gap-3 text-sm text-white/86">
                <span className="h-2.5 w-2.5 rounded-full bg-[#4ade80]" />
                Mas de 10.000 empresas confian en <span className="font-semibold text-[#d48cff]">{brand.name}</span>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {trustMarks.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm font-medium text-white/58"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden xl:flex xl:flex-col xl:items-end">
              <BrandMascot mode="ghost" className="h-40 w-40 opacity-55" />
              <p className="-mt-3 text-right text-xs uppercase tracking-[0.28em] text-white/40">
                {brand.mascot.name}
              </p>
            </div>
          </div>
        </section>

        <aside className="flex min-h-[calc(100vh-2rem)] items-center justify-center md:justify-end md:self-stretch">
          <div className="relative w-full max-w-[440px] overflow-hidden rounded-[34px] border border-white/18 bg-[linear-gradient(180deg,rgba(255,255,255,0.16),rgba(255,255,255,0.11)_56%,rgba(255,255,255,0.08))] p-5 shadow-[0_40px_100px_rgba(4,8,18,0.24)] backdrop-blur-[34px] sm:p-6 xl:max-w-[460px] xl:p-7">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.3),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(255,93,82,0.1),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))]" />
            <div className="pointer-events-none absolute -right-6 top-5 text-[4.75rem] font-semibold tracking-[-0.08em] text-slate-900/5 sm:text-[5.5rem]">
              {brand.shortName}
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between gap-4">
                <BrandLockup showSlogan className="gap-3" size="sm" />
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full border border-white/22 bg-white/16 px-4 py-2 text-sm font-medium text-slate-700 backdrop-blur-md transition-colors hover:bg-white/24"
                >
                  <Globe className="h-4 w-4" />
                  ES
                </button>
              </div>

              <div className="mt-6 md:hidden">
                <span className="mb-4 inline-flex h-1.5 w-12 rounded-full bg-[linear-gradient(90deg,#7c54ff,#ff6a5b)]" />
                <h1 className="text-4xl font-semibold tracking-[-0.06em] text-white">
                  Control total. Riesgo bajo.
                </h1>
                <p className="mt-4 max-w-md text-base leading-relaxed text-white/74">
                  {brand.slogan}
                </p>
              </div>

              <div className="mt-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-slate-500">
                  Acceso seguro
                </p>
                <h2 className="mt-2.5 text-3xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-[2.15rem]">
                  Hola, bienvenido
                </h2>
                <p className="mt-2.5 max-w-sm text-[14px] leading-6 text-slate-600">
                  Ingresa con tus credenciales para continuar en la plataforma o activa un acceso
                  demo para entrar en segundos.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-900" htmlFor="username">
                    Email o usuario
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="username"
                      value={username}
                      onChange={(event) => setUsername(event.target.value)}
                      placeholder="usuario@empresa.com"
                      className="h-13 rounded-2xl border-white/20 bg-white/18 pl-12 pr-4 text-slate-900 placeholder:text-slate-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_16px_30px_rgba(15,23,42,0.06)] backdrop-blur-md focus-visible:border-[#8f63ff]/35 focus-visible:ring-[#8f63ff]/18"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-900" htmlFor="password">
                    Contrasena
                  </label>
                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Ingresa tu contrasena"
                      className="h-13 rounded-2xl border-white/20 bg-white/18 pl-12 pr-12 text-slate-900 placeholder:text-slate-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_16px_30px_rgba(15,23,42,0.06)] backdrop-blur-md focus-visible:border-[#8f63ff]/35 focus-visible:ring-[#8f63ff]/18"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/28 bg-white/16 text-slate-500 transition-colors hover:bg-white/24 hover:text-slate-900"
                      aria-label={showPassword ? "Ocultar contrasena" : "Mostrar contrasena"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                  <label className="inline-flex items-center gap-2.5 text-slate-600">
                    <span
                      className={cn(
                        "flex h-4.5 w-4.5 items-center justify-center rounded-full border transition-colors",
                        rememberMe
                          ? "border-[#7c54ff]/45 bg-[#7c54ff]/12 text-[#7c54ff]"
                          : "border-slate-300 bg-white/40 text-transparent"
                      )}
                    >
                      <span className="h-2 w-2 rounded-full bg-current" />
                    </span>
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={rememberMe}
                      onChange={(event) => setRememberMe(event.target.checked)}
                    />
                    Recordarme
                  </label>

                  <button
                    type="button"
                    className="font-medium text-[#7c54ff] transition-colors hover:text-[#6948dd]"
                  >
                    Olvidaste tu contrasena?
                  </button>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="h-13 w-full rounded-2xl border-0 bg-[linear-gradient(90deg,#101727_0%,#1b2334_44%,#252e45_100%)] text-base font-semibold text-white shadow-[0_22px_44px_rgba(11,18,32,0.22)] transition-transform duration-300 hover:-translate-y-0.5 hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isLoading ? "Ingresando..." : "Ingresar"}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>

                {message && (
                  <div className="rounded-2xl border border-[#ffb4ad]/70 bg-[#fff1ef]/76 px-4 py-3 text-sm text-[#a33d34]">
                    {message}
                  </div>
                )}
              </form>

              <div className="mt-5">
                <div className="flex items-center gap-4">
                  <div className="h-px flex-1 bg-slate-300/70" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400">
                    Accesos demo
                  </span>
                  <div className="h-px flex-1 bg-slate-300/70" />
                </div>

                <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                  {demoProfiles.map((profile) => (
                    <DemoAccessButton
                      key={profile.id}
                      role={profile.role}
                      caption={profile.caption}
                      isActive={selectedProfile === profile.id}
                      onClick={() => applyDemoProfile(profile.id)}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-5 rounded-[20px] border border-white/20 bg-[linear-gradient(180deg,rgba(255,255,255,0.22),rgba(255,255,255,0.12))] px-4 py-3 shadow-[0_18px_36px_rgba(15,23,42,0.06)] backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <BrandMascot className="h-12 w-12 shrink-0 rounded-[18px]" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                      <ShieldCheck className="h-4 w-4 text-[#ff5d52]" />
                      {brand.mascot.name} - {brand.mascot.title}
                    </div>
                    <p className="mt-1 text-[11px] leading-5 text-slate-600">
                      Acceso rapido, control visual y una experiencia premium para tu operacion.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 text-center">
                <div className="mb-4 flex items-center gap-4">
                  <div className="h-px flex-1 bg-slate-300/70" />
                  <div className="inline-flex items-center gap-2 text-[11px] text-slate-500">
                    <ShieldCheck className="h-3.5 w-3.5 text-slate-500" />
                    Acceso seguro y protegido
                  </div>
                  <div className="h-px flex-1 bg-slate-300/70" />
                </div>
                <p className="text-[11px] text-slate-500">
                  {brand.name} v1.0 - {brand.slogan}
                </p>
                <div className="mt-3 flex items-center justify-center gap-3">
                  <SocialButton label="LinkedIn">
                    <Linkedin className="h-4.5 w-4.5" />
                  </SocialButton>
                  <SocialButton label="Facebook">
                    <Facebook className="h-4.5 w-4.5" />
                  </SocialButton>
                  <SocialButton label="Sitio web">
                    <Globe className="h-4.5 w-4.5" />
                  </SocialButton>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <button
        type="button"
        onClick={toggleVideoSound}
        className="absolute bottom-4 right-4 z-20 flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-black/28 text-white/84 shadow-[0_20px_40px_rgba(0,0,0,0.28)] backdrop-blur-xl transition-colors duration-300 hover:bg-black/40 sm:bottom-6 sm:right-6"
        aria-label={isMuted ? "Activar sonido del video" : "Silenciar sonido del video"}
      >
        {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
      </button>
    </main>
  )
}
