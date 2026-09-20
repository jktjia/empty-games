import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'

import './styles.css'
import { Toaster } from 'sonner'
import reportWebVitals from './reportWebVitals.ts'

import BaseLayout from './layouts/base-layout.tsx'
import GameLayout from './layouts/game-layout.tsx'
import MergeGame from './pages/merge-game.tsx'
import Minesweeper from './pages/minesweeper.tsx'
import FeedMe from './pages/feed-me.tsx'
import TextLayout from './layouts/text-layout.tsx'
import {
  DONT_LEAVE_PATH,
  FEED_ME_PATH,
  MINESWEEPER_PATH,
  TETRIS_PATH,
} from './lib/paths.ts'
import Stay from './pages/stay.tsx'
import Tetris from './pages/tetris.tsx'

const rootRoute = createRootRoute({
  component: BaseLayout,
})

const gameRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'game',
  component: GameLayout,
})

const textRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'text',
  component: TextLayout,
})

const indexRoute = createRoute({
  getParentRoute: () => gameRoute,
  path: '/',
  component: MergeGame,
})

const mineRoute = createRoute({
  getParentRoute: () => gameRoute,
  path: MINESWEEPER_PATH,
  component: Minesweeper,
})

const tetrisRoute = createRoute({
  getParentRoute: () => gameRoute,
  path: TETRIS_PATH,
  component: Tetris,
})

const feedRoute = createRoute({
  getParentRoute: () => textRoute,
  path: FEED_ME_PATH,
  component: FeedMe,
})

const stayRoute = createRoute({
  getParentRoute: () => textRoute,
  path: DONT_LEAVE_PATH,
  component: Stay,
})

const routeTree = rootRoute.addChildren([
  gameRoute.addChildren([indexRoute, mineRoute, tetrisRoute]),
  textRoute.addChildren([feedRoute, stayRoute]),
])

const router = createRouter({
  routeTree,
  context: {},
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
  basepath: 'empty-games',
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
      <Toaster position="top-right" richColors />
    </StrictMode>,
  )
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
