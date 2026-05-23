import Navigation from '@/components/Navigation'
import ListingForm from '@/components/ListingForm'

export default function Sell() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="max-w-2xl mx-auto px-4 py-10">
        <ListingForm />
      </div>
    </div>
  )
}
