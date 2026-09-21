import { Outlet, useNavigate } from '@tanstack/react-router'
import EmptyProvider from '@/components/providers/empty-provider'
import ThemeProvider from '@/components/providers/theme-provider'
import { SidebarProvider } from '@/components/ui/sidebar'

export default function BaseLayout() {
  const navigate = useNavigate()

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <EmptyProvider navigate={navigate}>
        <SidebarProvider defaultOpen={false}>
          <div className="text-center w-full h-screen overflow-auto">
            <Outlet />
          </div>
        </SidebarProvider>
      </EmptyProvider>
    </ThemeProvider>
  )
}
