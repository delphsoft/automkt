'use client';

import ListingForm from '@/components/ListingForm';
import Link from 'next/link';

export default function Sell() {
  return (
    <div className="min-h-screen bg-gray-50">
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
            <Link href="/sell" className="text-blue-600 font-semibold">
              Vender
            </Link>
          </div>
        </nav>
      </header>

      <div className="max-w-3xl mx-auto p-4 py-8">
        <ListingForm />
      </div>
    </div>
  );
}
