import { Link } from '@tanstack/react-router'
import { ChevronRight, Route } from 'lucide-react'
import type { MyCourseItem } from '@/features/course'
import { formatDistanceMeters } from '@/shared/lib/format'

export function SavedCourseGrid({ courses }: { courses: MyCourseItem[] }) {
  return (
    <div className="space-y-3">
      {courses.map((course) => (
        <Link
          key={course.courseId}
          to="/course/$courseId"
          params={{ courseId: course.courseId.toString() }}
          className="group border-outline-variant/20 hover:bg-surface-container-high bg-surface-container flex min-h-24 items-center rounded-xl border p-md transition-colors"
        >
          <div className="bg-primary/10 text-primary mr-3 grid size-10 shrink-0 place-items-center rounded-full">
            <Route className="size-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div>
              <h5 className="font-body-md text-body-md text-on-surface line-clamp-1 font-bold break-keep [overflow-wrap:anywhere]">
                {course.title}
              </h5>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 line-clamp-2 break-keep [overflow-wrap:anywhere]">
                {course.region ?? '지역 정보 없음'} • {formatDistanceMeters(course.totalDistanceM)}
              </p>
            </div>
          </div>
          <ChevronRight className="text-on-surface-variant group-hover:text-primary ml-3 size-5 shrink-0 transition-colors" />
        </Link>
      ))}
    </div>
  )
}
