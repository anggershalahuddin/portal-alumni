import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { siteConfig as defaultConfig } from '@/data/siteConfig'

const SiteConfigContext = createContext({ config: defaultConfig, setConfig: () => {}, refresh: () => {} })

export function SiteConfigProvider({ children }) {
  const [config, setConfig] = useState(defaultConfig)

  const refresh = useCallback(async () => {
    const { data } = await supabase
      .from('pengaturan')
      .select('value')
      .eq('key', 'site_config')
      .maybeSingle()
    if (data?.value) {
      try { setConfig(JSON.parse(data.value)) } catch {}
    }
  }, [])

  useEffect(() => { refresh() }, [refresh])

  return (
    <SiteConfigContext.Provider value={{ config, setConfig, refresh }}>
      {children}
    </SiteConfigContext.Provider>
  )
}

export function useSiteConfig() {
  return useContext(SiteConfigContext)
}
