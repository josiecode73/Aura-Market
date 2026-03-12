import { ReactNode } from "react";
import { Redirect } from "wouter";
import { useAdminAuth } from "@/store/use-admin-auth";

export function AdminGuard({ children }: { children: ReactNode }) {
  const isAuthenticated = useAdminAuth((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Redirect to="/admin/login" />;
  }

  return <>{children}</>;
}
