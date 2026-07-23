import { useState } from 'react'

export function useSavedFilter(initial: string[] = ['all']) {
  const [value, setValue] = useState<string[]>(initial)
  return { value, setValue }
}
