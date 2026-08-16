import { Building2, MapPinPlus, Moon, Search, Sparkles, Trees, X, Zap } from 'lucide-react'
import { useState } from 'react'
import { Switch } from '@/shared/components/ui/switch'
import { FilterChipGroup } from '@/shared/components/FilterChip'
import { toIsoDateString } from '@/shared/lib/format'
import { CourseDateRangeCalendar, type DateRange } from './CourseDateRangeCalendar'

export interface CourseCreateFormData {
  region: string
  startDate: string
  endDate: string
  preferredMood: string
  safetyPriority: boolean
}

const QUICK_REGIONS = ['서울', '부산', '제주', '강릉']

const VIBE_OPTIONS = [
  { value: 'quiet', label: '조용한', icon: Moon },
  { value: 'vibrant', label: '활기찬', icon: Zap },
  { value: 'nature', label: '자연과 함께', icon: Trees },
  { value: 'urban', label: '도심 속', icon: Building2 },
]

interface InterestPlace {
  id: string
  label: string
  imageUrl: string
}

const INITIAL_INTEREST_PLACES: InterestPlace[] = [
  { id: 'park', label: '공원 & 자연', imageUrl: 'https://picsum.photos/seed/course-park/300/160' },
  { id: 'cafe', label: '분위기 카페', imageUrl: 'https://picsum.photos/seed/course-cafe/300/160' },
  {
    id: 'night-view',
    label: '야경 명소',
    imageUrl: 'https://picsum.photos/seed/course-night-view/620/160',
  },
]

interface CourseCreateFormProps {
  onSubmit: (data: CourseCreateFormData) => void
  submitting?: boolean
}

export function CourseCreateForm({ onSubmit, submitting = false }: CourseCreateFormProps) {
  const [region, setRegion] = useState('')
  const [dateRange, setDateRange] = useState<DateRange>({ start: null, end: null })
  const [interestPlaces, setInterestPlaces] = useState(INITIAL_INTEREST_PLACES)
  const [vibe, setVibe] = useState<string[]>(['nature'])
  const [safetyPriority, setSafetyPriority] = useState(true)

  const isValid = region.trim().length > 0 && dateRange.start !== null && dateRange.end !== null

  return (
    <form
      className="space-y-xl"
      onSubmit={(e) => {
        e.preventDefault()
        if (!isValid || dateRange.start === null || dateRange.end === null) return

        onSubmit({
          region,
          startDate: toIsoDateString(dateRange.start),
          endDate: toIsoDateString(dateRange.end),
          preferredMood: vibe[0] ?? 'nature',
          safetyPriority,
        })
      }}
    >
      <section className="space-y-md">
        <label className="font-label-md text-label-md text-on-surface-variant tracking-wider uppercase">
          01. 여행 지역
        </label>
        <div className="relative">
          <Search className="left-md text-outline absolute top-1/2 size-5 -translate-y-1/2" />
          <input
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="border-outline-variant text-body-md focus:ring-primary bg-surface-container-low py-md pr-md placeholder:text-outline/60 w-full rounded-xl border pl-11 focus:border-transparent focus:ring-2 focus:outline-none"
            placeholder="어디로 떠나시나요?"
            type="text"
          />
        </div>
        <div className="no-scrollbar gap-xs py-xs flex overflow-x-auto">
          {QUICK_REGIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setRegion(option)}
              className="border-outline-variant text-body-sm hover:border-primary px-md py-xs shrink-0 rounded-full border bg-white font-medium transition-colors"
            >
              {option}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-md">
        <label className="font-label-md text-label-md text-on-surface-variant tracking-wider uppercase">
          02. 여행 기간
        </label>
        <CourseDateRangeCalendar range={dateRange} onRangeChange={setDateRange} />
      </section>

      {/* TODO: POST /api/v1/courses/generate는 아직 관심 장소(placeIds)를 받지 않아 AI가 전체 코스를 자동 구성한다.
          장소 검색/추가 UI는 백엔드가 필드를 지원하면 연결한다. */}
      <section className="space-y-md">
        <div className="mb-xs flex items-center justify-between">
          <label className="font-label-md text-label-md text-on-surface-variant tracking-wider uppercase">
            03. 관심 장소
          </label>
          <button
            type="button"
            className="text-primary font-label-md hover:bg-primary/5 gap-xs px-sm py-base flex items-center rounded-full"
          >
            <MapPinPlus className="size-[18px]" />
            장소 검색/추가
          </button>
        </div>
        <div className="gap-sm grid grid-cols-2">
          {interestPlaces.map((place, i) => (
            <div
              key={place.id}
              className={
                i === interestPlaces.length - 1 && interestPlaces.length % 2 === 1
                  ? 'group hover:border-primary relative col-span-2 h-28 cursor-pointer overflow-hidden rounded-xl border-2 border-transparent'
                  : 'group hover:border-primary relative h-28 cursor-pointer overflow-hidden rounded-xl border-2 border-transparent'
              }
            >
              <img
                src={place.imageUrl}
                alt={place.label}
                className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="bottom-xs left-xs absolute text-white">
                <p className="font-label-md text-label-md">{place.label}</p>
              </div>
              <button
                type="button"
                onClick={() => setInterestPlaces((prev) => prev.filter((p) => p.id !== place.id))}
                aria-label="삭제"
                className="hover:bg-error top-xs right-xs absolute rounded-full bg-black/40 p-1 text-white transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-md">
        <label className="font-label-md text-label-md text-on-surface-variant tracking-wider uppercase">
          04. 선호하는 분위기
        </label>
        <FilterChipGroup
          options={VIBE_OPTIONS.map(({ value, label }) => ({ value, label }))}
          value={vibe}
          onChange={setVibe}
        />
      </section>

      <section className="border-primary-container/20 bg-primary/5 p-md rounded-2xl border">
        <div className="flex items-center justify-between">
          <div className="gap-md flex items-center">
            <div className="bg-primary-container/10 p-sm text-primary rounded-full">
              <Sparkles className="size-5" />
            </div>
            <div>
              <p className="font-body-md text-body-md text-on-primary-fixed-variant font-bold">
                안전 우선 옵션
              </p>
              <p className="font-label-md text-label-md text-on-surface-variant">
                가로등이 많은 큰 길 위주로 안내합니다.
              </p>
            </div>
          </div>
          <Switch checked={safetyPriority} onCheckedChange={setSafetyPriority} />
        </div>
      </section>

      <button
        type="submit"
        disabled={!isValid || submitting}
        className="font-headline-lg-mobile text-headline-lg-mobile gap-xs bg-primary-container py-lg text-on-primary flex w-full items-center justify-center rounded-xl font-bold shadow-lg transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? 'AI가 코스를 만들고 있어요...' : '코스 생성하기'}
        <Sparkles className="size-5" />
      </button>
    </form>
  )
}
