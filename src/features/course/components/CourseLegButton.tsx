import { ChevronRight, Route } from 'lucide-react'

interface CourseLegButtonProps {
  originName: string
  destinationName: string
  onClick: () => void
}

export function CourseLegButton({ originName, destinationName, onClick }: CourseLegButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="border-outline-variant hover:border-primary flex w-full items-center gap-3 rounded-[8px] border bg-white px-3 py-2.5 text-left shadow-sm transition-colors active:scale-[0.99]"
    >
      <span className="bg-primary-fixed text-primary grid size-8 shrink-0 place-items-center rounded-full">
        <Route className="size-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="text-on-surface-variant block text-[10px] font-semibold">
          안심 도보 경로
        </span>
        <span className="text-on-surface block truncate text-xs font-bold">
          {originName} → {destinationName}
        </span>
      </span>
      <ChevronRight className="text-outline size-4 shrink-0" />
    </button>
  )
}
