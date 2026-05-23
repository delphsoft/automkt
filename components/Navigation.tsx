'use client'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { usePathname } from 'next/navigation'

export default function Navigation() {
  const { user, logout } = useAuth()
  const pathname = usePathname()

  const active = (path: string) =>
    pathname === path ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-blue-600'

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600">VendeBYD</Link>
        <div className="flex items-center gap-6">
          <Link href="/browse" className={active('/browse')}>Buscar</Link>
          <Link href="/sell" className={active('/sell')}>Vender</Link>
          {user ? (
            <>
              <Link href="/dashboard" className={active('/dashboard')}>Mi cuenta</Link>
              <button onClick={logout} className="text-gray-500 hover:text-red-500 text-sm">Salir</button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className={active('/auth/login')}>Ingresar</Link>
              <Link href="/auth/signup" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700">
                Registrarse
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
