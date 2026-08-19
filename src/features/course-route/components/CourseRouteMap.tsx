import { Minus, Plus } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type {
  CctvItem,
  Coordinate,
  LightItem,
  MapBounds,
  NavigateRouteResponse,
  PoliceItem,
  RouteView,
  SafetyWaypoint,
} from '../types/course-route.types'

interface CourseRouteMapProps {
  appKey: string
  route: NavigateRouteResponse | null
  activeRoute: RouteView
  origin: Coordinate
  destination: Coordinate
  lights: LightItem[]
  cctv: CctvItem[]
  police: PoliceItem[]
  onBoundsChange: (bounds: MapBounds | null) => void
}

interface KakaoLatLng {
  getLat(): number
  getLng(): number
}

interface KakaoLatLngBounds {
  extend(point: KakaoLatLng): void
  getSouthWest(): KakaoLatLng
  getNorthEast(): KakaoLatLng
}

interface KakaoMap {
  getBounds(): KakaoLatLngBounds
  getLevel(): number
  setLevel(level: number, options?: { animate?: boolean }): void
  setBounds(
    bounds: KakaoLatLngBounds,
    paddingTop?: number,
    paddingRight?: number,
    paddingBottom?: number,
    paddingLeft?: number,
  ): void
  relayout(): void
}

interface KakaoOverlay {
  setMap(map: KakaoMap | null): void
}

interface KakaoPolyline extends KakaoOverlay {
  setOptions(options: {
    strokeWeight?: number
    strokeOpacity?: number
    strokeStyle?: string
    zIndex?: number
  }): void
}

interface KakaoMapsApi {
  load(callback: () => void): void
  Map: new (container: HTMLElement, options: { center: KakaoLatLng; level: number }) => KakaoMap
  LatLng: new (latitude: number, longitude: number) => KakaoLatLng
  LatLngBounds: new () => KakaoLatLngBounds
  Polyline: new (options: {
    map: KakaoMap
    path: KakaoLatLng[]
    strokeWeight: number
    strokeColor: string
    strokeOpacity: number
    strokeStyle?: string
    zIndex: number
  }) => KakaoPolyline
  Circle: new (options: {
    map: KakaoMap
    center: KakaoLatLng
    radius: number
    strokeWeight: number
    strokeColor: string
    strokeOpacity: number
    fillColor: string
    fillOpacity: number
    zIndex: number
  }) => KakaoOverlay
  CustomOverlay: new (options: {
    map: KakaoMap
    position: KakaoLatLng
    content: HTMLElement
    xAnchor: number
    yAnchor: number
    zIndex: number
  }) => KakaoOverlay
  event: {
    addListener(target: KakaoMap, eventName: string, listener: () => void): void
    removeListener(target: KakaoMap, eventName: string, listener: () => void): void
  }
}

let kakaoMapsPromise: Promise<KakaoMapsApi> | null = null

export function CourseRouteMap({
  appKey,
  route,
  activeRoute,
  origin,
  destination,
  lights,
  cctv,
  police,
  onBoundsChange,
}: CourseRouteMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<KakaoMap | null>(null)
  const onBoundsChangeRef = useRef(onBoundsChange)
  const [maps, setMaps] = useState<KakaoMapsApi | null>(null)
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    onBoundsChangeRef.current = onBoundsChange
  }, [onBoundsChange])

  useEffect(() => {
    let active = true
    loadKakaoMaps(appKey)
      .then((loadedMaps) => {
        if (active) setMaps(loadedMaps)
      })
      .catch(() => {
        if (active) setLoadError(true)
      })
    return () => {
      active = false
    }
  }, [appKey])

  useEffect(() => {
    if (!maps || !containerRef.current) return
    const map = new maps.Map(containerRef.current, {
      center: new maps.LatLng(37.5665, 126.978),
      level: 7,
    })
    mapRef.current = map

    const emitBounds = () => {
      const bounds = map.getBounds()
      const southWest = bounds.getSouthWest()
      const northEast = bounds.getNorthEast()
      const nextBounds = {
        minLng: southWest.getLng(),
        minLat: southWest.getLat(),
        maxLng: northEast.getLng(),
        maxLat: northEast.getLat(),
      }
      const spanLng = nextBounds.maxLng - nextBounds.minLng
      const spanLat = nextBounds.maxLat - nextBounds.minLat
      onBoundsChangeRef.current(spanLng <= 0.25 && spanLat <= 0.25 ? nextBounds : null)
    }

    maps.event.addListener(map, 'idle', emitBounds)
    const resizeObserver = new ResizeObserver(() => {
      map.relayout()
      emitBounds()
    })
    resizeObserver.observe(containerRef.current)
    emitBounds()

    return () => {
      resizeObserver.disconnect()
      maps.event.removeListener(map, 'idle', emitBounds)
      mapRef.current = null
    }
  }, [maps])

  useEffect(() => {
    const map = mapRef.current
    if (!maps || !map) return
    const overlays: KakaoOverlay[] = []
    const safeActive = activeRoute === 'safe'

    if (route?.fastestRoute.path.length) {
      overlays.push(
        new maps.Polyline({
          map,
          path: toKakaoPath(maps, route.fastestRoute.path),
          strokeWeight: safeActive ? 3 : 6,
          strokeColor: '#515b5e',
          strokeOpacity: safeActive ? 0.62 : 0.96,
          strokeStyle: safeActive ? 'shortdash' : 'solid',
          zIndex: safeActive ? 2 : 4,
        }),
      )
    }

    if (route?.path.length) {
      overlays.push(
        new maps.Polyline({
          map,
          path: toKakaoPath(maps, route.path),
          strokeWeight: safeActive ? 6 : 3,
          strokeColor: '#006b7d',
          strokeOpacity: safeActive ? 0.97 : 0.42,
          zIndex: safeActive ? 4 : 2,
        }),
      )
    }

    route?.safety.safetyWaypoints.forEach((waypoint) => {
      overlays.push(createSafetyWaypointOverlay(maps, map, waypoint))
    })
    if (origin) overlays.push(createPointOverlay(maps, map, origin, 'origin'))
    if (destination) overlays.push(createPointOverlay(maps, map, destination, 'destination'))

    return () => clearOverlays(overlays)
  }, [activeRoute, destination, maps, origin, route])

  useEffect(() => {
    const map = mapRef.current
    if (!maps || !map) return
    const overlays: KakaoOverlay[] = []

    lights.forEach((light) => {
      if (light.latitude === null || light.longitude === null) return
      overlays.push(
        createFacilityCircle(maps, map, { lat: light.latitude, lng: light.longitude }, '#f4b942'),
      )
    })
    cctv.forEach((item) => {
      if (item.latitude === null || item.longitude === null) return
      overlays.push(
        createFacilityCircle(maps, map, { lat: item.latitude, lng: item.longitude }, '#315eaf'),
      )
    })
    police.forEach((item) => {
      if (item.latitude === null || item.longitude === null) return
      overlays.push(
        createFacilityCircle(maps, map, { lat: item.latitude, lng: item.longitude }, '#2e7d5b'),
      )
    })

    return () => clearOverlays(overlays)
  }, [cctv, lights, maps, police])

  useEffect(() => {
    const map = mapRef.current
    if (!maps || !map || !route?.path.length) return
    const bounds = new maps.LatLngBounds()
    ;[...route.path, ...route.fastestRoute.path].forEach((point) => {
      bounds.extend(new maps.LatLng(point.lat, point.lng))
    })
    map.setBounds(bounds, 190, 44, 270, 44)
  }, [maps, route])

  const changeLevel = (delta: number) => {
    const map = mapRef.current
    if (!map) return
    map.setLevel(Math.max(1, Math.min(14, map.getLevel() + delta)), { animate: true })
  }

  if (loadError) {
    return (
      <div className="absolute inset-0 grid place-items-center bg-[#e9eff1] px-8 text-center text-sm font-semibold text-gray-700">
        카카오 지도를 불러오지 못했어요. JavaScript 키와 등록 도메인을 확인해 주세요.
      </div>
    )
  }

  return (
    <div className="absolute inset-0" aria-label="일정 구간 안심 경로 지도">
      <div ref={containerRef} className="absolute inset-0" />
      <div className="absolute top-[320px] right-3 z-20 flex flex-col overflow-hidden rounded-md border border-gray-300 bg-white shadow-sm">
        <MapButton label="지도 확대" onClick={() => changeLevel(-1)}>
          <Plus size={18} />
        </MapButton>
        <MapButton label="지도 축소" onClick={() => changeLevel(1)}>
          <Minus size={18} />
        </MapButton>
      </div>
    </div>
  )
}

function MapButton({
  label,
  onClick,
  children,
}: {
  label: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className="grid h-9 w-9 place-items-center border-b border-gray-200 text-gray-700 last:border-b-0"
      onClick={onClick}
    >
      {children}
    </button>
  )
}

function loadKakaoMaps(appKey: string): Promise<KakaoMapsApi> {
  const loadedMaps = getKakaoMapsApi()
  if (loadedMaps) {
    return new Promise((resolve) => loadedMaps.load(() => resolve(loadedMaps)))
  }
  if (kakaoMapsPromise) return kakaoMapsPromise

  kakaoMapsPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${encodeURIComponent(appKey)}&autoload=false`
    script.async = true
    script.onload = () => {
      const maps = getKakaoMapsApi()
      if (!maps) {
        reject(new Error('Kakao Maps SDK did not initialize.'))
        return
      }
      maps.load(() => resolve(maps))
    }
    script.onerror = () => reject(new Error('Failed to load Kakao Maps SDK.'))
    document.head.appendChild(script)
  })
  return kakaoMapsPromise
}

function getKakaoMapsApi(): KakaoMapsApi | undefined {
  return (window as unknown as { kakao?: { maps?: KakaoMapsApi } }).kakao?.maps
}

function toKakaoPath(maps: KakaoMapsApi, path: Coordinate[]) {
  return path.map((point) => new maps.LatLng(point.lat, point.lng))
}

function createFacilityCircle(
  maps: KakaoMapsApi,
  map: KakaoMap,
  coordinate: Coordinate,
  color: string,
): KakaoOverlay {
  return new maps.Circle({
    map,
    center: new maps.LatLng(coordinate.lat, coordinate.lng),
    radius: 7,
    strokeWeight: 1,
    strokeColor: '#ffffff',
    strokeOpacity: 0.95,
    fillColor: color,
    fillOpacity: 0.9,
    zIndex: 1,
  })
}

function createPointOverlay(
  maps: KakaoMapsApi,
  map: KakaoMap,
  coordinate: Coordinate,
  kind: 'origin' | 'destination',
): KakaoOverlay {
  const element = document.createElement('div')
  const size = 14
  element.style.width = `${size}px`
  element.style.height = `${size}px`
  element.style.borderRadius = '50%'
  element.style.background = kind === 'origin' ? '#ffffff' : '#171c1f'
  element.style.border = `3px solid ${kind === 'origin' ? '#006b7d' : '#ffffff'}`
  element.style.boxSizing = 'border-box'
  element.style.boxShadow = '0 1px 4px rgba(0, 0, 0, 0.25)'

  return new maps.CustomOverlay({
    map,
    position: new maps.LatLng(coordinate.lat, coordinate.lng),
    content: element,
    xAnchor: 0.5,
    yAnchor: 0.5,
    zIndex: 6,
  })
}

function createSafetyWaypointOverlay(
  maps: KakaoMapsApi,
  map: KakaoMap,
  waypoint: SafetyWaypoint,
): KakaoOverlay {
  const element = document.createElement('div')
  element.style.display = 'flex'
  element.style.alignItems = 'center'
  element.style.gap = '5px'
  element.style.padding = '5px 7px 5px 5px'
  element.style.borderRadius = '6px'
  element.style.border = '1px solid rgba(255, 255, 255, 0.95)'
  element.style.background = 'rgba(255, 255, 255, 0.96)'
  element.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.22)'
  element.style.color = '#171c1f'
  element.style.fontSize = '10px'
  element.style.fontWeight = '700'
  element.style.whiteSpace = 'nowrap'

  const marker = document.createElement('span')
  const policeWaypoint = waypoint.type !== 'SAFETY_EVIDENCE'
  marker.textContent = policeWaypoint ? 'P' : 'S'
  marker.style.display = 'grid'
  marker.style.placeItems = 'center'
  marker.style.width = '18px'
  marker.style.height = '18px'
  marker.style.borderRadius = '50%'
  marker.style.background = policeWaypoint ? '#2e7d5b' : '#d9783d'
  marker.style.color = '#ffffff'
  marker.style.fontSize = '9px'
  marker.style.fontWeight = '800'

  const label = document.createElement('span')
  label.textContent = waypoint.name
  element.append(marker, label)

  return new maps.CustomOverlay({
    map,
    position: new maps.LatLng(waypoint.coordinate.lat, waypoint.coordinate.lng),
    content: element,
    xAnchor: 0.5,
    yAnchor: 1.35,
    zIndex: 7,
  })
}

function clearOverlays(overlays: KakaoOverlay[]) {
  overlays.forEach((overlay) => overlay.setMap(null))
}
