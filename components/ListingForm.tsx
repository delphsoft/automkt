'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useListings } from '@/hooks/useListings';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const BYD_MODELS = ['Seagull', 'Yuan Plus', 'Song', 'Atto 3'];

export default function ListingForm() {
  const { user, firebaseUser } = useAuth();
  const { createListing, loading } = useListings();
  const router = useRouter();

  const [photos, setPhotos] = useState<File[]>([]);
  const [form, setForm] = useState({
    model: '',
    year: new Date().getFullYear(),
    vin: '',
    odometer: 0,
    condition: 'excellent' as const,
    color: '',
    city: 'Córdoba',
    province: 'Córdoba',
    description: '',
    price: 2000000,
    isFirstSale: true,
  });

  if (!user || !firebaseUser) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <p className="text-center text-gray-600">Por favor inicia sesión primero</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (photos.length < 3) {
      toast.error('Por favor sube al menos 3 fotos');
      return;
    }

    try {
      await createListing(
        firebaseUser.uid,
        user.name,
        {
          brand: 'BYD',
          ...form,
        },
        photos,
        form.isFirstSale
      );

      toast.success('¡Anuncio publicado exitosamente!');
      router.push('/browse');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
      <h1 className="text-3xl font-bold mb-6">Registra tu BYD</h1>

      <div className="mb-4">
        <label className="block font-semibold mb-2">Modelo</label>
        <select
          value={form.model}
          onChange={(e) => setForm({ ...form, model: e.target.value })}
          required
          className="w-full border rounded px-3 py-2"
        >
          <option value="">-- Selecciona --</option>
          {BYD_MODELS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-2">Año</label>
        <input
          type="number"
          value={form.year}
          onChange={(e) => setForm({ ...form, year: parseInt(e.target.value) })}
          min="2015"
          max={new Date().getFullYear()}
          required
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-2">VIN</label>
        <input
          type="text"
          value={form.vin}
          onChange={(e) => setForm({ ...form, vin: e.target.value.toUpperCase() })}
          placeholder="Número de identificación del vehículo"
          required
          className="w-full border rounded px-3 py-2"
        />
        <p className="text-xs text-gray-500 mt-1">Se verificará en RENAPER automáticamente</p>
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-2">Kilometraje</label>
        <input
          type="number"
          value={form.odometer}
          onChange={(e) => setForm({ ...form, odometer: parseInt(e.target.value) })}
          required
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-2">Precio (ARS)</label>
        <input
          type="number"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: parseInt(e.target.value) })}
          required
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-2">Condición</label>
        <select
          value={form.condition}
          onChange={(e) => setForm({ ...form, condition: e.target.value as any })}
          className="w-full border rounded px-3 py-2"
        >
          <option value="excellent">Excelente</option>
          <option value="good">Muy bueno</option>
          <option value="fair">Bueno</option>
          <option value="poor">Regular</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-2">Color</label>
        <input
          type="text"
          value={form.color}
          onChange={(e) => setForm({ ...form, color: e.target.value })}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block font-semibold mb-2">Ciudad</label>
          <input
            type="text"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-semibold mb-2">Provincia</label>
          <input
            type="text"
            value={form.province}
            onChange={(e) => setForm({ ...form, province: e.target.value })}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-2">Descripción</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={4}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-2">Fotos (mínimo 3)</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setPhotos(Array.from(e.target.files || []))}
          required
          className="w-full border rounded px-3 py-2"
        />
        <p className="text-xs text-gray-500 mt-1">{photos.length} fotos seleccionadas</p>
      </div>

      <div className="mb-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.isFirstSale}
            onChange={(e) => setForm({ ...form, isFirstSale: e.target.checked })}
            className="w-4 h-4"
          />
          <span>Esta es mi primera venta (sin IVA)</span>
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white font-bold py-3 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Publicando...' : 'Publicar anuncio (es gratis)'}
      </button>
    </form>
  );
}
