import { useState } from "react";
import { useRoute } from "wouter";
import { Layout, PageTransition } from "@/components/layout/Layout";
import { useGetProduct } from "@workspace/api-client-react";
import { useCartStore } from "@/store/use-cart";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetail() {
  const [, params] = useRoute("/product/:id");
  const productId = parseInt(params?.id || "0");
  
  const { data: product, isLoading, isError } = useGetProduct(productId);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore(state => state.addItem);
  const { toast } = useToast();

  if (isError) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-24 text-center">
          <h2 className="text-2xl font-medium">找不到此商品。</h2>
        </div>
      </Layout>
    );
  }

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
      toast({
        title: "已加入購物車",
        description: `${quantity} x ${product.name} 已加入您的購物車。`,
      });
      setQuantity(1);
    }
  };

  return (
    <Layout>
      <PageTransition>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="flex flex-col md:flex-row gap-12 lg:gap-24">
            <div className="flex-1">
              <div className="aspect-[4/5] rounded-xl overflow-hidden bg-muted/20 border border-border/50">
                {isLoading ? (
                  <Skeleton className="w-full h-full" />
                ) : product?.image ? (
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    暫無圖片
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-center">
              {isLoading ? (
                <div className="space-y-6">
                  <Skeleton className="h-10 w-3/4" />
                  <Skeleton className="h-6 w-1/4" />
                  <Skeleton className="h-24 w-full" />
                </div>
              ) : product ? (
                <>
                  <div className="mb-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    {product.category || '一般'}
                  </div>
                  <h1 className="text-4xl lg:text-5xl font-semibold tracking-tight text-foreground mb-4">
                    {product.name}
                  </h1>
                  <div className="text-2xl font-medium text-primary mb-8">
                    NT$ {product.price.toLocaleString()}
                  </div>
                  
                  <div className="prose prose-sm text-foreground/80 font-light leading-relaxed mb-10 max-w-none">
                    <p>{product.description}</p>
                  </div>

                  <div className="space-y-6 pt-8 border-t border-border/50">
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium text-foreground">數量</span>
                      <div className="flex items-center border border-border rounded-md">
                        <button 
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="px-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
                          disabled={product.stock <= 0}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                        <button 
                          onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                          className="px-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
                          disabled={product.stock <= 0 || quantity >= product.stock}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <span className="text-xs text-muted-foreground ml-2">
                        庫存 {product.stock} 件
                      </span>
                    </div>

                    <Button 
                      size="lg" 
                      className="w-full sm:w-auto px-12 rounded-full h-14 text-base"
                      onClick={handleAddToCart}
                      disabled={product.stock <= 0}
                    >
                      <ShoppingBag className="w-5 h-5 mr-2" />
                      {product.stock > 0 ? "加入購物車" : "已售完"}
                    </Button>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </PageTransition>
    </Layout>
  );
}
