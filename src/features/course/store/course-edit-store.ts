import { create } from 'zustand'
import type { CourseStop } from '../types/course-ui.types'

interface CourseEditState {
  stops: CourseStop[]
  initialize: (stops: CourseStop[]) => void
  removeStop: (id: string) => void
}

export const useCourseEditStore = create<CourseEditState>((set) => ({
  stops: [],
  initialize: (stops) => set({ stops }),
  removeStop: (id) => set((state) => ({ stops: state.stops.filter((stop) => stop.id !== id) })),
}))
