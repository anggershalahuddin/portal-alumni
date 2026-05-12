import { AlertTriangle, Trash2, CheckCircle, ToggleLeft } from 'lucide-react'

const VARIANTS = {
  danger:  { Icon: Trash2,       iconBg: '#FFF1F2', iconColor: '#BE123C', btnBg: '#DC2626' },
  warning: { Icon: AlertTriangle, iconBg: '#FFFBEB', iconColor: '#D97706', btnBg: '#D97706' },
  success: { Icon: CheckCircle,  iconBg: '#F0FDF4', iconColor: '#15803D', btnBg: '#1A5C38' },
  toggle:  { Icon: ToggleLeft,   iconBg: '#EFF6FF', iconColor: '#1D4ED8', btnBg: '#1D4ED8' },
}

export default function ConfirmDialog({ open, title, message, confirmLabel = 'Ya, Lanjutkan', cancelLabel = 'Batal', variant = 'danger', onConfirm, onCancel }) {
  if (!open) return null
  const { Icon, iconBg, iconColor, btnBg } = VARIANTS[variant] ?? VARIANTS.danger

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="p-6 pb-4">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: iconBg }}>
              <Icon className="w-5 h-5" style={{ color: iconColor }} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-gray-900 mb-1 leading-snug">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{message}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2.5 px-6 pb-6">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: btnBg }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
