import { useState } from 'react'
import { ChevronDown, ChevronUp, Clock3, Route, ShieldCheck, TriangleAlert } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import type {
  NavigateRouteResponse,
  RouteSafetyDetails,
  RouteView,
} from '../types/course-route.types'

interface CourseRouteResultPanelProps {
  route: NavigateRouteResponse
  activeRoute: RouteView
  onRouteChange: (route: RouteView) => void
}

export function CourseRouteResultPanel({
  route,
  activeRoute,
  onRouteChange,
}: CourseRouteResultPanelProps) {
  const [detailsOpen, setDetailsOpen] = useState(false)
  const active = activeRoute === 'safe' ? route : route.fastestRoute
  const scoreGain = route.safetyScore - route.fastestRoute.safetyScore
  const extraMinutes = Math.max(0, route.durationMinutes - route.fastestRoute.durationMinutes)
  const primaryWaypoint = route.safety.safetyWaypoints[0]
  const activeCrimeRisk =
    activeRoute === 'safe' ? route.safety.crimeRisk : route.fastestRoute.crimeRisk
  const activeFacilityScore = active.facilityScore

  return (
    <section className="absolute inset-x-3 bottom-3 z-20 max-h-[calc(100dvh-112px)] overflow-y-auto rounded-[8px] border border-white/70 bg-white/97 p-3 shadow-xl backdrop-blur-sm">
      <div className="bg-surface-container grid h-11 grid-cols-2 rounded-[8px] p-1">
        <RouteTab
          selected={activeRoute === 'safe'}
          label="안심 경로"
          minutes={route.durationMinutes}
          onClick={() => onRouteChange('safe')}
        />
        <RouteTab
          selected={activeRoute === 'fastest'}
          label="빠른 경로"
          minutes={route.fastestRoute.durationMinutes}
          onClick={() => onRouteChange('fastest')}
        />
      </div>

      <div className="mt-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-on-surface truncate text-base font-bold">
            {routeTitle(route, activeRoute)}
          </p>
          <div className="text-on-surface-variant mt-1 flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1">
              <Clock3 className="size-3.5" /> {active.durationMinutes}분
            </span>
            <span className="flex items-center gap-1">
              <Route className="size-3.5" /> {formatDistance(active.distanceM)}
            </span>
          </div>
        </div>
        <div className="bg-primary-fixed text-on-primary-fixed min-w-[66px] rounded-[8px] px-2 py-1.5 text-center">
          <span className="block text-[10px] font-semibold">안심점수</span>
          <strong className="text-lg leading-5">{active.safetyScore}</strong>
          {activeRoute === 'safe' && (
            <span className="mt-0.5 block text-[9px] font-bold">
              {evidenceLabel(route.safety.evidenceLevel)}
            </span>
          )}
        </div>
      </div>

      <button
        type="button"
        aria-expanded={detailsOpen}
        aria-controls="route-safety-details"
        onClick={() => setDetailsOpen((open) => !open)}
        className="text-primary border-outline-variant/60 mt-2 flex h-8 w-full items-center justify-center gap-1.5 border-t pt-2 text-[11px] font-bold"
      >
        {detailsOpen ? '상세 근거 접기' : '상세 근거 보기'}
        {detailsOpen ? <ChevronDown className="size-3.5" /> : <ChevronUp className="size-3.5" />}
      </button>

      {detailsOpen && (
        <div id="route-safety-details">
          {activeRoute === 'safe' && (
            <div className="text-on-surface-variant border-outline-variant/60 mt-2 flex items-start gap-2 border-t pt-3 text-xs">
              <ShieldCheck className="text-primary size-4 shrink-0" />
              <div className="min-w-0 flex-1">
                <strong className="text-on-surface block text-[11px]">
                  {route.safety.safetyDetourApplied ? '안심 경유지 적용' : '안심 경유지 미적용'}
                </strong>
                <p className="mt-0.5 text-[10px] leading-4">
                  {routeDecisionDetail(route, extraMinutes, scoreGain)}
                </p>
                {primaryWaypoint && <WaypointEvidence route={route} />}
              </div>
            </div>
          )}

          <div className="border-outline-variant/60 mt-3 flex items-start gap-2 border-t pt-2.5 text-[10px] leading-4">
            <TriangleAlert className="mt-0.5 size-3.5 shrink-0 text-[#d84a2f]" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <strong className="text-on-surface">
                  과거 범죄 밀도 주의도 {activeCrimeRisk.cautionIndex}
                </strong>
                <span className="font-bold text-[#b52d20]">
                  {activeCrimeRisk.scorePenalty > 0
                    ? `주의도 감점 -${activeCrimeRisk.scorePenalty}점`
                    : '주의도 감점 없음'}
                </span>
              </div>
              <p className="text-on-surface-variant">
                시설 근거 {activeFacilityScore}점 - 주의도 감점 {activeCrimeRisk.scorePenalty}점 =
                최종 안심점수 {active.safetyScore}점
              </p>
              <p className="text-on-surface-variant">
                주의정보 표시 구간 {activeCrimeRisk.dataCoveragePercent}% · 7등급 이상{' '}
                {activeCrimeRisk.highCautionCoveragePercent}%
              </p>
              <p className="text-on-surface-variant/80">
                경찰청·생활안전지도 2025년 자료 · 현재 위험을 뜻하지 않음
              </p>
            </div>
          </div>

          {activeRoute === 'safe' && (
            <div className="mt-3">
              <div className="grid grid-cols-3 gap-2">
                <Coverage label="조명" value={route.safety.lightingCoveragePercent} />
                <Coverage label="CCTV" value={route.safety.cctvCoveragePercent} />
                <Coverage label="경찰시설" value={route.safety.policeCoveragePercent} />
              </div>
              <p className="text-on-surface-variant mt-2 text-[9px] leading-4">
                가로등 {route.safety.streetLightCoveragePercent}% · 보안등{' '}
                {route.safety.securityLightCoveragePercent}% · 독립 근거축{' '}
                {route.safety.evidenceAxisCount}개
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  )
}

function WaypointEvidence({ route }: { route: NavigateRouteResponse }) {
  const waypoint = route.safety.safetyWaypoints[0]
  if (!waypoint) return null
  const actualScoreGain = route.safetyScore - route.safety.baseSafetyScore

  return (
    <div className="bg-surface-container mt-2 rounded-[6px] px-2.5 py-2 text-[10px] leading-4">
      <strong className="text-on-surface block">경유지 근거점수 {waypoint.evidenceScore}점</strong>
      <p className="text-primary font-semibold">
        실제 큰길 {route.safety.baseSafetyScore}점 → 안심경로 {route.safetyScore}점 (+
        {actualScoreGain}점)
      </p>
      <p className="font-semibold">
        기본 큰길 대비 실제 거리 +{route.safety.extraDistanceM}m · 시간 +
        {route.safety.extraDurationMinutes}분
      </p>
      <p className="text-on-surface-variant">
        후보 단계 예상 +{waypoint.predictedScoreGain}점 · 약 {waypoint.predictedExtraDistanceM}m
      </p>
      <p>
        가로등 {waypoint.streetLightLocationCount}곳 · 보안등 {waypoint.securityLightLocationCount}
        곳 · 방범 CCTV {waypoint.cctvLocationCount}곳(
        {waypoint.cctvCameraCount}대)
      </p>
      <p>
        기본 큰길 대비 조명 {route.safety.baseLightingCoveragePercent}% →{' '}
        {route.safety.lightingCoveragePercent}% · CCTV {route.safety.baseCctvCoveragePercent}% →{' '}
        {route.safety.cctvCoveragePercent}%
      </p>
      <p>
        경찰시설 {waypoint.policeFacilityCount}곳 · 기존 경로에서 {waypoint.offRouteDistanceM}m
      </p>
    </div>
  )
}

function evidenceLabel(level: RouteSafetyDetails['evidenceLevel']): string {
  if (level === 'STRONG') return '근거 충분'
  if (level === 'MODERATE') return '근거 보통'
  return '근거 제한적'
}

function RouteTab({
  selected,
  label,
  minutes,
  onClick,
}: {
  selected: boolean
  label: string
  minutes: number
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center justify-center gap-2 rounded-[6px] text-xs font-semibold transition-colors',
        selected ? 'text-primary bg-white shadow-sm' : 'text-on-surface-variant',
      )}
    >
      {label}
      <span className={cn('font-bold', selected && 'text-on-surface')}>{minutes}분</span>
    </button>
  )
}

function Coverage({ label, value }: { label: string; value: number }) {
  return (
    <div className="min-w-0">
      <div className="mb-1 flex items-center justify-between gap-1 text-[10px]">
        <span className="text-on-surface-variant truncate">{label}</span>
        <strong className="text-on-surface">{value}%</strong>
      </div>
      <div className="bg-surface-container-high h-1.5 overflow-hidden rounded-full">
        <div className="bg-primary h-full rounded-full" style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

function routeTitle(route: NavigateRouteResponse, activeRoute: RouteView): string {
  if (activeRoute === 'fastest') return '가장 빠르게 도착해요'
  if (route.safety.routeStrategy === 'SHORTEST_ALREADY_SAFEST') return '빠르고 안전한 경로예요'
  if (route.safety.safetyDetourApplied) return '안전시설 경유를 반영했어요'
  return '큰길 경로를 유지했어요'
}

function routeDecisionDetail(
  route: NavigateRouteResponse,
  extraMinutes: number,
  scoreGain: number,
): string {
  const scoreLabel = `안심점수 ${scoreGain >= 0 ? '+' : ''}${scoreGain}`
  if (route.safety.safetyDetourApplied) {
    const waypointNames = route.safety.safetyWaypoints.map((waypoint) => waypoint.name).join(', ')
    return `빠른 경로 대비 ${extraMinutes}분 추가 · ${scoreLabel} · ${waypointNames} 경유`
  }
  if (route.safety.routeStrategy === 'SHORTEST_ALREADY_SAFEST') {
    return `빠른 경로가 더 안전해 우회하지 않음 · ${scoreLabel}`
  }
  return `점수·추가 시간·동선 형태를 비교해 큰길 유지 · 빠른 경로 대비 ${scoreLabel}`
}

function formatDistance(distanceM: number): string {
  if (distanceM < 1000) return `${distanceM}m`
  return `${(distanceM / 1000).toFixed(1)}km`
}
