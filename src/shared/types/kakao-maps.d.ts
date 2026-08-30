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
      /** 지도를 확대할 수 있는 최소 레벨(이 레벨보다 더 확대할 수 없음)을 설정한다. */
      setMinLevel(minLevel: number): void
      /** 지도를 축소할 수 있는 최대 레벨(이 레벨보다 더 축소할 수 없음)을 설정한다. */
      setMaxLevel(maxLevel: number): void
      panTo(latlng: LatLng): void
      setBounds(
        bounds: LatLngBounds,
        paddingTop?: number,
        paddingRight?: number,
        paddingBottom?: number,
        paddingLeft?: number,
      ): void
      relayout(): void
    }

    class LatLngBounds {
      constructor()
      extend(latlng: LatLng): void
    }

    interface PolylineOptions {
      map?: Map
      path: LatLng[]
      strokeWeight?: number
      strokeColor?: string
      strokeOpacity?: number
      strokeStyle?: string
      zIndex?: number
    }

    class Polyline {
      constructor(options: PolylineOptions)
      setMap(map: Map | null): void
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

    namespace event {
      function addListener(
        target: Map,
        type: 'idle' | 'dragend' | 'zoom_changed' | 'center_changed',
        handler: () => void,
      ): void
      function removeListener(
        target: Map,
        type: 'idle' | 'dragend' | 'zoom_changed' | 'center_changed',
        handler: () => void,
      ): void
    }

    /** SDK 로드 시 `&libraries=services`를 붙여야 사용할 수 있다. */
    namespace services {
      enum Status {
        OK = 'OK',
        ZERO_RESULT = 'ZERO_RESULT',
        ERROR = 'ERROR',
      }

      interface RegionCode {
        region_type: 'H' | 'B'
        address_name: string
        region_1depth_name: string
        region_2depth_name: string
        region_3depth_name: string
        code: string
      }

      class Geocoder {
        coord2RegionCode(
          lng: number,
          lat: number,
          callback: (result: RegionCode[], status: Status) => void,
        ): void
      }
    }
  }

  interface Window {
    kakao: typeof kakao
  }
}
