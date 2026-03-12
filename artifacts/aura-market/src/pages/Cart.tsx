import { Link } from "wouter";
import { Layout, PageTransition } from "@/components/layout/Layout";
import { useCartStore } from "@/store/use-cart";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ArrowRight } from "lucide-react";

export default function Cart() {
  const { items, updateQuantity, removeItem, getTotalPrice } = useCartStore();
  const subtotal = getTotalPrice();

  return (
    <Layout>
      <PageTransition>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground mb-12">購物車</h1>

          {items.length === 0 ? (
            <div className="py-24 text-center border border-dashed border-border rounded-xl bg-background/50">
              <p className="text-muted-foreground mb-6">您的購物車是空的。</p>
              <Link href="/shop">
                <Button className="rounded-full">繼續逛逛</Button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-12">
              <div className="flex-1 space-y-6">
                <div className="hidden sm:grid grid-cols-12 text-sm font-medium text-muted-foreground border-b border-border pb-4">
                  <div className="col-span-6">商品</div>
                  <div className="col-span-3 text-center">數量</div>
                  <div className="col-span-3 text-right">小計</div>
                </div>
                
                {items.map((item) => (
                  <div key={item.product.id} className="flex flex-col sm:grid sm:grid-cols-12 gap-4 items-center py-6 border-b border-border/40">
                    <div className="col-span-6 flex items-center gap-4 w-full">
                      <div className="w-20 h-24 bg-muted rounded overflow-hidden flex-shrink-0">
                        {item.product.image ? (
                          <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-muted/50" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <Link href={`/product/${item.product.id}`} className="font-medium hover:text-primary transition-colors line-clamp-2">
                          {item.product.name}
                        </Link>
                        <span className="text-sm text-muted-foreground mt-1">NT$ {item.product.price.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div className="col-span-3 flex items-center justify-center w-full sm:w-auto">
                      <div className="flex items-center border border-border rounded-md">
                        <button 
                          onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                          className="px-3 py-1.5 text-muted-foreground hover:text-foreground"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.product.id, Math.min(item.product.stock, item.quantity + 1))}
                          className="px-3 py-1.5 text-muted-foreground hover:text-foreground"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="col-span-3 flex items-center justify-between sm:justify-end w-full">
                      <span className="sm:hidden text-sm text-muted-foreground">小計：</span>
                      <div className="flex items-center gap-4">
                        <span className="font-medium">NT$ {(item.product.price * item.quantity).toLocaleString()}</span>
                        <button 
                          onClick={() => removeItem(item.product.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors p-1"
                          aria-label="移除商品"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="w-full lg:w-[380px]">
                <div className="bg-muted/10 border border-border/50 rounded-xl p-6 lg:p-8 sticky top-24">
                  <h2 className="text-xl font-medium tracking-tight mb-6">訂單摘要</h2>
                  
                  <div className="space-y-4 text-sm mb-6 border-b border-border/40 pb-6">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">小計</span>
                      <span className="font-medium">NT$ {subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">運費</span>
                      <span className="text-muted-foreground">結帳時計算</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mb-8">
                    <span className="font-medium">合計</span>
                    <span className="text-2xl font-semibold text-primary">NT$ {subtotal.toLocaleString()}</span>
                  </div>
                  
                  <Link href="/checkout">
                    <Button className="w-full rounded-full h-12 text-base">
                      前往結帳
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </PageTransition>
    </Layout>
  );
}
