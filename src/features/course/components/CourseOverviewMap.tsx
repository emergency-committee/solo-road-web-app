import { useEffect, useMemo, useRef, useState } from 'react'
import { loadKakaoMapsSdk } from '@/features/map/lib/load-kakao-maps'
import {
  getCourseDayColor,
  getCourseDayTransitions,
  groupCourseStopsByDay,
} from '../lib/course-map-days'

export interface CourseOverviewStop {
  id: string
  order: number
  dayNumber?: number
  name: string
  latitude: number
  longitude: number
}

export function CourseOverviewMap({
  stops,
  legendClassName = 'top-3 left-3',
}: {
  stops: CourseOverviewStop[]
  legendClassName?: string
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const stopsByDay = useMemo(() => groupCourseStopsByDay(stops), [stops])

  useEffect(() => {
    let active = true
    const overlays: kakao.maps.CustomOverlay[] = []
    const lines: kakao.maps.Polyline[] = []

    loadKakaoMapsSdk()
      .then((sdk) => {
        if (!active || !containerRef.current || stops.length === 0) return

        const points = stops.map((stop) => new sdk.maps.LatLng(stop.latitude, stop.longitude))
        const map = new sdk.maps.Map(containerRef.current, {
          center: points[0]!,
          level: 5,
        })

        if (points.length > 1) {
          const bounds = new sdk.maps.LatLngBounds()
          points.forEach((point) => bounds.extend(point))
          map.setBounds(bounds, 36, 36, 36, 36)
        }

        stopsByDay.forEach(([dayNumber, dayStops]) => {
          if (dayStops.length < 2) return

          lines.push(
            new sdk.maps.Polyline({
              map,
              path: dayStops.map((stop) =>
                new sdk.maps.LatLng(stop.latitude, stop.longitude),
              ),
              strokeWeight: 5,
              strokeColor: getCourseDayColor(dayNumber),
              strokeOpacity: 0.9,
              strokeStyle: 'solid',
              zIndex: 2,
            }),
          )
        })

        getCourseDayTransitions(stops).forEach(([from, to]) => {
          lines.push(
            new sdk.maps.Polyline({
              map,
              path: [
                new sdk.maps.LatLng(from.latitude, from.longitude),
                new sdk.maps.LatLng(to.latitude, to.longitude),
              ],
              strokeWeight: 4,
              strokeColor: '#7d898d',
              strokeOpacity: 0.75,
              strokeStyle: 'shortdash',
              zIndex: 1,
            }),
          )
        })

        stops.forEach((stop, index) => {
          const marker = document.createElement('div')
          marker.className =
            'grid size-9 place-items-center rounded-full border-[3px] border-white text-sm font-bold text-white shadow-lg'
          marker.style.backgroundColor = getCourseDayColor(stop.dayNumber)
          marker.textContent = stop.order.toString()
          marker.title = `${stop.dayNumber ? `${stop.dayNumber.toString()}일차 · ` : ''}${stop.order.toString()}. ${stop.name}`

          const overlay = new sdk.maps.CustomOverlay({
            map,
            position: points[index]!,
            content: marker,
            xAnchor: 0.5,
            yAnchor: 0.5,
            zIndex: 3,
          })
          overlays.push(overlay)
        })
      })
      .catch((error: unknown) => {
        if (active) {
          setErrorMessage(error instanceof Error ? error.message : '지도를 불러오지 못했습니다.')
        }
      })

    return () => {
      active = false
      lines.forEach((line) => line.setMap(null))
      overlays.forEach((overlay) => overlay.setMap(null))
    }
  }, [stops, stopsByDay])

  return (
    <div className="relative size-full">
      <div ref={containerRef} className="size-full" />
      {stopsByDay.length > 1 && (
        <div
          className={`bg-surface/95 pointer-events-none absolute z-10 flex flex-wrap gap-2 rounded-lg px-2.5 py-2 shadow-md backdrop-blur-sm ${legendClassName}`}
        >
          {stopsByDay.map(([dayNumber]) => (
            <span
              key={dayNumber}
              className="text-on-surface-variant flex items-center gap-1.5 text-[11px] font-semibold"
            >
              <span
                className="size-2.5 rounded-full"
                style={{ backgroundColor: getCourseDayColor(dayNumber) }}
              />
              {dayNumber}일차
            </span>
          ))}
        </div>
      )}
      {errorMessage && (
        <div className="bg-surface-container absolute inset-0 grid place-items-center px-8 text-center">
          <p className="text-body-sm text-on-surface-variant">{errorMessage}</p>
        </div>
      )}
    </div>
  )
}
