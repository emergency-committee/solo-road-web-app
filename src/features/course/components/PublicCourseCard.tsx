import { Link } from '@tanstack/react-router'
import { Clock3, Copy, Heart, MapPin, MessageCircle } from 'lucide-react'
import type { PublicCourseItem } from '../types/course.types'
import { paceLabel, soloImpressionLabel } from '../lib/course-community-labels'
import { formatDurationMinutes } from '@/shared/lib/format'
import { formatTripLength } from '../lib/course-schedule'

export function PublicCourseCard({
  course,
  rank,
  variant = 'default',
}: {
  course: PublicCourseItem
  rank?: number
  variant?: 'default' | 'compact'
}) {
  const highlights = course.tags.filter((tag) => tag.category === 'HIGHLIGHT').slice(0, 2)

  if (variant === 'compact') {
    return (
      <Link
        to="/course/$courseId"
        params={{ courseId: course.courseId.toString() }}
        className="border-outline-variant/30 bg-surface flex min-h-25 overflow-hidden rounded-lg border shadow-sm transition-transform active:scale-[0.99]"
      >
        <div className="bg-surface-container-high relative w-26 shrink-0 overflow-hidden">
          <img
            src={
              course.thumbnailUrl ??
              `https://picsum.photos/seed/public-course-${course.courseId.toString()}/240/240`
            }
            alt={course.title}
            className="size-full object-cover"
          />
          {rank !== undefined && (
            <span className="bg-primary text-on-primary absolute top-2 left-2 grid size-6 place-items-center rounded-full text-xs font-bold shadow-sm">
              {rank}
            </span>
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-between p-3">
          <div>
            <h4 className="text-on-surface line-clamp-2 text-sm leading-snug font-bold break-keep">
              {course.title}
            </h4>
            <p className="text-on-surface-variant mt-1 truncate text-xs">
              {course.region ?? '지역 미정'}
              {course.tripDays !== undefined &&
                ` · ${formatTripLength(course.startDate, course.endDate, course.tripDays)}`}
            </p>
          </div>
          <div className="text-on-surface-variant flex items-center justify-between gap-2 text-[11px]">
            <span className="min-w-0 truncate">{course.authorName}</span>
            <span className="flex shrink-0 items-center gap-2">
              <span className="flex items-center gap-1">
                <Heart className="size-3" /> {course.likeCount}
              </span>
              <span className="flex items-center gap-1">
                <Copy className="size-3" /> {course.copyCount}
              </span>
            </span>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link
      to="/course/$courseId"
      params={{ courseId: course.courseId.toString() }}
      className="border-outline-variant/30 bg-surface block overflow-hidden rounded-lg border shadow-sm transition-transform active:scale-[0.99]"
    >
      <div className="bg-surface-container-high relative aspect-[16/8] overflow-hidden">
        <img
          src={
            course.thumbnailUrl ??
            `https://picsum.photos/seed/public-course-${course.courseId.toString()}/720/360`
          }
          alt={course.title}
          className="size-full object-cover"
        />
        {rank !== undefined && (
          <span className="bg-primary text-on-primary absolute top-3 left-3 grid size-8 place-items-center rounded-full text-sm font-bold shadow-md">
            {rank}
          </span>
        )}
        <span className="bg-surface/90 text-primary absolute right-3 bottom-3 rounded-full px-3 py-1 text-xs font-semibold backdrop-blur-sm">
          {soloImpressionLabel(course.soloImpression) ?? '혼행 코스'}
        </span>
      </div>
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h4 className="text-on-surface line-clamp-2 text-lg leading-snug font-bold break-keep">
              {course.title}
            </h4>
            <p className="text-on-surface-variant mt-1 flex items-center gap-1 text-sm">
              <MapPin className="size-3.5" />
              {course.region ?? '지역 미정'}
              {course.tripDays !== undefined && (
                <>
                  <span aria-hidden>·</span>
                  {formatTripLength(course.startDate, course.endDate, course.tripDays)}
                </>
              )}
              {course.totalDurationMinutes !== undefined && (
                <>
                  <span aria-hidden>·</span>
                  <Clock3 className="size-3.5" />
                  {formatDurationMinutes(course.totalDurationMinutes)}
                </>
              )}
            </p>
          </div>
          <div className="bg-primary/10 text-primary shrink-0 rounded-md px-2 py-1 text-xs font-bold">
            Lv.{course.authorLevel}
          </div>
        </div>

        {course.description && (
          <p className="text-on-surface-variant line-clamp-2 text-sm leading-relaxed break-keep">
            {course.description}
          </p>
        )}

        <div className="flex flex-wrap gap-1.5">
          {paceLabel(course.paceType) && (
            <span className="bg-secondary-container/60 text-on-secondary-container rounded-md px-2 py-1 text-xs">
              {paceLabel(course.paceType)}
            </span>
          )}
          {highlights.map((tag) => (
            <span
              key={tag.tagId}
              className="bg-surface-container text-on-surface-variant rounded-md px-2 py-1 text-xs"
            >
              {tag.name}
            </span>
          ))}
        </div>

        <div className="border-outline-variant/30 text-on-surface-variant flex items-center justify-between border-t pt-3 text-xs">
          <span className="min-w-0 truncate font-medium">
            {course.authorTitle
              ? `${course.authorName} · ${course.authorTitle}`
              : course.authorName}
          </span>
          <span className="ml-3 flex shrink-0 items-center gap-3">
            <span className="flex items-center gap-1">
              <Heart className="size-3.5" />
              {course.likeCount}
            </span>
            <span className="flex items-center gap-1">
              <Copy className="size-3.5" />
              {course.copyCount}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="size-3.5" />
              {course.reviewCount}
            </span>
          </span>
        </div>
      </div>
    </Link>
  )
}
