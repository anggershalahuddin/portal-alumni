import { useState, useEffect, useCallback } from 'react'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'

const ICONS = {
  success: CheckCircle,
  error:   AlertCircle,
  warning: AlertTriangle,
  info:    Info,
}

const STYLES = {
  success: { bg: '#F0FDF4', border: '#86EFAC', icon: '#16A34A', text: '#15803D' },
  error:   { bg: '#FEF2F2', border: '#FCA5A5', icon: '#DC2626', text: '#B91C1C' },
  warning: { bg: '#FFFBEB', border: '#FCD34D', icon: '#D97706', text: '#B45309' },
  info:    { bg: '#EFF6FF', border: '#93C5FD', icon: '#2563EB', text: '#1D4ED8' },
}

let _id = 0

export default function Toast() {
  const [toasts, setToasts] = useState([])

  const remove = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  useEffect(() => {
    function handler(e) {
      const { message, type = 'error' } = e.detail
      const id = ++_id
      setToasts(prev => [...prev, { id, message, type }])
      setTimeout(() => remove(id), 4500)
    }
    window.addEventListener('app:toast', handler)
    return () => window.removeEventListener('app:toast', handler)
  }, [remove])

  if (!toasts.length) return null

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map(({ id, message, type }) => {
        const s = STYLES[type] ?? STYLES.error
        const Icon = ICONS[type] ?? AlertCircle
        return (
          <div
            key={id}
            className="flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg border pointer-events-auto animate-in slide-in-from-right-5 fade-in duration-200"
            style={{ backgroundColor: s.bg, borderColor: s.border }}
          >
            <Icon className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: s.icon }} />
            <p className="text-sm flex-1 leading-snug" style={{ color: s.text }}>{message}</p>
            <button
              onClick={() => remove(id)}
              className="flex-shrink-0 p-0.5 rounded hover:opacity-70 transition-opacity"
              style={{ color: s.icon }}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
