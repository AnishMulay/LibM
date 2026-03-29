import PrimaryButton from '@/components/libm/PrimaryButton'

export default function ConfirmDialog({
  title,
  message,
  confirmLabel,
  cancelLabel = 'Cancel',
  error,
  loading = false,
  onConfirm,
  onCancel,
}: {
  title: string
  message: string
  confirmLabel: string
  cancelLabel?: string
  error?: string | null
  loading?: boolean
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <div className="libm-modal-backdrop" role="presentation">
      <div
        className="libm-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="libm-confirm-dialog-title"
        aria-describedby="libm-confirm-dialog-message"
      >
        <h2 id="libm-confirm-dialog-title" className="libm-heading">
          {title}
        </h2>
        <p id="libm-confirm-dialog-message" className="libm-body-text">
          {message}
        </p>
        {error ? <p className="libm-error-text libm-modal-error">{error}</p> : null}
        <div className="libm-modal-actions">
          <PrimaryButton type="button" tone="ghost" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </PrimaryButton>
          <PrimaryButton
            type="button"
            tone="burgundy"
            loading={loading}
            loadingText="Removing..."
            onClick={onConfirm}
          >
            {confirmLabel}
          </PrimaryButton>
        </div>
      </div>
    </div>
  )
}
