import { Outlet } from '@tanstack/react-router'
import { GameSidebar } from '@/components/game-sidebar'
import { GameSidebarTrigger } from '@/components/game-sidebar-trigger'

export default function MainLayout() {
  return (
    <>
      <GameSidebarTrigger className="p-2 fixed z-10" />
      <GameSidebar />
      <div className="container mx-auto p-4 sm:p-8 text-center relative max-w-screen max-h-screen w-xl min-w-fit h-full justify-center items-center flex">
        <Outlet />
      </div>
    </>
  )
}
