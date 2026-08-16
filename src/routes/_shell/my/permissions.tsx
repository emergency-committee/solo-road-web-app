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
      <TopAppBar title="권한 설정" showBack />
      <main className="px-margin-mobile mx-auto w-full max-w-2xl flex-1 pb-24">
        <section className="py-xl">
          <div className="mb-lg">
            <div className="mb-md bg-primary-container flex size-16 items-center justify-center rounded-2xl shadow-sm">
              <ShieldCheck className="text-on-primary-container size-8" fill="currentColor" />
            </div>
            <h2 className="font-headline-lg text-headline-lg mb-sm text-primary">
              당신의 안전, 당신의 선택
            </h2>
            <p className="font-body-md text-on-surface-variant leading-relaxed">
              솔로더는 실시간 데이터로 조용하고 신뢰할 수 있는 보호를 제공합니다. 이 권한을 허용하면
              안전한 경로를 모니터링하고, 이상 상황을 감지하며, 도움이 필요할 때 지정한 연락처에
              알릴 수 있습니다.
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
            설정 저장
          </button>
          <p className="font-label-md text-on-surface-variant text-center">
            설정에서 언제든지 변경할 수 있습니다.
          </p>
        </div>
      </main>
    </div>
  )
}
