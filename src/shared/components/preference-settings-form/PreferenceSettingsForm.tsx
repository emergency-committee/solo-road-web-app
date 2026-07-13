import { Bell, ChevronRight, Footprints, Wallet } from 'lucide-react'
import { useState } from 'react'
import { FilterChipGroup } from '@/shared/components/FilterChip'
import { Switch } from '@/shared/components/ui/switch'

const MOOD_OPTIONS = [
  { value: 'quiet', label: 'Quiet' },
  { value: 'vibrant', label: 'Vibrant' },
  { value: 'nature', label: 'Nature' },
  { value: 'urban', label: 'Urban' },
]

const FOOD_OPTIONS = [
  { value: 'korean', label: '한식' },
  { value: 'western', label: '양식' },
  { value: 'japanese', label: '일식' },
  { value: 'chinese', label: '중식' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'street-food', label: 'Street Food' },
  { value: 'cafe-dessert', label: 'Cafe & Dessert' },
  { value: 'fine-dining', label: 'Fine Dining' },
]

const ADVANCED_SETTINGS = [
  { icon: Wallet, label: 'Price Range', value: 'Moderate ($$)' },
  { icon: Footprints, label: 'Pace preference', value: 'Relaxed & Casual' },
  { icon: Bell, label: 'Smart Alerts', value: 'Enabled for safety & routes' },
]

interface PreferenceSettingsFormProps {
  mode: 'onboarding' | 'settings'
  onSubmit: () => void
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
              Customize your journey
            </p>
            <p className="font-label-md text-label-md text-white/80">
              Tailoring Solo-road to your pace
            </p>
          </div>
        </section>
      )}

      <section>
        <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-sm">
          Preferred Atmosphere
        </h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant mb-md">
          What kind of environment feels most comfortable for you today?
        </p>
        <FilterChipGroup options={MOOD_OPTIONS} mode="multi" value={mood} onChange={setMood} />
      </section>

      <section className="border-outline-variant bg-surface-container-low p-md flex items-center justify-between rounded-xl border">
        <div>
          <h3 className="font-label-md text-label-md text-on-surface">Solo-friendly priority</h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Prioritize places with solo seating and high safety ratings.
          </p>
        </div>
        <Switch checked={soloPriority} onCheckedChange={setSoloPriority} />
      </section>

      <section>
        <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-sm">
          Food Interests
        </h2>
        <FilterChipGroup options={FOOD_OPTIONS} mode="multi" value={food} onChange={setFood} />
      </section>

      <section className="space-y-base">
        <h2 className="font-label-caps text-label-caps text-outline mb-xs px-base uppercase">
          Advanced Settings
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
        onClick={onSubmit}
        className="font-label-md bg-primary text-on-primary flex w-full items-center justify-center gap-2 rounded-xl py-4 shadow-lg transition-transform active:scale-[0.98]"
      >
        {mode === 'onboarding' ? '시작하기' : 'Save Preferences'}
      </button>
    </div>
  )
}
