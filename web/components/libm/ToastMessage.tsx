import { useEffect } from 'react'

export default function ToastMessage({
  message,
  onDone,
}: {
  message: string
  onDone: () => void
}) {
  useEffect(() => {
    const timeout = window.setTimeout(onDone, 2600)
    return () => window.clearTimeout(timeout)
  }, [message, onDone])

  return (
    <div className="libm-toast-region" aria-live="polite" aria-atomic="true">
      <div className="libm-toast">{message}</div>
    </div>
  )
}
