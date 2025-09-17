import { createContext } from 'react'
import type { ReactNode } from 'react'
import { useEmptyProvider } from '@/hooks/use-empty-context'
import type { UseNavigateResult } from '@tanstack/react-router'

interface EmptyContextType {
  title: string
  setTitle: (s: string) => void
  lastActivity: Date
  updateActivity: () => void
}

const EmptyContext = createContext<EmptyContextType>({
  title: '',
  setTitle: console.log,
  lastActivity: new Date(),
  updateActivity: () => console.log(new Date()),
})

export default function EmptyProvider({
  navigate,
  children,
}: {
  navigate: UseNavigateResult<string>
  children: ReactNode
}) {
  return (
    <EmptyContext.Provider value={useEmptyProvider({ navigate })}>
      {children}
    </EmptyContext.Provider>
  )
}

export { EmptyContext }
