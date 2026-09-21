import { createFileRoute, useRouter } from '@tanstack/react-router'
import {
  PreferenceSettingsForm,
  type PreferenceSettingsSubmitData,
} from '@/shared/components/preference-settings-form/PreferenceSettingsForm'
import { TopAppBar } from '@/shared/components/layout/TopAppBar'
import { useMyInterests, useUpdateInterests } from '@/features/profile'

export const Route = createFileRoute('/_shell/my/preferences')({
  component: PreferencesPage,
})

function PreferencesPage() {
  const router = useRouter()
  const interestsQuery = useMyInterests()
  const updateInterests = useUpdateInterests()

  function handleSubmit(data: PreferenceSettingsSubmitData) {
    updateInterests.mutate(
      {
        preferredMood: data.mood[0] ?? '상관없음',
        foodStyle: data.food.join(',') || 'ALL',
        hashtagList: data.interestTags ?? [],
        soloPreferenceScore: data.soloPriority ? 1 : 0,
      },
      { onSuccess: () => router.history.back() },
    )
  }

  return (
    <div className="bg-surface min-h-screen pb-24">
      <TopAppBar title="여행 취향 설정" showBack />
      <main className="px-margin-mobile pt-lg mx-auto max-w-2xl">
        {interestsQuery.isLoading ? (
          <p className="text-on-surface-variant py-xl text-center">
            취향 정보를 불러오는 중이에요.
          </p>
        ) : interestsQuery.isError ? (
          <div className="py-xl text-center">
            <p className="text-error">취향 정보를 불러오지 못했어요.</p>
            <button
              type="button"
              className="text-primary mt-md font-medium"
              onClick={() => interestsQuery.refetch()}
            >
              다시 시도
            </button>
          </div>
        ) : (
          <PreferenceSettingsForm
            mode="settings"
            onSubmit={handleSubmit}
            initialFood={normalizeFoodStyle(interestsQuery.data?.foodStyle)}
            initialMood={normalizeMood(interestsQuery.data?.preferredMood)}
            initialSoloPriority={(interestsQuery.data?.soloPreferenceScore ?? 1) >= 0.5}
            initialInterestTags={interestsQuery.data?.hashtagList ?? []}
          />
        )}
      </main>
    </div>
  )
}

const FOOD_STYLE_MAP: Record<string, string> = {
  한식: 'KOREAN',
  korean: 'KOREAN',
  중식: 'CHINESE',
  chinese: 'CHINESE',
  일식: 'JAPANESE',
  japanese: 'JAPANESE',
  양식: 'WESTERN',
  western: 'WESTERN',
  분식: 'SNACK',
  'street-food': 'SNACK',
  아시안: 'ASIAN',
  asian: 'ASIAN',
  기타: 'ETC',
  etc: 'ETC',
}

function normalizeFoodStyle(foodStyle?: string | null) {
  if (!foodStyle) return []
  return [
    ...new Set(
      foodStyle
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean)
        .map((value) => FOOD_STYLE_MAP[value.toLowerCase()] ?? value.toUpperCase())
        .filter((value) => value !== 'ALL' && FOOD_OPTIONS.has(value)),
    ),
  ].slice(0, 3)
}

const FOOD_OPTIONS = new Set(['KOREAN', 'CHINESE', 'JAPANESE', 'WESTERN', 'SNACK', 'ASIAN', 'ETC'])

function normalizeMood(mood?: string | null) {
  if (!mood) return ['상관없음']
  if (mood === '조용/차분' || mood === 'quiet' || mood === '조용한' || mood === 'nature') {
    return ['조용/차분']
  }
  if (mood === '활발/액티브' || mood === 'vibrant' || mood === '활기찬') {
    return ['활발/액티브']
  }
  return ['상관없음']
}
