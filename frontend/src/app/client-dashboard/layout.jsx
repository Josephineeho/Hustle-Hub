"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { 
  Briefcase, 
  CreditCard, 
  LayoutDashboard, 
  LogOut, 
  MessageSquare, 
  Settings, 
  Users 
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/client-dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/client-dashboard/jobs", label: "My Jobs", icon: Briefcase },
  { href: "/find-work", label: "Find Workers", icon: Users },
  { href: "/client-dashboard/messages", label: "Messages", icon: MessageSquare },
  { href: "/client-dashboard/payments", label: "Payments", icon: CreditCard },
  { href: "/client-dashboard/settings", label: "Settings", icon: Settings },
];

export default function ClientDashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, signOut } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (user.role !== "employer") {
        router.push("/");
      }
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== "employer") {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-(--color-surface-container-low)">
        <span className="inline-block w-8 h-8 border-4 border-(--color-primary)/30 border-t-(--color-primary) rounded-full animate-spin" />
      </div>
    );
  }

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <div className="flex h-screen bg-(--color-surface-container-low) overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-(--color-outline-variant)/30 flex flex-col hidden md:flex">
        <div className="p-6">
          <Link href="/" className="text-xl font-bold font-[family-name:--font-headline] text-(--color-primary)">
            HustleHub
          </Link>
        </div>

        <nav className="flex-1 px-4 py-2 space-y-1">
          {NAV_LINKS.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-(--radius-md) text-body-sm font-medium transition-colors",
                  isActive 
                    ? "bg-(--color-primary-container) text-(--color-on-primary-container)" 
                    : "text-(--color-on-surface-variant) hover:bg-(--color-surface-container) hover:text-(--color-on-surface)"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-(--color-primary)" : "text-(--color-outline)")} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-(--color-outline-variant)/30">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-(--radius-md) text-body-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-(--color-outline-variant)/30 p-4 flex items-center justify-between sticky top-0 z-10">
          <span className="font-bold text-(--color-primary)">HustleHub</span>
          <button className="p-2">
            <LayoutDashboard className="w-5 h-5 text-(--color-on-surface)" />
          </button>
        </header>

        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
