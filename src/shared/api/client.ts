import { ApiError } from './errors'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''
const API_KEY = import.meta.env.VITE_API_KEY

function buildHeaders(extra?: HeadersInit): Headers {
  const headers = new Headers({
    'Content-Type': 'application/json',
    'X-API-Key': API_KEY,
  })
  if (extra) {
    new Headers(extra).forEach((value, key) => headers.set(key, value))
  }
  return headers
}

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const { headers: extraHeaders, ...rest } = options
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...rest,
    headers: buildHeaders(extraHeaders as HeadersInit | undefined),
  })

  if (!response.ok) {
    const body = await response.text()
    throw new ApiError(response.status, body)
  }

  return response.json() as Promise<T>
}
