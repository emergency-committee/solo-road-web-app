let frameElement: HTMLDivElement | null = null

export function setAppFrameElement(el: HTMLDivElement | null) {
  frameElement = el
}

export function getAppFrameElement(): HTMLDivElement | null {
  return frameElement
}

/**
 * 데스크탑(>430px)에서는 문서가 아니라 .app-frame이 스크롤 컨테이너라
 * window.scrollTo만으로는 화면이 올라가지 않는다. 둘 다 올린다.
 */
export function scrollFrameToTop() {
  frameElement?.scrollTo(0, 0)
  window.scrollTo(0, 0)
}
