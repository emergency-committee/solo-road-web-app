import { Link } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
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
          className="group border-outline-variant/20 hover:bg-surface-container-high bg-surface-container flex overflow-hidden rounded-xl border transition-colors"
        >
          <div className="h-full w-24 shrink-0">
            <img
              src={`https://picsum.photos/seed/course-${course.courseId.toString()}/240/240`}
              alt={course.title}
              className="size-full object-cover"
            />
          </div>
          <div className="p-md flex flex-1 flex-col justify-between">
            <div>
              <h5 className="font-body-md text-body-md text-on-surface font-bold">
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
