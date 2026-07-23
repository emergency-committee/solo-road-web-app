import { createFileRoute } from '@tanstack/react-router'
import { MapPin, Search, SlidersHorizontal } from 'lucide-react'
import {
  HiddenGemsGrid,
  MiniMapPreviewCard,
  mockHiddenGems,
  mockSoloDiningPlaces,
  SoloFriendlySection,
} from '@/features/home'

export const Route = createFileRoute('/_shell/')({
  component: HomePage,
})

function HomePage() {
  return (
    <div className="bg-background min-h-screen">
      <header className="px-margin-mobile py-base flex items-center justify-between">
        <div className="gap-xs flex items-center">
          <MapPin className="text-primary size-5" />
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary font-bold">
            서울시 강남구
          </h1>
        </div>
      </header>
      <main className="space-y-xl px-margin-mobile pb-8">
        <section className="relative">
          <div className="border-outline-variant bg-surface-container-lowest px-md py-sm flex items-center rounded-xl border shadow-sm">
            <Search className="mr-xs text-outline size-5" />
            <input
              className="placeholder:text-outline-variant text-body-md w-full border-none bg-transparent focus:ring-0"
              placeholder="어디로 혼자 떠나볼까요?"
              type="text"
            />
            <SlidersHorizontal className="ml-xs text-primary size-5" />
          </div>
        </section>

        <MiniMapPreviewCard />
        <SoloFriendlySection places={mockSoloDiningPlaces} />
        <HiddenGemsGrid places={mockHiddenGems} />
      </main>
    </div>
  )
}
