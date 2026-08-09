/**
 * placeId를 기반으로 항상 같은 화면 좌표를 계산한다.
 * 실제 지도 SDK(카카오맵 등) 연동 전까지 임시로 마커를 화면에 흩어놓기 위한 용도이며,
 * 실제 위경도와는 무관하다.
 */
export function derivePosition(placeId: number): { top: string; left: string } {
  const hash = Math.abs(Math.sin(placeId) * 10000)
  const top = 20 + (hash % 60)
  const left = 15 + ((hash * 7) % 70)
  return { top: `${top.toFixed(1)}%`, left: `${left.toFixed(1)}%` }
}
