import Navigation from '@/components/Navigation'
import ListingForm from '@/components/ListingForm'

export default function Sell() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Publicar mi auto</h1>
          <p className="text-sm text-gray-500 mt-1">Gratis · Verificación automática · Cerrá en 3 días</p>
        </div>
        <ListingForm />
      </div>
    </div>
  )
}
