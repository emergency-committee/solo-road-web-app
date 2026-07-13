import { useNavigate } from '@tanstack/react-router'
import { CourseCard } from '@/shared/components/CourseCard'
import type { SavedCourseMock } from '../mocks/saved-courses-mocks'

export function SavedCourseGrid({ courses }: { courses: SavedCourseMock[] }) {
  const navigate = useNavigate()

  function goToDetail() {
    navigate({ to: '/course/$courseId', params: { courseId: 'seongsu-art-walk' } })
  }

  return (
    <div className="gap-lg grid grid-cols-1">
      {courses.map((course) => {
        if (course.variant === 'image-badge') {
          return (
            <CourseCard
              key={course.id}
              variant="image-badge"
              title={course.title}
              imageUrl={course.imageUrl}
              imageAlt={course.imageAlt}
              badges={course.badges}
              duration={course.duration}
              distance={course.distance}
              onClick={goToDetail}
            />
          )
        }
        if (course.variant === 'map-preview') {
          return (
            <CourseCard
              key={course.id}
              variant="map-preview"
              title={course.title}
              imageUrl={course.imageUrl}
              imageAlt={course.imageAlt}
              badges={course.badges}
              description={course.description}
              duration={course.duration}
              placeCount={course.placeCount}
              onClick={goToDetail}
            />
          )
        }
        return (
          <CourseCard
            key={course.id}
            variant="stats-grid"
            title={course.title}
            imageUrl={course.imageUrl}
            imageAlt={course.imageAlt}
            rating={course.rating}
            reviewCount={course.reviewCount}
            stats={course.stats}
            onClick={goToDetail}
          />
        )
      })}
    </div>
  )
}
