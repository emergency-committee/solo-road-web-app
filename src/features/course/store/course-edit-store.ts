import { create } from 'zustand'
import type { CourseStop } from '../types/course-ui.types'

interface CourseEditState {
  title: string
  stops: CourseStop[]
  demoStopsByCourseId: Record<string, CourseStop[]>
  initialize: (title: string, stops: CourseStop[]) => void
  updateTitle: (title: string) => void
  addStop: (stop: CourseStop) => void
  removeStop: (id: string) => void
  moveStop: (activeId: string, overId: string) => void
  updateStopMemo: (id: string, memo: string) => void
  updateStopDay: (id: string, dayNumber: number) => void
  saveDemoStops: (courseId: string) => void
}

export const useCourseEditStore = create<CourseEditState>((set) => ({
  title: '',
  stops: [],
  demoStopsByCourseId: {},
  initialize: (title, stops) => set({ title, stops }),
  updateTitle: (title) => set({ title }),
  addStop: (stop) =>
    set((state) =>
      state.stops.some((item) => item.placeId === stop.placeId)
        ? state
        : { stops: [...state.stops, stop] },
    ),
  removeStop: (id) => set((state) => ({ stops: state.stops.filter((stop) => stop.id !== id) })),
  moveStop: (activeId, overId) =>
    set((state) => {
      const fromIndex = state.stops.findIndex((stop) => stop.id === activeId)
      const toIndex = state.stops.findIndex((stop) => stop.id === overId)

      if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return state

      const reorderedStops = [...state.stops]
      const [movedStop] = reorderedStops.splice(fromIndex, 1)
      if (!movedStop) return state

      reorderedStops.splice(toIndex, 0, movedStop)
      return { stops: reorderedStops }
    }),
  updateStopMemo: (id, memo) =>
    set((state) => ({
      stops: state.stops.map((stop) => (stop.id === id ? { ...stop, memo } : stop)),
    })),
  updateStopDay: (id, dayNumber) =>
    set((state) => ({
      stops: state.stops.map((stop) => (stop.id === id ? { ...stop, dayNumber } : stop)),
    })),
  saveDemoStops: (courseId) =>
    set((state) => ({
      demoStopsByCourseId: { ...state.demoStopsByCourseId, [courseId]: state.stops },
    })),
}))
