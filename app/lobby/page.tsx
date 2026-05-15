"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { DoorOpen, LogOut, Plus, RefreshCcw, Trophy, Users } from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { roomsAPI, usersAPI } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import type { LeaderboardEntry, Room } from "@/lib/types";

export default function LobbyPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [name, setName] = useState("Ruang Redaksi Malam");
  const [maxPlayers, setMaxPlayers] = useState(6);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [roomRes, lbRes] = await Promise.all([
        roomsAPI.getAll(),
        usersAPI.getLeaderboard().catch(() => ({ data: { leaderboard: [] } })),
      ]);
      setRooms(roomRes.data.rooms || []);
      setLeaderboard(lbRes.data.leaderboard || []);
    } catch {
      toast.error("Gagal memuat lobby");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      try {
        const [roomRes, lbRes] = await Promise.all([
          roomsAPI.getAll(),
          usersAPI.getLeaderboard().catch(() => ({ data: { leaderboard: [] } })),
        ]);
        if (cancelled) return;
        setRooms(roomRes.data.rooms || []);
        setLeaderboard(lbRes.data.leaderboard || []);
      } catch {
        if (!cancelled) toast.error("Gagal memuat lobby");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => { cancelled = true; };
  }, []);

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
      toast.error("Gagal join room");
    }
  };

  return (
    <ProtectedRoute>
      <main className="page-shell">
        <div className="neo-container">
          <nav className="neo-nav">
            <div>
              <div className="brand-font" style={{ fontSize: 28 }}>TRUTH OR TRAP LOBBY</div>
              <div style={{ fontWeight: 800 }}>Halo, {user?.username}. Pilih room dan mulai cerita bercabang.</div>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link className="btn btn-green btn-sm" href="/leaderboard"><Trophy size={16} /> Leaderboard</Link>
              <button className="btn btn-ghost btn-sm" onClick={logout}><LogOut size={16} /> Logout</button>
            </div>
          </nav>

          <section className="neo-grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", marginBottom: 22 }}>
            <div className="stat-tile" style={{ background: "var(--c-blue)" }}><Users size={26} /><div className="brand-font" style={{ fontSize: 32 }}>{activeRooms.length}</div><strong>Room aktif</strong></div>
            <div className="stat-tile" style={{ background: "var(--c-green)" }}><Trophy size={26} /><div className="brand-font" style={{ fontSize: 32 }}>{user?.reputation ?? 0}</div><strong>Reputasi kamu</strong></div>
            <div className="stat-tile" style={{ background: "var(--c-pink)" }}><DoorOpen size={26} /><div className="brand-font" style={{ fontSize: 32 }}>2+</div><strong>Minimum pemain</strong></div>
          </section>

          <div className="neo-grid" style={{ gridTemplateColumns: "minmax(0,1.35fr) minmax(280px,.65fr)", alignItems: "start" }}>
            <section className="neo-card" style={{ padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 14 }}>
                <h1 className="brand-font" style={{ fontSize: 34, margin: 0 }}>MULTIPLAYER ROOM</h1>
                <button className="btn btn-blue btn-sm" onClick={loadData}><RefreshCcw size={16} /> Refresh</button>
              </div>

              <form onSubmit={createRoom} className="neo-panel" style={{ padding: 14, background: "var(--c-primary-soft)", marginBottom: 18 }}>
                <div className="neo-grid" style={{ gridTemplateColumns: "minmax(220px,1fr) 120px auto", alignItems: "end" }}>
                  <div>
                    <label className="label">Nama room</label>
                    <input className="input" value={name} onChange={(event) => setName(event.target.value)} />
                  </div>
                  <div>
                    <label className="label">Pemain</label>
                    <input className="input" type="number" min={2} max={10} value={maxPlayers} onChange={(event) => setMaxPlayers(Number(event.target.value))} />
                  </div>
                  <button className="btn btn-primary" disabled={creating}><Plus size={18} /> Buat</button>
                </div>
              </form>

              {loading ? <p style={{ fontWeight: 900 }}>Memuat room...</p> : (
                <div className="neo-grid">
                  {activeRooms.map((room) => (
                    <article key={room.id} className="stat-tile">
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                        <div>
                          <h2 className="brand-font" style={{ fontSize: 24, margin: 0 }}>{room.name}</h2>
                          <p style={{ margin: "4px 0", fontWeight: 800 }}>Kode: {room.code} | Host: {room.host_name || "-"}</p>
                          <span className={`neo-badge ${room.status === "active" ? "red" : "green"}`}>{room.status}</span>
                          <span className="neo-badge blue" style={{ marginLeft: 8 }}>{room.player_count || 0}/{room.max_players} pemain</span>
                        </div>
                        <button className="btn btn-green" onClick={() => joinRoom(room.id)}><DoorOpen size={18} /> Join</button>
                      </div>
                    </article>
                  ))}
                  {activeRooms.length === 0 && <div className="neo-strip" style={{ padding: 18, fontWeight: 900 }}>Belum ada room. Buat room pertama.</div>}
                </div>
              )}
            </section>

            <aside className="neo-card" style={{ padding: 20 }}>
              <h2 className="brand-font" style={{ fontSize: 28, marginTop: 0 }}>TOP PLAYER</h2>
              <div className="neo-grid">
                {leaderboard.slice(0, 8).map((entry, index) => (
                  <div key={entry.id} className="neo-panel" style={{ padding: 12, background: "white", fontWeight: 900 }}>
                    #{index + 1} {entry.username}
                    <div className="mini-text">{entry.total_points || entry.reputation || 0} poin | Trust {entry.trust_score}</div>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
