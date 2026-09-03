"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, QrCode, History, User, Menu, LayoutDashboard, CalendarDays, Images, CompassIcon, ScanLine, Users, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth/client";

export function BottomNavigation() {
  const pathname = usePathname();
  const [showMore, setShowMore] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  const { data: session } = authClient.useSession();

  useEffect(() => {
    if (session?.user?.email) {
      fetch("/api/user/role")
        .then((res) => res.json())
        .then((data) => {
          if (data.peran) setUserRole(data.peran);
        })
        .catch(() => {});
    } else {
      setUserRole(null);
    }
  }, [session?.user?.email]);

  const isStaffOrAdmin =
    userRole === "staf" ||
    userRole === "admin" ||
    pathname.startsWith("/staf") ||
    pathname.startsWith("/admin");

  const mainLinks = isStaffOrAdmin ? [
    { name: "Beranda", href: "/", icon: Home },
    { name: "Riwayat", href: "/staf/riwayat-scan", icon: History },
    { name: "Scan", href: "/staf/scan", icon: ScanLine, isFloating: true },
    { name: "Akun", href: "/akun", icon: User },
  ] : [
    { name: "Beranda", href: "/", icon: Home },
    { name: "Acara", href: "/acara", icon: Compass },
    { name: "QR Tiket", href: "/e-tiket", icon: QrCode, isFloating: true },
    { name: "Event", href: "/event", icon: Compass },
  ];

  const allMoreLinks = [
    { name: "Akun", href: "/akun", icon: User },
    { name: "Scan Barcode", href: "/staf/scan", icon: ScanLine },
    { name: "Riwayat", href: "/staf/riwayat-scan", icon: History },
    { name: "Kelola Acara", href: "/admin/acara", icon: CalendarDays },
    { name: "Kelola Event", href: "/admin/event", icon: CompassIcon },
    { name: "Banner", href: "/admin/banner", icon: Images },
    { name: "Pengguna", href: "/admin/pengguna", icon: Users },
    { name: "Staf", href: "/admin/staf", icon: ShieldCheck },
  ];

  const mainHrefs = mainLinks.map((item) => item.href);
  const moreLinks = allMoreLinks.filter((item) => !mainHrefs.includes(item.href));

  return (
    <>
      {showMore && (
        <div
          className="fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-200"
          onClick={() => setShowMore(false)}
        />
      )}

      <nav className="fixed bottom-0 left-0 right-0 z-50 rounded-none md:hidden">

        {/* Main bottom bar */}
        <div className="container mx-auto px-1 max-w-md relative z-20 bg-background border-t shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.15)] rounded-t-2xl">
          <div className="grid grid-cols-5 py-2 relative z-10 bg-background rounded-t-2xl">
            {mainLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

              if (item.isFloating) {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="relative flex flex-col items-center justify-center w-full mx-auto transition-all duration-200 group rounded-none"
                  >
                    <div
                      className="absolute -top-7 flex items-center justify-center w-14 h-14 shrink-0 aspect-square shadow-lg border-2 border-background transition-transform group-hover:-translate-y-1 bg-primary text-primary-foreground rounded-full"
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                  </Link>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center justify-center w-full mx-auto py-1 transition-all duration-200 relative rounded-none",
                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <div className="relative">
                    <Icon
                      className={cn(
                        "w-5 h-5 mb-1",
                        isActive ? "text-primary" : "text-muted-foreground"
                      )}
                      strokeWidth={isActive ? 2 : 1.5}
                    />
                  </div>
                  <span className={cn(
                    "text-[9px] font-bold tracking-widest text-center leading-tight",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}>
                    {item.name}
                  </span>
                </Link>
              );
            })}

            {/* Tombol trigger Lainnya */}
            <button
              onClick={() => setShowMore(!showMore)}
              className={cn(
                "flex flex-col items-center justify-center w-full mx-auto py-1 transition-all duration-200 rounded-none",
                showMore
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Menu className="w-5 h-5 mb-1" />
              <span
                className={cn(
                  "text-[9px] font-bold tracking-widest text-center leading-tight",
                  showMore
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                Lainnya
              </span>
            </button>
          </div>
        </div>

        {/* Expandable "More" panel */}
        <div
          className={cn(
            "grid transition-all duration-300 ease-in-out bg-background rounded-none max-w-md mx-auto relative z-10",
            showMore ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          )}
        >
          <div className="overflow-hidden">
            <div className="grid grid-cols-5 py-2 px-1 gap-y-3 border-t border-border">
              {moreLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                const isLogout = link.href === "/logout";

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setShowMore(false)}
                    className={cn(
                      "flex flex-col items-center justify-center w-full mx-auto py-1 transition-all duration-200 rounded-none",
                      isActive
                        ? "text-primary"
                        : isLogout
                          ? "text-red-500 hover:text-red-600"
                          : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-5 h-5 mb-1",
                        isActive ? "text-primary" : isLogout ? "text-red-500" : "text-muted-foreground"
                      )}
                    />
                    <span
                      className={cn(
                        "text-[9px] font-bold tracking-widest text-center leading-tight",
                        isActive
                          ? "text-primary"
                          : isLogout
                            ? "text-red-500"
                            : "text-muted-foreground"
                      )}
                    >
                      {link.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
