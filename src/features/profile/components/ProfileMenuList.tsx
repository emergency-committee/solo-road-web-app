import type { ReactNode } from 'react'
import { ChevronRight } from 'lucide-react'

export interface ProfileMenuItem {
  icon: ReactNode
  label: string
  onClick: () => void
}

export function ProfileMenuList({ items, title }: { items: ProfileMenuItem[]; title?: string }) {
  return (
    <section className="mb-xl">
      {title && (
        <h3 className="font-label-caps text-label-caps text-outline mb-sm px-xs">{title}</h3>
      )}
      <div className="gap-xs flex flex-col">
        {items.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={item.onClick}
            className="hover:bg-surface-variant bg-surface-container-lowest p-md flex w-full items-center justify-between rounded-xl transition-colors active:scale-[0.98]"
          >
            <div className="gap-md flex items-center">
              <div className="bg-primary-container/10 text-primary flex size-10 items-center justify-center rounded-full">
                {item.icon}
              </div>
              <span className="font-body-md text-body-md text-on-surface">{item.label}</span>
            </div>
            <ChevronRight className="text-outline size-5" />
          </button>
        ))}
      </div>
    </section>
  )
}
