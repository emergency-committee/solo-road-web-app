import { ArrowLeft, MapPin } from 'lucide-react'
import { createPortal } from 'react-dom'
import { useState } from 'react'
import { KAKAO_JS_KEY } from '@/shared/api/config'
import { ApiError } from '@/shared/api/errors'
import { useCourseLegRoute } from '../hooks/use-course-leg-route'
import { useCourseRouteInfrastructure } from '../hooks/use-course-route-infrastructure'
import type { Coordinate, MapBounds, RouteView } from '../types/course-route.types'
import { CourseRouteMap } from './CourseRouteMap'
import { CourseRouteResultPanel } from './CourseRouteResultPanel'
import { CourseSafetyControls } from './CourseSafetyControls'

interface CourseRouteViewerProps {
  originName: string
  destinationName: string
  origin: Coordinate
  destination: Coordinate
  onClose: () => void
}

export function CourseRouteViewer({
  originName,
  destinationName,
  origin,
  destination,
  onClose,
}: CourseRouteViewerProps) {
  const [activeRoute, setActiveRoute] = useState<RouteView>('safe')
  const [bounds, setBounds] = useState<MapBounds | null>(null)
  const [showLights, setShowLights] = useState(true)
  const [showCctv, setShowCctv] = useState(true)
  const [showPolice, setShowPolice] = useState(true)
  const routeQuery = useCourseLegRoute(origin, destination)
  const infrastructure = useCourseRouteInfrastructure(bounds, { showLights, showCctv, showPolice })
  const kakaoJavaScriptKey = KAKAO_JS_KEY?.trim()

  return createPortal(
    <section className="bg-surface fixed inset-y-0 left-1/2 z-[80] w-full max-w-[430px] -translate-x-1/2 overflow-hidden shadow-2xl">
      {kakaoJavaScriptKey ? (
        <CourseRouteMap
          appKey={kakaoJavaScriptKey}
          route={routeQuery.data ?? null}
          activeRoute={activeRoute}
          origin={origin}
          destination={destination}
          lights={showLights ? infrastructure.lights : []}
          cctv={showCctv ? infrastructure.cctv : []}
          police={showPolice ? infrastructure.police : []}
          onBoundsChange={setBounds}
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center bg-[#e9eff1] px-8 text-center text-sm font-semibold text-gray-700">
          카카오 지도 JavaScript 키가 필요합니다.
        </div>
      )}

      <header className="absolute inset-x-3 top-3 z-40 flex min-h-16 items-center gap-3 rounded-[8px] border border-white/80 bg-white/95 px-3 py-2 shadow-lg backdrop-blur-md">
        <button
          type="button"
          aria-label="일정으로 돌아가기"
          onClick={onClose}
          className="hover:bg-surface-container grid size-10 shrink-0 place-items-center rounded-full transition-colors"
        >
          <ArrowLeft className="text-primary size-5" />
        </button>
        <div className="min-w-0 flex-1">
          <p className="text-on-surface-variant text-[10px] font-semibold">일정 이동 코스</p>
          <div className="mt-0.5 flex items-center gap-1.5 text-sm font-bold">
            <span className="truncate">{originName}</span>
            <MapPin className="text-secondary size-3.5 shrink-0" />
            <span className="truncate">{destinationName}</span>
          </div>
        </div>
      </header>

      <div className="absolute top-[88px] left-3 z-30 flex items-center gap-2 rounded-[6px] bg-white/90 px-2 py-1.5 text-[9px] font-semibold text-gray-700 shadow-sm backdrop-blur-sm">
        <LegendDot color="#f4b942" label="조명" />
        <LegendDot color="#315eaf" label="CCTV" />
        <LegendDot color="#2e7d5b" label="경찰" />
        <span className="flex items-center gap-1">
          <span className="h-0.5 w-4 rounded-full bg-[#006b7d]" /> 안심경로
        </span>
      </div>

      <CourseSafetyControls
        showLights={showLights}
        showCctv={showCctv}
        lightCount={infrastructure.lights.length}
        cctvCount={infrastructure.cctv.length}
        policeCount={infrastructure.police.length}
        onLightsChange={setShowLights}
        onCctvChange={setShowCctv}
        showPolice={showPolice}
        onPoliceChange={setShowPolice}
      />

      {routeQuery.isPending && (
        <div className="bg-inverse-surface/90 text-inverse-on-surface absolute top-1/2 left-1/2 z-40 -translate-x-1/2 -translate-y-1/2 rounded-full px-4 py-2 text-xs font-semibold shadow-lg">
          이동 코스를 계산하고 있어요
        </div>
      )}

      {routeQuery.isError && (
        <div className="bg-error-container text-on-error-container absolute inset-x-3 top-24 z-40 rounded-[8px] px-3 py-2 text-center text-xs font-semibold shadow-md">
          {errorMessage(routeQuery.error)}
        </div>
      )}

      {routeQuery.data && (
        <CourseRouteResultPanel
          route={routeQuery.data}
          activeRoute={activeRoute}
          onRouteChange={setActiveRoute}
        />
      )}
    </section>,
    document.body,
  )
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1">
      <span
        className="size-2 rounded-full border border-white shadow-sm"
        style={{ backgroundColor: color }}
      />
      {label}
    </span>
  )
}

function errorMessage(error: Error): string {
  if (!(error instanceof ApiError)) return '이동 코스를 불러오지 못했습니다.'
  try {
    const parsed = JSON.parse(error.body) as { message?: string }
    return parsed.message ?? '이동 코스를 불러오지 못했습니다.'
  } catch {
    return '이동 코스를 불러오지 못했습니다.'
  }
}
