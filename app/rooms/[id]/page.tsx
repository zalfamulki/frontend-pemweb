"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { 
  ArrowLeft, Crown, MessageSquare, Play, Radio, Send, 
  Timer, Users, Vote, WifiOff, Terminal, ShieldAlert, Trophy 
} from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useRealtimeRoom } from "@/hooks/useRealtimeRoom";
import { useAuthStore } from "@/lib/store";

export default function GameRoomPage() {
  const params = useParams<{ id: string }>();
  const roomId = Number(params.id);
  const { user } = useAuthStore();
  const { room, state, messages, typingUsers, connected, actions } = useRealtimeRoom(roomId, user?.id);
  const [chat, setChat] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typingUsers]);

  useEffect(() => {
    if (state.phase === "ended") {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff5a36', '#39a0ff', '#47d16c', '#ffb000']
      });
    }
  }, [state.phase]);

  const authoritativeHostId = state.hostId ?? room?.host_id ?? null;
  const isHost = authoritativeHostId === user?.id;
  const isReady = Boolean(user?.id && state.ready[String(user.id)]);
  const allReady = state.members.length > 0 && state.members.every((member) => state.ready[String(member.id)]);
  const canStart = isHost && allReady && state.members.length >= 2 && state.phase === "waiting";
  
  const totalVotes = useMemo(() => 
    Object.values(state.votes?.tally || {}).reduce((sum, value) => sum + value, 0), 
    [state.votes]
  );
  
  const voteProgress = state.members.length ? Math.min(100, (totalVotes / state.members.length) * 100) : 0;
  const myVote = user?.id ? state.votes?.byUser?.[String(user.id)] || state.myVote : null;

  const sendMessage = (event: React.FormEvent) => {
    event.preventDefault();
    if (!chat.trim()) return;
    actions.sendMessage(chat);
    actions.setTyping(false);
    setChat("");
  };

  const phaseConfig = {
    waiting: { title: "Lobby", color: "var(--c-blue)", icon: Users },
    story_intro: { title: "Intro", color: "var(--c-violet)", icon: Terminal },
    discussion_phase: { title: "Diskusi", color: "var(--c-primary-soft)", icon: MessageSquare },
    voting_phase: { title: "Voting", color: "var(--c-primary)", icon: Vote },
    voting: { title: "Voting", color: "var(--c-primary)", icon: Vote },
    result_phase: { title: "Hasil", color: "var(--c-green)", icon: ShieldAlert },
    result: { title: "Hasil", color: "var(--c-green)", icon: ShieldAlert },
    ended: { title: "Selesai", color: "var(--c-ink)", icon: Trophy },
  };

  const currentPhase = phaseConfig[state.phase] || phaseConfig.waiting;

  return (
    <ProtectedRoute>
      <main className="page-shell">
        <div className="mesh-bg" />
        <div className="scanline" />

        <motion.div 
          className="neo-container"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", damping: 20 }}
        >
          <motion.nav 
            className="neo-nav"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <motion.div
                whileHover={{ x: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link href="/lobby" className="btn btn-ghost btn-sm" style={{ padding: "0 12px", minHeight: 40, boxShadow: '4px 4px 0 black' }}>
                  <ArrowLeft size={16} /> <span className="hidden sm:inline" style={{ fontSize: 13 }}>Keluar Ke Lobby</span>
                </Link>
              </motion.div>
              <div style={{ borderLeft: '3px solid black', paddingLeft: 16 }}>
                <div className="brand-font" style={{ fontSize: 28, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>{room?.name || "Investigasi Malam"}</div>
                <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
                  <AnimatePresence mode="wait">
                    <motion.div 
                      key={state.phase}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="status-pill"
                      style={{ 
                        padding: '8px 16px',
                        fontSize: 13,
                        color: currentPhase.color === 'var(--c-primary-soft)' ? '#854d0e' : (currentPhase.color === 'var(--c-blue)' ? '#1e40af' : (state.phase === 'ended' ? '#166534' : 'inherit')),
                        borderColor: 'currentColor',
                        background: 'white'
                      }}
                    >
                      <div className="indicator-dot" style={{ color: currentPhase.color, width: 10, height: 10 }} />
                      <currentPhase.icon size={16} />
                      <span style={{ textTransform: 'uppercase', fontWeight: 900 }}>{currentPhase.title}</span>
                    </motion.div>
                  </AnimatePresence>

                  <div className={`status-pill ${connected ? "connected" : "disconnected"}`} 
                       style={{ 
                         padding: '8px 16px',
                         fontSize: 13,
                         color: connected ? '#166534' : '#991b1b',
                         borderColor: 'currentColor',
                         background: 'white'
                       }}>
                    <div className="indicator-dot" style={{ color: connected ? '#47d16c' : '#ef2d56', width: 10, height: 10 }} />
                    {connected ? <Radio size={16} /> : <WifiOff size={16} />} 
                    <span style={{ textTransform: 'uppercase', fontWeight: 900 }}>{connected ? "TERKONEKSI" : "OFFLINE"}</span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              {state.phase === "waiting" && (
                <>
                  <motion.button 
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className={`btn ${isReady ? "btn-green" : "btn-pink"}`} 
                    onClick={() => actions.setReady(!isReady)}
                    style={{ height: 54, boxShadow: '6px 6px 0 black' }}
                  >
                    {isReady ? "SIAP ✓" : "TANDAI SIAP"}
                  </motion.button>
                  {isHost && (
                    <motion.button 
                      whileHover={canStart ? { y: -2 } : {}}
                      whileTap={canStart ? { scale: 0.98 } : {}}
                      className="btn btn-primary" 
                      disabled={!canStart} 
                      onClick={actions.startGame}
                      style={{ height: 54, boxShadow: '6px 6px 0 black' }}
                    >
                      <Play size={20} fill="white" /> MULAI GAME
                    </motion.button>
                  )}
                </>
              )}
            </div>
          </motion.nav>

          <div className="game-layout">
            <motion.section 
              layout
              className="neo-card story-stage glass"
              style={{ padding: 0, minHeight: 650, boxShadow: '12px 12px 0 black' }}
            >
              <div style={{ 
                padding: '16px 24px', borderBottom: '3px solid black', 
                display: 'flex', justifyContent: 'space-between', 
                background: 'rgba(0,0,0,0.05)', alignItems: 'center' 
              }}>
                <div style={{ display: 'flex', gap: 12 }}>
                  <span className="neo-badge yellow" style={{ fontSize: 16, padding: '6px 14px' }}>
                    <Timer size={18} /> {state.timer}s
                  </span>
                  <span className="neo-badge pink" style={{ fontSize: 16, padding: '6px 14px' }}>
                    <Users size={18} /> {state.members.length} AGEN
                  </span>
                </div>
                {state.phase.includes('voting') && (
                  <motion.div 
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="neo-badge blue" 
                    style={{ fontSize: 16, padding: '6px 14px' }}
                  >
                    <Vote size={18} /> {totalVotes}/{state.members.length} VOTE MASUK
                  </motion.div>
                )}
              </div>

              <div style={{ padding: 48, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={state.phase + (state.scenario?.id || '')}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ type: "spring", damping: 25 }}
                  >
                    {state.phase === "waiting" && (
                      <div className="story-copy">
                        <motion.div 
                          className="neo-badge violet" 
                          style={{ marginBottom: 24 }}
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                        >
                          OPERASI SIAGA
                        </motion.div>
                        <h1 className="brand-font story-title" style={{ fontSize: 72 }}>SIAPKAN TIM INVESTIGASI.</h1>
                        <p className="story-text" style={{ fontSize: 26 }}>
                          Menunggu semua agen untuk memberikan konfirmasi kesiapan. 
                          <span style={{ color: 'var(--c-primary)', fontWeight: 900 }}> Kebenaran tidak bisa menunggu sendirian.</span>
                        </p>
                      </div>
                    )}

                    {state.scenario && (
                      <div className="story-copy">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                          <div className="neo-badge violet" style={{ padding: '4px 12px', fontSize: 14 }}>
                            KASUS #{state.scenario.id}
                          </div>
                          <div style={{ height: 3, flex: 1, background: 'black', opacity: 0.1 }} />
                        </div>
                        <h1 className="brand-font story-title">{state.scenario.title}</h1>
                        <p className="story-text" style={{ fontSize: 28, lineHeight: 1.4 }}>{state.scenario.content}</p>
                      </div>
                    )}

                    {state.phase === "discussion_phase" && (
                      <motion.div 
                        initial={{ scale: 0.98, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="neo-panel" 
                        style={{ background: "white", marginTop: 40, padding: 32, boxShadow: '10px 10px 0 var(--c-primary-soft)', border: '4px solid var(--c-primary-soft)' }}
                      >
                        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
                          <div style={{ background: 'var(--c-primary-soft)', padding: 16, borderRadius: 20, position: 'relative' }}>
                            <MessageSquare className="animate-bounce" color="white" size={32} />
                            <div className="indicator-dot" style={{ position: 'absolute', top: 4, right: 4, color: 'white', width: 12, height: 12 }} />
                          </div>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                              <span className="neo-badge yellow" style={{ background: 'var(--c-primary-soft)', color: 'white' }}>STATUS: AKTIF</span>
                              <div className="indicator-dot" style={{ color: 'var(--c-primary-soft)' }} />
                            </div>
                            <h2 className="brand-font" style={{ margin: 0, fontSize: 36, color: 'var(--c-ink)' }}>DISKUSI TIM</h2>
                            <p style={{ fontWeight: 700, margin: "8px 0 0", fontSize: 18, opacity: 0.8 }}>Gunakan kanal komunikasi untuk merumuskan validitas bukti.</p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {state.phase.includes('voting') && state.scenario && (
                      <div style={{ marginTop: 48 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: 12 }}>
                          <span className="brand-font" style={{ fontSize: 20 }}>PROGRESS KESEPAKATAN</span>
                          <span className="brand-font" style={{ fontSize: 24, color: 'var(--c-primary)' }}>{Math.round(voteProgress)}%</span>
                        </div>
                        <div className="progress-container" style={{ marginBottom: 32, height: 32 }}>
                          <motion.div 
                            className="progress-bar"
                            initial={{ width: 0 }}
                            animate={{ width: `${voteProgress}%` }}
                          />
                        </div>
                        <div className="neo-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
                          {state.scenario.choices.map((choice, idx) => (
                            <motion.button
                              key={choice.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              whileHover={!myVote ? { scale: 1.05, rotate: idx % 2 === 0 ? 1 : -1 } : {}}
                              whileTap={!myVote ? { scale: 0.95 } : {}}
                              className={`choice-card ${myVote === choice.id ? "selected" : ""}`}
                              disabled={Boolean(myVote)}
                              onClick={() => actions.vote(state.scenario!.id, choice.id)}
                              style={{ padding: 24 }}
                            >
                              <div style={{ 
                                width: 48, height: 48, background: myVote === choice.id ? 'white' : 'black', 
                                color: myVote === choice.id ? 'black' : 'white', 
                                borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '4px 4px 0 rgba(0,0,0,0.2)', flexShrink: 0
                              }}>
                                <Vote size={24} />
                              </div>
                              <span style={{ fontSize: 20, fontWeight: 900 }}>{choice.text}</span>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    )}

                    {(state.phase === "result_phase" || state.phase === "result") && state.lastResult && (
                      <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="neo-panel" 
                        style={{ marginTop: 40, padding: 32, background: 'white', boxShadow: '10px 10px 0 black' }}
                      >
                        <h2 className="brand-font" style={{ fontSize: 36, marginBottom: 24, borderBottom: '3px solid black', paddingBottom: 16 }}>HASIL KESEPAKATAN</h2>
                        <div className="neo-grid" style={{ gap: 16 }}>
                          {state.lastResult.breakdown.map((item) => (
                            <div 
                              key={item.choiceId} 
                              className="player-row" 
                              style={{ 
                                background: item.isWinner ? 'var(--c-green)' : 'white',
                                padding: 20,
                                borderWidth: item.isWinner ? '4px' : '3px'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                {item.isWinner ? (
                                  <div style={{ background: 'black', padding: 8, borderRadius: 10 }}>
                                    <Crown size={24} color="white" />
                                  </div>
                                ) : (
                                  <div style={{ width: 40, height: 40, border: '2px solid black', borderRadius: 10 }} />
                                )}
                                <strong style={{ fontSize: 22, textTransform: 'uppercase' }}>{item.text}</strong>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{ fontSize: 14, fontWeight: 800, opacity: 0.6 }}>TOTAL VOTE:</div>
                                <span className="neo-badge" style={{ background: 'black', color: 'white', fontSize: 20 }}>{item.count}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {state.phase === "ended" && (
                      <motion.div 
                        initial={{ scale: 0.8, opacity: 0, rotate: -2 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        className="neo-panel" 
                        style={{ marginTop: 40, padding: 48, background: 'var(--c-green)', textAlign: 'center', boxShadow: '12px 12px 0 black' }}
                      >
                        <motion.div
                          animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0] }}
                          transition={{ repeat: Infinity, duration: 4 }}
                        >
                          <Trophy size={100} style={{ margin: '0 auto 32px' }} />
                        </motion.div>
                        <h1 className="brand-font" style={{ fontSize: 64, marginBottom: 16 }}>INVESTIGASI SELESAI</h1>
                        <p style={{ fontWeight: 800, fontSize: 24, marginBottom: 40, maxWidth: 600, margin: '0 auto 40px' }}>
                          Seluruh bukti telah dianalisis dan keputusan akhir telah diambil. Kota menanti keadilan Anda.
                        </p>
                        <Link href="/leaderboard" className="btn btn-primary btn-lg" style={{ height: 72, padding: '0 40px', fontSize: 24 }}>
                          LIHAT PERINGKAT AGEN
                        </Link>
                      </motion.div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.section>

            <aside style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <section className="neo-card glass" style={{ padding: 24, boxShadow: '8px 8px 0 black' }}>
                <h2 className="brand-font" style={{ fontSize: 20, display: 'flex', alignItems: 'center', gap: 10, borderBottom: '3px solid black', paddingBottom: 12, marginBottom: 20 }}>
                  <Users size={22} /> DAFTAR AGEN ({state.members.length})
                </h2>
                <div className="neo-grid" style={{ gap: 12 }}>
                  {state.members.map((member) => (
                    <motion.div 
                      layout
                      key={member.id} 
                      className="player-row"
                      style={{ padding: '10px 14px' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ 
                          width: 36, height: 36, background: 'var(--c-bg)', 
                          border: '2px solid black', borderRadius: 8,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 14, fontWeight: 900
                        }}>
                          {member.username.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 900, fontSize: 15 }}>{member.username}</div>
                          <div style={{ fontSize: 10, fontWeight: 800, opacity: 0.6 }}>RP: {member.reputation} | TR: {member.trust_score}%</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 6 }}>
                        {member.id === authoritativeHostId && (
                          <motion.span animate={{ rotate: [0, 15, -15, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="neo-badge yellow" style={{ padding: '6px 10px' }}>
                            <Crown size={16} />
                          </motion.span>
                        )}
                        <span className={`neo-badge ${state.ready[String(member.id)] ? "green" : "red"}`} style={{ minWidth: 32, padding: '6px 12px', textAlign: 'center', fontSize: 13 }}>
                          {state.ready[String(member.id)] ? "✓" : "!"}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>

              <section className="neo-card glass" style={{ padding: 24, flex: 1, display: 'flex', flexDirection: 'column', boxShadow: '8px 8px 0 black' }}>
                <h2 className="brand-font" style={{ fontSize: 20, display: 'flex', alignItems: 'center', gap: 10, borderBottom: '3px solid black', paddingBottom: 12, marginBottom: 16 }}>
                  <MessageSquare size={22} /> KOMUNIKASI TIM
                </h2>
                <div 
                  className="chat-box" 
                  ref={chatRef}
                  style={{ height: 350, background: 'rgba(0,0,0,0.02)', border: '3px solid rgba(0,0,0,0.1)', padding: "16px" }}
                >
                  <AnimatePresence initial={false}>
                    {messages.map((msg, index) => (
                      <motion.div 
                        initial={{ opacity: 0, x: msg.userId === user?.id ? 20 : -20, scale: 0.8 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        key={`msg-${msg.id || 'noid'}-${msg.clientMessageId || 'nocid'}-${index}`} 
                        className={`chat-message ${msg.messageType === "system" ? "system" : ""}`}
                        style={{ 
                          margin: 0, 
                          alignSelf: msg.userId === user?.id ? 'flex-end' : 'flex-start',
                          background: msg.userId === user?.id ? 'var(--c-primary-soft)' : 'white'
                        }}
                      >
                        {msg.messageType !== "system" && (
                          <div style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', marginBottom: 4, opacity: 0.7 }}>
                            {msg.username}
                          </div>
                        )}
                        <div style={{ fontWeight: 700, fontSize: 14 }}>{msg.content}</div>
                      </motion.div>
                    ))}
                    {typingUsers.length > 0 && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="typing-line"
                        style={{ alignSelf: 'flex-start', marginLeft: 8 }}
                      >
                        {typingUsers.join(", ")} sedang mengetik...
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <form onSubmit={sendMessage} style={{ display: "flex", gap: 10, marginTop: 16 }}>
                  <input
                    className="input"
                    value={chat}
                    autoComplete="off"
                    onChange={(event) => {
                      setChat(event.target.value);
                      actions.setTyping(Boolean(event.target.value));
                    }}
                    onBlur={() => actions.setTyping(false)}
                    placeholder="Laporkan temuan..."
                    style={{ background: 'white' }}
                  />
                  <motion.button 
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    className="btn btn-primary" 
                    style={{ minWidth: 54, padding: 0 }}
                  >
                    <Send size={20} />
                  </motion.button>
                </form>
              </section>
            </aside>
          </div>
        </motion.div>
      </main>
    </ProtectedRoute>
  );
}
