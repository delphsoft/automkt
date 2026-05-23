'use client'
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useListings } from '@/hooks/useListings'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { BYD_MODELS, AR_PROVINCES, formatPrice, calculateVAT } from '@/lib/utils'

export default function ListingForm() {
  const { user, authUser } = useAuth()
  const { createListing, loading } = useListings()
  const router = useRouter()
  const [photos, setPhotos] = useState<File[]>([])
  const [form, setForm] = useState({
    model: '', year: new Date().getFullYear(), vin: '',
    odometer: 0, condition: 'excellent', color: '',
    city: 'Córdoba', province: 'Córdoba',
    description: '', price: 2000000, is_first_sale: true,
  })

  if (!user || !authUser) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">Necesitás iniciar sesión para publicar</p>
        <a href="/auth/login" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700">
          Iniciar sesión
        </a>
      </div>
    )
  }

  const vat = calculateVAT(form.price, form.is_first_sale)
  const f = (k: string, v: string | number | boolean) => setForm((p) => ({ ...p, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (photos.length < 3) { toast.error('Subí al menos 3 fotos'); return }
    try {
      await createListing(authUser.id, user.name, form, photos)
      toast.success('¡Publicación exitosa!')
      router.push('/browse')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error al publicar')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white rounded-2xl shadow p-8 space-y-5">
      <h1 className="text-3xl font-bold">Publicar tu BYD</h1>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Modelo</label>
          <select value={form.model} onChange={(e) => f('model', e.target.value)} required className="w-full border rounded-lg px-3 py-2 text-sm">
            <option value="">-- Seleccionar --</option>
            {BYD_MODELS.map((m) => <option key={m}>{m}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Año</label>
          <input type="number" value={form.year} onChange={(e) => f('year', +e.target.value)} min={2018} max={new Date().getFullYear()} required className="w-full border rounded-lg px-3 py-2 text-sm" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1">VIN</label>
        <input type="text" value={form.vin} onChange={(e) => f('vin', e.target.value.toUpperCase())} placeholder="17 caracteres" maxLength={17} required className="w-full border rounded-lg px-3 py-2 text-sm font-mono" />
        <p className="text-xs text-gray-400 mt-1">Se verificará en RENAPER automáticamente</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Kilometraje</label>
          <input type="number" value={form.odometer} onChange={(e) => f('odometer', +e.target.value)} required className="w-full border rounded-lg px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Condición</label>
          <select value={form.condition} onChange={(e) => f('condition', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm">
            <option value="excellent">Excelente</option>
            <option value="good">Muy bueno</option>
            <option value="fair">Bueno</option>
            <option value="poor">Regular</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Color</label>
          <input type="text" value={form.color} onChange={(e) => f('color', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Precio (ARS)</label>
          <input type="number" value={form.price} onChange={(e) => f('price', +e.target.value)} required className="w-full border rounded-lg px-3 py-2 text-sm" />
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-3 text-sm">
        <div className="flex justify-between"><span className="text-gray-600">Precio</span><span className="font-semibold">{formatPrice(form.price)}</span></div>
        <div className="flex justify-between"><span className="text-gray-600">IVA</span><span className={vat === 0 ? 'text-green-600' : 'text-gray-700'}>{vat === 0 ? 'Exento' : formatPrice(vat)}</span></div>
        <div className="flex justify-between font-bold border-t mt-1 pt-1"><span>Total comprador</span><span>{formatPrice(form.price + vat)}</span></div>
        <label className="flex items-center gap-2 mt-2 text-gray-600 cursor-pointer">
          <input type="checkbox" checked={form.is_first_sale} onChange={(e) => f('is_first_sale', e.target.checked)} />
          <span>Primera venta (sin IVA)</span>
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Ciudad</label>
          <input type="text" value={form.city} onChange={(e) => f('city', e.target.value)} required className="w-full border rounded-lg px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Provincia</label>
          <select value={form.province} onChange={(e) => f('province', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm">
            {AR_PROVINCES.map((p) => <option key={p}>{p}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1">Descripción</label>
        <textarea value={form.description} onChange={(e) => f('description', e.target.value)} rows={4} className="w-full border rounded-lg px-3 py-2 text-sm resize-none" placeholder="Estado del auto, mantenimiento, accesorios..." />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1">Fotos (mínimo 3)</label>
        <input type="file" multiple accept="image/*" onChange={(e) => setPhotos(Array.from(e.target.files || []))} className="w-full border rounded-lg px-3 py-2 text-sm" />
        <p className="text-xs text-gray-400 mt-1">{photos.length} foto{photos.length !== 1 ? 's' : ''} seleccionada{photos.length !== 1 ? 's' : ''}</p>
      </div>

      <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
        {loading ? 'Publicando...' : 'Publicar gratis'}
      </button>
    </form>
  )
}
