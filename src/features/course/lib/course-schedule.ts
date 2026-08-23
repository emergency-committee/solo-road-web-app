const DAY_MS = 24 * 60 * 60 * 1000

function parseIsoDate(date: string) {
  return new Date(`${date}T00:00:00`)
}

export function calculateTripDays(startDate?: string, endDate?: string) {
  if (!startDate || !endDate) return 1
  const difference = Math.round((parseIsoDate(endDate).getTime() - parseIsoDate(startDate).getTime()) / DAY_MS)
  return Math.max(1, difference + 1)
}

export function formatTripLength(startDate?: string, endDate?: string, tripDays?: number) {
  const days = tripDays ?? calculateTripDays(startDate, endDate)
  return days <= 1 ? '당일' : `${(days - 1).toString()}박 ${days.toString()}일`
}

export function formatCourseDayDate(startDate: string | undefined, dayNumber: number) {
  if (!startDate) return ''
  const date = parseIsoDate(startDate)
  date.setDate(date.getDate() + dayNumber - 1)
  return `${date.getMonth() + 1}월 ${date.getDate()}일`
}

function formatMonthDay(date: string) {
  const parsed = parseIsoDate(date)
  return `${parsed.getMonth() + 1}.${parsed.getDate()}`
}

export function formatCourseDateRange(startDate?: string, endDate?: string) {
  if (!startDate) return '날짜 미정'

  const range = !endDate || startDate === endDate
    ? formatMonthDay(startDate)
    : `${formatMonthDay(startDate)} - ${formatMonthDay(endDate)}`

  return `${range} · ${formatTripLength(startDate, endDate)}`
}
