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
// import FeedMe from './pages/feed-me.tsx'
import TextLayout from './layouts/secret-layout.tsx'
import {
  DONT_LEAVE_PATH,
  // FEED_ME_PATH,
  MINESWEEPER_PATH,
  SETTINGS_PATH,
  SNAKE_PATH,
  TETRIS_PATH,
} from './utils/paths.ts'
import Stay from './pages/stay.tsx'
import Tetris from './pages/tetris.tsx'
import MainLayout from './layouts/main-layout.tsx'
import Settings from './pages/settings.tsx'
import Snake from './pages/snake.tsx'

const rootRoute = createRootRoute({
  component: BaseLayout,
})

const mainRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'main',
  component: MainLayout,
})

const gameRoute = createRoute({
  getParentRoute: () => mainRoute,
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

const snakeRoute = createRoute({
  getParentRoute: () => gameRoute,
  path: SNAKE_PATH,
  component: Snake,
})

const settingsRoute = createRoute({
  getParentRoute: () => mainRoute,
  path: SETTINGS_PATH,
  component: Settings,
})

// const feedRoute = createRoute({
//   getParentRoute: () => textRoute,
//   path: FEED_ME_PATH,
//   component: FeedMe,
// })

const stayRoute = createRoute({
  getParentRoute: () => textRoute,
  path: DONT_LEAVE_PATH,
  component: Stay,
})

const routeTree = rootRoute.addChildren([
  mainRoute.addChildren([
    settingsRoute,
    gameRoute.addChildren([indexRoute, mineRoute, tetrisRoute, snakeRoute]),
  ]),
  // textRoute.addChildren([feedRoute, stayRoute]),
  textRoute.addChildren([stayRoute]),
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
