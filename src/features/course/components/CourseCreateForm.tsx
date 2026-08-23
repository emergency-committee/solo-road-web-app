import { Building2, MapPinPlus, Moon, Search, Sparkles, Trees, X, Zap } from 'lucide-react'
import { useState } from 'react'
import { Switch } from '@/shared/components/ui/switch'
import { FilterChipGroup } from '@/shared/components/FilterChip'
import { toIsoDateString } from '@/shared/lib/format'
import { CourseDateRangeCalendar, type DateRange } from './CourseDateRangeCalendar'
import { isSafetyRouteRegion } from '../lib/course-region'
import { calculateTripDays, formatTripLength } from '../lib/course-schedule'

export interface CourseCreateFormData {
  region: string
  startDate: string
  endDate: string
  preferredMood: string
  safetyPriority: boolean
}

const QUICK_REGIONS = ['서울', '부산', '제주']

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
  const [safetyPreferenceTouched, setSafetyPreferenceTouched] = useState(false)

  const isValid = region.trim().length > 0 && dateRange.start !== null && dateRange.end !== null
  const safetyRouteSupported = isSafetyRouteRegion(region)
  const selectedStartDate = dateRange.start ? toIsoDateString(dateRange.start) : undefined
  const selectedEndDate = dateRange.end ? toIsoDateString(dateRange.end) : undefined
  const selectedTripDays = calculateTripDays(selectedStartDate, selectedEndDate)

  function changeRegion(nextRegion: string) {
    setRegion(nextRegion)
    if (!isSafetyRouteRegion(nextRegion)) {
      setSafetyPriority(false)
    } else if (!safetyPreferenceTouched) {
      setSafetyPriority(true)
    }
  }

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
          safetyPriority: safetyRouteSupported && safetyPriority,
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
            onChange={(e) => changeRegion(e.target.value)}
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
              onClick={() => changeRegion(option)}
              className={`text-body-sm hover:border-primary px-md py-xs shrink-0 rounded-full border font-medium transition-colors ${region === option ? 'border-primary bg-primary text-white' : 'border-outline-variant bg-white'}`}
            >
              {option}
            </button>
          ))}
        </div>
        <p className="font-label-md text-label-md text-on-surface-variant">
          다른 지역은 입력창에 지역명을 직접 적어주세요.
        </p>
      </section>

      <section className="space-y-md">
        <label className="font-label-md text-label-md text-on-surface-variant tracking-wider uppercase">
          02. 여행 기간
        </label>
        <CourseDateRangeCalendar range={dateRange} onRangeChange={setDateRange} />
        {dateRange.start && dateRange.end && (
          <div className="bg-primary/5 text-primary flex items-center justify-between rounded-lg px-4 py-3">
            <span className="text-sm font-semibold">선택한 여행 기간</span>
            <strong>{formatTripLength(selectedStartDate, selectedEndDate, selectedTripDays)}</strong>
          </div>
        )}
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

      <section
        className={`p-md rounded-xl border ${safetyRouteSupported ? 'border-primary/20 bg-primary/5' : 'border-outline-variant/40 bg-surface-container-low'}`}
      >
        <div className="flex items-center justify-between">
          <div className="gap-md flex items-center">
            <div
              className={`p-sm rounded-full ${safetyRouteSupported ? 'bg-primary-container/10 text-primary' : 'bg-surface-container-high text-outline'}`}
            >
              <Sparkles className="size-5" />
            </div>
            <div>
              <p className="font-body-md text-body-md text-on-primary-fixed-variant font-bold">
                안심경로 함께 보기
              </p>
              <p className="font-label-md text-label-md text-on-surface-variant">
                {!region.trim()
                  ? '서울·부산·제주에서 이용할 수 있어요.'
                  : safetyRouteSupported
                    ? '안전시설을 반영한 도보 경로를 함께 안내해요.'
                    : `${region.trim()}은 일반 코스로 만들어요. 안심경로는 준비 중이에요.`}
              </p>
            </div>
          </div>
          <Switch
            checked={safetyRouteSupported && safetyPriority}
            disabled={!safetyRouteSupported}
            onCheckedChange={(checked) => {
              setSafetyPreferenceTouched(true)
              setSafetyPriority(checked)
            }}
          />
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
