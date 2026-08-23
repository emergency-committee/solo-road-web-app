export const COURSE_DAY_COLORS = ['#006b7d', '#d94b35', '#2f7d61', '#365e9d', '#8a5ca8'] as const

export function normalizeCourseDay(dayNumber?: number) {
  return dayNumber && dayNumber > 0 ? dayNumber : 1
}

export function getCourseDayColor(dayNumber?: number) {
  const normalizedDay = normalizeCourseDay(dayNumber)
  return COURSE_DAY_COLORS[(normalizedDay - 1) % COURSE_DAY_COLORS.length]!
}

export function groupCourseStopsByDay<T extends { dayNumber?: number }>(stops: T[]) {
  const groups = new Map<number, T[]>()

  stops.forEach((stop) => {
    const dayNumber = normalizeCourseDay(stop.dayNumber)
    groups.set(dayNumber, [...(groups.get(dayNumber) ?? []), stop])
  })

  return [...groups.entries()].sort(([left], [right]) => left - right)
}

export function getCourseDayTransitions<T extends { dayNumber?: number }>(stops: T[]) {
  return stops.slice(0, -1).flatMap((stop, index) => {
    const nextStop = stops[index + 1]
    if (!nextStop || normalizeCourseDay(stop.dayNumber) === normalizeCourseDay(nextStop.dayNumber)) {
      return []
    }
    return [[stop, nextStop] as const]
  })
}
