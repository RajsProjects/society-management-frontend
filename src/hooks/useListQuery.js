import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { extractPageContent, extractPageMeta } from '../utils/format'

const DEFAULT_LIST_PARAMS = { page: 0, size: 50 }

export function useListQuery({ queryKey, queryFn, params = {}, enabled = true }) {
  const mergedParams = { ...DEFAULT_LIST_PARAMS, ...params }

  const query = useQuery({
    queryKey: [...queryKey, mergedParams],
    queryFn: () => queryFn(mergedParams),
    enabled,
    staleTime: 30_000,
    refetchOnWindowFocus: true,
    placeholderData: keepPreviousData,
  })

  return {
    ...query,
    items: extractPageContent(query.data),
    meta: extractPageMeta(query.data),
  }
}
