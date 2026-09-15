import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'solo-road:recent-searches'
const MAX_RECENT_SEARCHES = 8

function readStoredSearches(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : []
  } catch {
    return []
  }
}

function writeStoredSearches(terms: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(terms))
  } catch {
    // 저장 실패(프라이빗 모드 등)는 무시한다 — 최근 검색어는 있으면 좋은 보조 기능일 뿐이다.
  }
}

/** 검색어를 브라우저 localStorage에 최근 검색어로 저장/조회한다(기기별, 서버 미연동). */
export function useRecentSearches() {
  const [recentSearches, setRecentSearches] = useState<string[]>(() => readStoredSearches())

  useEffect(() => {
    writeStoredSearches(recentSearches)
  }, [recentSearches])

  const addRecentSearch = useCallback((term: string) => {
    const trimmed = term.trim()
    if (!trimmed) return
    setRecentSearches((prev) =>
      [trimmed, ...prev.filter((existing) => existing !== trimmed)].slice(0, MAX_RECENT_SEARCHES),
    )
  }, [])

  const removeRecentSearch = useCallback((term: string) => {
    setRecentSearches((prev) => prev.filter((existing) => existing !== term))
  }, [])

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([])
  }, [])

  return { recentSearches, addRecentSearch, removeRecentSearch, clearRecentSearches }
}
