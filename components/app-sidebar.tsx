"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  ChartPieSlice,
  CalendarBlank,
  Receipt,
  Users,
  Gear,
  Lifebuoy,
  ChartLineUp,
  Database,
  Command,
  House,
  Compass,
  QrCode,
  ClockCounterClockwise,
  User,
  ImageSquare
} from "@phosphor-icons/react"

import { authClient } from "@/lib/auth/client"

const data = {
  navMain: [
    {
      title: "Beranda",
      url: "/",
      icon: <House />,
      isActive: true,
    },
    {
      title: "Acara",
      url: "/acara",
      icon: <CalendarBlank />,
      isActive: false,
    },
    {
      title: "Event",
      url: "/event",
      icon: <Compass />,
      isActive: false,
    },
    {
      title: "Barcode",
      url: "/barcode",
      icon: <QrCode />,
      isActive: false,
    },
    {
      title: "Riwayat",
      url: "/riwayat",
      icon: <ClockCounterClockwise />,
      isActive: false,
    },
    {
      title: "Akun",
      url: "/akun",
      icon: <User />,
      isActive: false,
    },
  ],
  navAdmin: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: <ChartPieSlice />,
      isActive: false,
    },
    {
      title: "Kelola Pengguna",
      url: "/admin/pengguna",
      icon: <Users />,
      isActive: false,
    },
    {
      title: "Kelola Event",
      url: "/admin/event",
      icon: <Compass />,
      isActive: false,
    },
    {
      title: "Kelola Acara",
      url: "/admin/acara",
      icon: <CalendarBlank />,
      isActive: false,
    },
    {
      title: "Kelola Banner",
      url: "/admin/banner",
      icon: <ImageSquare />,
      isActive: false,
    },
    {
      title: "Pengaturan",
      url: "/admin/pengaturan",
      icon: <Gear />,
      isActive: false,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = authClient.useSession();
  
  const userData = session?.user ? {
    name: session.user.name || "Pengguna",
    email: session.user.email || "",
    avatar: session.user.image || "",
  } : {
    name: "Tamu",
    email: "Belum login",
    avatar: "",
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5!"
              render={<a href="#" />}
            >
              <Command className="size-5!" />
              <span className="text-base font-semibold">Event Ticket</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain label="Menu Utama" items={data.navMain} />
        <NavMain label="Administrator" items={data.navAdmin} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}
