import { Box } from 'lucide-react'
import { Button } from './ui/button'
import { useSidebar } from '@/components/ui/sidebar'

export function GameSidebarTrigger({ className }: { className?: string }) {
  const { toggleSidebar } = useSidebar()

  return (
    <div className={className}>
      <Button size={'lg'} onClick={toggleSidebar} variant={'ghost'}>
        <Box />
        Cube Games
      </Button>
    </div>
  )
}
