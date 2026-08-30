import { useEffect, useState } from 'react'
import { loadKakaoMapsSdk } from '@/features/map/lib/load-kakao-maps'

export type CurrentRegionStatus = 'loading' | 'ready' | 'error'

/** 카카오 Geocoder 응답에서 "시/도 + 구/군" 수준의 표시용 라벨을 만든다. */
function formatRegionLabel(region: kakao.maps.services.RegionCode): string {
  return [region.region_1depth_name, region.region_2depth_name].filter(Boolean).join(' ')
}

/**
 * 브라우저 위치 권한으로 좌표를 얻고, 카카오 Geocoder(coord2RegionCode)로 그 좌표의
 * 시/구 단위 행정구역 이름을 가져온다. 위치 권한이 없거나 조회에 실패하면 label은 null.
 */
export function useCurrentRegionLabel() {
  const [label, setLabel] = useState<string | null>(null)
  const [status, setStatus] = useState<CurrentRegionStatus>('loading')

  useEffect(() => {
    let cancelled = false

    if (!navigator.geolocation) {
      setStatus('error')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        loadKakaoMapsSdk()
          .then((kakaoSdk) => {
            if (cancelled) return
            new kakaoSdk.maps.services.Geocoder().coord2RegionCode(
              position.coords.longitude,
              position.coords.latitude,
              (result, geocodeStatus) => {
                if (cancelled) return
                if (geocodeStatus === kakaoSdk.maps.services.Status.OK) {
                  // 행정동(H) 기준을 우선으로 쓰고, 없으면 첫 결과로 대체한다.
                  const region = result.find((item) => item.region_type === 'H') ?? result[0]
                  if (region) {
                    setLabel(formatRegionLabel(region))
                    setStatus('ready')
                    return
                  }
                }
                setStatus('error')
              },
            )
          })
          .catch(() => {
            if (!cancelled) setStatus('error')
          })
      },
      () => {
        // 위치 권한 거부 등. 화면에서는 기본 문구로 대체한다.
        if (!cancelled) setStatus('error')
      },
    )

    return () => {
      cancelled = true
    }
  }, [])

  return { label, status }
}
