import { describe, expect, it } from 'vitest'
import { sortByImageFirst } from './sort-by-image'

describe('sortByImageFirst', () => {
  it('이미지가 있는 항목을 앞으로 보낸다', () => {
    const places = [
      { id: 'a', hasImage: false },
      { id: 'b', hasImage: true },
      { id: 'c', hasImage: false },
      { id: 'd', hasImage: true },
    ]

    expect(sortByImageFirst(places).map((p) => p.id)).toEqual(['b', 'd', 'a', 'c'])
  })

  it('같은 그룹 내 원래 순서를 유지한다(안정 정렬)', () => {
    const places = [
      { id: 'a', hasImage: true },
      { id: 'b', hasImage: true },
      { id: 'c', hasImage: true },
    ]

    expect(sortByImageFirst(places).map((p) => p.id)).toEqual(['a', 'b', 'c'])
  })

  it('원본 배열을 변경하지 않는다', () => {
    const places = [
      { id: 'a', hasImage: false },
      { id: 'b', hasImage: true },
    ]

    sortByImageFirst(places)

    expect(places.map((p) => p.id)).toEqual(['a', 'b'])
  })
})
