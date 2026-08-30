import { KAKAO_JS_KEY } from '@/shared/api/config'

let kakaoMapsPromise: Promise<typeof kakao> | null = null

/**
 * 카카오맵 JS SDK를 1회만 동적으로 로드한다 (autoload=false + kakao.maps.load 콜백 패턴).
 * 이미 로드됐거나 로딩 중이면 캐시된 프로미스를 재사용한다.
 */
export function loadKakaoMapsSdk(): Promise<typeof kakao> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('브라우저 환경에서만 사용할 수 있습니다.'))
  }

  if (window.kakao?.maps) {
    return Promise.resolve(window.kakao)
  }

  if (kakaoMapsPromise) {
    return kakaoMapsPromise
  }

  kakaoMapsPromise = new Promise<typeof kakao>((resolve, reject) => {
    if (!KAKAO_JS_KEY) {
      reject(
        new Error(
          'VITE_KAKAO_JS_KEY가 설정되지 않았습니다. 카카오 디벨로퍼스 > 내 애플리케이션 > 앱 키 > JavaScript 키를 .env.local에 추가하세요.',
        ),
      )
      return
    }

    const script = document.createElement('script')
    // libraries=services: 좌표 → 행정구역 변환(Geocoder) 등 위치 검색 라이브러리를 함께 불러온다.
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_JS_KEY}&libraries=services&autoload=false`
    script.async = true
    script.onerror = () => {
      reject(new Error('카카오맵 SDK 스크립트를 불러오지 못했습니다.'))
    }
    script.onload = () => {
      window.kakao.maps.load(() => resolve(window.kakao))
    }
    document.head.appendChild(script)
  }).catch((error: unknown) => {
    kakaoMapsPromise = null
    throw error
  })

  return kakaoMapsPromise
}
