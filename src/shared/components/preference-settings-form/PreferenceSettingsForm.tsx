import { useState } from 'react'
import { FilterChipGroup } from '@/shared/components/FilterChip'
import { Switch } from '@/shared/components/ui/switch'
import {
  FOOD_PREFERENCE_OPTIONS,
  INTEREST_PREFERENCE_OPTIONS,
  MOOD_PREFERENCE_OPTIONS,
} from '@/shared/constants/preference-options'

export interface PreferenceSettingsSubmitData {
  mood: string[]
  soloPriority: boolean
  food: string[]
  interestTags?: string[]
}

interface PreferenceSettingsFormProps {
  mode: 'onboarding' | 'settings'
  onSubmit: (data: PreferenceSettingsSubmitData) => void
  initialMood?: string[]
  initialSoloPriority?: boolean
  initialFood?: string[]
  initialInterestTags?: string[]
}

export function PreferenceSettingsForm({
  mode,
  onSubmit,
  initialMood,
  initialSoloPriority = true,
  initialFood,
  initialInterestTags = [],
}: PreferenceSettingsFormProps) {
  const [mood, setMood] = useState<string[]>(initialMood ?? ['상관없음'])
  const [soloPriority, setSoloPriority] = useState(initialSoloPriority)
  const [food, setFood] = useState<string[]>(initialFood ?? [])
  const [interestTags, setInterestTags] = useState<string[]>(initialInterestTags)

  return (
    <div className="space-y-xl">
      {mode === 'settings' && (
        <section className="border-outline-variant relative h-40 overflow-hidden rounded-xl border shadow-sm">
          <img
            src="https://picsum.photos/seed/travel-preferences-banner/800/320"
            alt="여행 준비를 위한 지도와 배낭"
            className="size-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute bottom-4 left-4">
            <p className="font-headline-lg-mobile text-headline-lg-mobile text-white">
              나만의 여정을 만들어보세요
            </p>
            <p className="font-label-md text-label-md text-white/80">당신의 속도에 맞춘 솔로더</p>
          </div>
        </section>
      )}

      <section>
        <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-sm">
          선호하는 분위기
        </h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant mb-md">
          오늘 가장 편안하게 느껴지는 분위기는 무엇인가요?
        </p>
        <FilterChipGroup options={MOOD_PREFERENCE_OPTIONS} value={mood} onChange={setMood} />
      </section>

      <section className="border-outline-variant bg-surface-container-low p-md flex items-center justify-between rounded-xl border">
        <div>
          <h3 className="font-label-md text-label-md text-on-surface">혼행 친화 우선</h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            1인석과 안전 평점이 높은 장소를 우선 추천합니다.
          </p>
        </div>
        <Switch checked={soloPriority} onCheckedChange={setSoloPriority} />
      </section>

      {mode === 'settings' && (
        <>
          <section>
            <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-sm">
              음식 관심사
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-md">
              좋아하는 음식 종류를 최대 3개까지 선택해 주세요.
            </p>
            <FilterChipGroup
              options={FOOD_PREFERENCE_OPTIONS}
              mode="multi"
              maxSelections={3}
              value={food}
              onChange={setFood}
            />
          </section>

          <section>
            <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-sm">
              관심 분야
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-md">
              최대 3개까지 선택할 수 있어요.
            </p>
            <FilterChipGroup
              options={INTEREST_PREFERENCE_OPTIONS}
              mode="multi"
              maxSelections={3}
              value={interestTags}
              onChange={setInterestTags}
            />
          </section>
        </>
      )}

      <button
        type="button"
        onClick={() =>
          onSubmit({
            mood,
            soloPriority,
            food,
            ...(mode === 'settings' ? { interestTags } : {}),
          })
        }
        className="font-label-md bg-primary text-on-primary flex w-full items-center justify-center gap-2 rounded-xl py-4 shadow-lg transition-transform active:scale-[0.98]"
      >
        {mode === 'onboarding' ? '시작하기' : '설정 저장'}
      </button>
    </div>
  )
}
