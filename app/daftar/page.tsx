import { TopBar } from "@/components/top-bar";
import { LoginForm } from "@/components/login-form";

export default function DaftarPage() {
  return (
    <div className="fixed inset-0 flex flex-col bg-muted/10 text-xs overflow-hidden pb-6">
      {/* Consistent Header */}
      <TopBar title="Tiketku.com" />

      <div className="flex-1 flex flex-col justify-center items-center max-w-6xl mx-auto w-full p-4 md:p-6 overflow-hidden my-auto">
        <LoginForm mode="register" />
      </div>
    </div>
  );
}
