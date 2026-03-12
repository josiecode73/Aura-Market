import { useState } from "react";
import { Layout, PageTransition } from "@/components/layout/Layout";
import { useCartStore } from "@/store/use-cart";
import { useCreateCheckoutSession } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Lock } from "lucide-react";
import { Link } from "wouter";

export default function Checkout() {
  const { items, getTotalPrice, setCheckoutEmail } = useCartStore();
  const { mutateAsync: createSession, isPending } = useCreateCheckoutSession();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    userName: "",
    userEmail: "",
    address: ""
  });

  const subtotal = getTotalPrice();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    try {
      setCheckoutEmail(formData.userEmail);
      
      const payload = {
        userEmail: formData.userEmail,
        userName: formData.userName,
        address: formData.address,
        items: items.map(i => ({
          productId: i.product.id,
          name: i.product.name,
          price: i.product.price,
          quantity: i.quantity
        }))
      };

      const res = await createSession({ data: payload });
      if (res.url) {
        window.location.href = res.url;
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "結帳失敗",
        description: "處理訂單時發生問題，請稍後再試。",
      });
    }
  };

  if (items.length === 0) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto px-4 py-24 text-center">
          <h2 className="text-2xl font-medium mb-4">購物車是空的</h2>
          <Link href="/shop"><Button>前往購物</Button></Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageTransition>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
            
            <div className="flex-1">
              <h1 className="text-3xl font-semibold tracking-tight mb-8">結帳</h1>
              
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-6 bg-card p-6 border border-border/50 rounded-xl">
                  <h2 className="text-lg font-medium tracking-tight border-b border-border/40 pb-4">聯絡資訊</h2>
                  
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="email">電子信箱</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        required 
                        placeholder="example@email.com"
                        className="bg-background"
                        value={formData.userEmail}
                        onChange={e => setFormData(p => ({ ...p, userEmail: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6 bg-card p-6 border border-border/50 rounded-xl">
                  <h2 className="text-lg font-medium tracking-tight border-b border-border/40 pb-4">寄送資訊</h2>
                  
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">姓名</Label>
                      <Input 
                        id="name" 
                        required 
                        className="bg-background"
                        value={formData.userName}
                        onChange={e => setFormData(p => ({ ...p, userName: e.target.value }))}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="address">收件地址</Label>
                      <Input 
                        id="address" 
                        required 
                        className="bg-background"
                        placeholder="台北市信義區信義路五段 7 號"
                        value={formData.address}
                        onChange={e => setFormData(p => ({ ...p, address: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full h-14 rounded-xl text-base shadow-sm"
                  disabled={isPending}
                >
                  {isPending ? "處理中..." : "確認下單"}
                  {!isPending && <CreditCard className="w-5 h-5 ml-2" />}
                </Button>
                
                <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1">
                  <Lock className="w-3 h-3" /> 安全結帳（付款功能為模擬佔位符）
                </p>
              </form>
            </div>

            <div className="w-full lg:w-[400px]">
              <div className="bg-muted/10 border border-border/50 rounded-xl p-6 sticky top-24">
                <h2 className="text-lg font-medium tracking-tight mb-6">訂單摘要</h2>
                
                <div className="space-y-4 mb-6">
                  {items.map(item => (
                    <div key={item.product.id} className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-muted rounded overflow-hidden flex-shrink-0">
                        {item.product.image && (
                          <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium line-clamp-1">{item.product.name}</p>
                        <p className="text-xs text-muted-foreground">數量：{item.quantity}</p>
                      </div>
                      <div className="text-sm font-medium">
                        NT$ {(item.product.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 text-sm border-t border-border/40 pt-4 mb-4">
                  <div className="flex justify-between text-muted-foreground">
                    <span>小計</span>
                    <span>NT$ {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>運費</span>
                    <span>免運</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center border-t border-border/40 pt-4">
                  <span className="font-medium text-base">合計</span>
                  <span className="font-semibold text-xl text-primary">NT$ {subtotal.toLocaleString()}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </PageTransition>
    </Layout>
  );
}
