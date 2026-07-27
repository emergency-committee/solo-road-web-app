import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

/**
 * 인증 토큰은 백엔드가 HttpOnly 쿠키로만 내려주므로(JS에서 읽거나 저장할 수 없음),
 * 여기서는 로그인 여부 판단용으로 사용자 정보만 들고 있는다.
 */
export interface AuthUser {
  id: string
  nickname?: string
  profileImageUrl?: string
}

interface SessionState {
  user: AuthUser | null
  hasOnboarded: boolean
  setSession: (payload: { user: AuthUser }) => void
  setOnboarded: () => void
  clearSession: () => void
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      user: null,
      hasOnboarded: false,
      setSession: ({ user }) => set({ user }),
      setOnboarded: () => set({ hasOnboarded: true }),
      clearSession: () => set({ user: null }),
    }),
    {
      name: 'solo-road-session',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        hasOnboarded: state.hasOnboarded,
      }),
    },
  ),
)
