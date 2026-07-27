import { KAKAO_REST_API_KEY } from '@/shared/api/config'

const KAKAO_REDIRECT_PATH = '/login/kakao/callback'

export function kakaoRedirectUri(): string {
  return `${window.location.origin}${KAKAO_REDIRECT_PATH}`
}

/** 카카오 인가 코드 요청 화면으로 이동할 URL. */
export function kakaoAuthorizeUrl(): string {
  const params = new URLSearchParams({
    client_id: KAKAO_REST_API_KEY,
    redirect_uri: kakaoRedirectUri(),
    response_type: 'code',
  })
  return `https://kauth.kakao.com/oauth/authorize?${params.toString()}`
}

/**
 * 인가 코드를 카카오 액세스 토큰으로 교환한다.
 *
 * 카카오 디벨로퍼스에서 Client Secret을 활성화한 경우, 이 교환은 시크릿 노출을 막기 위해
 * 반드시 백엔드에서 수행해야 한다 (현재는 비활성 상태를 가정하고 프론트에서 직접 교환한다).
 */
export async function exchangeKakaoCodeForToken(code: string): Promise<string> {
  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: KAKAO_REST_API_KEY,
    redirect_uri: kakaoRedirectUri(),
    code,
  })

  const response = await fetch('https://kauth.kakao.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
    body: params.toString(),
  })

  if (!response.ok) {
    throw new Error(`카카오 토큰 발급 실패: ${response.status.toString()}`)
  }

  const data = (await response.json()) as { access_token: string }
  return data.access_token
}
