import { createFileRoute } from '@tanstack/react-router'
import { ShieldUser } from 'lucide-react'
import { KakaoLoginButton } from '@/features/auth'
import { loginPageGuard } from '@/shared/auth/route-guards'

export const Route = createFileRoute('/login/')({
  beforeLoad: loginPageGuard,
  component: LoginPage,
})

function LoginPage() {
  return (
    <main className="bg-background px-margin-mobile py-xl flex min-h-screen flex-col items-center justify-between">
      <div className="mt-xl flex flex-1 flex-col items-center justify-center">
        <div className="bg-primary-container mb-md flex size-20 items-center justify-center rounded-full shadow-md">
          <ShieldUser className="text-on-primary-container size-10" fill="currentColor" />
        </div>
        <h1 className="font-headline-xl text-headline-xl text-primary mb-base tracking-tight">
          Solo-road
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant text-center">
          안전하고 쾌적한 나홀로 여행의 시작
        </p>
      </div>

      <div className="mb-xl w-full max-w-[400px]">
        <KakaoLoginButton />
      </div>
    </main>
  )
}
