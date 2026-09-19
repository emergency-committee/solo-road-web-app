import { Link } from '@tanstack/react-router'
import { ChevronRight, Route, Trash2 } from 'lucide-react'
import type { MyCourseItem } from '@/features/course'
import { formatDistanceMeters } from '@/shared/lib/format'

export function SavedCourseGrid({
  courses,
  deletingCourseId,
  onDelete,
}: {
  courses: MyCourseItem[]
  deletingCourseId?: number | null
  onDelete?: (course: MyCourseItem) => void
}) {
  return (
    <div className="space-y-3">
      {courses.map((course) => (
        <div
          key={course.courseId}
          className="group border-outline-variant/20 bg-surface-container flex min-h-24 items-center rounded-xl border p-md transition-colors hover:bg-surface-container-high"
        >
          <Link
            to="/course/$courseId"
            params={{ courseId: course.courseId.toString() }}
            className="flex min-w-0 flex-1 items-center"
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
          </Link>
          <div className="ml-3 flex shrink-0 items-center gap-1">
            {onDelete && (
              <button
                type="button"
                disabled={deletingCourseId === course.courseId}
                aria-label="코스 삭제"
                onClick={() => onDelete(course)}
                className="text-on-surface-variant hover:text-error grid size-9 place-items-center rounded-full transition-colors disabled:cursor-wait disabled:opacity-40"
              >
                <Trash2 className="size-4" />
              </button>
            )}
            <ChevronRight className="text-on-surface-variant group-hover:text-primary size-5 transition-colors" />
          </div>
        </div>
      ))}
    </div>
  )
}
