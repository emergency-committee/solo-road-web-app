export interface OnboardingSubmitPayload {
  gender: '남성' | '여성' | null
  foodPreference: string | null
  interests: string[]
  mood: string[]
  soloPriority: boolean
  food: string[]
}
