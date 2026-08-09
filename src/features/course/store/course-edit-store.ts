import { create } from 'zustand'
import type { CourseStop } from '../types/course-ui.types'

interface CourseEditState {
  title: string
  stops: CourseStop[]
  initialize: (title: string, stops: CourseStop[]) => void
  removeStop: (id: string) => void
}

export const useCourseEditStore = create<CourseEditState>((set) => ({
  title: '',
  stops: [],
  initialize: (title, stops) => set({ title, stops }),
  removeStop: (id) => set((state) => ({ stops: state.stops.filter((stop) => stop.id !== id) })),
}))
