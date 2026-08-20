import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { fetchRepositorySnapshot, type RepositorySnapshot } from './repository'

type RepositoryState = {
  data: RepositorySnapshot | null
  loading: boolean
  error: boolean
}

const RepositoryContext = createContext<RepositoryState>({ data: null, loading: true, error: false })

export function RepositoryDataProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<RepositoryState>({ data: null, loading: true, error: false })

  useEffect(() => {
    let active = true
    let refresh: number | undefined
    const controller = new AbortController()
    const load = async () => {
      try {
        const snapshot = await fetchRepositorySnapshot(fetch, controller.signal)
        if (active) setState({ data: snapshot, loading: false, error: false })
      } catch {
        if (active) setState((current) => ({ data: current.data, loading: false, error: true }))
      } finally {
        if (active) refresh = window.setTimeout(load, 15 * 60_000)
      }
    }
    void load()
    return () => {
      active = false
      controller.abort()
      if (refresh !== undefined) window.clearTimeout(refresh)
    }
  }, [])

  return <RepositoryContext.Provider value={state}>{children}</RepositoryContext.Provider>
}

export function useRepositoryData() {
  return useContext(RepositoryContext)
}
