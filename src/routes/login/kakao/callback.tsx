import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import {
  kakaoLoginRequest,
  recoverKakaoAccountRequest,
  type KakaoLoginResult,
} from '@/features/auth/api/auth-api'
import { exchangeKakaoCodeForToken, fetchKakaoUserProfile } from '@/features/auth/api/kakao-oauth'
import { useSessionStore } from '@/shared/auth/session-store'

interface KakaoCallbackSearch {
  code: string | undefined
  error: string | undefined
}

interface RecoveryPrompt {
  kakaoAccessToken: string
  recoveryDeadline: string
  profile: {
    nickname: string | undefined
    profileImageUrl: string | undefined
  }
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
  const [recoveryPrompt, setRecoveryPrompt] = useState<RecoveryPrompt | null>(null)
  const [isRecovering, setIsRecovering] = useState(false)
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
        if (result.recoveryRequired && result.recoveryDeadline) {
          setRecoveryPrompt({
            kakaoAccessToken,
            recoveryDeadline: result.recoveryDeadline,
            profile,
          })
          return
        }
        if (!result.user) {
          throw new Error('로그인 사용자 정보가 없습니다.')
        }
        useSessionStore.getState().setSession({
          user: {
            id: String(result.user.userId),
            ...(profile.nickname !== undefined && { nickname: profile.nickname }),
            ...(profile.profileImageUrl !== undefined && {
              profileImageUrl: profile.profileImageUrl,
            }),
          },
        })
        // isNewUser는 서버가 판단하는 온보딩 완료 여부의 근거다. 로컬 hasOnboarded는
        // 브라우저 캐시/스토리지가 지워지면 사라지므로, 여기서 OR로 묶으면 이미 온보딩을
        // 마친 기존 유저도 캐시가 지워졌다는 이유만으로 다시 온보딩하게 된다.
        if (!result.isNewUser) {
          useSessionStore.getState().setOnboarded()
        }
        await navigate({ to: result.isNewUser ? '/onboarding' : '/' })
      } catch {
        setFailureMessage('카카오 로그인에 실패했습니다. 다시 시도해 주세요.')
      }
    }

    void login(code)
  }, [code, error, navigate])

  async function recoverAccount() {
    if (!recoveryPrompt || isRecovering) return
    try {
      setIsRecovering(true)
      setFailureMessage(null)
      const result = await recoverKakaoAccountRequest(recoveryPrompt.kakaoAccessToken)
      completeRecoveredLogin(result, recoveryPrompt.profile)
      await navigate({ to: '/', replace: true })
    } catch {
      setFailureMessage('계정을 복구하지 못했어요. 잠시 후 다시 시도해 주세요.')
    } finally {
      setIsRecovering(false)
    }
  }

  if (recoveryPrompt) {
    const deadline = new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(recoveryPrompt.recoveryDeadline))

    return (
      <main className="px-margin-mobile flex min-h-screen items-center justify-center">
        <section className="w-full max-w-sm text-center">
          <p className="text-primary mb-2 text-sm font-semibold">탈퇴 대기 중인 계정</p>
          <h1 className="text-on-surface text-2xl font-bold">계정을 복구할까요?</h1>
          <p className="text-on-surface-variant mt-3 text-sm leading-6">
            {deadline}까지 복구할 수 있어요. 복구하면 저장한 장소와 코스 등 이전 기록을 다시 이용할
            수 있어요.
          </p>

          {failureMessage ? (
            <p
              className="bg-error-container/20 text-error mt-4 rounded-lg px-3 py-2 text-sm"
              role="alert"
            >
              {failureMessage}
            </p>
          ) : null}

          <div className="mt-8 space-y-3">
            <button
              type="button"
              disabled={isRecovering}
              onClick={() => void recoverAccount()}
              className="bg-primary text-on-primary h-12 w-full rounded-full font-semibold disabled:opacity-50"
            >
              {isRecovering ? '복구 중' : '계정 복구'}
            </button>
            <button
              type="button"
              disabled={isRecovering}
              onClick={() => navigate({ to: '/login', replace: true })}
              className="text-on-surface-variant hover:bg-surface-container h-12 w-full rounded-full font-medium disabled:opacity-50"
            >
              탈퇴 유지
            </button>
          </div>
        </section>
      </main>
    )
  }

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

function completeRecoveredLogin(result: KakaoLoginResult, profile: RecoveryPrompt['profile']) {
  if (!result.user) {
    throw new Error('복구된 사용자 정보가 없습니다.')
  }
  useSessionStore.getState().setSession({
    user: {
      id: String(result.user.userId),
      ...(profile.nickname !== undefined && { nickname: profile.nickname }),
      ...(profile.profileImageUrl !== undefined && { profileImageUrl: profile.profileImageUrl }),
    },
  })
  useSessionStore.getState().setOnboarded()
}
