import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ChevronDown, ChevronUp, Clock3, Route, ShieldCheck } from 'lucide-react'
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
  const primaryWaypoint = route.safety.safetyWaypoints[0]

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
                  {route.safety.safetyDetourApplied
                    ? '안전시설이 확인되는 구간을 더 지나요'
                    : '현재 경로가 가장 균형이 좋아요'}
                </strong>
                <p className="mt-0.5 text-[10px] leading-4">{routeDecisionDetail(route)}</p>
                {primaryWaypoint && <WaypointEvidence route={route} />}
              </div>
            </div>
          )}

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
              <div className="border-outline-variant/60 mt-2 border-t pt-2 text-[9px] leading-4">
                <strong className="text-on-surface block">안심점수 계산 기준</strong>
                <p className="text-on-surface-variant">
                  시설 개수가 아니라 경로를 30m 간격으로 나눠 안전시설이 확인되는 구간의 비율을
                  계산해요.
                </p>
                <p className="text-on-surface mt-0.5 font-semibold">
                  안심점수 = 조명 확인 비율 × 50% + 방범 CCTV 확인 비율 × 35% + 경찰시설 확인 비율 ×
                  15%
                </p>
              </div>
            </div>
          )}

          <Link
            to="/my/data-sources"
            className="text-primary border-outline-variant/60 mt-3 flex h-9 items-center justify-center border-t pt-2 text-[10px] font-bold"
          >
            데이터 출처 보기
          </Link>
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
      <strong className="text-on-surface block">왜 이 길을 골랐나요?</strong>
      <p className="text-primary mt-0.5 font-semibold">
        {waypoint.name}을 반영한 뒤, 경유 전 큰길보다 안심점수가 {route.safety.baseSafetyScore}
        점에서 {route.safetyScore}점으로 {actualScoreGain}점 높아졌어요.
      </p>
      <p className="text-on-surface-variant">
        {formatFastestTimeDifference(route)} · {formatFastestDistanceDifference(route)}
      </p>
      <p className="mt-1 font-semibold">이 길 주변에서 확인한 시설</p>
      <p className="text-on-surface-variant">
        가로등 {waypoint.streetLightLocationCount}곳 · 보안등 {waypoint.securityLightLocationCount}
        곳 · 방범 CCTV {waypoint.cctvLocationCount}곳(
        {waypoint.cctvCameraCount}대)
      </p>
      {waypoint.policeFacilityCount > 0 && (
        <p className="text-on-surface-variant">경찰시설 {waypoint.policeFacilityCount}곳</p>
      )}
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

function routeDecisionDetail(route: NavigateRouteResponse): string {
  if (route.safety.safetyDetourApplied) {
    const waypointNames = route.safety.safetyWaypoints.map((waypoint) => waypoint.name).join(', ')
    const scoreGain = route.safetyScore - route.safety.baseSafetyScore
    return `${formatFastestTimeLead(route)} 안전 경유지(${waypointNames})를 반영해 경유 전 큰길보다 안심점수가 ${scoreGain}점 높아졌어요.`
  }
  if (route.safety.routeStrategy === 'SHORTEST_ALREADY_SAFEST') {
    return '빠른 경로가 안전시설 점수도 높아 별도의 우회가 필요하지 않아요.'
  }
  return '안전시설과 이동시간을 함께 비교했을 때 현재 큰길이 가장 적절해요.'
}

function formatFastestTimeLead(route: NavigateRouteResponse): string {
  const difference = route.durationMinutes - route.fastestRoute.durationMinutes
  if (difference === 0) return '빠른 경로와 예상 시간은 같고,'
  if (difference < 0) return `빠른 경로보다 ${Math.abs(difference)}분 빠르고,`
  return `빠른 경로보다 ${difference}분 더 걸리지만,`
}

function formatFastestTimeDifference(route: NavigateRouteResponse): string {
  const difference = route.durationMinutes - route.fastestRoute.durationMinutes
  if (difference === 0) return '빠른 경로와 예상 시간은 같아요'
  if (difference < 0) return `빠른 경로보다 ${Math.abs(difference)}분 빨라요`
  return `빠른 경로보다 ${difference}분 더 걸려요`
}

function formatFastestDistanceDifference(route: NavigateRouteResponse): string {
  const difference = route.distanceM - route.fastestRoute.distanceM
  if (difference === 0) return '거리 차이 없음'
  if (difference < 0) return `${Math.abs(difference)}m 덜 걸어요`
  return `${difference}m 더 걸어요`
}

function formatDistance(distanceM: number): string {
  if (distanceM < 1000) return `${distanceM}m`
  return `${(distanceM / 1000).toFixed(1)}km`
}
