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
    buttons: type === 'pointerup' ? 0 : 1, // 버튼을 누른 채 움직이는 상태
  })
  Object.defineProperty(event, 'pointerType', { value: 'mouse' })
  return event
}

/** 터치 포인터 이벤트 (버튼 없음). */
function touch(type: string, clientX: number, clientY: number) {
  const event = new MouseEvent(type, { bubbles: true, cancelable: true, clientX, clientY })
  Object.defineProperty(event, 'pointerType', { value: 'touch' })
  return event
}

/** jsdom의 matchMedia는 늘 matches:false라 "마우스 있는 기기" 게이트를 열어준다. */
function asPointerFineDevice() {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: (query: string) => ({ matches: true, media: query }),
  })
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
    asPointerFineDevice()
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
  it('터치 포인터는 스크롤을 가로채지 않는다', () => {
    const frame = makeBox('overflow-y: auto', {
      scrollHeight: 2000,
      clientHeight: 800,
      scrollWidth: 430,
      clientWidth: 430,
    })
    const child = document.createElement('span')
    frame.appendChild(child)
    document.body.appendChild(frame)
    asPointerFineDevice()
    enableDragScroll()

    child.dispatchEvent(touch('pointerdown', 100, 400))
    const move = touch('pointermove', 100, 200)
    document.dispatchEvent(move)

    // 네이티브 터치 스크롤이 살아있어야 한다: 우리가 굴리지도, preventDefault 하지도 않는다
    expect(frame.scrollTop).toBe(0)
    expect(move.defaultPrevented).toBe(false)
  })

  it('창 밖에서 버튼을 뗀 뒤 남은 상태가 이후 스크롤을 막지 않는다', () => {
    const frame = makeBox('overflow-y: auto', {
      scrollHeight: 2000,
      clientHeight: 800,
      scrollWidth: 430,
      clientWidth: 430,
    })
    const child = document.createElement('span')
    frame.appendChild(child)
    document.body.appendChild(frame)
    asPointerFineDevice()
    enableDragScroll()

    // 드래그 시작 → pointerup 없이 버튼만 떼진 상태(창 밖에서 뗀 경우)
    child.dispatchEvent(pointer('pointerdown', 100, 400))
    document.dispatchEvent(pointer('pointermove', 100, 300))
    expect(frame.scrollTop).toBe(100)
    const released = new MouseEvent('pointermove', {
      bubbles: true,
      cancelable: true,
      clientX: 100,
      clientY: 250,
      buttons: 0,
    })
    Object.defineProperty(released, 'pointerType', { value: 'mouse' })
    document.dispatchEvent(released)

    // 상태가 털렸으므로 이후 터치 이동은 아무 영향도 받지 않는다
    const afterTouch = touch('pointermove', 100, 100)
    document.dispatchEvent(afterTouch)
    expect(afterTouch.defaultPrevented).toBe(false)
    expect(frame.scrollTop).toBe(100)
  })
})
