import { useState } from "react";
import { Layout, PageTransition } from "@/components/layout/Layout";
import { ProductCard } from "@/components/ProductCard";
import { useListProducts } from "@workspace/api-client-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ListProductsSort } from "@workspace/api-client-react";

const CATEGORIES = [
  { value: "All", label: "全部" },
  { value: "服飾", label: "服飾" },
  { value: "配件", label: "配件" },
  { value: "居家", label: "居家" },
  { value: "生活美學", label: "生活美學" },
];

export default function Shop() {
  const [category, setCategory] = useState<string>("All");
  const [sort, setSort] = useState<ListProductsSort>("name_asc");

  const queryParams = {
    category: category === "All" ? undefined : category,
    sort: sort
  };

  const { data: products, isLoading } = useListProducts(queryParams);

  return (
    <Layout>
      <PageTransition>
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-16 lg:py-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 lg:mb-20">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extralight tracking-wide text-foreground">所有商品</h1>
              <p className="text-foreground/35 mt-3 font-light text-[13px] tracking-wide">探索我們精心挑選的系列。</p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.value}
                    className={`text-[12px] tracking-[0.1em] uppercase px-4 py-2 rounded-lg transition-all duration-500 ${
                      category === cat.value 
                        ? "bg-foreground text-background" 
                        : "text-foreground/40 hover:text-foreground"
                    }`}
                    onClick={() => setCategory(cat.value)}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
              <div className="w-[140px]">
                <Select value={sort} onValueChange={(v) => setSort(v as ListProductsSort)}>
                  <SelectTrigger className="rounded-lg border-border/30 text-[12px] tracking-wide text-foreground/50 h-9">
                    <SelectValue placeholder="排序" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name_asc">名稱 A-Z</SelectItem>
                    <SelectItem value="price_asc">價格：低到高</SelectItem>
                    <SelectItem value="price_desc">價格：高到低</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-12 lg:gap-x-8 lg:gap-y-16">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-[4/5] bg-muted/15 animate-pulse rounded-lg"></div>
              ))}
            </div>
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-12 lg:gap-x-8 lg:gap-y-16">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-32">
              <p className="text-foreground/35 font-light tracking-wide">找不到符合條件的商品。</p>
              <button 
                onClick={() => setCategory("All")} 
                className="mt-6 text-[12px] tracking-[0.15em] uppercase text-foreground/40 border-b border-foreground/15 pb-0.5 hover:text-foreground hover:border-foreground/40 transition-all duration-500"
              >
                清除篩選
              </button>
            </div>
          )}
        </div>
      </PageTransition>
    </Layout>
  );
}
