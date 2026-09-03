"use client"

import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth/client"
import { User as UserIcon, LogIn as LogInIcon, UserPlus as UserPlusIcon } from "lucide-react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { DotsThreeVerticalIcon, UserCircleIcon, CreditCardIcon, BellIcon, SignOutIcon } from "@phosphor-icons/react"

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar()
  const router = useRouter()

  const isLoggedIn = Boolean(user.avatar || (user.email && user.email !== "Belum login"))

  const handleLogout = async () => {
    try {
      await authClient.signOut()
      router.push("/masuk")
      router.refresh()
    } catch (err) {
      console.error("Gagal logout:", err)
      window.location.href = "/masuk"
    }
  }

  const renderAvatar = () => {
    if (user.avatar) {
      return <img src={user.avatar} alt={user.name} referrerPolicy="no-referrer" className="size-8 rounded-full object-cover shrink-0" />
    }
    return (
      <div className="size-8 rounded-full bg-primary/10 border flex items-center justify-center shrink-0">
        <UserIcon className="size-4 text-primary" />
      </div>
    )
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton size="lg" className="aria-expanded:bg-muted -ml-2" />
            }
          >
            {renderAvatar()}
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user.name}</span>
              <span className="truncate text-xs text-foreground/70">
                {user.email}
              </span>
            </div>
            <DotsThreeVerticalIcon className="ml-auto size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-56"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  {renderAvatar()}
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user.name}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            {isLoggedIn ? (
              <>
                <DropdownMenuGroup>
                  <DropdownMenuItem render={<a href="/akun" />}>
                    <UserCircleIcon />
                    <span>Akun Profil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem render={<a href="/notifikasi" />}>
                    <BellIcon />
                    <span>Notifikasi</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                  <SignOutIcon />
                  <span>Keluar</span>
                </DropdownMenuItem>
              </>
            ) : (
              <DropdownMenuGroup>
                <DropdownMenuItem render={<a href="/masuk" />}>
                  <LogInIcon className="size-4 text-primary" />
                  <span>Masuk Akun</span>
                </DropdownMenuItem>
                <DropdownMenuItem render={<a href="/daftar" />}>
                  <UserPlusIcon className="size-4" />
                  <span>Daftar Baru</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
