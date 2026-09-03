import { TopBar } from "@/components/top-bar";
import { LoginForm } from "@/components/login-form";

export default function DaftarPage() {
  return (
    <div className="flex flex-col min-h-screen text-xs bg-muted/10">
      {/* Consistent Header */}
      <TopBar />

      <div className="flex-1 flex flex-col justify-center max-w-6xl mx-auto w-full p-4 md:p-6">
        <LoginForm mode="register" />
      </div>
    </div>
  );
}
