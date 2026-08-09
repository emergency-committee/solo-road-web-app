import { ShieldCheck } from 'lucide-react'

interface SoloAnalysisCardProps {
  /** solo_road_server의 SoloScoresGrade와 동일한 값(HIGH/MEDIUM/LOW). */
  soloFriendliness: 'HIGH' | 'MEDIUM' | 'LOW'
  hashtags: string[]
}

const LEVEL_LABEL: Record<SoloAnalysisCardProps['soloFriendliness'], string> = {
  HIGH: '매우 높음',
  MEDIUM: '보통',
  LOW: '낮음',
}

export function SoloAnalysisCard({ soloFriendliness, hashtags }: SoloAnalysisCardProps) {
  return (
    <section className="mb-lg">
      <h2 className="font-label-caps text-label-caps text-outline mb-md uppercase">
        솔로더 분석
      </h2>
      <div className="bg-primary-container/10 border-primary/5 p-md flex items-center justify-between rounded-xl border">
        <div className="gap-md flex items-center">
          <div className="bg-primary flex size-12 items-center justify-center rounded-full text-white">
            <ShieldCheck className="size-7" />
          </div>
          <div>
            <p className="text-body-sm text-on-surface-variant">혼행 친화도</p>
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
