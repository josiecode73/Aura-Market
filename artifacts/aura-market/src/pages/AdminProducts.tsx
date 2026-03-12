import { useState } from "react";
import { AdminLayout, AdminPageTransition } from "@/components/layout/AdminLayout";
import { useListProducts, useCreateProduct, useUpdateProduct, useDeleteProduct, Product } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export default function AdminProducts() {
  const queryClient = useQueryClient();
  const { data: products, isLoading } = useListProducts();
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    image: "",
    category: ""
  });

  const resetForm = () => {
    setFormData({ name: "", description: "", price: "", stock: "", image: "", category: "" });
    setEditingProduct(null);
  };

  const handleOpenEdit = (prod: Product) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name,
      description: prod.description,
      price: prod.price.toString(),
      stock: prod.stock.toString(),
      image: prod.image || "",
      category: prod.category || ""
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock, 10),
      image: formData.image || null,
      category: formData.category || null
    };

    try {
      if (editingProduct) {
        await updateMutation.mutateAsync({ id: editingProduct.id, data: payload });
        toast({ title: "商品已更新" });
      } else {
        await createMutation.mutateAsync({ data: payload });
        toast({ title: "商品已新增" });
      }
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setIsDialogOpen(false);
      resetForm();
    } catch (err) {
      toast({ variant: "destructive", title: "儲存失敗", description: "請檢查輸入資料後再試一次。" });
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("確定要刪除這個商品嗎？")) {
      try {
        await deleteMutation.mutateAsync({ id });
        queryClient.invalidateQueries({ queryKey: ["/api/products"] });
        toast({ title: "商品已刪除" });
      } catch (err) {
        toast({ variant: "destructive", title: "刪除失敗" });
      }
    }
  };

  return (
    <AdminLayout>
      <AdminPageTransition>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">商品管理</h1>
              <p className="text-muted-foreground mt-1 text-sm">管理店鋪商品庫存與資訊。</p>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
              if(!open) resetForm();
              setIsDialogOpen(open);
            }}>
              <DialogTrigger asChild>
                <Button className="rounded-full shadow-sm">
                  <Plus className="w-4 h-4 mr-2" />
                  新增商品
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] border-border/50">
                <DialogHeader>
                  <DialogTitle>{editingProduct ? "編輯商品" : "新增商品"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="name">商品名稱</Label>
                      <Input id="name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">價格（NT$）</Label>
                      <Input id="price" type="number" step="0.01" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stock">庫存數量</Label>
                      <Input id="stock" type="number" required value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
                    </div>
                    <div className="space-y-2 col-span-2 sm:col-span-1">
                      <Label htmlFor="category">分類</Label>
                      <Input id="category" placeholder="服飾、配件、居家..." value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
                    </div>
                    <div className="space-y-2 col-span-2 sm:col-span-1">
                      <Label htmlFor="image">圖片網址</Label>
                      <Input id="image" type="url" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="description">商品描述</Label>
                      <Textarea id="description" required rows={3} className="resize-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                    </div>
                  </div>
                  <div className="pt-4 flex justify-end gap-3">
                    <Button type="button" variant="outline" onClick={() => { setIsDialogOpen(false); resetForm(); }}>
                      取消
                    </Button>
                    <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                      {editingProduct ? "儲存變更" : "新增商品"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-sm shadow-black/5">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="w-[80px]">圖片</TableHead>
                  <TableHead>商品名稱</TableHead>
                  <TableHead>分類</TableHead>
                  <TableHead className="text-right">價格</TableHead>
                  <TableHead className="text-right">庫存</TableHead>
                  <TableHead className="text-right w-[100px]">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                      載入中...
                    </TableCell>
                  </TableRow>
                ) : products && products.length > 0 ? (
                  products.map(product => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="w-10 h-10 bg-muted rounded overflow-hidden">
                          {product.image && <img src={product.image} className="w-full h-full object-cover" alt="" />}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell className="text-muted-foreground">{product.category || "-"}</TableCell>
                      <TableCell className="text-right font-medium text-primary">NT$ {product.price.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <span className={product.stock <= 0 ? "text-destructive" : ""}>{product.stock}</span>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(product)} className="h-8 w-8 text-muted-foreground hover:text-primary">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)} className="h-8 w-8 text-muted-foreground hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-48 text-center text-muted-foreground bg-muted/5">
                      尚無商品。點擊「新增商品」開始建立。
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
