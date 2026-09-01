import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background pb-24 relative max-w-md mx-auto w-full shadow-2xl border-x rounded-none">
      <main className="w-full h-full">
        {children}
      </main>
    </div>
  );
}
