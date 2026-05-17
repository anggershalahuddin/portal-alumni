import { useEffect, useState } from 'react'
import { Clock, LogOut } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

const COUNTDOWN_SEC = 60

export default function IdleWarningModal() {
  const { idleWarning, extendSession, signOut } = useAuth()
  const [seconds, setSeconds] = useState(COUNTDOWN_SEC)

  useEffect(() => {
    if (!idleWarning) { setSeconds(COUNTDOWN_SEC); return }
    const interval = setInterval(() => {
      setSeconds(s => {
        if (s <= 1) { clearInterval(interval); return 0 }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [idleWarning])

  if (!idleWarning) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: '#FEF3C7' }}>
          <Clock className="w-8 h-8" style={{ color: '#D97706' }} />
        </div>

        <h2 className="text-lg font-extrabold text-gray-900 mb-1">Sesi Hampir Berakhir</h2>
        <p className="text-sm text-gray-500 leading-relaxed mb-4">
          Anda tidak aktif selama beberapa saat. Sesi akan otomatis berakhir dalam:
        </p>

        <div className="text-4xl font-extrabold mb-5" style={{ color: seconds <= 10 ? '#DC2626' : '#1A5C38' }}>
          {String(seconds).padStart(2, '0')} <span className="text-lg font-semibold text-gray-400">detik</span>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => signOut()}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Keluar
          </button>
          <button
            onClick={extendSession}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#1A5C38' }}
          >
            Tetap Masuk
          </button>
        </div>
      </div>
    </div>
  )
}
