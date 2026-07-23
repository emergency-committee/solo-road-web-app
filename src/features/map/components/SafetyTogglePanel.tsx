import { Bell, Lightbulb, Video } from 'lucide-react'

export function SafetyTogglePanel() {
  return (
    <div className="right-margin-mobile gap-sm absolute top-1/3 z-30 flex flex-col">
      <button
        type="button"
        aria-label="CCTV 표시"
        className="hover:bg-surface-container-low text-on-surface flex size-12 items-center justify-center rounded-full bg-white shadow-md transition-colors active:scale-90"
      >
        <Video className="size-5" />
      </button>
      <button
        type="button"
        aria-label="조명 표시"
        className="hover:bg-surface-container-low text-on-surface flex size-12 items-center justify-center rounded-full bg-white shadow-md transition-colors active:scale-90"
      >
        <Lightbulb className="size-5" />
      </button>
      <button
        type="button"
        aria-label="안전 알림"
        className="bg-secondary text-on-secondary flex size-12 items-center justify-center rounded-full shadow-lg transition-colors active:scale-90"
      >
        <Bell className="size-5" fill="currentColor" />
      </button>
    </div>
  )
}
