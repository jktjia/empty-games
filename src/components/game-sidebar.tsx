import { Link } from '@tanstack/react-router'
import { Blocks, Bomb, Grid2X2 } from 'lucide-react'
import { GameSidebarTrigger } from './game-sidebar-trigger'
import type { LucideIcon } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
} from '@/components/ui/sidebar'
import { MINESWEEPER_PATH, TETRIS_PATH } from '@/lib/paths'

interface GameOption {
  name: string
  href: string
  icon: LucideIcon
}

const gameOptions: GameOption[] = [
  { name: '2048', href: '/', icon: Grid2X2 },
  { name: 'Minesweeper', href: '/' + MINESWEEPER_PATH, icon: Bomb },
  { name: 'Tetris', href: '/' + TETRIS_PATH, icon: Blocks },
]

export function GameSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <GameSidebarTrigger />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Games</SidebarGroupLabel>
          <SidebarMenu>
            {gameOptions.map((g) => (
              <SidebarMenuButton>
                <Link to={g.href} className="flex flex-row gap-2 items-center">
                  <g.icon size={20} />
                  {g.name}
                </Link>
              </SidebarMenuButton>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}
