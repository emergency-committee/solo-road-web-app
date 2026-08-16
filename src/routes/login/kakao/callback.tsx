import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { kakaoLoginRequest } from '@/features/auth/api/auth-api'
import { exchangeKakaoCodeForToken, fetchKakaoUserProfile } from '@/features/auth/api/kakao-oauth'
import { useSessionStore } from '@/shared/auth/session-store'

interface KakaoCallbackSearch {
  code: string | undefined
  error: string | undefined
}

export const Route = createFileRoute('/login/kakao/callback')({
  validateSearch: (search: Record<string, unknown>): KakaoCallbackSearch => ({
    code: typeof search.code === 'string' ? search.code : undefined,
    error: typeof search.error === 'string' ? search.error : undefined,
  }),
  component: KakaoCallbackPage,
})

function KakaoCallbackPage() {
  const { code, error } = Route.useSearch()
  const navigate = useNavigate()
  const [failureMessage, setFailureMessage] = useState<string | null>(null)
  const requested = useRef(false)

  useEffect(() => {
    if (requested.current) return
    requested.current = true

    if (error) {
      setFailureMessage('카카오 로그인이 취소되었습니다.')
      return
    }
    if (!code) {
      setFailureMessage('카카오 인가 코드가 없습니다.')
      return
    }

    async function login(authorizationCode: string) {
      try {
        const kakaoAccessToken = await exchangeKakaoCodeForToken(authorizationCode)
        const [result, profile] = await Promise.all([
          kakaoLoginRequest(kakaoAccessToken),
          // 프로필 조회는 화면 표시용 부가 정보이므로 실패해도 로그인 자체는 계속 진행한다.
          fetchKakaoUserProfile(kakaoAccessToken).catch(() => ({
            nickname: undefined,
            profileImageUrl: undefined,
          })),
        ])
        useSessionStore.getState().setSession({
          user: {
            id: String(result.user.userId),
            ...(profile.nickname !== undefined && { nickname: profile.nickname }),
            ...(profile.profileImageUrl !== undefined && {
              profileImageUrl: profile.profileImageUrl,
            }),
          },
        })
        const needsOnboarding = result.isNewUser || !useSessionStore.getState().hasOnboarded
        await navigate({ to: needsOnboarding ? '/onboarding' : '/' })
      } catch {
        setFailureMessage('카카오 로그인에 실패했습니다. 다시 시도해 주세요.')
      }
    }

    void login(code)
  }, [code, error, navigate])

  if (failureMessage) {
    return (
      <main className="px-margin-mobile gap-md flex min-h-screen flex-col items-center justify-center">
        <p className="font-body-md text-body-md text-on-surface-variant text-center">
          {failureMessage}
        </p>
        <button
          type="button"
          onClick={() => navigate({ to: '/login' })}
          className="font-headline-lg-mobile text-headline-lg-mobile bg-primary text-on-primary flex h-12 items-center justify-center rounded-full px-6"
        >
          로그인 화면으로
        </button>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <p className="font-body-md text-body-md text-on-surface-variant">로그인 처리 중...</p>
    </main>
  )
}
