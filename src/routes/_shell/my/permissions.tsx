import { createFileRoute } from '@tanstack/react-router'
import { ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { mockPermissionSettings, PermissionToggleCard } from '@/features/profile'
import { TopAppBar } from '@/shared/components/layout/TopAppBar'

export const Route = createFileRoute('/_shell/my/permissions')({
  component: PermissionsPage,
})

function PermissionsPage() {
  const [permissions, setPermissions] = useState(mockPermissionSettings)

  return (
    <div className="bg-surface flex min-h-screen flex-col">
      <TopAppBar title="Permissions" showBack />
      <main className="px-margin-mobile mx-auto w-full max-w-2xl flex-1 pb-24">
        <section className="py-xl">
          <div className="mb-lg">
            <div className="mb-md bg-primary-container flex size-16 items-center justify-center rounded-2xl shadow-sm">
              <ShieldCheck className="text-on-primary-container size-8" fill="currentColor" />
            </div>
            <h2 className="font-headline-lg text-headline-lg mb-sm text-primary">
              Your Safety, Your Choice
            </h2>
            <p className="font-body-md text-on-surface-variant leading-relaxed">
              Solo-road uses real-time data to provide silent, reliable protection. By enabling
              these permissions, you allow our system to monitor safe routes, detect unusual stops,
              and alert your trusted contacts if you need assistance.
            </p>
          </div>
        </section>

        <section className="space-y-md">
          {permissions.map((permission) => (
            <PermissionToggleCard
              key={permission.id}
              permission={permission}
              onToggle={(enabled) =>
                setPermissions((prev) =>
                  prev.map((p) => (p.id === permission.id ? { ...p, enabled } : p)),
                )
              }
            />
          ))}
        </section>

        <div className="mt-xl gap-sm pb-lg flex flex-col">
          <button
            type="button"
            className="font-label-caps bg-primary text-on-primary flex h-14 w-full items-center justify-center gap-2 rounded-full tracking-widest uppercase shadow-lg transition-all hover:opacity-90 active:scale-[0.98]"
          >
            Save Preferences
          </button>
          <p className="font-label-md text-on-surface-variant text-center">
            You can change these anytime in settings.
          </p>
        </div>
      </main>
    </div>
  )
}
