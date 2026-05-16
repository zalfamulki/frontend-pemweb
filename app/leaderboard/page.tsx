"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { ArrowLeft, Shield, Trophy, Star, Medal, Target, TrendingUp } from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { usersAPI } from "@/lib/api";
import type { LeaderboardEntry } from "@/lib/types";

export default function LeaderboardPage() {
  const [items, setItems] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    usersAPI.getLeaderboard()
      .then((res) => {
        setItems(res.data.leaderboard || []);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Gagal memuat leaderboard");
        setLoading(false);
      });
  }, []);

  return (
    <ProtectedRoute>
      <main className="page-shell">
        <div className="mesh-bg" />
        <div className="scanline" />
        <div className="neo-container">
          <motion.nav 
            className="neo-nav"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <Link href="/lobby" className="btn btn-ghost btn-sm" style={{ padding: '0 20px' }}>
                <ArrowLeft size={18} /> <span className="hidden sm:inline">KEMBALI KE LOBBY</span>
              </Link>
              <div style={{ borderLeft: '3px solid black', paddingLeft: 20 }}>
                <h1 className="brand-font" style={{ fontSize: 36, margin: 0 }}>HALL OF FAME</h1>
              </div>
            </div>
            <motion.div 
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="btn btn-primary" 
              style={{ padding: 12, minHeight: 'auto' }}
            >
              <Trophy size={28} fill="white" />
            </motion.div>
          </motion.nav>

          <section className="neo-card glass" style={{ padding: 48, boxShadow: '16px 16px 0 black' }}>
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 12 }}
              >
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <Medal size={80} style={{ color: 'var(--c-primary)' }} />
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    style={{ position: 'absolute', top: -10, right: -10, color: 'var(--c-primary-soft)' }}
                  >
                    <Star fill="currentColor" size={32} />
                  </motion.div>
                </div>
                <h2 className="brand-font" style={{ fontSize: 64, marginBottom: 12, marginTop: 24 }}>AGEN ELITE KOTA</h2>
                <p style={{ fontWeight: 900, fontSize: 22, opacity: 0.7, maxWidth: 700, margin: '0 auto' }}>
                  Daftar detektif dengan reputasi tertinggi dan tingkat kepercayaan paling akurat dalam menangani hoaks.
                </p>
              </motion.div>
            </div>

            <div className="neo-grid" style={{ gap: 24 }}>
              <AnimatePresence mode="popLayout">
                {items.map((item, index) => (
                  <motion.article 
                    layout
                    key={item.id} 
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.05, type: "spring" }}
                    whileHover={{ x: 12, scale: 1.01 }}
                    className="stat-tile" 
                    style={{ 
                      background: index === 0 ? "var(--c-primary-soft)" : "white",
                      borderWidth: index === 0 ? '4px' : '3px',
                      boxShadow: index === 0 ? '12px 12px 0 black' : '8px 8px 0 black',
                      padding: 24
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
                        <div className="brand-font" style={{ 
                          fontSize: index < 3 ? 40 : 28, 
                          width: 80, height: 80, 
                          background: index === 0 ? 'black' : (index < 3 ? 'var(--c-ink)' : 'var(--c-bg)'), 
                          color: index < 3 ? 'white' : 'black',
                          border: '4px solid black',
                          borderRadius: 20, display: 'flex',
                          alignItems: 'center', justifyContent: 'center',
                          boxShadow: '4px 4px 0 rgba(0,0,0,0.2)'
                        }}>
                          {index + 1}
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <h2 className="brand-font" style={{ fontSize: 40, margin: 0 }}>{item.username}</h2>
                            {index === 0 && <Star fill="var(--c-primary)" size={32} className="animate-pulse" />}
                            {index > 0 && index < 3 && <Target size={24} color="var(--c-blue)" />}
                          </div>
                          <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
                            <span className="neo-badge blue" style={{ background: 'black', color: 'white', padding: '6px 16px', fontSize: 14 }}>
                              <Trophy size={16} /> {item.total_points || item.reputation || 0} REPUTASI
                            </span>
                            <span className="neo-badge green" style={{ background: 'white', padding: '6px 16px', fontSize: 14 }}>
                              <Shield size={16} /> {item.trust_score}% TRUST
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div style={{ textAlign: 'right', background: 'rgba(0,0,0,0.05)', padding: '16px 24px', borderRadius: 16, border: '2px solid black' }}>
                        <div style={{ fontSize: 12, fontWeight: 900, marginBottom: 4, opacity: 0.6, display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}>
                          <TrendingUp size={14} /> TOTAL VOTE
                        </div>
                        <div className="brand-font" style={{ fontSize: 32 }}>{item.total_votes || 0}</div>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
              
              {!loading && items.length === 0 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="neo-strip" 
                  style={{ padding: 80, textAlign: 'center', background: 'rgba(0,0,0,0.02)', borderRadius: 24, border: '4px dashed black' }}
                >
                  <Star size={64} style={{ margin: '0 auto 24px', opacity: 0.2 }} />
                  <p className="brand-font" style={{ fontSize: 32, opacity: 0.4 }}>BELUM ADA REKOR TERGOLONG.</p>
                  <p style={{ fontWeight: 800, marginTop: 12, fontSize: 18 }}>Jadilah yang pertama untuk mencapai puncak Hall of Fame!</p>
                </motion.div>
              )}
            </div>
          </section>

          <footer style={{ marginTop: 64, textAlign: 'center', paddingBottom: 64 }}>
            <div className="neo-badge" style={{ background: 'black', color: 'white', padding: '8px 24px' }}>
              DATA DIPERBARUI SECARA REAL-TIME — © 2026 TRUTH OR TRAP
            </div>
          </footer>
        </div>
      </main>
    </ProtectedRoute>
  );
}
