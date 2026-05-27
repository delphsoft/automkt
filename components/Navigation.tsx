'use client'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { usePathname } from 'next/navigation'

export default function Navigation() {
  const { user, logout } = useAuth()
  const pathname = usePathname()

  const isHome = pathname === '/'

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backdropFilter: 'blur(18px) saturate(140%)',
      background: 'rgba(8,8,10,0.65)',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
    }}>
      <nav style={{
        maxWidth: 1260,
        margin: '0 auto',
        padding: '0 40px',
        height: 72,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 24,
      }}>

        {/* Logo */}
        <Link href="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          fontWeight: 700,
          fontSize: 18,
          letterSpacing: '-0.02em',
          textDecoration: 'none',
          color: 'var(--text)',
        }}>
          <span style={{
            width: 32, height: 32,
            borderRadius: 9,
            background: 'linear-gradient(135deg, #E60012 0%, #b8000e 100%)',
            display: 'grid',
            placeItems: 'center',
            color: '#fff',
            fontWeight: 800,
            fontSize: 11,
            letterSpacing: '0.02em',
            boxShadow: '0 0 0 1px rgba(255,255,255,0.08), 0 4px 12px rgba(230,0,18,0.3)',
            flexShrink: 0,
          }}>BYD</span>
          <span>
            Drivers{' '}
            <span style={{ color: 'var(--text-3)', fontWeight: 400, fontSize: 13 }}>
              Argentina
            </span>
          </span>
        </Link>

        {/* Nav links */}
        <div style={{ display: 'flex', gap: 32, fontSize: 14, color: 'var(--text-2)' }}>
          <Link href="/browse"
            style={{
              textDecoration: 'none',
              color: pathname === '/browse' ? 'var(--text)' : 'var(--text-2)',
              transition: 'color 0.15s',
            }}>
            Explorar
          </Link>
          <Link href="/#como"
            style={{ textDecoration: 'none', color: 'var(--text-2)', transition: 'color 0.15s' }}>
            Cómo funciona
          </Link>
          <Link href="/#referente"
            style={{ textDecoration: 'none', color: 'var(--text-2)', transition: 'color 0.15s' }}>
            Ser referente
          </Link>
          <Link href="/#asesor"
            style={{ textDecoration: 'none', color: 'var(--text-2)', transition: 'color 0.15s' }}>
            Asesor IA
          </Link>
        </div>

        {/* CTA */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {user ? (
            <>
              <Link href="/dashboard" style={{
                padding: '10px 18px',
                borderRadius: 'var(--radius-pill)',
                border: '1px solid var(--border-strong)',
                color: 'var(--text)',
                fontSize: 14,
                fontWeight: 500,
                textDecoration: 'none',
                transition: 'all 0.2s',
              }}>
                Mi cuenta
              </Link>
              <button
                onClick={logout}
                style={{
                  padding: '10px 18px',
                  borderRadius: 'var(--radius-pill)',
                  border: '1px solid var(--border-strong)',
                  color: 'var(--text-2)',
                  fontSize: 14,
                  fontWeight: 500,
                  background: 'transparent',
                  transition: 'all 0.2s',
                }}>
                Salir
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" style={{
                padding: '10px 18px',
                borderRadius: 'var(--radius-pill)',
                border: '1px solid var(--border-strong)',
                color: 'var(--text)',
                fontSize: 14,
                fontWeight: 500,
                textDecoration: 'none',
                background: 'transparent',
                transition: 'all 0.2s',
              }}>
                Ingresar
              </Link>
              <Link href="/sell" style={{
                padding: '10px 18px',
                borderRadius: 'var(--radius-pill)',
                background: 'var(--byd-red)',
                color: '#fff',
                fontSize: 14,
                fontWeight: 600,
                textDecoration: 'none',
                border: '1px solid var(--byd-red)',
                transition: 'all 0.2s',
              }}>
                Publicar gratis
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
