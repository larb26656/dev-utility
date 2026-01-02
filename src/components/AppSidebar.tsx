import { HomeIcon, Settings } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'
import { useLocation, useNavigate } from '@tanstack/react-router'
import { registry } from '@/lib/extensions/tools/register'

interface AppSidebarProps {}

export function AppSidebar({}: AppSidebarProps) {
  const toolGroups = registry.getGroups()
  const navigate = useNavigate()

  const location = useLocation()

  const isActive = (path: string) => {
    return location.href.startsWith(path)
  }

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader>
        <SidebarMenuItem>
          <SidebarMenuButton
            onClick={() =>
              navigate({
                to: '/',
              })
            }
          >
            <p className="text-xl font-bold">DevUtility</p>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() =>
                navigate({
                  to: '/home',
                })
              }
              isActive={isActive(`/home`)}
            >
              <HomeIcon />
              <span>Home</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {toolGroups.map((group) => {
            return (
              <SidebarMenuSubItem key={group.category}>
                <SidebarMenuButton>{group.category}</SidebarMenuButton>
                <SidebarMenuSub>
                  {group.tools.map((tool) => {
                    return (
                      <SidebarMenuSubItem key={tool.id}>
                        <SidebarMenuSubButton
                          isActive={isActive(`/tool/${tool.id}`)}
                          onClick={() =>
                            navigate({
                              to: '/tool/$toolId',
                              params: { toolId: tool.id },
                            })
                          }
                        >
                          {tool.name}
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    )
                  })}
                </SidebarMenuSub>
              </SidebarMenuSubItem>
            )
          })}
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <a href="#">
              <Settings />
              <span>Setting</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarFooter>
    </Sidebar>
  )
}
