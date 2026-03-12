import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useCartStore } from "@/store/use-cart";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export function Layout({ children }: { children: ReactNode }) {
  const totalItems = useCartStore((state) => state.getTotalItems());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const navLinks = [
    { href: "/shop", label: "商品" },
    { href: "/orders", label: "訂單查詢" },
    { href: "/cart", label: "購物車" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-accent selection:text-accent-foreground">
      <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border/20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Link href="/" className="text-lg font-light tracking-[0.15em] uppercase text-foreground hover:opacity-60 transition-opacity duration-500">
              Aura Market
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/shop" className="text-[13px] tracking-wide text-foreground/50 hover:text-foreground transition-colors duration-500">商品</Link>
              <Link href="/orders" className="text-[13px] tracking-wide text-foreground/50 hover:text-foreground transition-colors duration-500">訂單查詢</Link>
            </nav>
          </div>
          
          <div className="flex items-center gap-2">
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative text-foreground/40 hover:text-foreground transition-colors duration-500">
                <ShoppingBag className="w-[18px] h-[18px]" strokeWidth={1.5} />
                {totalItems > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-[10px] font-medium text-background">
                    {totalItems}
                  </span>
                )}
                <span className="sr-only">購物車</span>
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-foreground/40 hover:text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-[18px] h-[18px]" strokeWidth={1.5} />
              ) : (
                <Menu className="w-[18px] h-[18px]" strokeWidth={1.5} />
              )}
            </Button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="md:hidden fixed top-16 left-0 right-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border/20 overflow-hidden"
          >
            <nav className="flex flex-col px-6 py-6 gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`py-3 text-[15px] tracking-wide transition-colors duration-300 border-b border-border/10 last:border-0 ${
                    location === link.href
                      ? "text-foreground font-medium"
                      : "text-foreground/50"
                  }`}
                >
                  {link.label}
                  {link.href === "/cart" && totalItems > 0 && (
                    <span className="ml-2 text-[12px] text-foreground/35">({totalItems})</span>
                  )}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t border-border/20 mt-auto">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 flex flex-col md:flex-row justify-between items-center gap-8">
          <span className="text-sm font-light tracking-[0.15em] uppercase text-foreground/40">Aura Market</span>
          <div className="flex gap-10 text-[13px] tracking-wide text-foreground/35">
            <Link href="/about" className="hover:text-foreground transition-colors duration-500">關於我們</Link>
            <Link href="/contact" className="hover:text-foreground transition-colors duration-500">聯絡我們</Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors duration-500">隱私政策</Link>
            <Link href="/admin/login" className="hover:text-foreground transition-colors duration-500">管理後台</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
