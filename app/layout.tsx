import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'VendeBYD – Vendé tu auto sin comisión',
  description: 'La primera plataforma P2P para vender autos chinos en Argentina. Verificación RENAPER, trámites automáticos, sin intermediarios.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-gray-50 min-h-screen">
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  )
}
