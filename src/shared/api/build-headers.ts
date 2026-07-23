import { useSessionStore } from '@/shared/auth/session-store'
import { API_KEY } from './config'

export function buildHeaders(extra?: HeadersInit): Headers {
  const headers = new Headers({
    'Content-Type': 'application/json',
    'X-API-Key': API_KEY,
  })

  const token = useSessionStore.getState().accessToken
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  if (extra) {
    new Headers(extra).forEach((value, key) => headers.set(key, value))
  }

  return headers
}
