import { useEffect, useRef, useState } from 'react'
import { loadKakaoMapsSdk } from '@/features/map/lib/load-kakao-maps'

export interface CourseOverviewStop {
  id: string
  order: number
  dayNumber?: number
  name: string
  latitude: number
  longitude: number
}

export function CourseOverviewMap({ stops }: { stops: CourseOverviewStop[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let active = true
    const overlays: kakao.maps.CustomOverlay[] = []
    let line: kakao.maps.Polyline | null = null

    loadKakaoMapsSdk()
      .then((sdk) => {
        if (!active || !containerRef.current || stops.length === 0) return

        const points = stops.map((stop) => new sdk.maps.LatLng(stop.latitude, stop.longitude))
        const map = new sdk.maps.Map(containerRef.current, {
          center: points[0]!,
          level: 5,
        })

        if (points.length > 1) {
          line = new sdk.maps.Polyline({
            map,
            path: points,
            strokeWeight: 5,
            strokeColor: '#006b7d',
            strokeOpacity: 0.9,
            strokeStyle: 'solid',
            zIndex: 2,
          })

          const bounds = new sdk.maps.LatLngBounds()
          points.forEach((point) => bounds.extend(point))
          map.setBounds(bounds, 36, 36, 36, 36)
        }

        stops.forEach((stop, index) => {
          const marker = document.createElement('div')
          marker.className =
            'grid size-9 place-items-center rounded-full border-[3px] border-white bg-primary text-sm font-bold text-white shadow-lg'
          marker.textContent = (index + 1).toString()
          marker.title = `${stop.dayNumber ? `${stop.dayNumber.toString()}일차 · ` : ''}${(index + 1).toString()}. ${stop.name}`

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
      line?.setMap(null)
      overlays.forEach((overlay) => overlay.setMap(null))
    }
  }, [stops])

  return (
    <div className="relative size-full">
      <div ref={containerRef} className="size-full" />
      {errorMessage && (
        <div className="bg-surface-container absolute inset-0 grid place-items-center px-8 text-center">
          <p className="text-body-sm text-on-surface-variant">{errorMessage}</p>
        </div>
      )}
    </div>
  )
}
