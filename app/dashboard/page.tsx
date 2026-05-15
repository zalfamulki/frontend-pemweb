"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/lobby");
  }, [router]);

  return (
    <main className="page-shell">
      <div className="neo-card" style={{ padding: 24, fontWeight: 900 }}>Membuka lobby...</div>
    </main>
  );
}
