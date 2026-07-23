import { ShieldCheck } from 'lucide-react'

interface SoloAnalysisCardProps {
  soloFriendliness: 'High' | 'Medium' | 'Low'
  hashtags: string[]
}

const LEVEL_LABEL: Record<SoloAnalysisCardProps['soloFriendliness'], string> = {
  High: 'High (매우 높음)',
  Medium: 'Medium (보통)',
  Low: 'Low (낮음)',
}

export function SoloAnalysisCard({ soloFriendliness, hashtags }: SoloAnalysisCardProps) {
  return (
    <section className="mb-lg">
      <h2 className="font-label-caps text-label-caps text-outline mb-md uppercase">
        Solo-road Analysis
      </h2>
      <div className="bg-primary-container/10 border-primary/5 p-md flex items-center justify-between rounded-xl border">
        <div className="gap-md flex items-center">
          <div className="bg-primary flex size-12 items-center justify-center rounded-full text-white">
            <ShieldCheck className="size-7" />
          </div>
          <div>
            <p className="text-body-sm text-on-surface-variant">Solo-friendliness</p>
            <p className="font-headline-lg-mobile text-headline-lg-mobile text-primary">
              {LEVEL_LABEL[soloFriendliness]}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-xs gap-xs flex flex-wrap">
        {hashtags.map((tag) => (
          <span
            key={tag}
            className="border-outline-variant/20 text-label-md text-on-surface-variant bg-surface-container-high px-md rounded-full border py-1"
          >
            {tag}
          </span>
        ))}
      </div>
    </section>
  )
}
