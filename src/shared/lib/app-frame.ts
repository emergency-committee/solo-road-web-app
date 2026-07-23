let frameElement: HTMLDivElement | null = null

export function setAppFrameElement(el: HTMLDivElement | null) {
  frameElement = el
}

export function getAppFrameElement(): HTMLDivElement | null {
  return frameElement
}
