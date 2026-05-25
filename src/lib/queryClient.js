import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime:  5 * 60 * 1000,  // data dianggap fresh selama 5 menit
      gcTime:     10 * 60 * 1000, // cache disimpan 10 menit setelah tidak dipakai
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})
