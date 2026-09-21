import { Outlet } from '@tanstack/react-router'
import { Card } from '@/components/ui/card'
import { GameSidebar } from '@/components/game-sidebar'
import { GameSidebarTrigger } from '@/components/game-sidebar-trigger'

export default function GameLayout() {
  return (
    <>
      <GameSidebarTrigger className="p-2 fixed z-10" />
      <GameSidebar />
      <div className="container mx-auto p-4 sm:p-8 text-center relative max-w-screen max-h-screen w-xl min-w-fit h-full justify-center items-center flex">
        <Card className="bg-card/50 backdrop-blur-sm border-muted max-w-full max-h-full w-full h-fit min-w-fit">
          <Outlet />
        </Card>
      </div>
    </>
  )
}
