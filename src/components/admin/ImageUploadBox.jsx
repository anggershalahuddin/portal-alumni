import { useState } from 'react'
import { ImageIcon, Link2, Upload, X } from 'lucide-react'

export default function ImageUploadBox({ label, hint, onChange, value }) {
  const [mode, setMode] = useState('upload')
  const [preview, setPreview] = useState(value || null)
  const [urlInput, setUrlInput] = useState(value || '')

  function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setPreview(url)
    onChange?.(url)
  }

  function handleUrlApply() {
    const u = urlInput.trim()
    if (!u) return
    setPreview(u)
    onChange?.(u)
  }

  function clearPreview() {
    setPreview(null)
    setUrlInput('')
    onChange?.('')
  }

  return (
    <div>
      {label && (
        <label className="block text-xs font-semibold text-gray-700 mb-1.5">{label}</label>
      )}

      {/* Mode toggle */}
      <div className="flex gap-1 mb-2">
        <button type="button" onClick={() => setMode('upload')}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-colors"
          style={mode === 'upload' ? { backgroundColor: '#1A5C38', color: '#fff', borderColor: '#1A5C38' } : { backgroundColor: '#fff', color: '#6B7280', borderColor: '#E5E7EB' }}>
          <Upload className="w-3 h-3" /> Upload
        </button>
        <button type="button" onClick={() => setMode('url')}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-colors"
          style={mode === 'url' ? { backgroundColor: '#1A5C38', color: '#fff', borderColor: '#1A5C38' } : { backgroundColor: '#fff', color: '#6B7280', borderColor: '#E5E7EB' }}>
          <Link2 className="w-3 h-3" /> URL
        </button>
      </div>

      {/* Preview */}
      {preview ? (
        <div className="relative rounded-xl overflow-hidden border border-gray-200 mb-2">
          <img src={preview} alt="preview" className="w-full h-32 object-cover" onError={() => setPreview(null)} />
          <button type="button" onClick={clearPreview} className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70">
            <X className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
      ) : mode === 'upload' ? (
        <label className="block cursor-pointer">
          <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-5 text-center hover:border-green-400 hover:bg-green-50/30 transition-all">
            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center mx-auto mb-2">
              <ImageIcon className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-xs font-semibold text-gray-500">Klik untuk upload gambar</p>
            {hint && <p className="text-[11px] text-gray-400 mt-0.5">{hint}</p>}
          </div>
        </label>
      ) : null}

      {/* URL input */}
      {mode === 'url' && !preview && (
        <div className="space-y-2">
          <input
            type="url"
            value={urlInput}
            onChange={e => setUrlInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleUrlApply()}
            placeholder="https://..."
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-400"
          />
          <button type="button" onClick={handleUrlApply} disabled={!urlInput.trim()}
            className="w-full py-2 rounded-xl text-xs font-semibold text-white disabled:opacity-40 transition-opacity"
            style={{ backgroundColor: '#1A5C38' }}>
            Terapkan URL
          </button>
        </div>
      )}
    </div>
  )
}
