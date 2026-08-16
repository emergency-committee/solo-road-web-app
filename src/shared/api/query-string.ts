type QueryParams = Record<string, string | number | boolean | undefined | null>

/** undefined/null/빈 문자열 값을 제외하고 쿼리스트링을 만든다. 값이 하나도 없으면 빈 문자열을 반환한다. */
export function buildQueryString(params: QueryParams): string {
  const search = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      search.set(key, String(value))
    }
  }

  const qs = search.toString()
  return qs ? `?${qs}` : ''
}
