"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { ArrowLeft, Shield, Trophy } from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { usersAPI } from "@/lib/api";
import type { LeaderboardEntry } from "@/lib/types";

export default function LeaderboardPage() {
  const [items, setItems] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    usersAPI.getLeaderboard()
      .then((res) => setItems(res.data.leaderboard || []))
      .catch(() => toast.error("Gagal memuat leaderboard"));
  }, []);

  return (
    <ProtectedRoute>
      <main className="page-shell">
        <div className="neo-container">
          <nav className="neo-nav">
            <div>
              <Link href="/lobby" className="btn btn-ghost btn-sm"><ArrowLeft size={16} /> Lobby</Link>
              <h1 className="brand-font" style={{ fontSize: 42, margin: "14px 0 0" }}>LEADERBOARD</h1>
            </div>
          </nav>

          <section className="neo-card" style={{ padding: 22 }}>
            <div className="neo-grid">
              {items.map((item, index) => (
                <article key={item.id} className="stat-tile" style={{ background: index === 0 ? "var(--c-primary-soft)" : "white" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                    <div>
                      <span className="neo-badge blue">#{index + 1}</span>
                      <h2 className="brand-font" style={{ fontSize: 28, margin: "8px 0 4px" }}>{item.username}</h2>
                      <strong><Trophy size={18} /> {item.total_points || item.reputation || 0} poin</strong>
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <span className="neo-badge green"><Shield size={14} /> Trust {item.trust_score}</span>
                      <span className="neo-badge yellow">{item.total_votes || 0} vote</span>
                    </div>
                  </div>
                </article>
              ))}
              {items.length === 0 && <div className="neo-strip" style={{ padding: 18, fontWeight: 900 }}>Belum ada data skor.</div>}
            </div>
          </section>
        </div>
      </main>
    </ProtectedRoute>
  );
}
