import { AdminLayout, AdminPageTransition } from "@/components/layout/AdminLayout";
import { useListOrders } from "@workspace/api-client-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PackageOpen } from "lucide-react";

const STATUS_MAP: Record<string, string> = {
  pending: "處理中",
  completed: "已完成",
  cancelled: "已取消",
};

export default function AdminOrders() {
  const { data: orders, isLoading } = useListOrders(undefined, { query: { enabled: true } });

  return (
    <AdminLayout>
      <AdminPageTransition>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">訂單管理</h1>
            <p className="text-muted-foreground mt-1 text-sm">查看及管理所有顧客訂單。</p>
          </div>

          <div className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-sm shadow-black/5">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="w-[100px]">訂單編號</TableHead>
                  <TableHead>日期</TableHead>
                  <TableHead>顧客信箱</TableHead>
                  <TableHead>姓名</TableHead>
                  <TableHead>商品</TableHead>
                  <TableHead>狀態</TableHead>
                  <TableHead className="text-right">金額</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
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
                      <TableCell className="text-sm">{order.userEmail}</TableCell>
                      <TableCell className="text-sm">{(order as any).userName || "-"}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <PackageOpen className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{order.items?.length || 0} 件</span>
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
                    <TableCell colSpan={7} className="h-48 text-center text-muted-foreground bg-muted/5">
                      目前尚無訂單。
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </AdminPageTransition>
    </AdminLayout>
  );
}
