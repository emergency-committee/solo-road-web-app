/**
 * 마우스 클릭-드래그로 스크롤 컨테이너를 민다.
 *
 * 데스크탑(>430px)에서 .app-frame은 "폰 화면"이라 내부 스크롤 컨테이너가 되는데,
 * 브라우저는 휠·터치에만 스크롤을 붙여주고 마우스 드래그에는 붙여주지 않는다.
 * document 한 곳에만 리스너를 달고 누른 지점의 가장 가까운 스크롤 조상을 찾으므로,
 * 모달·바텀시트·가로 칩 목록 등 모든 스크롤 영역에 한 번에 적용된다.
 */

/** 이 거리를 넘겨야 드래그로 확정한다. 그 전까지는 클릭·텍스트 선택이 그대로 동작한다. */
const DRAG_THRESHOLD_PX = 5

/** 자체 드래그 동작이 있거나(지도) 텍스트 입력이 우선인 요소는 건너뛴다. */
const NON_DRAGGABLE =
  'input, textarea, select, [contenteditable]:not([contenteditable="false"]), [data-no-drag-scroll]'

type Axis = 'x' | 'y'

function overflows(el: Element, axis: Axis) {
  return axis === 'y' ? el.scrollHeight > el.clientHeight : el.scrollWidth > el.clientWidth
}

function isScrollable(el: Element, axis: Axis) {
  const style = getComputedStyle(el)
  const overflow = axis === 'y' ? style.overflowY : style.overflowX
  return /auto|scroll/.test(overflow) && overflows(el, axis)
}

/**
 * 누른 지점에서 위로 올라가며 해당 축으로 실제 스크롤되는 첫 조상을 찾는다.
 * 축을 나눠 찾는 이유: 가로 칩 목록 위에서 세로로 끌면 칩이 아니라 페이지가 움직여야 한다.
 */
export function findScrollable(start: Element | null, axis: Axis): Element | null {
  for (let el: Element | null = start; el && el !== document.body; el = el.parentElement) {
    if (isScrollable(el, axis)) return el
  }
  // 모바일 폭에서는 .app-frame이 아니라 문서가 스크롤한다.
  const doc = document.scrollingElement
  return doc && overflows(doc, axis) ? doc : null
}

export function enableDragScroll() {
  // 터치가 주 입력인 기기(폰·태블릿·인앱 브라우저)에서는 아예 리스너를 달지 않는다.
  // pointerType만 믿으면, 터치를 'mouse'로 잘못 보고하는 인앱 브라우저에서
  // 네이티브 터치 스크롤을 preventDefault로 죽여버린다.
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

  let targetX: Element | null = null
  let targetY: Element | null = null
  let startX = 0
  let startY = 0
  let startLeft = 0
  let startTop = 0
  let dragging = false
  let suppressClick = false

  function onPointerDown(event: PointerEvent) {
    // 다음 상호작용이 시작됐으니, 소비되지 않고 남은 클릭 억제 플래그를 여기서 푼다.
    suppressClick = false
    if (event.pointerType !== 'mouse' || event.button !== 0) return

    const origin = event.target instanceof Element ? event.target : null
    if (!origin || origin.closest(NON_DRAGGABLE)) return

    targetX = findScrollable(origin, 'x')
    targetY = findScrollable(origin, 'y')
    if (!targetX && !targetY) return

    startX = event.clientX
    startY = event.clientY
    startLeft = targetX?.scrollLeft ?? 0
    startTop = targetY?.scrollTop ?? 0
    dragging = false
  }

  function onPointerMove(event: PointerEvent) {
    if (event.pointerType !== 'mouse') return
    if (!targetX && !targetY) return
    // 창 밖에서 버튼을 떼면 pointerup을 못 받아 상태가 남는다. 그대로 두면 이후의
    // 모든 이동(터치 포함)이 preventDefault되어 스크롤이 통째로 죽는다.
    if (event.buttons === 0) {
      onPointerUp()
      return
    }
    const dx = event.clientX - startX
    const dy = event.clientY - startY

    if (!dragging) {
      if (Math.abs(dx) < DRAG_THRESHOLD_PX && Math.abs(dy) < DRAG_THRESHOLD_PX) return
      dragging = true
      document.getSelection()?.removeAllRanges()
      document.body.style.userSelect = 'none'
      document.body.style.cursor = 'grabbing'
    }

    if (targetX) targetX.scrollLeft = startLeft - dx
    if (targetY) targetY.scrollTop = startTop - dy
    event.preventDefault()
  }

  function onPointerUp() {
    if (dragging) {
      // 드래그 끝의 click이 카드/링크를 눌러버리지 않도록 한 번 삼킨다.
      suppressClick = true
      document.body.style.userSelect = ''
      document.body.style.cursor = ''
    }
    targetX = null
    targetY = null
    dragging = false
  }

  function onClickCapture(event: MouseEvent) {
    if (!suppressClick) return
    suppressClick = false
    event.stopPropagation()
    event.preventDefault()
  }

  function onDragStart(event: DragEvent) {
    // 이미지·링크의 네이티브 드래그가 스크롤을 가로채지 않게 한다.
    if (dragging) event.preventDefault()
  }

  document.addEventListener('pointerdown', onPointerDown, true)
  document.addEventListener('pointermove', onPointerMove, true)
  document.addEventListener('pointerup', onPointerUp, true)
  document.addEventListener('pointercancel', onPointerUp, true)
  document.addEventListener('click', onClickCapture, true)
  document.addEventListener('dragstart', onDragStart, true)
}
