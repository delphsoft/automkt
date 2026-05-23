'use client'
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function Signup() {
  const { signup, error } = useAuth()
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', user_type: 'buyer' as const })
  const [loading, setLoading] = useState(false)
  const f = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await signup(form.email, form.password, { name: form.name, phone: form.phone, email: form.email, user_type: form.user_type })
      toast.success('¡Cuenta creada! Revisá tu email para confirmar.')
      router.push('/browse')
    } catch { /* error shown via hook */ } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow p-8 w-full max-w-md">
        <Link href="/" className="text-2xl font-bold text-blue-600 block mb-6">VendeBYD</Link>
        <h1 className="text-2xl font-bold mb-6">Crear cuenta</h1>
        {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Nombre completo</label>
            <input type="text" value={form.name} onChange={(e) => f('name', e.target.value)} required className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Email</label>
            <input type="email" value={form.email} onChange={(e) => f('email', e.target.value)} required className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Contraseña</label>
            <input type="password" value={form.password} onChange={(e) => f('password', e.target.value)} required minLength={6} className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Teléfono</label>
            <input type="tel" value={form.phone} onChange={(e) => f('phone', e.target.value)} required className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Soy</label>
            <select value={form.user_type} onChange={(e) => f('user_type', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm">
              <option value="buyer">Comprador</option>
              <option value="seller">Vendedor</option>
              <option value="dealer">Dealer / Concesionaria</option>
            </select>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors">
            {loading ? 'Creando cuenta...' : 'Crear cuenta gratis'}
          </button>
        </form>
        <p className="text-sm text-center text-gray-500 mt-4">
          ¿Ya tenés cuenta? <Link href="/auth/login" className="text-blue-600 font-semibold">Ingresar</Link>
        </p>
      </div>
    </div>
  )
}
