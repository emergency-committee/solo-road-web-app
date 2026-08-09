/** 분 단위 소요시간을 "1시간 20분" 형태의 한국어 라벨로 변환한다. */
export function formatDurationMinutes(minutes: number | null | undefined): string {
  if (minutes === null || minutes === undefined) return '시간 정보 없음'

  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60

  if (hours === 0) return `${mins}분`
  if (mins === 0) return `${hours}시간`
  return `${hours}시간 ${mins}분`
}

/** 미터 단위 거리를 "3.2km" 또는 "850m" 형태의 라벨로 변환한다. */
export function formatDistanceMeters(meters: number | null | undefined): string {
  if (meters === null || meters === undefined) return '거리 정보 없음'
  if (meters < 1000) return `${Math.round(meters)}m`
  return `${(meters / 1000).toFixed(1)}km`
}

/** Date를 백엔드가 받는 'YYYY-MM-DD' 형식으로 변환한다 (로컬 타임존 기준). */
export function toIsoDateString(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year.toString()}-${month}-${day}`
}
