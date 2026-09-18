import { Outlet, useNavigate } from '@tanstack/react-router'
import EmptyProvider from '@/components/providers/empty-provider'
import ThemeProvider from '@/components/providers/theme-provider'
import { SidebarProvider } from '@/components/ui/sidebar'
import { GameSidebar } from '@/components/game-sidebar'
import { GameSidebarTrigger } from '@/components/game-sidebar-trigger'

export default function BaseLayout() {
  const navigate = useNavigate()

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <EmptyProvider navigate={navigate}>
        <SidebarProvider defaultOpen={false}>
          <GameSidebar />
          <div className="text-center w-full h-screen overflow-auto p-2">
            <Outlet />
          </div>
          <GameSidebarTrigger className="p-2 fixed z-10" />
        </SidebarProvider>
      </EmptyProvider>
    </ThemeProvider>
  )
}
