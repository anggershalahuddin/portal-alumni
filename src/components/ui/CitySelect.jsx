import { useState, useEffect, useRef } from 'react'
import { ChevronDown, Search, X } from 'lucide-react'
import { DOMISILI_GROUPS } from '@/data/domisili'

const inputCls = 'w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none transition-all bg-white'

function allCities() {
  return DOMISILI_GROUPS.flatMap((g) => g.cities)
}

export default function CitySelect({ value, onChange, required }) {
  const isOtherValue = value && !allCities().includes(value)

  const [query, setQuery]     = useState(isOtherValue ? '' : (value || ''))
  const [open, setOpen]       = useState(false)
  const [isOther, setIsOther] = useState(isOtherValue)
  const [otherVal, setOtherVal] = useState(isOtherValue ? value : '')
  const ref = useRef(null)

  useEffect(() => {
    if (!isOtherValue) setQuery(value || '')
  }, [value, isOtherValue])

  useEffect(() => {
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  const filtered = DOMISILI_GROUPS.map((g) => ({
    ...g,
    cities: query.trim()
      ? g.cities.filter((c) => c.toLowerCase().includes(query.toLowerCase()))
      : g.cities,
  })).filter((g) => g.cities.length > 0)

  function selectCity(city) {
    onChange({ target: { value: city } })
    setQuery(city)
    setOpen(false)
  }

  function enterOther() {
    setIsOther(true)
    setOpen(false)
    setQuery('')
    onChange({ target: { value: otherVal } })
  }

  function cancelOther() {
    setIsOther(false)
    setOtherVal('')
    setQuery('')
    onChange({ target: { value: '' } })
  }

  if (isOther) {
    return (
      <div className="flex gap-2">
        <input
          type="text"
          value={otherVal}
          onChange={(e) => {
            setOtherVal(e.target.value)
            onChange({ target: { value: e.target.value } })
          }}
          placeholder="Tulis nama kota / kabupaten..."
          required={required}
          autoFocus
          className={inputCls + ' flex-1'}
          style={{ borderColor: '#1A5C38' }}
        />
        <button
          type="button"
          onClick={cancelOther}
          title="Batal"
          className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-400 hover:border-red-200 transition-colors flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    )
  }

  return (
    <div ref={ref} className="relative">
      {/* Input pencarian */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          placeholder="Cari kota / kabupaten..."
          required={required && !value}
          readOnly={false}
          className={inputCls + ' pl-8 pr-8'}
          style={open ? { borderColor: '#1A5C38' } : {}}
        />
        {query ? (
          <button
            type="button"
            onClick={() => { setQuery(''); onChange({ target: { value: '' } }); setOpen(true) }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : (
          <ChevronDown className={`absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none transition-transform ${open ? 'rotate-180' : ''}`} />
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-56 overflow-y-auto">
          {filtered.length > 0 ? (
            filtered.map((group) => (
              <div key={group.label}>
                <div className="sticky top-0 px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50 border-b border-gray-100">
                  {group.label}
                </div>
                {group.cities.map((city) => (
                  <button
                    key={city}
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); selectCity(city) }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-[#1A5C38] transition-colors"
                  >
                    {city}
                  </button>
                ))}
              </div>
            ))
          ) : (
            <div className="px-4 py-3 text-sm text-gray-400">
              Tidak ditemukan — pilih <strong>Lainnya</strong> untuk isi manual.
            </div>
          )}

          {/* Opsi Lainnya */}
          <div className="sticky bottom-0 border-t border-gray-100 bg-white">
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); enterOther() }}
              className="w-full text-left px-4 py-2.5 text-sm font-semibold text-[#1A5C38] hover:bg-green-50 transition-colors flex items-center gap-2"
            >
              <span className="w-4 h-4 rounded-full border-2 border-[#1A5C38] flex items-center justify-center text-[10px] font-black leading-none">+</span>
              Lainnya (isi manual)
            </button>
          </div>
        </div>
      )}

      {/* Hidden input untuk validasi required */}
      {required && <input type="text" value={value || ''} required onChange={() => {}} className="sr-only" tabIndex={-1} />}
    </div>
  )
}
