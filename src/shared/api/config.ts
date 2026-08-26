/** solo_road_server(Spring) API 기본 경로. 개발 시 빈 문자열 → vite.config.ts 프록시(/api → :8080)를 사용한다. */
export const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''
/** 모든 API는 /api/v1 프리픽스를 사용한다 (WebConfig.API_PREFIX). */
export const API_PREFIX = '/api/v1'
export const AUTH_MOCK_ENABLED = import.meta.env.VITE_AUTH_MOCK === 'true'
/** 배포 시 혼밥 평점 기능을 확인할 수 있는 데모 장소. 명시적으로 false일 때만 숨긴다. */
export const PLACE_DEMO_ENABLED = import.meta.env.VITE_PLACE_DEMO_ENABLED !== 'false'
export const KAKAO_REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY
/** 카카오 디벨로퍼스 > 내 애플리케이션 > 앱 키 > JavaScript 키 (REST API 키와 다름, 카카오맵 SDK 전용). */
export const KAKAO_JS_KEY = import.meta.env.VITE_KAKAO_JS_KEY
