/** solo_road_server(Spring) API 기본 경로. 개발 시 빈 문자열 → vite.config.ts 프록시(/api → :8080)를 사용한다. */
export const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''
/** 모든 API는 /api/v1 프리픽스를 사용한다 (WebConfig.API_PREFIX). */
export const API_PREFIX = '/api/v1'
export const KAKAO_REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY
