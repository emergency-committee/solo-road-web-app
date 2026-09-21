export interface OnboardingSubmitPayload {
  nickname: string
  gender: '남성' | '여성' | null
  foodPreferences: string[]
  interests: string[]
  mood: string[]
  soloPriority: boolean
  food: string[]
}
