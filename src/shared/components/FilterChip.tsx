import { cn } from '@/shared/lib/utils'

interface FilterChipProps {
  label: string
  active: boolean
  onClick: () => void
  className?: string
}

export function FilterChip({ label, active, onClick, className }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'font-label-md text-label-md px-md py-xs shrink-0 rounded-full whitespace-nowrap transition-colors',
        active
          ? 'bg-primary text-on-primary'
          : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest',
        className,
      )}
    >
      {label}
    </button>
  )
}

interface FilterChipOption {
  value: string
  label: string
}

interface FilterChipGroupProps {
  options: FilterChipOption[]
  mode?: 'single' | 'multi'
  value: string[]
  onChange: (value: string[]) => void
  className?: string
}

export function FilterChipGroup({
  options,
  mode = 'single',
  value,
  onChange,
  className,
}: FilterChipGroupProps) {
  function handleToggle(optionValue: string) {
    if (mode === 'single') {
      onChange([optionValue])
      return
    }
    onChange(
      value.includes(optionValue)
        ? value.filter((v) => v !== optionValue)
        : [...value, optionValue],
    )
  }

  return (
    <div className={cn('no-scrollbar gap-xs flex overflow-x-auto', className)}>
      {options.map((option) => (
        <FilterChip
          key={option.value}
          label={option.label}
          active={value.includes(option.value)}
          onClick={() => handleToggle(option.value)}
        />
      ))}
    </div>
  )
}
