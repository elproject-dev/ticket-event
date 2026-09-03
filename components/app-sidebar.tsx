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
  ImageSquare,
  IdentificationBadge
} from "@phosphor-icons/react"

import { usePathname } from "next/navigation"
import { authClient } from "@/lib/auth/client"

// Menu untuk pengguna biasa (5 item)
const navUser = [
  { title: "Beranda", url: "/", icon: <House /> },
  { title: "Acara", url: "/acara", icon: <CalendarBlank /> },
  { title: "Barcode", url: "/barcode", icon: <QrCode /> },
  { title: "Event", url: "/event", icon: <Compass /> },
  { title: "Akun", url: "/akun", icon: <User /> },
];

const data = {
  navMain: navUser,
  navAdmin: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: <ChartPieSlice />,
    },
    {
      title: "Kelola Pengguna",
      url: "/admin/pengguna",
      icon: <Users />,
    },
    {
      title: "Kelola Staf",
      url: "/admin/staf",
      icon: <IdentificationBadge />,
    },
    {
      title: "Kelola Event",
      url: "/admin/event",
      icon: <Compass />,
    },
    {
      title: "Kelola Acara",
      url: "/admin/acara",
      icon: <CalendarBlank />,
    },
    {
      title: "Kelola Banner",
      url: "/admin/banner",
      icon: <ImageSquare />,
    },
    {
      title: "Pengaturan",
      url: "/admin/pengaturan",
      icon: <Gear />,
    },
  ],
  navStaff: [
    {
      title: "Scan Barcode",
      url: "/staf/scan",
      icon: <QrCode />,
    },
    {
      title: "Riwayat",
      url: "/staf/riwayat-scan",
      icon: <ClockCounterClockwise />,
    },
  ],
}

export function AppSidebar({ initialSession, ...props }: React.ComponentProps<typeof Sidebar> & { initialSession?: any }) {
  const pathname = usePathname();
  const { data: clientSession } = authClient.useSession();
  const session = clientSession || initialSession;

  const [dbUser, setDbUser] = React.useState<{ name: string; email: string; image: string } | null>(null);
  const [userRole, setUserRole] = React.useState<string>("pengguna");

  React.useEffect(() => {
    if (session?.user?.email) {
      fetch("/api/user/profile")
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            setDbUser({
              name: data.user.name,
              email: data.user.email,
              image: data.user.image || "",
            });
            setUserRole(data.user.peran || "pengguna");
          }
        })
        .catch(() => {});
    } else {
      setDbUser(null);
      setUserRole("pengguna");
    }
  }, [session?.user?.email]);

  const isStaff = userRole === "staf";
  const isAdmin = userRole === "admin";

  const userData = session?.user ? {
    name: dbUser?.name || session.user.name || "Pengguna",
    email: dbUser?.email || session.user.email || "",
    avatar: dbUser?.image || session.user.image || "",
  } : {
    name: "Tamu",
    email: "Belum login",
    avatar: "",
  };

  const navMain = data.navMain.map((item) => ({
    ...item,
    isActive: item.url === "/" 
      ? pathname === "/" 
      : pathname === item.url || pathname.startsWith(item.url + "/"),
  }));

  const navStaff = (isStaff || isAdmin) ? data.navStaff.map((item) => ({
    ...item,
    isActive: pathname === item.url || pathname.startsWith(item.url + "/"),
  })) : [];

  const navAdmin = isAdmin ? data.navAdmin.map((item) => ({
    ...item,
    isActive: item.url === "/admin" 
      ? pathname === "/admin" 
      : pathname === item.url || pathname.startsWith(item.url + "/"),
  })) : [];

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
        <NavMain label="Menu Utama" items={navMain} />
        {(isStaff || isAdmin) && <NavMain label="Staf" items={navStaff} />}
        {isAdmin && <NavMain label="Administrator" items={navAdmin} />}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}
