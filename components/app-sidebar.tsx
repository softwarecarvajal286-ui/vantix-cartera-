"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import {
  ChevronRight,
  HelpCircle,
  LogOut,
  Menu,
  Settings,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { navItems, type NavItem } from "@/lib/navigation"
import { brand } from "@/lib/brand"
import { BrandLockup, BrandMark } from "@/components/brand-mark"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

function normalizeText(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}

function getSidebarSlotClassName(active: boolean, isDark: boolean) {
  return cn(
    "group relative flex h-14 w-14 items-center justify-center rounded-[24px] border transition-[background-color,border-color,box-shadow,transform] duration-200 ease-out",
    isDark
      ? active
        ? "border-white/14 bg-white/[0.06] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_18px_34px_rgba(5,7,12,0.3)]"
        : "border-transparent bg-transparent hover:border-white/8 hover:bg-white/[0.035]"
      : active
        ? "border-slate-200/75 bg-white/58 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_16px_30px_rgba(148,163,184,0.18)]"
        : "border-transparent bg-transparent hover:border-slate-200/70 hover:bg-white/42"
  )
}

function getSidebarButtonClassName(active: boolean, isDark: boolean) {
  return cn(
    "relative z-20 flex h-11 w-11 items-center justify-center rounded-[18px] border transition-[transform,color,background-color,border-color,box-shadow] duration-200 ease-out",
    active
      ? "border-white/80 bg-white/96 text-slate-950 shadow-[0_16px_32px_rgba(255,255,255,0.15)]"
      : isDark
        ? "border-transparent bg-transparent text-slate-400 hover:border-white/8 hover:bg-white/8 hover:text-white"
        : "border-transparent bg-transparent text-slate-500 hover:border-slate-200/70 hover:bg-white/52 hover:text-slate-900"
  )
}

function SidebarIconButton({
  active,
  isDark,
  children,
  title,
  onClick,
}: {
  active: boolean
  isDark: boolean
  children: React.ReactNode
  title: string
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={getSidebarButtonClassName(active, isDark)}
    >
      {children}
    </button>
  )
}

function isItemRouteActive(pathname: string, item: NavItem) {
  if (item.href && pathname === item.href) {
    return true
  }

  return Boolean(
    item.children?.some((child) => pathname === child.href || pathname.startsWith(`${child.href}/`))
  )
}

export function AppSidebar() {
  const pathname = usePathname()
  const { resolvedTheme } = useTheme()
  const { user, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const sidebarRef = React.useRef<HTMLDivElement | null>(null)
  const isDark = resolvedTheme !== "light"

  const filteredNavItems = React.useMemo(() => {
    if (!user) return navItems
    const currentRole = normalizeText(user.role)
    return navItems.filter(
      (item) => !item.roles || item.roles.some((role) => normalizeText(role) === currentRole)
    )
  }, [user])

  const activeItemId = React.useMemo(() => {
    const activeItem = filteredNavItems.find((item) => isItemRouteActive(pathname, item))
    return activeItem?.id ?? filteredNavItems[0]?.id ?? null
  }, [filteredNavItems, pathname])

  const [expandedItem, setExpandedItem] = React.useState<string | null>(null)

  React.useEffect(() => {
    const activeItem = filteredNavItems.find((item) => item.id === activeItemId)
    if (activeItem?.children) {
      setExpandedItem(activeItem.id)
      return
    }

    setExpandedItem((current) => {
      if (!current) return null
      return filteredNavItems.some((item) => item.id === current && item.children) ? current : null
    })
  }, [activeItemId, filteredNavItems])

  React.useEffect(() => {
    if (!expandedItem) return

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null
      if (!target || !sidebarRef.current) return
      if (!sidebarRef.current.contains(target)) {
        setExpandedItem(null)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setExpandedItem(null)
      }
    }

    window.addEventListener("pointerdown", handlePointerDown)
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown)
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [expandedItem])

  const expandedNavItem = React.useMemo(
    () => filteredNavItems.find((item) => item.id === expandedItem && item.children),
    [expandedItem, filteredNavItems]
  )

  const isExpanded = Boolean(expandedNavItem)

  return (
    <>
      <aside ref={sidebarRef} className="fixed inset-y-3 left-3 z-50 hidden sm:block lg:inset-y-4 lg:left-4">
        <div
          className={cn(
            "relative h-full transition-[width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
            isExpanded ? "w-[320px] md:w-[336px] lg:w-[352px]" : "w-[92px] lg:w-[104px]"
          )}
        >
          <div
            className={cn(
              "glass-panel relative flex h-full rounded-[32px] border-white/12",
              isDark
                ? "bg-[linear-gradient(180deg,rgba(8,12,20,0.96),rgba(5,7,12,0.92))] text-white"
                : "border-slate-200/70 bg-[linear-gradient(180deg,rgba(240,244,249,0.92),rgba(232,238,245,0.86))] text-slate-900 shadow-[0_18px_36px_rgba(148,163,184,0.14)]"
            )}
          >
            <div
              className={cn(
                "pointer-events-none absolute inset-[1px] rounded-[31px]",
                isDark ? "border border-white/6" : "border border-white/55"
              )}
            />

            <div className="relative flex h-full w-[76px] shrink-0 flex-col items-center py-4 lg:w-[88px] lg:py-5">
              <div
                className={cn(
                  "pointer-events-none absolute inset-y-7 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-transparent to-transparent",
                  isDark ? "via-white/14" : "via-slate-200/90"
                )}
              />

              <div className="relative z-10 mb-6 lg:mb-7">
                <BrandMark size="md" />
              </div>

              <nav className="relative z-10 flex flex-1 flex-col items-center gap-1.5">
                {filteredNavItems.map((item) => {
                  const Icon = item.icon
                  const isItemActive = item.id === activeItemId
                  const isItemSelected = isItemActive || expandedItem === item.id

                  if (item.href && !item.children) {
                    return (
                      <div key={item.id} className={getSidebarSlotClassName(isItemSelected, isDark)}>
                        <span
                          className={cn(
                            "pointer-events-none absolute right-[7px] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full transition-[opacity,transform] duration-200",
                            isItemSelected
                              ? "scale-100 bg-[#ff5d52] opacity-100 shadow-[0_0_12px_rgba(255,93,82,0.52)]"
                              : "scale-50 opacity-0"
                          )}
                        />
                        <Link
                          href={item.href}
                          title={item.title}
                          className={getSidebarButtonClassName(isItemSelected, isDark)}
                        >
                          <Icon className="h-5 w-5" />
                        </Link>
                      </div>
                    )
                  }

                  return (
                    <div key={item.id} className={getSidebarSlotClassName(isItemSelected, isDark)}>
                      <span
                        className={cn(
                          "pointer-events-none absolute right-[7px] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full transition-[opacity,transform] duration-200",
                          isItemSelected
                            ? "scale-100 bg-[#ff5d52] opacity-100 shadow-[0_0_12px_rgba(255,93,82,0.52)]"
                            : "scale-50 opacity-0"
                        )}
                      />
                      <SidebarIconButton
                        title={item.title}
                        active={isItemSelected}
                        isDark={isDark}
                        onClick={() =>
                          setExpandedItem((current) => (current === item.id ? null : item.id))
                        }
                      >
                        <Icon className="h-5 w-5" />
                      </SidebarIconButton>
                    </div>
                  )
                })}
              </nav>

              <div
                className={cn(
                  "relative z-10 mt-auto flex flex-col items-center gap-2.5 pt-5",
                  isDark ? "border-t border-white/10" : "border-t border-slate-200/80"
                )}
              >
                <div className={getSidebarSlotClassName(false, isDark)}>
                  <SidebarIconButton active={false} isDark={isDark} title="Ayuda">
                    <HelpCircle className="h-4 w-4" />
                  </SidebarIconButton>
                </div>

                <div className={getSidebarSlotClassName(false, isDark)}>
                  <ThemeToggle
                    className={cn(
                      "relative z-20 h-11 w-11 rounded-[18px] border-transparent bg-transparent",
                      isDark
                        ? "text-slate-400 hover:border-white/10 hover:bg-white/8 hover:text-white"
                        : "text-slate-500 hover:border-slate-200/70 hover:bg-white/52 hover:text-slate-900"
                    )}
                  />
                </div>

                <div className={getSidebarSlotClassName(false, isDark)}>
                  <Link
                    href="/configuracion/tablas"
                    title="Configuracion"
                    className={cn(
                      "relative z-20 flex h-11 w-11 items-center justify-center rounded-[18px] border border-transparent transition-[color,background-color,border-color] duration-200 ease-out",
                      isDark
                        ? "text-slate-400 hover:border-white/10 hover:bg-white/8 hover:text-white"
                        : "text-slate-500 hover:border-slate-200/70 hover:bg-white/52 hover:text-slate-900"
                    )}
                  >
                    <Settings className="h-4 w-4" />
                  </Link>
                </div>

                <div className={getSidebarSlotClassName(false, isDark)}>
                  <SidebarIconButton active={false} isDark={isDark} title="Cerrar sesion" onClick={logout}>
                    <LogOut className="h-4 w-4" />
                  </SidebarIconButton>
                </div>
              </div>
            </div>

            <div
              className={cn(
                "overflow-hidden transition-[width,opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                isExpanded ? "w-[244px] translate-x-0 opacity-100 md:w-[260px] lg:w-[264px]" : "w-0 translate-x-3 opacity-0"
              )}
            >
              <div
                className={cn(
                  "flex h-full w-[244px] flex-col py-4 pr-4 backdrop-blur-[30px] md:w-[260px] md:pr-5 lg:w-[264px] lg:py-5 lg:pr-5",
                  isDark
                    ? "border-l border-white/10 bg-[linear-gradient(180deg,rgba(12,17,27,0.9),rgba(9,14,23,0.84))] shadow-[-18px_0_40px_rgba(5,7,12,0.16)]"
                    : "border-l border-slate-200/80 bg-[linear-gradient(180deg,rgba(239,243,248,0.92),rgba(232,238,245,0.88))] text-slate-900 shadow-[-12px_0_30px_rgba(148,163,184,0.12)]"
                )}
              >
                <div className="px-4">
                  <BrandLockup inverted={isDark} />
                  <div
                    className={cn(
                      "mt-4 inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]",
                      isDark
                        ? "border border-white/12 bg-white/[0.06] text-white/52"
                        : "border border-slate-200/80 bg-white/56 text-slate-500"
                    )}
                  >
                    Sistema
                  </div>
                  <h3 className={cn("mt-3 text-base font-semibold", isDark ? "text-white" : "text-slate-900")}>
                    {expandedNavItem?.title ?? brand.name}
                  </h3>
                  <p className={cn("mt-1 max-w-[198px] text-xs leading-5 lg:max-w-[210px]", isDark ? "text-white/58" : "text-slate-500")}>
                    Navegacion modular con enfoque en productividad.
                  </p>
                </div>

                <div className="mt-5 space-y-1 px-2">
                  {expandedNavItem?.children?.map((child, index) => {
                    const ChildIcon = child.icon
                    const isChildActive =
                      pathname === child.href || pathname.startsWith(`${child.href}/`)

                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          "flex min-h-[56px] items-start gap-3 rounded-2xl px-3.5 py-3 text-sm transition-[transform,color,background-color,box-shadow,opacity] duration-200 ease-out",
                          isDark
                            ? isChildActive
                              ? "border border-white/20 bg-white/12 text-white shadow-[0_12px_28px_rgba(5,7,12,0.26)]"
                              : "border border-transparent text-white/72 hover:border-white/10 hover:bg-white/[0.06] hover:text-white"
                            : isChildActive
                              ? "border border-slate-200/80 bg-white/62 text-slate-900 shadow-[0_12px_28px_rgba(148,163,184,0.14)]"
                              : "border border-transparent text-slate-600 hover:border-slate-200/70 hover:bg-white/44 hover:text-slate-900"
                        )}
                        style={{
                          transitionDelay: isExpanded ? `${index * 20}ms` : "0ms",
                        }}
                      >
                        <ChildIcon className="mt-0.5 h-4 w-4 shrink-0" />
                        <span className="line-clamp-2 min-w-0 flex-1 leading-5">{child.title}</span>
                        <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 opacity-40" />
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <div className="fixed bottom-4 left-4 z-50 sm:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              className="glass-panel flex h-14 w-14 items-center justify-center rounded-2xl border-white/14 bg-[linear-gradient(180deg,rgba(8,12,20,0.96),rgba(5,7,12,0.92))] text-white shadow-[0_18px_34px_rgba(5,7,12,0.32)]"
            >
              <Menu className="h-5 w-5" />
            </button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-[88vw] max-w-none border-r border-white/10 bg-[linear-gradient(180deg,rgba(8,12,20,0.98),rgba(5,7,12,0.94))] p-0 text-white sm:max-w-sm"
          >
            <div className="flex h-full flex-col">
              <div className="border-b border-white/10 px-5 py-5">
                <SheetTitle className="sr-only">Menu principal</SheetTitle>
                <SheetDescription className="sr-only">
                  Navegacion principal de {brand.name}
                </SheetDescription>
                <BrandLockup showSlogan inverted />
                <p className="mt-3 text-xs text-white/48">
                  {user?.role ?? "Operacion"} · Navegacion movil
                </p>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-4">
                <div className="space-y-4">
                  {filteredNavItems.map((item) => {
                    const Icon = item.icon
                    const isItemActive = isItemRouteActive(pathname, item)

                    if (item.href && !item.children) {
                      return (
                        <SheetClose asChild key={item.id}>
                          <Link
                            href={item.href}
                            className={cn(
                              "flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition-colors",
                              isItemActive
                                ? "border-white/18 bg-white/[0.08] text-white"
                                : "border-white/8 bg-white/[0.03] text-white/72 hover:bg-white/[0.05] hover:text-white"
                            )}
                          >
                            <span
                              className={cn(
                                "flex h-10 w-10 items-center justify-center rounded-xl border",
                                isItemActive
                                  ? "border-white/20 bg-white/90 text-slate-950"
                                  : "border-white/10 bg-white/[0.04] text-white/72"
                              )}
                            >
                              <Icon className="h-[18px] w-[18px]" />
                            </span>
                            <span className="flex-1">{item.title}</span>
                            <ChevronRight className="h-4 w-4 opacity-40" />
                          </Link>
                        </SheetClose>
                      )
                    }

                    return (
                      <div key={item.id} className="rounded-[24px] border border-white/8 bg-white/[0.03] p-3">
                        <div className="flex items-center gap-3 px-1 pb-2">
                          <span
                            className={cn(
                              "flex h-10 w-10 items-center justify-center rounded-xl border",
                              isItemActive
                                ? "border-white/20 bg-white/90 text-slate-950"
                                : "border-white/10 bg-white/[0.04] text-white/72"
                            )}
                          >
                            <Icon className="h-[18px] w-[18px]" />
                          </span>
                          <div>
                            <p className="text-sm font-semibold text-white">{item.title}</p>
                            <p className="text-xs text-white/46">Acceso modular</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          {item.children?.map((child) => {
                            const ChildIcon = child.icon
                            const isChildActive =
                              pathname === child.href || pathname.startsWith(`${child.href}/`)

                            return (
                              <SheetClose asChild key={child.href}>
                                <Link
                                  href={child.href}
                                  className={cn(
                                    "flex items-center gap-3 rounded-2xl border px-3 py-3 text-sm transition-colors",
                                    isChildActive
                                      ? "border-white/18 bg-white/[0.08] text-white"
                                      : "border-white/8 bg-transparent text-white/72 hover:bg-white/[0.05] hover:text-white"
                                  )}
                                >
                                  <ChildIcon className="h-4 w-4 shrink-0" />
                                  <span className="flex-1">{child.title}</span>
                                  <ChevronRight className="h-4 w-4 opacity-40" />
                                </Link>
                              </SheetClose>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="border-t border-white/10 px-4 py-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-2">
                    <ThemeToggle className="h-11 w-full rounded-xl border-white/10 bg-white/[0.04] text-white/72 hover:bg-white/[0.08] hover:text-white" />
                  </div>

                  <SheetClose asChild>
                    <Link
                      href="/configuracion/tablas"
                      className="flex h-[60px] items-center justify-center rounded-2xl border border-white/8 bg-white/[0.03] text-sm font-medium text-white/72 transition-colors hover:bg-white/[0.05] hover:text-white"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Config
                    </Link>
                  </SheetClose>
                </div>

                <button
                  type="button"
                  onClick={logout}
                  className="mt-3 flex w-full items-center justify-center rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm font-medium text-white/72 transition-colors hover:bg-white/[0.05] hover:text-white"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar sesion
                </button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
