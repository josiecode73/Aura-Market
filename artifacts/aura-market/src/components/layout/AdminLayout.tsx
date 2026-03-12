import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, Package, ClipboardList, ArrowLeft, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useAdminAuth } from "@/store/use-admin-auth";
import { AdminGuard } from "@/components/AdminGuard";

const adminNavItems = [
  { href: "/admin/products", label: "商品管理", icon: Package },
  { href: "/admin/orders", label: "訂單管理", icon: ClipboardList },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { logout } = useAdminAuth();
  const [, navigate] = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <AdminGuard>
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 w-full bg-[#30364F] text-white border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin/products" className="flex items-center gap-2 text-base font-medium tracking-tight hover:opacity-80 transition-opacity">
              <LayoutDashboard className="w-5 h-5" />
              Aura Market 後台
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              {adminNavItems.map((item) => {
                const isActive = location === item.href;
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`text-sm gap-2 ${isActive ? "bg-white/15 text-white" : "text-white/70 hover:text-white hover:bg-white/10"}`}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10 gap-2">
                <ArrowLeft className="w-4 h-4" />
                返回前台
              </Button>
            </Link>
            <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10 gap-2" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
              登出
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 bg-muted/20">
        {children}
      </main>

      <footer className="border-t border-border/40 bg-background/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
          <span className="text-sm text-muted-foreground">Aura Market 管理後台</span>
        </div>
      </footer>
    </div>
    </AdminGuard>
  );
}

export function AdminPageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
