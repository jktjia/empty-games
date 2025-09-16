import { Outlet } from '@tanstack/react-router'
import { Card } from '@/components/ui/card'

export default function GameLayout() {
  return (
    <div className="container mx-auto p-4 sm:p-8 text-center relative z-10  max-w-screen w-xl min-w-fit h-full justify-center items-center flex">
      <Card className="bg-card/50 max-w-screen backdrop-blur-sm border-muted w-full h-fit min-w-fit">
        <Outlet />
      </Card>
    </div>
  )
}
