"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { 
  Scale, 
  FileText, 
  Briefcase, 
  AlertCircle, 
  Home, 
  Globe, 
  LogOut,
  Menu,
  Bell,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NotificationBell } from "@/components/notification-bell";

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Check if we're on the main dashboard page
  const isMainDashboard = pathname === "/dashboard";

  useEffect(() => {
    // Ensure we're on the client side before accessing localStorage
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        router.push("/");
        return;
      }
      setUser(JSON.parse(storedUser));

      // Load sidebar state from localStorage
      const savedState = localStorage.getItem("sidebarCollapsed");
      if (savedState) {
        setSidebarCollapsed(JSON.parse(savedState));
      }
    }
  }, [router]);

  const toggleSidebar = () => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    if (typeof window !== 'undefined') {
      localStorage.setItem("sidebarCollapsed", JSON.stringify(newState));
    }
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem("user");
    }
    router.push("/");
  };

  const menuItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Home,
    },
    {
      title: "Ações Cíveis",
      href: "/dashboard/acoes-civeis",
      icon: FileText,
    },
    {
      title: "Ações Trabalhistas",
      href: "/dashboard/acoes-trabalhistas",
      icon: Briefcase,
    },
    {
      title: "Ações Criminais",
      href: "/dashboard/acoes-criminais",
      icon: AlertCircle,
    },
    {
      title: "Compra e Venda",
      href: "/dashboard/compra-venda",
      icon: Home,
    },
    {
      title: "Perda de Nacionalidade",
      href: "/dashboard/perda-nacionalidade",
      icon: Globe,
    },
    {
      title: "Vistos",
      href: "/dashboard/vistos",
      icon: Globe,
    },
  ];

  const Sidebar = () => (
    <div className="flex flex-col h-full bg-card">
      <div className="p-6 border-b border-border bg-card">
        <div className="flex items-center justify-center mb-3">
          <Image 
            src="https://i.imgur.com/9R0VFkm.png"
            alt="Sistema Jurídico Logo" 
            width={200}
            height={60}
            className="object-contain"
            priority
            unoptimized
          />
        </div>
        <p className="text-xs text-muted-foreground text-center">{user?.name}</p>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto bg-card">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors bg-card"
          >
            <item.icon className="h-5 w-5" />
            <span className="text-sm font-medium">{item.title}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-border space-y-2 bg-card">
        <Button
          variant="ghost"
          className="w-full justify-start bg-card"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 mr-3" />
          Sair
        </Button>
        
        {/* Collapse Button - Bottom of Sidebar (Desktop only) */}
        <button
          onClick={toggleSidebar}
          className="hidden lg:flex w-full items-center justify-center py-1 px-2 text-xs text-muted-foreground hover:text-muted-foreground hover:bg-muted rounded transition-colors bg-card"
          title="Ocultar menu"
        >
          <ChevronLeft className="h-3 w-3 mr-1" />
          <span>Ocultar</span>
        </button>
      </div>
    </div>
  );

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside 
        className={`hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col border-r border-border bg-card transition-all duration-300 ${
          sidebarCollapsed ? 'lg:w-0 lg:overflow-hidden' : 'lg:w-64'
        }`}
      >
        <Sidebar />
      </aside>

      {/* Desktop Toggle Button (when collapsed) */}
      {sidebarCollapsed && (
        <button
          onClick={toggleSidebar}
          className="hidden lg:flex fixed left-2 bottom-4 items-center justify-center p-1.5 bg-card text-muted-foreground hover:text-muted-foreground hover:bg-muted rounded border border-border shadow-sm transition-all z-50"
          title="Expandir menu"
        >
          <ChevronRight className="h-3 w-3" />
        </button>
      )}

      {/* Desktop Header with Notification Bell */}
      <div className="hidden lg:block fixed top-0 right-0 z-50 bg-card">
        <div className="flex items-center justify-end px-6 py-3 gap-3">
          {isMainDashboard && <NotificationBell />}
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b border-border">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="bg-card">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0 bg-card border-border">
                <Sidebar />
              </SheetContent>
            </Sheet>
            <Image 
              src="https://i.imgur.com/9R0VFkm.png"
              alt="Sistema Jurídico Logo" 
              width={140}
              height={42}
              className="object-contain"
              priority
              unoptimized
            />
          </div>
          {isMainDashboard && <NotificationBell />}
        </div>
      </div>

      {/* Main Content */}
      <main className={`pt-16 lg:pt-16 transition-all duration-300 ${
        sidebarCollapsed ? 'lg:pl-0' : 'lg:pl-64'
      }`}>
        <div className="p-4 lg:p-8">{children}</div>
      </main>
    </div>
  );
}