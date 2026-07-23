import {
  BrainCircuit,
  Camera,
  Compass,
  Gamepad2,
  Landmark,
  Sparkles,
  Trees,
  UtensilsCrossed,
} from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { useOnboardingStore } from '../store/onboarding-store'

const FOOD_OPTIONS = ['한식', '중식', '일식', '양식', '분식', '아시안', '기타']

const INTEREST_OPTIONS = [
  { value: '자연/풍경', label: '🌿 자연/풍경', icon: Trees },
  { value: '전시/문화', label: '🏛️ 전시/문화', icon: Landmark },
  { value: '액티비티', label: '🎮 액티비티', icon: Gamepad2 },
  { value: '맛집/요리', label: '🧑‍🍳 맛집/요리', icon: UtensilsCrossed },
  { value: '사진/영상', label: '📷 사진/영상', icon: Camera },
  { value: '웰니스/힐링', label: '🧘 웰니스/힐링', icon: Sparkles },
  { value: '여행/동네탐방', label: '🚶 여행/동네탐방', icon: Compass },
  { value: '학습/스터디', label: '🧠 학습/스터디', icon: BrainCircuit },
]

export function OnboardingProfileStep() {
  const { gender, setGender, foodPreference, setFoodPreference, interests, toggleInterest } =
    useOnboardingStore()

  return (
    <div className="space-y-xl">
      <section className="space-y-sm">
        <div className="flex items-end justify-between">
          <h3 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-bold">
            1) 성별
          </h3>
          <span className="font-label-md text-label-md text-outline">1개만 선택해요.</span>
        </div>
        <div className="gap-sm grid grid-cols-2">
          {(['남성', '여성'] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setGender(option)}
              className={cn(
                'py-md font-body-md rounded-xl border-2 transition-all active:scale-95',
                gender === option
                  ? 'border-primary bg-primary text-white'
                  : 'border-outline-variant hover:bg-surface-container-low bg-white',
              )}
            >
              {option}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-sm">
        <h3 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-bold">
          2) 음식 취향
        </h3>
        <span className="font-label-md text-label-md text-outline">
          가장 좋아하는 메뉴 1개를 선택해 주세요.
        </span>
        <div className="gap-xs flex flex-wrap">
          {FOOD_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setFoodPreference(option)}
              className={cn(
                'font-label-md px-lg py-sm rounded-full border transition-all active:scale-95',
                foodPreference === option
                  ? 'border-primary bg-primary text-white'
                  : 'border-outline-variant hover:bg-surface-container text-on-surface-variant bg-white',
              )}
            >
              {option}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-sm">
        <h3 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-bold">
          3) 관심분야 (최대 3개)
        </h3>
        <span className="font-label-md text-label-md text-outline">
          선택한 관심분야로 추천을 더 정확하게 만들어요.
        </span>
        <div className="gap-sm grid grid-cols-2">
          {INTEREST_OPTIONS.map(({ value, label, icon: Icon }) => {
            const active = interests.includes(value)
            const disabled = !active && interests.length >= 3
            return (
              <button
                key={value}
                type="button"
                disabled={disabled}
                onClick={() => toggleInterest(value)}
                className={cn(
                  'gap-xs p-md flex flex-col items-start rounded-xl border text-left transition-all duration-300 disabled:opacity-40',
                  active
                    ? 'border-secondary bg-secondary/15 text-secondary'
                    : 'border-outline-variant bg-white hover:shadow-md',
                )}
              >
                <div
                  className={cn(
                    'flex size-10 items-center justify-center rounded-full transition-colors',
                    active ? 'bg-secondary text-white' : 'bg-surface-container text-primary',
                  )}
                >
                  <Icon className="size-5" />
                </div>
                <span className="font-label-md">{label}</span>
              </button>
            )
          })}
        </div>
      </section>
    </div>
  )
}
