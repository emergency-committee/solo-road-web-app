import { cn } from '@/shared/lib/utils'

export function ProgressDots({ total, current }: { total: number; current: number }) {
  return (
    <div className="gap-xs flex justify-center">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={cn(
            'h-1.5 rounded-full transition-all duration-300',
            i + 1 === current ? 'bg-primary w-8' : 'bg-surface-container-highest w-4',
          )}
        />
      ))}
    </div>
  )
}
