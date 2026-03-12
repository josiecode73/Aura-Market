import { useEffect } from "react";
import { Link } from "wouter";
import { Layout, PageTransition } from "@/components/layout/Layout";
import { ProductCard } from "@/components/ProductCard";
import { useListProducts, useCompleteCheckout } from "@workspace/api-client-react";
import { useCartStore } from "@/store/use-cart";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function Home() {
  const { data: products, isLoading } = useListProducts();
  const { mutateAsync: completeCheckout } = useCompleteCheckout();
  const cartStore = useCartStore();
  const { toast } = useToast();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const sessionId = searchParams.get('session_id');
    const success = searchParams.get('success');

    if (success === 'true' && sessionId) {
      if (!cartStore.checkoutEmail) {
        cartStore.clearCart();
        toast({
          title: "訂單已完成",
          description: "感謝您的購買，訂單已成功建立。",
        });
        window.history.replaceState({}, '', '/');
        return;
      }

      completeCheckout({
        data: {
          sessionId,
          userEmail: cartStore.checkoutEmail,
          totalPrice: cartStore.getTotalPrice(),
          items: cartStore.items.map(i => ({
            productId: i.product.id,
            quantity: i.quantity
          }))
        }
      }).then(() => {
        cartStore.clearCart();
        cartStore.setCheckoutEmail("");
        toast({
          title: "訂單已完成",
          description: "感謝您的購買，訂單已成功建立。",
        });
        window.history.replaceState({}, '', '/');
      }).catch(() => {
        cartStore.clearCart();
        toast({
          title: "訂單已完成",
          description: "感謝您的購買。",
        });
        window.history.replaceState({}, '', '/');
      });
    }
  }, []);

  const featuredProducts = products?.slice(0, 6) || [];

  return (
    <Layout>
      <PageTransition>
        <section className="relative w-full min-h-[80vh] flex flex-col items-center justify-center">
          <div className="flex flex-col items-center text-center px-6 pt-24 pb-16">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
              className="text-5xl sm:text-6xl lg:text-7xl font-extralight tracking-[0.08em] text-foreground"
            >
              Aura Market
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="mt-5 text-sm sm:text-base tracking-[0.2em] uppercase text-foreground/35 font-light"
            >
              Minimal Brand Store
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
              className="mt-10"
            >
              <Link href="/shop">
                <span className="inline-block text-[13px] tracking-[0.2em] uppercase text-foreground/50 border-b border-foreground/20 pb-1 hover:text-foreground hover:border-foreground/50 transition-all duration-500 cursor-pointer">
                  探索商品
                </span>
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
            className="w-full max-w-5xl mx-auto px-6 sm:px-8 pb-8"
          >
            <div className="aspect-[16/9] rounded-lg overflow-hidden">
              <img 
                src={`${import.meta.env.BASE_URL}images/hero-bg.png`} 
                alt="Aura Market" 
                className="object-cover w-full h-full"
              />
            </div>
          </motion.div>
        </section>

        <section className="py-20 lg:py-28 max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="mb-16 lg:mb-20">
            <h2 className="text-2xl sm:text-3xl font-extralight tracking-wide text-foreground">精選商品</h2>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-[13px] tracking-wide text-foreground/35 font-light">最受歡迎的極簡單品。</p>
              <Link href="/shop">
                <span className="hidden sm:inline-block text-[12px] tracking-[0.15em] uppercase text-foreground/35 border-b border-foreground/15 pb-0.5 hover:text-foreground hover:border-foreground/40 transition-all duration-500 cursor-pointer">
                  查看全部
                </span>
              </Link>
            </div>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-12 lg:gap-x-8 lg:gap-y-16">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="aspect-[4/5] bg-muted/15 animate-pulse rounded-lg"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-12 lg:gap-x-8 lg:gap-y-16">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          <div className="mt-14 sm:hidden flex justify-center">
            <Link href="/shop">
              <span className="text-[12px] tracking-[0.15em] uppercase text-foreground/35 border-b border-foreground/15 pb-0.5 hover:text-foreground transition-all duration-500 cursor-pointer">
                查看全部商品
              </span>
            </Link>
          </div>
        </section>

        <section className="bg-[#355872] text-white">
          <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-24 lg:py-32 flex flex-col md:flex-row items-center gap-16 lg:gap-24">
            <div className="flex-1 w-full">
              <div className="aspect-[4/5] rounded-lg overflow-hidden">
                <img 
                  src={`${import.meta.env.BASE_URL}images/brand-story.png`} 
                  alt="品牌理念" 
                  className="object-cover w-full h-full opacity-90"
                />
              </div>
            </div>
            <div className="flex-1 space-y-8">
              <h2 className="text-3xl lg:text-4xl font-extralight tracking-wide leading-relaxed">
                少即是多的藝術。
              </h2>
              <div className="w-8 h-px bg-white/25"></div>
              <p className="text-white/60 leading-[1.9] font-light text-[15px] tracking-wide">
                Aura Market 信奉日式極簡哲學。我們精心挑選與創造的每一件商品，都剔除了不必要的元素，只留下功能性、美感與本質。
              </p>
              <p className="text-white/60 leading-[1.9] font-light text-[15px] tracking-wide">
                我們選品中的每一件物品都經過深思熟慮，旨在為您的個人空間帶來平靜與清澈。
              </p>
            </div>
          </div>
        </section>
      </PageTransition>
    </Layout>
  );
}
