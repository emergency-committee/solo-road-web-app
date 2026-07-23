import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface AuthUser {
  id: string
  nickname: string
  profileImageUrl?: string
}

interface SessionState {
  accessToken: string | null
  refreshToken: string | null
  user: AuthUser | null
  hasOnboarded: boolean
  setSession: (payload: {
    accessToken: string
    refreshToken?: string | null
    user: AuthUser
  }) => void
  setOnboarded: () => void
  clearSession: () => void
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      hasOnboarded: false,
      setSession: ({ accessToken, refreshToken, user }) =>
        set({ accessToken, refreshToken: refreshToken ?? null, user }),
      setOnboarded: () => set({ hasOnboarded: true }),
      clearSession: () => set({ accessToken: null, refreshToken: null, user: null }),
    }),
    {
      name: 'solo-road-session',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        hasOnboarded: state.hasOnboarded,
      }),
    },
  ),
)
