import { ChevronDown, ChevronRight, HomeIcon, Star } from 'lucide-react'
import { useLocation, useNavigate } from '@tanstack/react-router'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'
import { registry } from '@/lib/extensions/tools/register'
import { useFavoritesStore } from '@/stores/favoritesStore'

export function AppSidebar() {
  const toolGroups = registry.getGroups()
  const navigate = useNavigate()

  const location = useLocation()

  const { favorites, isFavoritesCollapsed, toggleFavoritesCollapsed } = useFavoritesStore()

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

          {favorites.length > 0 && (
            <SidebarMenuSubItem>
              <SidebarMenuButton onClick={toggleFavoritesCollapsed}>
                {isFavoritesCollapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                <span>Favorites</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {favorites.length}
                </span>
              </SidebarMenuButton>
              {!isFavoritesCollapsed && (
                <SidebarMenuSub>
                  {favorites.map((tool) => (
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
                  ))}
                </SidebarMenuSub>
              )}
            </SidebarMenuSubItem>
          )}

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
    </Sidebar>
  )
}
