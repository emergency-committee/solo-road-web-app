import { LocateFixed } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { Switch } from '@/shared/components/ui/switch'
import type { PermissionSetting } from '../types/profile.types'

interface PermissionToggleCardProps {
  permission: PermissionSetting
  onToggle: (enabled: boolean) => void
}

export function PermissionToggleCard({ permission, onToggle }: PermissionToggleCardProps) {
  return (
    <div
      className={cn(
        'border-outline-variant/30 bg-surface-container-low p-md hover:bg-surface-container flex items-start gap-4 rounded-xl border shadow-sm transition-colors',
        permission.enabled && 'ring-primary/20 ring-1',
      )}
    >
      <div className="bg-surface-container-highest mt-1 rounded-lg p-2">
        <LocateFixed className="text-primary size-5" />
      </div>
      <div className="flex-1">
        <div className="flex items-start justify-between">
          <h3 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">
            {permission.title}
          </h3>
          <Switch
            checked={permission.enabled}
            onCheckedChange={onToggle}
            aria-label={permission.title}
          />
        </div>
        <p className="font-body-sm text-on-surface-variant mt-1">{permission.description}</p>
      </div>
    </div>
  )
}
