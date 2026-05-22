import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            VendeBYD
          </Link>
          <div className="flex gap-4">
            <Link href="/browse" className="text-gray-600 hover:text-blue-600">
              Buscar
            </Link>
            <Link href="/sell" className="text-gray-600 hover:text-blue-600">
              Vender
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-50 to-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">Vende tu BYD sin comisión</h1>
          <p className="text-xl text-gray-600 mb-8">
            La primera plataforma P2P para vender autos chinos en Argentina. En 3 días, sin intermediarios.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/sell"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              Registra tu auto
            </Link>
            <Link
              href="/browse"
              className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50"
            >
              Buscar autos
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-12">
            <div>
              <p className="text-3xl font-bold text-blue-600">$2.8M</p>
              <p className="text-gray-600">Precio promedio</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-600">20%</p>
              <p className="text-gray-600">Más valor vs dealer</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-600">3 días</p>
              <p className="text-gray-600">Tiempo promedio</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">¿Por qué VendeBYD?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: '⚡',
              title: 'Rápido y seguro',
              desc: 'Vende en 3 días con verificación RENAPER y escrow seguro',
            },
            {
              icon: '💰',
              title: 'Más dinero',
              desc: 'Comisión del 3% vs 15-25% de los dealers',
            },
            {
              icon: '📋',
              title: 'Sin trámites',
              desc: 'Impuestos, RENAPER y seguros automáticos',
            },
            {
              icon: '🔒',
              title: 'Confianza',
              desc: 'Inspección certificada y garantía activada',
            },
            {
              icon: '🌟',
              title: 'Precio justo',
              desc: 'Ve el historial de precios de tu modelo',
            },
            {
              icon: '🎁',
              title: 'Gana con referidos',
              desc: 'Refiere amigos y gana crédito',
            },
          ].map((feature, i) => (
            <div key={i} className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition">
              <p className="text-4xl mb-4">{feature.icon}</p>
              <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4 mt-20">
        <div className="max-w-6xl mx-auto text-center">
          <p>&copy; 2024 VendeBYD. Todos los derechos reservados.</p>
          <p className="text-gray-400 mt-2">La primera plataforma P2P para vender autos chinos en Argentina</p>
        </div>
      </footer>
    </div>
  );
}
