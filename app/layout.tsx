import type { Metadata } from "next"
import { RootProviders } from "@/components/root-providers"
import { brand } from "@/lib/brand"
import "./globals.css"

export const metadata: Metadata = {
  title: `${brand.name} - ${brand.slogan}`,
  description: brand.description,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="min-h-screen bg-[#05070c] font-sans antialiased">
        <RootProviders>{children}</RootProviders>
      </body>
    </html>
  )
}
