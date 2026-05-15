"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { initAuth, isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => { initAuth(); }, [initAuth]);
  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace("/login");
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <main className="page-shell">
        <div className="neo-card" style={{ padding: 24, fontWeight: 900 }}>Loading...</div>
      </main>
    );
  }

  return <>{children}</>;
}
