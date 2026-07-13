import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useMemo, useState } from 'react'
import { cn } from '@/shared/lib/utils'

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

export interface DateRange {
  start: Date | null
  end: Date | null
}

interface CourseDateRangeCalendarProps {
  range: DateRange
  onRangeChange: (range: DateRange) => void
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function formatShort(date: Date) {
  return `${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
}

export function CourseDateRangeCalendar({ range, onRangeChange }: CourseDateRangeCalendarProps) {
  const [viewDate, setViewDate] = useState(() => range.start ?? new Date())

  const days = useMemo(() => {
    const year = viewDate.getFullYear()
    const month = viewDate.getMonth()
    const firstWeekday = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const cells: (Date | null)[] = []
    for (let i = 0; i < firstWeekday; i++) cells.push(null)
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d))
    return cells
  }, [viewDate])

  function handleSelect(day: Date) {
    if (!range.start || (range.start && range.end)) {
      onRangeChange({ start: day, end: null })
      return
    }
    if (day < range.start) {
      onRangeChange({ start: day, end: null })
      return
    }
    onRangeChange({ start: range.start, end: day })
  }

  function isInRange(day: Date) {
    if (!range.start || !range.end) return false
    return day > range.start && day < range.end
  }

  const nightsLabel =
    range.start && range.end
      ? `${formatShort(range.start)} - ${formatShort(range.end)} (${Math.round((range.end.getTime() - range.start.getTime()) / 86400000) + 1}일)`
      : range.start
        ? `${formatShort(range.start)} 선택됨 — 종료일을 선택하세요`
        : '기간을 선택해주세요'

  return (
    <div className="border-outline-variant space-y-md p-md rounded-xl border bg-white">
      <div className="mb-sm flex items-center justify-between">
        <button
          type="button"
          onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))}
          className="text-primary"
          aria-label="이전 달"
        >
          <ChevronLeft className="size-5" />
        </button>
        <span className="text-on-surface font-bold">
          {viewDate.getFullYear()}년 {viewDate.getMonth() + 1}월
        </span>
        <button
          type="button"
          onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))}
          className="text-primary"
          aria-label="다음 달"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>
      <div className="gap-xs grid grid-cols-7 text-center">
        {WEEKDAYS.map((weekday) => (
          <span key={weekday} className="text-label-md text-outline">
            {weekday}
          </span>
        ))}
        {days.map((day, i) => {
          if (!day) return <span key={`empty-${i}`} />
          const isStart = range.start && isSameDay(day, range.start)
          const isEnd = range.end && isSameDay(day, range.end)
          return (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() => handleSelect(day)}
              className={cn(
                'text-body-sm py-xs rounded-full',
                (isStart || isEnd) && 'bg-primary text-on-primary',
                isInRange(day) && 'bg-primary/10',
              )}
            >
              {day.getDate()}
            </button>
          )
        })}
      </div>
      <div className="border-outline-variant pt-sm flex items-center justify-between border-t">
        <div className="flex flex-col">
          <span className="text-label-caps text-outline">선택된 기간</span>
          <span className="text-body-sm text-primary font-bold">{nightsLabel}</span>
        </div>
        <button
          type="button"
          onClick={() => onRangeChange({ start: null, end: null })}
          className="font-label-md text-primary"
        >
          초기화
        </button>
      </div>
    </div>
  )
}
