import { Outlet, createFileRoute } from '@tanstack/react-router'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { AppSidebar } from '@/components/AppSidebar'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { AppBreadcrumb } from '@/components/AppBreadcrumb'
import { SearchButton } from '@/components/SearchButton'

export const Route = createFileRoute('/_appLayout')({
  component: HomePage,
})

function HomePage() {
  const { theme, setTheme } = useTheme()

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4 w-full">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <AppBreadcrumb className="flex-1" />
            <SearchButton />
            <Separator
              orientation="vertical"
              className="data-[orientation=vertical]:h-4"
            />
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-md hover:bg-accent"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </header>

        <div className="p-4">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
