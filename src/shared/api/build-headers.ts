/**
 * 인증은 HttpOnly 쿠키(credentials:'include')로 전달되므로 여기서 별도 처리하지 않는다.
 * solo_road_server는 X-API-Key를 검사하지 않는다.
 */
export function buildHeaders(extra?: HeadersInit): Headers {
  const headers = new Headers({
    'Content-Type': 'application/json',
  })

  if (extra) {
    new Headers(extra).forEach((value, key) => headers.set(key, value))
  }

  return headers
}
