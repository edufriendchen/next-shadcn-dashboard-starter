'use client';

import { useAuth } from '@/components/auth/auth-provider';
import { Icons } from '@/components/icons';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@/components/ui/sidebar';
import { useState } from 'react';

export function OrgSwitcher() {
  const { isMobile, state } = useSidebar();
  const router = useRouter();
  const { organizations, activeOrganizationId, isLoaded, switchOrg } = useAuth();
  const [switchingId, setSwitchingId] = useState<number | null>(null);

  // Get the currently active organization
  const activeOrganization =
    organizations.find((org) => org.id === activeOrganizationId) ?? organizations[0];

  // Handle organization switch
  const handleOrganizationSwitch = async (organizationId: number) => {
    if (activeOrganizationId === organizationId || switchingId !== null) {
      return; // Already active or a switch is in flight
    }
    setSwitchingId(organizationId);
    try {
      const result = await switchOrg(organizationId);
      if (!result.success) {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Failed to switch organization:', error);
      toast.error('Failed to switch organization');
    } finally {
      setSwitchingId(null);
    }
  };

  // Show loading state
  if (!isLoaded) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size='lg' disabled>
            <div className='bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 shrink-0 items-center justify-center rounded-lg'>
              <Icons.galleryVerticalEnd className='size-4' />
            </div>
            <div
              className={`grid flex-1 text-left text-sm leading-tight transition-all duration-200 ease-in-out ${
                state === 'collapsed'
                  ? 'invisible max-w-0 overflow-hidden opacity-0'
                  : 'visible max-w-full opacity-100'
              }`}
            >
              <span className='truncate font-medium'>Loading...</span>
              <span className='text-muted-foreground truncate text-xs'>Organizations</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  // Show create organization option if no organizations
  if (!organizations || organizations.length === 0) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            size='lg'
            onClick={() => router.push('/dashboard/workspaces')}
            className='data-popup-open:bg-sidebar-accent data-popup-open:text-sidebar-accent-foreground'
          >
            <div className='bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg'>
              <Icons.add className='size-4' />
            </div>
            <div
              className={`grid flex-1 text-left text-sm leading-tight transition-all duration-200 ease-in-out ${
                state === 'collapsed'
                  ? 'invisible max-w-0 overflow-hidden opacity-0'
                  : 'visible max-w-full opacity-100'
              }`}
            >
              <span className='truncate font-medium'>Create organization</span>
              <span className='text-muted-foreground truncate text-xs'>Get started</span>
            </div>
            <Icons.chevronsUpDown
              className={`ml-auto transition-all duration-200 ease-in-out ${
                state === 'collapsed'
                  ? 'invisible max-w-0 opacity-0'
                  : 'visible max-w-full opacity-100'
              }`}
            />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  if (!activeOrganization) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size='lg'
                className='data-popup-open:bg-sidebar-accent data-popup-open:text-sidebar-accent-foreground'
              />
            }
          >
            <div className='bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg'>
              {activeOrganization.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={activeOrganization.logo}
                  alt={activeOrganization.name}
                  className='size-full object-cover'
                />
              ) : (
                <Icons.galleryVerticalEnd className='size-4' />
              )}
            </div>
            <div
              className={`grid flex-1 text-left text-sm leading-tight transition-all duration-200 ease-in-out ${
                state === 'collapsed'
                  ? 'invisible max-w-0 overflow-hidden opacity-0'
                  : 'visible max-w-full opacity-100'
              }`}
            >
              <span className='truncate font-medium'>{activeOrganization.name}</span>
              <span className='text-muted-foreground truncate text-xs'>
                {activeOrganization.code || 'Organization'}
              </span>
            </div>
            <Icons.chevronsUpDown
              className={`ml-auto transition-all duration-200 ease-in-out ${
                state === 'collapsed'
                  ? 'invisible max-w-0 opacity-0'
                  : 'visible max-w-full opacity-100'
              }`}
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-(--anchor-width) min-w-56 rounded-lg'
            align='start'
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className='text-muted-foreground text-xs'>
                Organizations
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuGroup>
              {organizations.map((org, index) => {
                const isActive = org.id === activeOrganizationId;
                return (
                  <DropdownMenuItem
                    key={org.id}
                    onClick={() => handleOrganizationSwitch(org.id)}
                    className='gap-2 p-2'
                  >
                    <div className='flex size-6 items-center justify-center overflow-hidden rounded-md border'>
                      {org.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={org.logo} alt={org.name} className='size-full object-cover' />
                      ) : (
                        <Icons.galleryVerticalEnd className='size-3.5 shrink-0' />
                      )}
                    </div>
                    {org.name}
                    {switchingId === org.id ? (
                      <Icons.spinner className='text-muted-foreground ml-auto size-4 animate-spin' />
                    ) : isActive ? (
                      <Icons.check className='ml-auto size-4' />
                    ) : (
                      <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                    )}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                className='gap-2 p-2'
                onClick={() => {
                  router.push('/dashboard/workspaces');
                }}
              >
                <div className='flex size-6 items-center justify-center rounded-md border bg-transparent'>
                  <Icons.add className='size-4' />
                </div>
                <div className='text-muted-foreground font-medium'>Add organization</div>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
