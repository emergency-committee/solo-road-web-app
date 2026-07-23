import { Compass, HeartHandshake, UtensilsCrossed } from 'lucide-react'

export function OnboardingWelcomeStep() {
  return (
    <div className="flex flex-1 flex-col justify-center">
      <h2 className="font-headline-xl text-headline-xl text-on-surface mb-md">
        안전하고 쾌적한
        <br />
        <span className="text-primary">나홀로 여행</span>의 시작
      </h2>
      <p className="font-body-md text-body-md text-on-surface-variant mb-xl max-w-[80%]">
        솔로드와 함께라면 더 이상 혼자 가는 길이 두렵지 않습니다. 검증된 안전 경로와 혼자서도
        환영받는 장소들을 만나보세요.
      </p>
      <div className="gap-md grid grid-cols-2">
        <div className="gap-md bg-surface-container-low p-lg col-span-2 flex items-center rounded-xl shadow-sm">
          <div className="bg-secondary-container text-on-secondary-container flex size-12 shrink-0 items-center justify-center rounded-full">
            <HeartHandshake className="size-6" fill="currentColor" />
          </div>
          <div>
            <p className="font-label-md text-label-md text-secondary">안심 귀가 경로</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              조명이 밝고 유동인구가 적절한 안전한 길 안내
            </p>
          </div>
        </div>
        <div className="bg-surface-container-low p-lg rounded-xl shadow-sm">
          <div className="mb-sm bg-primary-fixed text-primary flex size-10 items-center justify-center rounded-full">
            <UtensilsCrossed className="size-5" />
          </div>
          <p className="font-label-md text-label-md text-primary">혼밥 성지</p>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            눈치 보지 않는 1인 친화 식당
          </p>
        </div>
        <div className="bg-surface-container-low p-lg rounded-xl shadow-sm">
          <div className="mb-sm bg-tertiary-fixed text-tertiary flex size-10 items-center justify-center rounded-full">
            <Compass className="size-5" />
          </div>
          <p className="font-label-md text-label-md text-tertiary">테마 탐색</p>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            당신의 취향을 반영한 여행지
          </p>
        </div>
      </div>
    </div>
  )
}
