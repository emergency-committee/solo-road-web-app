import { ChevronRight, Route } from 'lucide-react'

interface CourseLegButtonProps {
  originName: string
  destinationName: string
  onClick: () => void
  label?: string
  description?: string
}

export function CourseLegButton({
  originName,
  destinationName,
  onClick,
  label = '안심 도보 경로',
  description,
}: CourseLegButtonProps) {
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
        <span className="text-on-surface-variant block text-[10px] font-semibold">{label}</span>
        <span className="text-on-surface line-clamp-2 text-xs leading-snug font-bold break-keep [overflow-wrap:anywhere]">
          {originName} → {destinationName}
        </span>
        {description && (
          <span className="text-on-surface-variant mt-0.5 line-clamp-2 text-[10px] leading-snug break-keep">
            {description}
          </span>
        )}
      </span>
      <ChevronRight className="text-outline size-4 shrink-0" />
    </button>
  )
}
