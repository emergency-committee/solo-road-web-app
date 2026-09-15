/**
 * `navigator.geolocation.getCurrentPosition` 공용 옵션.
 * 옵션 없이 호출하면 기기가 캐시된 저정밀(IP 기반 등) 위치를 그대로 재사용할 수 있어
 * "위치 정확도" 문제로 이어진다. GPS 우선 + 캐시 재사용 금지로 정확도를 강제한다.
 */
export const GEOLOCATION_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 10_000,
  maximumAge: 0,
}
