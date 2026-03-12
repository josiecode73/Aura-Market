import { Link } from "wouter";
import { Product } from "@workspace/api-client-react";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.id}`} className="group block">
      <div className="flex flex-col">
        <div className="aspect-[4/5] bg-muted/10 relative overflow-hidden rounded-lg">
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.name} 
              className="object-cover w-full h-full group-hover:opacity-75 transition-opacity duration-700 ease-out"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground/40 text-sm tracking-wide">
              暫無圖片
            </div>
          )}
          {product.stock <= 0 && (
            <div className="absolute top-4 left-4 text-[11px] tracking-wider uppercase text-foreground/60">
              已售完
            </div>
          )}
        </div>
        <div className="pt-4 space-y-1">
          <h3 className="text-sm tracking-wide text-foreground/80 group-hover:text-foreground transition-colors duration-500">{product.name}</h3>
          <p className="text-[13px] text-foreground/40">NT$ {product.price.toLocaleString()}</p>
        </div>
      </div>
    </Link>
  );
}
