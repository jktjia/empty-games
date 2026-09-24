import { Link } from '@tanstack/react-router'
import { Blocks, Bomb, Grid2X2, LineSquiggle, Settings } from 'lucide-react'
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
  useSidebar,
} from '@/components/ui/sidebar'
import {
  MINESWEEPER_PATH,
  SETTINGS_PATH,
  SNAKE_PATH,
  TETRIS_PATH,
} from '@/utils/paths'

interface PageOption {
  name: string
  href: string
  icon: LucideIcon
}

const gameOptions: PageOption[] = [
  { name: '2048', href: '/', icon: Grid2X2 },
  { name: 'Minesweeper', href: '/' + MINESWEEPER_PATH, icon: Bomb },
  { name: 'Snake', href: '/' + SNAKE_PATH, icon: LineSquiggle },
  { name: 'Tetris', href: '/' + TETRIS_PATH, icon: Blocks },
]

const footerLinks: PageOption[] = [
  { name: 'Settings', href: '/' + SETTINGS_PATH, icon: Settings },
]

function PageLink({ page }: { page: PageOption }) {
  const { toggleSidebar } = useSidebar()
  return (
    <SidebarMenuButton key={page.name} onClick={toggleSidebar}>
      <Link to={page.href} className="flex flex-row gap-2 items-center w-full">
        <page.icon size={20} />
        {page.name}
      </Link>
    </SidebarMenuButton>
  )
}

export function GameSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="flex flex-row justify-start">
        <GameSidebarTrigger />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Games</SidebarGroupLabel>
          <SidebarMenu>
            {gameOptions.map((g) => (
              <PageLink key={g.name} page={g} />
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          {footerLinks.map((p) => (
            <PageLink key={p.name} page={p} />
          ))}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
