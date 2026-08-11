/**
 * 카카오맵 JS SDK(window.kakao.maps)의 최소 앰비언트 타입 선언.
 * 공식 @types 패키지가 없어 이 프로젝트에서 실제로 사용하는 API만 선언한다.
 * 참고: https://apis.map.kakao.com/web/documentation/
 */
export {}

declare global {
  namespace kakao.maps {
    class LatLng {
      constructor(lat: number, lng: number)
      getLat(): number
      getLng(): number
    }

    interface MapOptions {
      center: LatLng
      level?: number
    }

    class Map {
      constructor(container: HTMLElement, options: MapOptions)
      setCenter(latlng: LatLng): void
      getCenter(): LatLng
      setLevel(level: number): void
      panTo(latlng: LatLng): void
      relayout(): void
    }

    interface CustomOverlayOptions {
      position: LatLng
      content: string | HTMLElement
      map?: Map
      xAnchor?: number
      yAnchor?: number
      zIndex?: number
    }

    class CustomOverlay {
      constructor(options: CustomOverlayOptions)
      setMap(map: Map | null): void
      setPosition(latlng: LatLng): void
      setZIndex(zIndex: number): void
    }

    function load(callback: () => void): void
  }

  interface Window {
    kakao: typeof kakao
  }
}
