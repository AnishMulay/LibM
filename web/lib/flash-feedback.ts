'use client'

export type ShelfFeedback = {
  shelf: 'library' | 'wishlist'
  toast: string
  highlightBookId?: string
}

const FLASH_KEY = 'libm:shelf-feedback'

export function setShelfFeedback(feedback: ShelfFeedback) {
  if (typeof window === 'undefined') {
    return
  }

  window.sessionStorage.setItem(FLASH_KEY, JSON.stringify(feedback))
}

export function consumeShelfFeedback() {
  if (typeof window === 'undefined') {
    return null
  }

  const raw = window.sessionStorage.getItem(FLASH_KEY)
  if (!raw) {
    return null
  }

  window.sessionStorage.removeItem(FLASH_KEY)

  try {
    return JSON.parse(raw) as ShelfFeedback
  } catch {
    return null
  }
}
