import type { ReactNode } from 'react'
import { ProgressDots } from './ProgressDots'

interface OnboardingLayoutProps {
  step: number
  totalSteps: number
  onSkip: () => void
  footer: ReactNode
  children: ReactNode
}

export function OnboardingLayout({
  step,
  totalSteps,
  onSkip,
  footer,
  children,
}: OnboardingLayoutProps) {
  return (
    <div className="bg-background text-on-background px-margin-mobile py-xl flex min-h-screen flex-col">
      <header className="flex items-center justify-between">
        <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary font-bold tracking-tight">
          Solo-road
        </h1>
        <button
          type="button"
          onClick={onSkip}
          className="font-label-md text-label-md hover:bg-surface-variant px-md py-xs text-on-surface-variant rounded-full transition-colors"
        >
          건너뛰기
        </button>
      </header>

      <div className="my-lg">
        <ProgressDots total={totalSteps} current={step} />
      </div>

      <main className="flex-1">{children}</main>

      <footer className="mt-lg">{footer}</footer>
    </div>
  )
}
