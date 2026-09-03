import { TopBar } from "@/components/top-bar";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen bg-muted/10 text-xs">
      {/* Consistent Header */}
      <TopBar />
      
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
