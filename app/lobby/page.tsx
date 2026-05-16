"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { 
  DoorOpen, LogOut, Plus, RefreshCcw, Trophy, Users, 
  Search, Shield, Zap, TrendingUp, Sparkles 
} from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { roomsAPI, usersAPI } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import type { LeaderboardEntry, Room } from "@/lib/types";

export default function LobbyPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [name, setName] = useState("Investigasi Malam");
  const [maxPlayers, setMaxPlayers] = useState(6);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [roomRes, lbRes] = await Promise.all([
        roomsAPI.getAll(),
        usersAPI.getLeaderboard().catch(() => ({ data: { leaderboard: [] } })),
      ]);
      setRooms(roomRes.data.rooms || []);
      setLeaderboard(lbRes.data.leaderboard || []);
    } catch {
      toast.error("Gagal memuat data lobby");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, [loadData]);

  const activeRooms = useMemo(() => rooms.filter((room) => room.status !== "closed"), [rooms]);

  const createRoom = async (event: React.FormEvent) => {
    event.preventDefault();
    if (name.trim().length < 3) return toast.error("Nama room minimal 3 karakter");
    setCreating(true);
    try {
      const res = await roomsAPI.create({ name, max_players: maxPlayers, is_private: 0 });
      router.push(`/rooms/${res.data.roomId}`);
    } catch {
      toast.error("Gagal membuat room");
    } finally {
      setCreating(false);
    }
  };

  const joinRoom = async (roomId: number) => {
    try {
      await roomsAPI.join(roomId);
      router.push(`/rooms/${roomId}`);
    } catch {
      toast.error("Gagal bergabung ke room");
    }
  };

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
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <motion.div 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="btn btn-primary" 
                style={{ padding: 10, minHeight: 'auto' }}
              >
                <Shield size={24} fill="white" />
              </motion.div>
              <div>
                <div className="brand-font" style={{ fontSize: 24 }}>LOBBY UTAMA</div>
                <div style={{ fontWeight: 800, fontSize: 14 }}>Status: <span style={{ color: 'var(--c-primary)' }}>Agen Investigasi</span></div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <Link className="btn btn-green" href="/leaderboard">
                <Trophy size={18} /> <span className="hidden sm:inline">Peringkat</span>
              </Link>
              <button className="btn btn-ghost" onClick={logout}>
                <LogOut size={18} /> <span className="hidden sm:inline">Keluar</span>
              </button>
            </div>
          </motion.nav>

          <motion.section 
            className="neo-grid" 
            style={{ gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", marginBottom: 32, gap: 24 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div whileHover={{ scale: 1.05, rotate: 1 }} className="stat-tile" style={{ background: "var(--c-blue)", boxShadow: '8px 8px 0 black' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Users size={32} />
                <TrendingUp size={20} />
              </div>
              <div className="brand-font" style={{ fontSize: 48, margin: "10px 0" }}>{activeRooms.length}</div>
              <strong style={{ fontSize: 18 }}>INVESTIGASI AKTIF</strong>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05, rotate: -1 }} className="stat-tile" style={{ background: "var(--c-green)", boxShadow: '8px 8px 0 black' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Zap size={32} />
                <Sparkles size={20} />
              </div>
              <div className="brand-font" style={{ fontSize: 48, margin: "10px 0" }}>{user?.reputation ?? 0}</div>
              <strong style={{ fontSize: 18 }}>SKOR REPUTASI</strong>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05, rotate: 1 }} className="stat-tile" style={{ background: "var(--c-pink)", boxShadow: '8px 8px 0 black' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Shield size={32} />
                <TrendingUp size={20} />
              </div>
              <div className="brand-font" style={{ fontSize: 48, margin: "10px 0" }}>{user?.trust_score ?? 100}</div>
              <strong style={{ fontSize: 18 }}>TINGKAT KEPERCAYAAN</strong>
            </motion.div>
          </motion.section>

          <div className="game-layout">
            <section className="neo-card glass" style={{ padding: 32, boxShadow: '12px 12px 0 black' }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ background: 'black', padding: 12, borderRadius: 14, boxShadow: '4px 4px 0 rgba(0,0,0,0.2)' }}>
                    <Search size={24} color="white" />
                  </div>
                  <h1 className="brand-font" style={{ fontSize: 40, margin: 0 }}>CARI OPERASI</h1>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.1, rotate: 180 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="btn btn-blue" 
                  onClick={loadData}
                  style={{ width: 54, height: 54, padding: 0 }}
                >
                  <RefreshCcw size={22} className={loading ? "animate-spin" : ""} />
                </motion.button>
              </div>

              <motion.form 
                onSubmit={createRoom} 
                className="neo-panel" 
                style={{ padding: 28, background: "var(--c-primary-soft)", marginBottom: 40, boxShadow: '8px 8px 0 black' }}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
              >
                <h3 className="brand-font" style={{ marginBottom: 20, fontSize: 24 }}>MULAI OPERASI BARU</h3>
                <div className="neo-grid" style={{ gridTemplateColumns: "1fr auto auto", alignItems: "end", gap: 20 }}>
                  <div>
                    <label className="label" style={{ fontWeight: 900, fontSize: 14, display: 'block', marginBottom: 8 }}>NAMA OPERASI</label>
                    <input className="input" placeholder="Masukkan nama operasi..." value={name} onChange={(event) => setName(event.target.value)} />
                  </div>
                  <div>
                    <label className="label" style={{ fontWeight: 900, fontSize: 14, display: 'block', marginBottom: 8 }}>AGEN MAX</label>
                    <input className="input" type="number" min={2} max={10} value={maxPlayers} onChange={(event) => setMaxPlayers(Number(event.target.value))} />
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.05, rotate: 1 }} 
                    whileTap={{ scale: 0.95 }} 
                    className="btn btn-primary" 
                    style={{ height: 58, padding: '0 32px' }} 
                    disabled={creating}
                  >
                    <Plus size={24} fill="white" /> <span className="hidden sm:inline">BUAT ROOM</span>
                  </motion.button>
                </div>
              </motion.form>

              <div className="neo-grid" style={{ gap: 20 }}>
                <AnimatePresence mode="popLayout">
                  {activeRooms.map((room, idx) => (
                    <motion.article 
                      layout
                      key={room.id} 
                      initial={{ scale: 0.9, opacity: 0, x: -20 }}
                      animate={{ scale: 1, opacity: 1, x: 0 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ x: 8, rotate: 0.5 }}
                      className="stat-tile"
                      style={{ background: 'white', padding: 24, boxShadow: '6px 6px 0 black' }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24 }}>
                        <div style={{ flex: 1 }}>
                          <h2 className="brand-font" style={{ fontSize: 28, margin: 0 }}>{room.name}</h2>
                          <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                            <span className="neo-badge yellow" style={{ fontWeight: 900 }}>ID: {room.code}</span>
                            <span className="neo-badge blue" style={{ fontWeight: 900 }}>{room.player_count || 0}/{room.max_players} AGEN</span>
                            <span className={`neo-badge ${room.status === "active" ? "red" : "green"}`} style={{ fontWeight: 900 }}>
                              {room.status === 'active' ? 'BERJALAN' : 'STANDBY'}
                            </span>
                          </div>
                          <div style={{ marginTop: 12, fontSize: 14, fontWeight: 900, opacity: 0.5, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'black' }} /> Host: {room.host_name || "Sistem"}
                          </div>
                        </div>
                        <motion.button 
                          whileHover={{ scale: 1.1, rotate: -2 }}
                          whileTap={{ scale: 0.9 }}
                          className="btn btn-green" 
                          style={{ height: 64, padding: "0 32px", fontSize: 18 }}
                          onClick={() => joinRoom(room.id)}
                        >
                          <DoorOpen size={24} /> MASUK
                        </motion.button>
                      </div>
                    </motion.article>
                  ))}
                </AnimatePresence>
                {!loading && activeRooms.length === 0 && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="neo-strip" 
                    style={{ padding: 64, textAlign: 'center', background: 'rgba(0,0,0,0.02)', borderRadius: 20, border: '3px dashed black' }}
                  >
                    <Search size={64} style={{ margin: '0 auto 24px', opacity: 0.2 }} />
                    <p className="brand-font" style={{ fontSize: 24, opacity: 0.5 }}>TIDAK ADA OPERASI AKTIF.</p>
                    <p style={{ fontWeight: 800, marginTop: 8 }}>Silakan buat operasi baru untuk memulai investigasi.</p>
                  </motion.div>
                )}
              </div>
            </section>

            <aside className="neo-card glass" style={{ padding: 28, boxShadow: '8px 8px 0 black' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                <div style={{ background: 'var(--c-primary-soft)', padding: 10, borderRadius: 12, border: '3px solid black' }}>
                  <Trophy size={28} color="black" />
                </div>
                <h2 className="brand-font" style={{ fontSize: 28, margin: 0 }}>AGEN TERBAIK</h2>
              </div>
              <div className="neo-grid" style={{ gap: 16 }}>
                {leaderboard.slice(0, 6).map((entry, index) => (
                  <motion.div 
                    key={entry.id} 
                    className="neo-panel" 
                    initial={{ x: 30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ x: -4, rotate: index % 2 === 0 ? 1 : -1 }}
                    style={{ 
                      padding: 18, background: "white", display: 'flex', 
                      justifyContent: 'space-between', alignItems: 'center',
                      boxShadow: '4px 4px 0 black'
                    }}
                  >
                    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                      <div className="brand-font" style={{ 
                        width: 36, height: 36, background: index === 0 ? 'var(--c-primary-soft)' : 'var(--c-bg)', 
                        border: '3px solid black', borderRadius: 10, display: 'flex', 
                        alignItems: 'center', justifyContent: 'center', fontSize: 16 
                      }}>
                        {index + 1}
                      </div>
                      <div>
                        <div style={{ fontWeight: 900, fontSize: 18 }}>{entry.username}</div>
                        <div style={{ fontSize: 12, fontWeight: 800, opacity: 0.6 }}>Trust {entry.trust_score}%</div>
                      </div>
                    </div>
                    <div className="brand-font" style={{ fontSize: 20, color: 'var(--c-primary)' }}>
                      {entry.total_points || entry.reputation || 0}
                    </div>
                  </motion.div>
                ))}
              </div>
              <Link href="/leaderboard" className="btn btn-ghost" style={{ width: '100%', marginTop: 32, height: 54 }}>
                LIHAT SEMUA AGEN
              </Link>
            </aside>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
