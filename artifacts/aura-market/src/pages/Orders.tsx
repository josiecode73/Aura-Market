import { useState } from "react";
import { Layout, PageTransition } from "@/components/layout/Layout";
import { useListOrders } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, PackageOpen } from "lucide-react";

const STATUS_MAP: Record<string, string> = {
  pending: "處理中",
  completed: "已完成",
  cancelled: "已取消",
};

export default function Orders() {
  const [searchEmail, setSearchEmail] = useState("");
  const [emailToFetch, setEmailToFetch] = useState("");
  
  const { data: orders, isLoading } = useListOrders(
    emailToFetch ? { email: emailToFetch } : undefined,
    { query: { enabled: true } } 
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailToFetch(searchEmail);
  };

  return (
    <Layout>
      <PageTransition>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b border-border/40 pb-8">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">訂單查詢</h1>
              <p className="text-muted-foreground mt-2 font-light">查看您的歷史訂單紀錄。</p>
            </div>
            
            <form onSubmit={handleSearch} className="flex w-full md:w-auto max-w-sm items-center space-x-2">
              <Input 
                type="email" 
                placeholder="輸入電子信箱查詢..." 
                value={searchEmail}
                onChange={e => setSearchEmail(e.target.value)}
                className="bg-background"
              />
              <Button type="submit" variant="secondary">
                <Search className="w-4 h-4 mr-2" />
                查詢
              </Button>
            </form>
          </div>

          <div className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-sm shadow-black/5">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="w-[100px]">訂單編號</TableHead>
                  <TableHead>日期</TableHead>
                  <TableHead>電子信箱</TableHead>
                  <TableHead>商品</TableHead>
                  <TableHead>狀態</TableHead>
                  <TableHead className="text-right">金額</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                      載入中...
                    </TableCell>
                  </TableRow>
                ) : orders && orders.length > 0 ? (
                  orders.map(order => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">#{order.id}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString('zh-TW')}
                      </TableCell>
                      <TableCell>{order.userEmail}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <PackageOpen className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">
                            {order.items?.length || 0} 件商品
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={order.status === 'completed' ? 'default' : 'secondary'}
                          className="capitalize font-medium"
                        >
                          {STATUS_MAP[order.status] || order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium text-primary">
                        NT$ {order.totalPrice.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-48 text-center text-muted-foreground bg-muted/5">
                      尚無訂單紀錄。請輸入電子信箱搜尋您的訂單。
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </PageTransition>
    </Layout>
  );
}
