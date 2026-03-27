'use client'
import useSWR from 'swr'
import { fetchProtocols, fetchChains, fetchYieldPools, fetchDEXOverview, fetchFeesOverview, fetchStablecoins, type DeFiProtocol, type ChainTvl, type YieldPool, type DEXProtocol, type FeesProtocol, type Stablecoin } from '@/lib/defillama'

export function useProtocols() {
  const { data, error, isLoading } = useSWR<DeFiProtocol[]>('dl-protocols', fetchProtocols, { refreshInterval: 300_000, revalidateOnFocus: false, keepPreviousData: true })
  return { protocols: data || [], error, isLoading }
}

export function useChains() {
  const { data, error, isLoading } = useSWR<ChainTvl[]>('dl-chains', fetchChains, { refreshInterval: 300_000, revalidateOnFocus: false, keepPreviousData: true })
  return { chains: (data || []).sort((a, b) => b.tvl - a.tvl), error, isLoading }
}

export function useYieldPools() {
  const { data, error, isLoading } = useSWR<YieldPool[]>('dl-yields', fetchYieldPools, { refreshInterval: 600_000, revalidateOnFocus: false, keepPreviousData: true })
  return { pools: data || [], error, isLoading }
}

export function useDEXVolumes() {
  const { data, error, isLoading } = useSWR('dl-dex', fetchDEXOverview, { refreshInterval: 300_000, revalidateOnFocus: false })
  return { dexes: ((data?.protocols || []) as DEXProtocol[]).filter(d => d.total24h).sort((a, b) => (b.total24h || 0) - (a.total24h || 0)), totalVolume24h: data?.total24h || 0, error, isLoading }
}

export function useFees() {
  const { data, error, isLoading } = useSWR('dl-fees', fetchFeesOverview, { refreshInterval: 300_000, revalidateOnFocus: false })
  return { fees: ((data?.protocols || []) as FeesProtocol[]).filter(f => f.total24h).sort((a, b) => (b.total24h || 0) - (a.total24h || 0)), error, isLoading }
}

export function useStablecoins() {
  const { data, error, isLoading } = useSWR<Stablecoin[]>('dl-stables', fetchStablecoins, { refreshInterval: 600_000, revalidateOnFocus: false })
  return { stablecoins: data || [], error, isLoading }
}
