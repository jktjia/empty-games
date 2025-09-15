import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'

import './styles.css'
import reportWebVitals from './reportWebVitals.ts'

import { Toaster } from 'sonner'
import BaseLayout from './layouts/base-layout.tsx'
import GameLayout from './layouts/game-layout.tsx'
import MergeGame from './pages/merge-game.tsx'
import Minesweeper from './pages/minesweeper.tsx'

const rootRoute = createRootRoute({
  component: BaseLayout,
})

const gameRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'game',
  component: GameLayout,
})

const indexRoute = createRoute({
  getParentRoute: () => gameRoute,
  path: '/',
  component: MergeGame,
})

const mineRoute = createRoute({
  getParentRoute: () => gameRoute,
  path: 'minesweeper',
  component: Minesweeper,
})

const routeTree = rootRoute.addChildren([
  gameRoute.addChildren([indexRoute, mineRoute]),
])

const router = createRouter({
  routeTree,
  context: {},
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
      <Toaster position="top-center" />
    </StrictMode>,
  )
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
