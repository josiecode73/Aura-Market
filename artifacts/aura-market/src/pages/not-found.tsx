import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <Layout>
      <div className="min-h-[60vh] w-full flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-6xl font-semibold text-primary mb-4">404</h1>
        <p className="text-lg text-muted-foreground mb-8">找不到您要的頁面。</p>
        <Link href="/">
          <Button className="rounded-full">返回首頁</Button>
        </Link>
      </div>
    </Layout>
  );
}
