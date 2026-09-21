import { cn } from '@/shared/lib/utils'

interface FilterChipProps {
  label: string
  active: boolean
  onClick: () => void
  className?: string
  disabled?: boolean
}

export function FilterChip({
  label,
  active,
  onClick,
  className,
  disabled = false,
}: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      className={cn(
        'font-label-md text-label-md px-md py-xs shrink-0 rounded-full whitespace-nowrap transition-colors',
        active
          ? 'bg-primary text-on-primary'
          : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest',
        disabled && 'cursor-not-allowed opacity-40',
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
  options: readonly FilterChipOption[]
  mode?: 'single' | 'multi'
  value: string[]
  onChange: (value: string[]) => void
  className?: string
  maxSelections?: number
}

export function FilterChipGroup({
  options,
  mode = 'single',
  value,
  onChange,
  className,
  maxSelections,
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
          disabled={
            mode === 'multi' &&
            maxSelections !== undefined &&
            value.length >= maxSelections &&
            !value.includes(option.value)
          }
          onClick={() => handleToggle(option.value)}
        />
      ))}
    </div>
  )
}
