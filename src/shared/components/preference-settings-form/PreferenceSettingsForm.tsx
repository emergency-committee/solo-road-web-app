import { Bell, ChevronRight, Footprints, Wallet } from 'lucide-react'
import { useState } from 'react'
import { FilterChipGroup } from '@/shared/components/FilterChip'
import { Switch } from '@/shared/components/ui/switch'

const MOOD_OPTIONS = [
  { value: 'quiet', label: '조용한' },
  { value: 'vibrant', label: '활기찬' },
  { value: 'nature', label: '자연 속' },
  { value: 'urban', label: '도심 속' },
]

const FOOD_OPTIONS = [
  { value: 'korean', label: '한식' },
  { value: 'western', label: '양식' },
  { value: 'japanese', label: '일식' },
  { value: 'chinese', label: '중식' },
  { value: 'vegan', label: '비건' },
  { value: 'street-food', label: '길거리 음식' },
  { value: 'cafe-dessert', label: '카페/디저트' },
  { value: 'fine-dining', label: '파인 다이닝' },
]

const ADVANCED_SETTINGS = [
  { icon: Wallet, label: '가격대', value: '보통 ($$)' },
  { icon: Footprints, label: '이동 속도 선호', value: '느긋하게' },
  { icon: Bell, label: '스마트 알림', value: '안전·경로 알림 사용 중' },
]

export interface PreferenceSettingsSubmitData {
  mood: string[]
  soloPriority: boolean
  food: string[]
}

interface PreferenceSettingsFormProps {
  mode: 'onboarding' | 'settings'
  onSubmit: (data: PreferenceSettingsSubmitData) => void
}

export function PreferenceSettingsForm({ mode, onSubmit }: PreferenceSettingsFormProps) {
  const [mood, setMood] = useState<string[]>(['quiet'])
  const [soloPriority, setSoloPriority] = useState(true)
  const [food, setFood] = useState<string[]>(['korean', 'japanese'])

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
            <p className="font-label-md text-label-md text-white/80">
              당신의 속도에 맞춘 솔로더
            </p>
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
        <FilterChipGroup options={MOOD_OPTIONS} mode="multi" value={mood} onChange={setMood} />
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

      <section>
        <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-sm">
          음식 관심사
        </h2>
        <FilterChipGroup options={FOOD_OPTIONS} mode="multi" value={food} onChange={setFood} />
      </section>

      <section className="space-y-base">
        <h2 className="font-label-caps text-label-caps text-outline mb-xs px-base uppercase">
          고급 설정
        </h2>
        <div className="border-outline-variant bg-surface-container-lowest overflow-hidden rounded-xl border">
          {ADVANCED_SETTINGS.map((setting, i) => (
            <button
              key={setting.label}
              type="button"
              className="hover:bg-surface-container p-md flex w-full items-center justify-between transition-colors"
              style={i < ADVANCED_SETTINGS.length - 1 ? { borderBottom: '1px solid #dee3e7' } : {}}
            >
              <div className="gap-md flex items-center">
                <setting.icon className="text-on-surface-variant size-5" />
                <div className="text-left">
                  <p className="font-label-md text-label-md text-on-surface">{setting.label}</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    {setting.value}
                  </p>
                </div>
              </div>
              <ChevronRight className="text-outline size-5" />
            </button>
          ))}
        </div>
      </section>

      <button
        type="button"
        onClick={() => onSubmit({ mood, soloPriority, food })}
        className="font-label-md bg-primary text-on-primary flex w-full items-center justify-center gap-2 rounded-xl py-4 shadow-lg transition-transform active:scale-[0.98]"
      >
        {mode === 'onboarding' ? '시작하기' : '설정 저장'}
      </button>
    </div>
  )
}
