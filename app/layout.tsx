import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'VendeBYD - Vende tu auto sin comisión',
  description: 'La primera plataforma P2P para vender autos chinos en Argentina',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="bg-gray-50">{children}</body>
    </html>
  )
}
