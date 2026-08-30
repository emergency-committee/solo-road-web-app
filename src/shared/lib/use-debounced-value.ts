import { useEffect, useState } from 'react'

/** 값이 delay(ms) 동안 더 바뀌지 않을 때만 최신 값을 반영한다. 검색어 입력처럼 매 타이핑마다 요청을 보내지 않으려 할 때 쓴다. */
export function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}
