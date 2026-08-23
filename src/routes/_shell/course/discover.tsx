import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Compass, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { PublicCourseCard, usePublicCourses } from '@/features/course'
import { EmptyState } from '@/shared/components/EmptyState'

export const Route = createFileRoute('/_shell/course/discover')({
  component: CourseDiscoverPage,
})

const REGIONS = [
  { label: '전체', value: 'ALL' },
  { label: '서울', value: '서울' },
  { label: '부산', value: '부산' },
  { label: '제주', value: '제주' },
  { label: '기타 지역', value: 'OTHER' },
] as const

function CourseDiscoverPage() {
  const navigate = useNavigate()
  const [sort, setSort] = useState<'HOT' | 'LATEST'>('HOT')
  const [region, setRegion] = useState<(typeof REGIONS)[number]['value']>('ALL')
  const coursesQuery = usePublicCourses({ sort, ...(region !== 'ALL' && { region }), size: 30 })
  const courses = coursesQuery.data?.content ?? []

  return (
    <main className="px-margin-mobile mx-auto min-h-screen max-w-2xl pb-10">
      <header className="py-md flex items-center gap-3">
        <button
          type="button"
          aria-label="이전 화면"
          onClick={() => void navigate({ to: '/course' })}
          className="hover:bg-surface-container grid size-10 place-items-center rounded-full"
        >
          <ArrowLeft className="text-primary size-6" />
        </button>
        <div>
          <h1 className="text-on-surface text-xl font-bold">다른 여행자의 코스</h1>
          <p className="text-on-surface-variant text-sm">혼자 다녀온 여정을 발견해 보세요.</p>
        </div>
      </header>

      <div className="bg-surface-container mb-4 grid grid-cols-2 rounded-lg p-1">
        {(
          [
            ['HOT', '지금 인기'],
            ['LATEST', '새로 올라온'],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setSort(value)}
            className={`h-10 rounded-md text-sm font-semibold transition-colors ${sort === value ? 'bg-surface text-primary shadow-sm' : 'text-on-surface-variant'}`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="no-scrollbar -mx-margin-mobile px-margin-mobile mb-5 flex gap-2 overflow-x-auto">
        {REGIONS.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setRegion(item.value)}
            className={`h-9 shrink-0 rounded-full border px-4 text-sm font-medium ${region === item.value ? 'border-primary bg-primary text-on-primary' : 'border-outline-variant bg-surface text-on-surface-variant'}`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {coursesQuery.isLoading ? (
        <div className="text-on-surface-variant py-16 text-center text-sm">
          코스를 모아보고 있어요...
        </div>
      ) : coursesQuery.isError ? (
        <EmptyState
          icon={<Compass className="size-6" />}
          title="코스를 불러오지 못했어요"
          description="잠시 후 다시 확인해 주세요."
        />
      ) : courses.length === 0 ? (
        <EmptyState
          icon={<Sparkles className="size-6" />}
          title="아직 공개된 코스가 없어요"
          description="첫 번째 혼행 코스를 공유해 보세요."
        />
      ) : (
        <div className="space-y-4">
          {courses.map((course, index) => (
            <PublicCourseCard
              key={course.courseId}
              course={course}
              {...(sort === 'HOT' && { rank: index + 1 })}
            />
          ))}
        </div>
      )}
    </main>
  )
}
