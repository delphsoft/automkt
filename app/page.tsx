import Link from 'next/link'
import Navigation from '@/components/Navigation'

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />

      <section className="bg-gradient-to-br from-blue-50 to-white py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block bg-blue-100 text-blue-700 text-sm font-semibold px-4 py-1 rounded-full mb-6">
            🇦🇷 Primera plataforma P2P de autos chinos en Argentina
          </span>
          <h1 className="text-5xl font-bold mb-5 leading-tight">
            Vendé tu BYD sin<br />comisión, en 3 días
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-xl mx-auto">
            Sin intermediarios. Verificación RENAPER automática, trámites incluidos, escrow seguro.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/sell" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors">
              Publicar mi BYD
            </Link>
            <Link href="/browse" className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-colors">
              Buscar autos
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-6 mt-16 max-w-lg mx-auto">
            {[
              { n: '3%', l: 'comisión vs 20% dealer' },
              { n: '3 días', l: 'tiempo promedio de venta' },
              { n: '100%', l: 'legal con RENAPER' },
            ].map(({ n, l }) => (
              <div key={n} className="text-center">
                <p className="text-3xl font-bold text-blue-600">{n}</p>
                <p className="text-sm text-gray-500 mt-1">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">¿Por qué VendeBYD?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: '⚡', title: 'Rápido y seguro', desc: 'VIN verificado con RENAPER, escrow seguro, cierre en 3 días.' },
            { icon: '💰', title: 'Más plata para vos', desc: '3% de comisión vs 15-25% de los dealers. Guardá hasta $400K más.' },
            { icon: '📋', title: 'Sin trámites', desc: 'AFIP, RENAPER, seguro y garantía BYD gestionados automáticamente.' },
            { icon: '🔒', title: 'Confianza total', desc: 'Inspección de mecánico certificado BYD incluida.' },
            { icon: '🏦', title: 'Financiación integrada', desc: 'Pre-aprobación con Ualá y Mercado Crédito en 60 segundos.' },
            { icon: '🎁', title: 'Programa de referidos', desc: 'Referí un amigo → ambos ganan 8.000 ARS de crédito.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
              <span className="text-4xl">{icon}</span>
              <h3 className="font-bold text-lg mt-3 mb-2">{title}</h3>
              <p className="text-gray-600 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-blue-600 text-white py-16 px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Primeros 50 vendedores: publicación gratis</h2>
        <p className="text-blue-100 mb-8">Más de 20% de valor adicional vs. entregar el auto al concesionario</p>
        <Link href="/auth/signup" className="bg-white text-blue-600 font-bold px-8 py-4 rounded-xl text-lg hover:bg-blue-50">
          Registrarme ahora
        </Link>
      </section>

      <footer className="bg-gray-900 text-gray-400 text-sm text-center py-8">
        <p>© 2025 VendeBYD · La primera plataforma P2P para autos chinos en Argentina</p>
      </footer>
    </div>
  )
}
