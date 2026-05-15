export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): T & { cancel?: () => void } {
  let timeout: NodeJS.Timeout | null = null
  
  const debouncedFn = (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => {
      func(...args)
      timeout = null
    }, wait)
  }
  
  debouncedFn.cancel = () => {
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }
  }
  
  return debouncedFn as T & { cancel?: () => void }
}