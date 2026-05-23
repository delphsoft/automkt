export const formatPrice = (price: number) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(price)

export const calculateVAT = (price: number, isFirstSale: boolean): number =>
  isFirstSale ? 0 : Math.round(price * 0.21)

export const conditionLabel: Record<string, string> = {
  excellent: 'Excelente',
  good: 'Muy bueno',
  fair: 'Bueno',
  poor: 'Regular',
}

export const BYD_MODELS = ['Seagull', 'Yuan Plus', 'Song', 'Atto 3', 'Dolphin', 'Han']

export const AR_PROVINCES = [
  'Buenos Aires', 'CABA', 'Córdoba', 'Santa Fe',
  'Mendoza', 'Rosario', 'Tucumán', 'Salta', 'Misiones',
]
