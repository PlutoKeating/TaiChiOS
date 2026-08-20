import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { isRepositorySnapshot, type RepositorySnapshot } from './repository'

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
    const load = async () => {
      try {
        const response = await fetch('/api/github/repository', { headers: { accept: 'application/json' } })
        const payload: unknown = await response.json()
        if (!response.ok || !isRepositorySnapshot(payload)) throw new Error('invalid repository response')
        if (active) setState({ data: payload, loading: false, error: false })
      } catch {
        if (active) setState((current) => ({ data: current.data, loading: false, error: true }))
      }
    }
    void load()
    const refresh = window.setInterval(load, 60_000)
    return () => {
      active = false
      window.clearInterval(refresh)
    }
  }, [])

  return <RepositoryContext.Provider value={state}>{children}</RepositoryContext.Provider>
}

export function useRepositoryData() {
  return useContext(RepositoryContext)
}
