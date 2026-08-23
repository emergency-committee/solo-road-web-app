const SAFETY_ROUTE_REGION_PREFIXES = ['서울', '부산', '제주', '서귀포']

export function isSafetyRouteRegion(region: string) {
  const normalized = region.trim().replaceAll(' ', '')
  return SAFETY_ROUTE_REGION_PREFIXES.some((prefix) => normalized.startsWith(prefix))
}
