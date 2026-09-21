import { create } from 'zustand'

interface OnboardingState {
  step: 1 | 2 | 3
  nickname: string
  gender: '남성' | '여성' | null
  foodPreferences: string[]
  interests: string[]
  goToStep: (step: 1 | 2 | 3) => void
  setNickname: (nickname: string) => void
  setGender: (gender: '남성' | '여성') => void
  toggleFoodPreference: (food: string) => void
  toggleInterest: (interest: string) => void
}

const MAX_INTERESTS = 3
const MAX_FOOD_PREFERENCES = 3

export const useOnboardingStore = create<OnboardingState>((set) => ({
  step: 1,
  nickname: '',
  gender: null,
  foodPreferences: [],
  interests: [],
  goToStep: (step) => set({ step }),
  setNickname: (nickname) => set({ nickname }),
  setGender: (gender) => set({ gender }),
  toggleFoodPreference: (food) =>
    set((state) => {
      if (state.foodPreferences.includes(food)) {
        return { foodPreferences: state.foodPreferences.filter((value) => value !== food) }
      }
      if (state.foodPreferences.length >= MAX_FOOD_PREFERENCES) return state
      return { foodPreferences: [...state.foodPreferences, food] }
    }),
  toggleInterest: (interest) =>
    set((state) => {
      if (state.interests.includes(interest)) {
        return { interests: state.interests.filter((i) => i !== interest) }
      }
      if (state.interests.length >= MAX_INTERESTS) return state
      return { interests: [...state.interests, interest] }
    }),
}))
