// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest'
import { enableDragScroll, findScrollable } from './drag-scroll'

/** jsdom은 레이아웃을 계산하지 않아서 스크롤 크기·위치를 직접 심어준다. */
function makeBox(style: string, sizes: Record<string, number>) {
  const el = document.createElement('div')
  el.setAttribute('style', style)
  for (const [key, value] of Object.entries({ scrollTop: 0, scrollLeft: 0, ...sizes })) {
    Object.defineProperty(el, key, { value, writable: true, configurable: true })
  }
  return el
}

/** jsdom에는 PointerEvent가 없어서 MouseEvent에 pointerType만 얹어 쓴다. */
function pointer(type: string, clientX: number, clientY: number) {
  const event = new MouseEvent(type, {
    bubbles: true,
    cancelable: true,
    clientX,
    clientY,
    button: 0,
  })
  Object.defineProperty(event, 'pointerType', { value: 'mouse' })
  return event
}

beforeEach(() => {
  document.body.innerHTML = ''
})

describe('findScrollable', () => {
  it('축마다 가장 가까운 스크롤 컨테이너를 따로 찾는다', () => {
    // 데스크탑 .app-frame: 세로만 스크롤
    const frame = makeBox('overflow-x: hidden; overflow-y: auto', {
      scrollHeight: 2000,
      clientHeight: 800,
      scrollWidth: 430,
      clientWidth: 430,
    })
    // 가로 칩 목록: 가로만 스크롤
    const chips = makeBox('overflow-x: auto', {
      scrollHeight: 40,
      clientHeight: 40,
      scrollWidth: 900,
      clientWidth: 430,
    })
    const chip = document.createElement('button')
    chips.appendChild(chip)
    frame.appendChild(chips)
    document.body.appendChild(frame)

    expect(findScrollable(chip, 'x')).toBe(chips)
    // 칩 위에서 세로로 끌면 칩이 아니라 프레임이 움직여야 한다
    expect(findScrollable(chip, 'y')).toBe(frame)
  })

  it('overflow는 auto여도 내용이 넘치지 않으면 건너뛴다', () => {
    const notOverflowing = makeBox('overflow-y: auto', {
      scrollHeight: 300,
      clientHeight: 300,
      scrollWidth: 430,
      clientWidth: 430,
    })
    const child = document.createElement('span')
    notOverflowing.appendChild(child)
    document.body.appendChild(notOverflowing)

    expect(findScrollable(child, 'y')).toBeNull()
  })
})

describe('enableDragScroll', () => {
  it('임계값을 넘긴 드래그만 스크롤하고, 그 뒤의 click은 삼킨다', () => {
    const frame = makeBox('overflow-y: auto', {
      scrollHeight: 2000,
      clientHeight: 800,
      scrollWidth: 430,
      clientWidth: 430,
    })
    const link = document.createElement('a')
    frame.appendChild(link)
    document.body.appendChild(frame)
    enableDragScroll()

    let clicks = 0
    link.addEventListener('click', () => {
      clicks++
    })
    const click = () =>
      link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))

    // 임계값(5px) 미만으로 흔들린 클릭 → 스크롤도 없고 클릭은 살아있다
    link.dispatchEvent(pointer('pointerdown', 100, 400))
    document.dispatchEvent(pointer('pointermove', 102, 400))
    document.dispatchEvent(pointer('pointerup', 102, 400))
    click()
    expect(frame.scrollTop).toBe(0)
    expect(clicks).toBe(1)

    // 임계값을 넘긴 드래그 → 스크롤되고, 뒤따르는 클릭은 삼켜진다
    link.dispatchEvent(pointer('pointerdown', 100, 400))
    document.dispatchEvent(pointer('pointermove', 100, 300))
    expect(frame.scrollTop).toBe(100)
    document.dispatchEvent(pointer('pointerup', 100, 300))
    click()
    expect(clicks).toBe(1)

    // 다음 클릭은 다시 정상 동작해야 한다 (억제 플래그가 남지 않는다)
    link.dispatchEvent(pointer('pointerdown', 100, 400))
    document.dispatchEvent(pointer('pointerup', 100, 400))
    click()
    expect(clicks).toBe(2)
  })
})
