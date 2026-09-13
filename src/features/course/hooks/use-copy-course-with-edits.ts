import { useMutation, useQueryClient } from '@tanstack/react-query'
import { copyCourse, updateCourse } from '../api/course-api'
import type { UpdateCourseRequest } from '../types/course.types'

/**
 * 남의 코스를 미리보기 화면에서 편집만 하다가 뒤로가기 해도 아무것도 저장되지 않도록,
 * 실제 복사(POST) + 편집 내용 반영(PUT)을 "저장" 버튼 클릭 시 한 번에 실행한다.
 */
export function useCopyCourseWithEdits(sourceCourseId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (req: UpdateCourseRequest) => {
      const copied = await copyCourse(sourceCourseId)
      await updateCourse(copied.courseId, req)
      return copied
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['courses', 'my'] })
      void queryClient.invalidateQueries({ queryKey: ['courses', 'public'] })
    },
  })
}
