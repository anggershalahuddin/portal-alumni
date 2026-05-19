import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import { ImageIcon, Link2, Upload, X, Loader2, ZoomIn, ZoomOut } from 'lucide-react'
import { supabase } from '@/lib/supabase'

async function compressImage(file, maxDim = 1200, quality = 0.85) {
  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      const ratio = Math.min(maxDim / img.width, maxDim / img.height, 1)
      const w = Math.round(img.width * ratio)
      const h = Math.round(img.height * ratio)
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      canvas.getContext('2d').drawImage(img, 0, 0, w, h)
      canvas.toBlob(resolve, 'image/jpeg', quality)
    }
    img.src = url
  })
}

async function getCroppedBlob(imageSrc, croppedAreaPixels, quality = 0.85) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.setAttribute('crossOrigin', 'anonymous')
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = croppedAreaPixels.width
      canvas.height = croppedAreaPixels.height
      canvas.getContext('2d').drawImage(
        img,
        croppedAreaPixels.x, croppedAreaPixels.y,
        croppedAreaPixels.width, croppedAreaPixels.height,
        0, 0, croppedAreaPixels.width, croppedAreaPixels.height,
      )
      canvas.toBlob(resolve, 'image/jpeg', quality)
    }
    img.onerror = reject
    img.src = imageSrc
  })
}

function CropModal({ src, aspect, cropShape, onDone, onCancel }) {
  const [crop, setCrop]       = useState({ x: 0, y: 0 })
  const [zoom, setZoom]       = useState(1)
  const [croppedArea, setCroppedArea] = useState(null)

  const onCropComplete = useCallback((_, pixels) => setCroppedArea(pixels), [])

  async function handleApply() {
    if (!croppedArea) return
    const blob = await getCroppedBlob(src, croppedArea)
    onDone(blob)
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <p className="text-sm font-bold text-gray-900">Sesuaikan Foto</p>
          <button onClick={onCancel} className="p-1 rounded-lg hover:bg-gray-100"><X className="w-4 h-4 text-gray-500" /></button>
        </div>

        <div className="relative w-full" style={{ height: 280, background: '#111' }}>
          <Cropper
            image={src}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            cropShape={cropShape}
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="px-5 py-3 flex items-center gap-3">
          <ZoomOut className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            type="range" min={1} max={3} step={0.05}
            value={zoom} onChange={e => setZoom(Number(e.target.value))}
            className="flex-1 accent-green-700"
          />
          <ZoomIn className="w-4 h-4 text-gray-400 flex-shrink-0" />
        </div>

        <div className="px-5 pb-4 flex justify-end gap-2">
          <button onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50">
            Batal
          </button>
          <button
            onClick={handleApply}
            className="px-5 py-2 text-sm font-bold text-white rounded-xl"
            style={{ backgroundColor: '#1A5C38' }}
          >
            Terapkan
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ImageUploadBox({
  label, hint, onChange, value,
  bucket, pathPrefix,
  enableCrop = false,
  aspect = 1,
  cropShape = 'rect',
  maxDim = 1200,
  quality = 0.85,
}) {
  const [mode, setMode]           = useState('upload')
  const [preview, setPreview]     = useState(value || null)
  const [urlInput, setUrlInput]   = useState(value || '')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState(null)
  const [cropSrc, setCropSrc]     = useState(null)

  async function uploadBlob(blob) {
    setUploading(true)
    setUploadError(null)

    if (!bucket) {
      const url = URL.createObjectURL(blob)
      setPreview(url)
      onChange?.(url)
      setUploading(false)
      return
    }

    const path = pathPrefix
      ? `${pathPrefix}/${Date.now()}.jpg`
      : `${Date.now()}.jpg`

    const { error } = await supabase.storage.from(bucket).upload(path, blob, { upsert: true, contentType: 'image/jpeg' })
    if (error) {
      setUploadError('Gagal upload: ' + error.message)
      setUploading(false)
      return
    }

    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path)
    setPreview(urlData.publicUrl)
    onChange?.(urlData.publicUrl)
    setUploading(false)
  }

  async function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadError(null)

    if (enableCrop) {
      const url = URL.createObjectURL(file)
      setCropSrc(url)
      return
    }

    const blob = await compressImage(file, maxDim, quality)
    await uploadBlob(blob)
  }

  async function handleCropDone(blob) {
    setCropSrc(null)
    await uploadBlob(blob)
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
    setUploadError(null)
    onChange?.('')
  }

  return (
    <>
      <div>
        {label && (
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">{label}</label>
        )}

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

        {preview ? (
          <div className="relative rounded-xl overflow-hidden border border-gray-200 mb-2">
            <img src={preview} alt="preview" className="w-full h-32 object-cover" onError={() => setPreview(null)} />
            <button type="button" onClick={clearPreview} className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70">
              <X className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        ) : mode === 'upload' ? (
          <label className={`block ${uploading ? 'cursor-wait' : 'cursor-pointer'}`}>
            <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
            <div className={`border-2 border-dashed rounded-xl p-5 text-center transition-all ${uploading ? 'border-green-300 bg-green-50/50' : 'border-gray-200 hover:border-green-400 hover:bg-green-50/30'}`}>
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center mx-auto mb-2">
                {uploading
                  ? <Loader2 className="w-4 h-4 text-green-600 animate-spin" />
                  : <ImageIcon className="w-4 h-4 text-gray-400" />
                }
              </div>
              <p className="text-xs font-semibold text-gray-500">
                {uploading ? 'Mengupload...' : 'Klik untuk upload gambar'}
              </p>
              {hint && !uploading && <p className="text-[11px] text-gray-400 mt-0.5">{hint}</p>}
            </div>
          </label>
        ) : null}

        {uploadError && (
          <p className="text-[11px] text-red-500 mt-1">{uploadError}</p>
        )}

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

      {cropSrc && (
        <CropModal
          src={cropSrc}
          aspect={aspect}
          cropShape={cropShape}
          onDone={handleCropDone}
          onCancel={() => { URL.revokeObjectURL(cropSrc); setCropSrc(null) }}
        />
      )}
    </>
  )
}
