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

interface KakaoUserMeResponse {
  kakao_account?: {
    profile?: {
      nickname?: string
      profile_image_url?: string
    }
  }
}

export interface KakaoUserProfile {
  nickname: string | undefined
  profileImageUrl: string | undefined
}

/**
 * 카카오 액세스 토큰으로 닉네임/프로필 이미지를 가져온다. 백엔드는 nickname/profileImageUrl 컬럼이
 * 없어 저장하지 않으므로, 화면 표시용으로만 프론트에서 직접 조회해 세션 스토어에 보관한다.
 */
export async function fetchKakaoUserProfile(accessToken: string): Promise<KakaoUserProfile> {
  const response = await fetch('https://kapi.kakao.com/v2/user/me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  if (!response.ok) {
    return { nickname: undefined, profileImageUrl: undefined }
  }

  const data = (await response.json()) as KakaoUserMeResponse
  return {
    nickname: data.kakao_account?.profile?.nickname,
    profileImageUrl: data.kakao_account?.profile?.profile_image_url,
  }
}
