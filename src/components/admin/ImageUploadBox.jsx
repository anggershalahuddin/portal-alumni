import { useState } from 'react'
import { ImageIcon } from 'lucide-react'

export default function ImageUploadBox({ label, hint, onChange }) {
  const [preview, setPreview] = useState(null)

  function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setPreview(url)
    onChange?.(url)
  }

  return (
    <div>
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
      )}
      <label className="block cursor-pointer">
        <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
        {preview ? (
          <div className="relative rounded-xl overflow-hidden border border-gray-200">
            <img src={preview} alt="preview" className="w-full h-32 object-cover" />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <p className="text-white text-xs font-semibold">Ganti Gambar</p>
            </div>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-5 text-center hover:border-green-400 hover:bg-green-50/30 transition-all">
            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center mx-auto mb-2">
              <ImageIcon className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-xs font-semibold text-gray-500">Klik untuk upload gambar</p>
            {hint && <p className="text-[11px] text-gray-400 mt-0.5">{hint}</p>}
          </div>
        )}
      </label>
    </div>
  )
}
