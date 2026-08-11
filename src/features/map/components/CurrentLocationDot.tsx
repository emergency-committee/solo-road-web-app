/** 카카오맵 CustomOverlay content로 쓰이는 "현재 위치" 펄스 마커. */
export function CurrentLocationDot() {
  return (
    <div className="relative flex size-3.5 items-center justify-center">
      <div className="bg-primary/40 absolute size-12 animate-ping rounded-full" />
      <div className="bg-primary size-3.5 rounded-full border-2 border-white shadow-[0_0_8px_rgba(0,0,0,0.2)]" />
    </div>
  )
}
