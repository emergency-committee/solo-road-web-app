import { Armchair, UtensilsCrossed, VolumeX } from 'lucide-react'
import type { PlaceHighlight } from '../types/place.types'

const ICON_MAP: Record<PlaceHighlight['icon'], typeof Armchair> = {
  seat: Armchair,
  menu: UtensilsCrossed,
  quiet: VolumeX,
}

export function KeyHighlightsList({ highlights }: { highlights: PlaceHighlight[] }) {
  return (
    <section className="mb-lg">
      <h3 className="font-label-caps text-label-caps text-outline mb-md uppercase">
        Key Highlights
      </h3>
      <div className="gap-sm flex flex-wrap">
        {highlights.map((highlight) => {
          const Icon = ICON_MAP[highlight.icon]
          return (
            <div
              key={highlight.label}
              className="text-label-md gap-xs px-md py-sm flex items-center rounded-lg border border-[#006b7d]/15 bg-[#006b7d]/10 text-[#00515f]"
            >
              <Icon className="size-5" />
              <span>{highlight.label}</span>
            </div>
          )
        })}
      </div>
    </section>
  )
}
