import { useEffect, useRef, useState } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { cn } from '@/shared/lib/utils'
import { loadKakaoMapsSdk } from '../lib/load-kakao-maps'
import type { MapMarkerData, MapRatingMode } from '../types/map.types'
import { CurrentLocationDot } from './CurrentLocationDot'
import { MapMarker } from './MapMarker'

interface OverlayEntry {
  overlay: kakao.maps.CustomOverlay
  root: Root
}

interface KakaoMapProps {
  /** 현재(사용자) 위치이자 초기 지도 중심. */
  center: { lat: number; lng: number }
  level?: number
  /**
   * 지도를 이 레벨보다 더 축소할 수 없게 한다(기본값: 8 ≈ 반경 2km 안팎).
   * 장소 조회가 중심 좌표 기준 근처 결과 위주라, 제한 없이 축소하면
   * 화면엔 넓은 지역이 보여도 마커는 중심 근처 몇 개만 몰려 찍혀 텅 빈 지도처럼 보인다.
   */
  maxLevel?: number
  markers?: MapMarkerData[]
  ratingMode?: MapRatingMode
  selectedId?: string | null
  onSelectMarker?: (marker: MapMarkerData) => void
  /** 사용자가 지도를 드래그/확대해 중심이 바뀔 때마다 호출된다. 새 위치 기준으로 마커를 다시 불러오는 데 쓴다. */
  onCenterChanged?: (center: { lat: number; lng: number }) => void
  className?: string
}

/**
 * 카카오맵 JS SDK를 로드해 실제 지도를 렌더링하는 컴포넌트.
 * 마커는 kakao.maps.CustomOverlay + React 포털(createRoot)로 그려서
 * 기존 MapMarker/CurrentLocationDot의 Tailwind 스타일을 그대로 재사용한다.
 */
export function KakaoMap({
  center,
  level = 4,
  maxLevel = 8,
  markers = [],
  ratingMode = 'solo',
  selectedId = null,
  onSelectMarker,
  onCenterChanged,
  className,
}: KakaoMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<kakao.maps.Map | null>(null)
  const currentLocationOverlayRef = useRef<kakao.maps.CustomOverlay | null>(null)
  const overlaysRef = useRef<Map<string, OverlayEntry>>(new Map())
  const onCenterChangedRef = useRef(onCenterChanged)
  // idle에서 올라온 center 변경을 부모가 그대로 되돌려줄 때, 아래 panTo 이펙트가
  // 다시 같은 위치로 panTo를 걸어 idle을 재발생시키는 루프를 막기 위한 플래그.
  const skipNextPanRef = useRef(false)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState('')

  // 최초 1회만 붙는 idle 리스너가 항상 최신 콜백을 부르도록 ref로 동기화한다.
  useEffect(() => {
    onCenterChangedRef.current = onCenterChanged
  }, [onCenterChanged])

  // 지도 최초 1회 생성
  useEffect(() => {
    let cancelled = false

    loadKakaoMapsSdk()
      .then((kakaoSdk) => {
        if (cancelled || !containerRef.current) return

        const map = new kakaoSdk.maps.Map(containerRef.current, {
          center: new kakaoSdk.maps.LatLng(center.lat, center.lng),
          level,
        })
        map.setMaxLevel(maxLevel)
        mapRef.current = map

        const dotContainer = document.createElement('div')
        const dotRoot = createRoot(dotContainer)
        dotRoot.render(<CurrentLocationDot />)
        const overlay = new kakaoSdk.maps.CustomOverlay({
          position: new kakaoSdk.maps.LatLng(center.lat, center.lng),
          content: dotContainer,
          zIndex: 1,
        })
        overlay.setMap(map)
        currentLocationOverlayRef.current = overlay

        // 드래그/확대 등으로 지도가 움직임을 멈추면(idle) 새 중심 기준으로 마커를 다시 불러오게 알린다.
        kakaoSdk.maps.event.addListener(map, 'idle', handleIdle)

        setStatus('ready')
      })
      .catch((error: unknown) => {
        setErrorMessage(error instanceof Error ? error.message : '지도를 불러오지 못했습니다.')
        setStatus('error')
      })

    function handleIdle() {
      const map = mapRef.current
      if (!map) return
      const position = map.getCenter()
      skipNextPanRef.current = true
      onCenterChangedRef.current?.({ lat: position.getLat(), lng: position.getLng() })
    }

    return () => {
      cancelled = true
      if (mapRef.current) {
        window.kakao.maps.event.removeListener(mapRef.current, 'idle', handleIdle)
      }
      for (const entry of overlaysRef.current.values()) {
        entry.overlay.setMap(null)
        entry.root.unmount()
      }
      overlaysRef.current.clear()
      currentLocationOverlayRef.current?.setMap(null)
      mapRef.current = null
    }
    // 최초 마운트 시 한 번만 지도를 만든다. 이후 중심 이동은 아래 별도 effect가 담당한다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 사용자 위치(center)가 바뀌면(최초 GPS 수신, "현재 위치로" 버튼) 지도를 이동시킨다.
  // idle 콜백이 이 center를 부모 상태로 되돌려준 경우(드래그/줌으로 인한 변경)에는
  // 이미 그 위치에 있으므로 다시 panTo하지 않는다.
  useEffect(() => {
    if (status !== 'ready') return
    if (skipNextPanRef.current) {
      skipNextPanRef.current = false
      return
    }
    const kakaoSdk = window.kakao
    const position = new kakaoSdk.maps.LatLng(center.lat, center.lng)
    mapRef.current?.panTo(position)
    currentLocationOverlayRef.current?.setPosition(position)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center.lat, center.lng, status])

  // 장소 마커 동기화 (추가/삭제/선택 상태 반영)
  useEffect(() => {
    const map = mapRef.current
    if (!map || status !== 'ready') return

    const kakaoSdk = window.kakao
    const overlays = overlaysRef.current
    const nextIds = new Set(markers.map((marker) => marker.id))

    for (const [id, entry] of overlays) {
      if (!nextIds.has(id)) {
        entry.overlay.setMap(null)
        entry.root.unmount()
        overlays.delete(id)
      }
    }

    for (const marker of markers) {
      const isSelected = marker.id === selectedId
      const existing = overlays.get(marker.id)

      if (existing) {
        existing.root.render(
          <MapMarker
            marker={marker}
            ratingMode={ratingMode}
            selected={isSelected}
            onSelect={onSelectMarker ?? (() => {})}
          />,
        )
        existing.overlay.setZIndex(isSelected ? 3 : 2)
        continue
      }

      const content = document.createElement('div')
      const root = createRoot(content)
      root.render(
        <MapMarker
          marker={marker}
          ratingMode={ratingMode}
          selected={isSelected}
          onSelect={onSelectMarker ?? (() => {})}
        />,
      )

      const overlay = new kakaoSdk.maps.CustomOverlay({
        position: new kakaoSdk.maps.LatLng(marker.lat, marker.lng),
        content,
        xAnchor: 0.5,
        yAnchor: 1,
        zIndex: isSelected ? 3 : 2,
      })
      overlay.setMap(map)
      overlays.set(marker.id, { overlay, root })
    }
  }, [markers, ratingMode, selectedId, onSelectMarker, status])

  return (
    <div className={cn('relative size-full', className)}>
      <div ref={containerRef} className="size-full" />
      {status === 'error' && (
        <div className="bg-surface-container absolute inset-0 z-10 flex items-center justify-center px-8 text-center">
          <p className="text-body-sm text-on-surface-variant">
            지도를 불러오지 못했어요.
            <br />
            {errorMessage}
          </p>
        </div>
      )}
    </div>
  )
}
