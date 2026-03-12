import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminAuth, CREDENTIALS } from "@/store/use-admin-auth";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff } from "lucide-react";

export default function AdminLogin() {
  const [, navigate] = useLocation();
  const { login } = useAdminAuth();
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(username, password);
    if (success) {
      toast({ title: "登入成功", description: "歡迎進入管理後台。" });
      navigate("/admin/products");
    } else {
      setError(true);
      toast({ variant: "destructive", title: "登入失敗", description: "帳號或密碼錯誤，請重新輸入。" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-foreground/5 mb-6">
            <Lock className="w-5 h-5 text-foreground/40" strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-extralight tracking-[0.1em] text-foreground">管理後台</h1>
          <p className="text-[13px] text-foreground/35 mt-2 tracking-wide">Aura Market</p>
        </div>

        <div className="bg-[#355872]/5 border border-[#355872]/10 rounded-lg p-4 mb-8">
          <p className="text-[12px] tracking-wide text-[#355872]/70 mb-2 font-medium">登入資訊</p>
          <div className="space-y-1 text-[13px] text-[#355872]">
            <p>帳號：<span className="font-mono font-medium tracking-wider">{CREDENTIALS.username}</span></p>
            <p>密碼：<span className="font-mono font-medium tracking-wider">{CREDENTIALS.password}</span></p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-[13px] tracking-wide text-foreground/50">帳號</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError(false); }}
              placeholder="請輸入帳號"
              className={`h-11 bg-background border-border/30 rounded-lg text-sm ${error ? "border-destructive" : ""}`}
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-[13px] tracking-wide text-foreground/50">密碼</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(false); }}
                placeholder="請輸入密碼"
                className={`h-11 bg-background border-border/30 rounded-lg text-sm pr-10 ${error ? "border-destructive" : ""}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/30 hover:text-foreground/60 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-[12px] text-destructive tracking-wide">帳號或密碼錯誤，請重新輸入。</p>
          )}

          <Button type="submit" className="w-full h-11 rounded-lg text-sm tracking-wide mt-2">
            登入後台
          </Button>
        </form>

        <div className="mt-8 text-center">
          <a href="/" className="text-[12px] tracking-wide text-foreground/30 hover:text-foreground/60 transition-colors duration-500">
            返回首頁
          </a>
        </div>
      </motion.div>
    </div>
  );
}
