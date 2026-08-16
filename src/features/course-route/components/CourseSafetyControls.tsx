import { Lightbulb, Shield, TriangleAlert, Video } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

interface CourseSafetyControlsProps {
  showLights: boolean
  showCctv: boolean
  showCrimeRisk: boolean
  lightCount: number
  cctvCount: number
  policeCount: number
  onLightsChange: (show: boolean) => void
  onCctvChange: (show: boolean) => void
  onCrimeRiskChange: (show: boolean) => void
  showPolice: boolean
  onPoliceChange: (show: boolean) => void
}

export function CourseSafetyControls({
  showLights,
  showCctv,
  showCrimeRisk,
  lightCount,
  cctvCount,
  policeCount,
  onLightsChange,
  onCctvChange,
  onCrimeRiskChange,
  showPolice,
  onPoliceChange,
}: CourseSafetyControlsProps) {
  return (
    <div className="absolute top-[104px] right-3 z-30 flex flex-col gap-2">
      <SafetyButton
        label={`범죄주의 구간 ${showCrimeRisk ? '숨기기' : '표시'}`}
        active={showCrimeRisk}
        count={0}
        activeClass="bg-[#d84a2f] text-white"
        onClick={() => onCrimeRiskChange(!showCrimeRisk)}
      >
        <TriangleAlert className="size-5" />
      </SafetyButton>
      <SafetyButton
        label={`CCTV ${showCctv ? '숨기기' : '표시'}`}
        active={showCctv}
        count={cctvCount}
        activeClass="bg-[#315eaf] text-white"
        onClick={() => onCctvChange(!showCctv)}
      >
        <Video className="size-5" />
      </SafetyButton>
      <SafetyButton
        label={`경찰시설 ${showPolice ? '숨기기' : '표시'}`}
        active={showPolice}
        count={policeCount}
        activeClass="bg-[#2e7d5b] text-white"
        onClick={() => onPoliceChange(!showPolice)}
      >
        <Shield className="size-5" />
      </SafetyButton>
      <SafetyButton
        label={`조명 ${showLights ? '숨기기' : '표시'}`}
        active={showLights}
        count={lightCount}
        activeClass="bg-[#d99114] text-white"
        onClick={() => onLightsChange(!showLights)}
      >
        <Lightbulb className="size-5" />
      </SafetyButton>
    </div>
  )
}

function SafetyButton({
  label,
  active,
  count,
  activeClass,
  onClick,
  children,
}: {
  label: string
  active: boolean
  count: number
  activeClass: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'relative flex size-11 items-center justify-center rounded-full border border-white bg-white text-gray-700 shadow-md transition-colors active:scale-95',
        active && activeClass,
      )}
    >
      {children}
      {active && count > 0 && (
        <span className="bg-inverse-surface text-inverse-on-surface absolute -top-1 -right-1 min-w-5 rounded-full px-1 text-[9px] leading-5 font-bold">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  )
}
