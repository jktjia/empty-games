import EmptyProvider from '@/components/providers/empty-provider'
import ThemeProvider from '@/components/providers/theme-provider'
import { Outlet } from '@tanstack/react-router'

export default function BaseLayout() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <div className="text-center w-full h-screen overflow-auto">
        <EmptyProvider>
          <Outlet />
        </EmptyProvider>
      </div>
    </ThemeProvider>
  )
}
