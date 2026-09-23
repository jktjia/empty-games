import { Outlet } from '@tanstack/react-router'
import { Card } from '@/components/ui/card'

export default function GameLayout() {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-muted max-w-full max-h-full w-full h-fit min-w-fit">
      <Outlet />
    </Card>
  )
}
