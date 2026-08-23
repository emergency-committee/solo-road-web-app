import { describe, expect, it } from 'vitest'
import {
  getCourseDayColor,
  getCourseDayTransitions,
  groupCourseStopsByDay,
} from './course-map-days'

describe('course map day styles', () => {
  it('날짜별로 서로 다른 고정 색상을 사용한다', () => {
    expect(getCourseDayColor(1)).not.toBe(getCourseDayColor(2))
    expect(getCourseDayColor(1)).toBe(getCourseDayColor(6))
  })

  it('장소를 날짜순으로 묶고 날짜가 없으면 1일차로 처리한다', () => {
    const groups = groupCourseStopsByDay([
      { id: 'three', dayNumber: 2 },
      { id: 'one' },
      { id: 'two', dayNumber: 1 },
    ])

    expect(groups).toEqual([
      [1, [{ id: 'one' }, { id: 'two', dayNumber: 1 }]],
      [2, [{ id: 'three', dayNumber: 2 }]],
    ])
  })

  it('날짜가 바뀌는 두 장소를 전체 코스 연결 구간으로 찾는다', () => {
    const first = { id: 'one', dayNumber: 1 }
    const second = { id: 'two', dayNumber: 1 }
    const third = { id: 'three', dayNumber: 2 }

    expect(getCourseDayTransitions([first, second, third])).toEqual([[second, third]])
  })
})
