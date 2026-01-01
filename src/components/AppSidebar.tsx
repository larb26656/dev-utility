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
import { registry } from '@/lib'

interface AppSidebarProps {}

export function AppSidebar({}: AppSidebarProps) {
  const conversionGroups = registry.getGroups()
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
          {conversionGroups.map((group) => {
            return (
              <SidebarMenuSubItem key={group.category}>
                <SidebarMenuButton>{group.category}</SidebarMenuButton>
                <SidebarMenuSub>
                  {group.conversions.map((conversion) => {
                    return (
                      <SidebarMenuSubItem key={conversion.id}>
                        <SidebarMenuSubButton
                          isActive={isActive(`/conversion/${conversion.id}`)}
                          onClick={() =>
                            navigate({
                              to: '/conversion/$conversionId',
                              params: { conversionId: conversion.id },
                            })
                          }
                        >
                          {conversion.name}
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
