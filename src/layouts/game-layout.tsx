import { Outlet } from '@tanstack/react-router'
import { Card } from '@/components/ui/card'

export default function GameLayout() {
  return (
    <div className="container mx-auto p-8 text-center relative z-10 w-xl min-w-fit h-full justify-center items-center flex">
      <Card className="bg-card/50 backdrop-blur-sm border-muted w-full h-fit min-w-fit">
        <Outlet />
      </Card>
    </div>
  )
}
