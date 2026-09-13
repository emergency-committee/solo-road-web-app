// @vitest-environment jsdom
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useCopyCourseWithEdits } from './use-copy-course-with-edits'

const { copyCourseMock, updateCourseMock } = vi.hoisted(() => ({
  copyCourseMock: vi.fn(),
  updateCourseMock: vi.fn(),
}))

vi.mock('../api/course-api', () => ({
  copyCourse: copyCourseMock,
  updateCourse: updateCourseMock,
}))

function createWrapper() {
  const queryClient = new QueryClient()
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useCopyCourseWithEdits', () => {
  beforeEach(() => {
    copyCourseMock.mockReset()
    updateCourseMock.mockReset()
  })

  it('저장 버튼을 누르기 전(mutate 호출 전)에는 복사도 수정도 요청하지 않는다', () => {
    renderHook(() => useCopyCourseWithEdits(1), { wrapper: createWrapper() })

    expect(copyCourseMock).not.toHaveBeenCalled()
    expect(updateCourseMock).not.toHaveBeenCalled()
  })

  it('mutate 호출 시 원본을 복사한 뒤 그 결과 id로 편집 내용을 저장한다', async () => {
    copyCourseMock.mockResolvedValue({ courseId: 999, copiedFromCourseId: 1, title: '원본 나의 일정' })
    updateCourseMock.mockResolvedValue({ courseId: 999, totalDurationMinutes: 0, totalDistanceM: 0, stops: [] })

    const { result } = renderHook(() => useCopyCourseWithEdits(1), { wrapper: createWrapper() })
    const payload = { title: '수정된 제목', stops: [] }

    result.current.mutate(payload)

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(copyCourseMock).toHaveBeenCalledWith(1)
    expect(updateCourseMock).toHaveBeenCalledWith(999, payload)
    expect(result.current.data).toEqual({ courseId: 999, copiedFromCourseId: 1, title: '원본 나의 일정' })
  })
})
