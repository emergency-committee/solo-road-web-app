import { describe, expect, it } from 'vitest'
import { hasDisplayableSoloRating, soloRatingMessage } from './solo-rating'

describe('solo rating presentation', () => {
  it('waits for three reviews before presenting a public rating', () => {
    expect(hasDisplayableSoloRating(5, 2)).toBe(false)
    expect(hasDisplayableSoloRating(4.3, 3)).toBe(true)
  })

  it('uses plain-language descriptions without exposing internal grades', () => {
    expect(soloRatingMessage(4.2, 8)).toBe('혼자 식사하기 편한 곳이에요')
    expect(soloRatingMessage(3.4, 8)).toBe('무난하게 혼밥할 수 있어요')
    expect(soloRatingMessage(2.7, 8)).toBe('방문 전 혼밥 후기를 확인해 보세요')
  })
})
