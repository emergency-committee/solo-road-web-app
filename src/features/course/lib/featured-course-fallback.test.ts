import { describe, expect, it } from 'vitest'
import { mockFeaturedPublicCourses, resolveFeaturedCourses } from './featured-course-fallback'

describe('resolveFeaturedCourses', () => {
  it('공개 코스가 없으면 주목받는 더미 코스 두 개를 보여준다', () => {
    expect(resolveFeaturedCourses([])).toEqual(mockFeaturedPublicCourses)
    expect(mockFeaturedPublicCourses).toHaveLength(2)
  })

  it('공개 코스가 있으면 실제 데이터를 우선한다', () => {
    const liveCourses = [mockFeaturedPublicCourses[1]!]

    expect(resolveFeaturedCourses(liveCourses)).toBe(liveCourses)
  })
})
