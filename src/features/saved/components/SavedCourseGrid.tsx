import { Link } from '@tanstack/react-router'
import { ChevronRight, Route } from 'lucide-react'
import type { MyCourseItem } from '@/features/course'
import { formatDistanceMeters } from '@/shared/lib/format'

export function SavedCourseGrid({ courses }: { courses: MyCourseItem[] }) {
  return (
    <div className="gap-md grid grid-cols-1 md:grid-cols-2">
      {courses.map((course) => (
        <Link
          key={course.courseId}
          to="/course/$courseId"
          params={{ courseId: course.courseId.toString() }}
          className="group border-outline-variant/20 hover:bg-surface-container-high bg-surface-container flex rounded-xl border p-md transition-colors"
        >
          <div className="bg-primary/10 text-primary mr-3 grid size-10 shrink-0 place-items-center rounded-full">
            <Route className="size-5" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col justify-between">
            <div>
              <h5 className="font-body-md text-body-md text-on-surface truncate font-bold">
                {course.title}
              </h5>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                {course.region ?? '지역 정보 없음'} • {formatDistanceMeters(course.totalDistanceM)}
              </p>
            </div>
            <div className="flex justify-end">
              <ChevronRight className="text-on-surface-variant group-hover:text-primary size-5 transition-colors" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
