"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Crown, MessageSquare, Play, Radio, Send, Timer, Users, Vote, WifiOff } from "lucide-react";
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

  const authoritativeHostId = state.hostId ?? room?.host_id ?? null;
  const isHost = authoritativeHostId === user?.id;
  const isReady = Boolean(user?.id && state.ready[String(user.id)]);
  const allReady = state.members.length > 0 && state.members.every((member) => state.ready[String(member.id)]);
  const canStart = isHost && allReady && state.members.length >= 2 && state.phase === "waiting";
  const totalVotes = useMemo(() => Object.values(state.votes?.tally || {}).reduce((sum, value) => sum + value, 0), [state.votes]);
  const voteProgress = state.members.length ? Math.min(100, Math.round((totalVotes / state.members.length) * 100)) : 0;
  const myVote = user?.id ? state.votes?.byUser?.[String(user.id)] || state.myVote : null;

  const sendMessage = (event: React.FormEvent) => {
    event.preventDefault();
    if (!chat.trim()) return;
    actions.sendMessage(chat);
    actions.setTyping(false);
    setChat("");
  };

  const phaseTitle = {
    waiting: "Waiting Room",
    story_intro: "Story Intro",
    discussion_phase: "Discussion Phase",
    voting_phase: "Voting Screen",
    result_phase: "Result Screen",
    voting: "Voting Screen",
    result: "Result Screen",
    ended: "Ending Screen",
  }[state.phase];

  return (
    <ProtectedRoute>
      <main className="page-shell">
        <div className="neo-container">
          <nav className="neo-nav floating-card">
            <div>
              <Link href="/lobby" className="btn btn-ghost btn-sm"><ArrowLeft size={16} /> Lobby</Link>
              <div className="brand-font" style={{ fontSize: 28, marginTop: 10 }}>{room?.name || "Truth or Trap Room"}</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6 }}>
                <span className="neo-badge blue">{phaseTitle}</span>
                <span className={`neo-badge ${connected ? "green" : "red"}`}>{connected ? <Radio size={14} /> : <WifiOff size={14} />} {connected ? "Realtime" : "Reconnect..."}</span>
                <span className="neo-badge yellow">Kode {room?.code || "-"}</span>
              </div>
            </div>
            {state.phase === "waiting" && (
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button className={`btn ${isReady ? "btn-green" : "btn-pink"}`} onClick={() => actions.setReady(!isReady)}>
                  {isReady ? "Ready" : "Set Ready"}
                </button>
                {isHost && (
                  <button className="btn btn-primary" disabled={!canStart} onClick={actions.startGame}>
                    <Play size={18} /> Start Game
                  </button>
                )}
              </div>
            )}
          </nav>

          <div className="neo-grid game-layout">
            <section className={`neo-card story-stage cinematic ${state.phase}`}>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 18 }}>
                <span className="neo-badge yellow"><Timer size={14} /> {state.timer}s</span>
                <span className="neo-badge pink"><Users size={14} /> {state.members.length} pemain</span>
                <span className="neo-badge"><Vote size={14} /> {totalVotes}/{state.members.length} vote</span>
              </div>

              {state.phase === "waiting" && (
                <div className="story-copy">
                  <span className="neo-badge blue">Waiting room</span>
                  <h1 className="brand-font">SIAPKAN TIM INVESTIGASI.</h1>
                  <p>Semua pemain harus menekan Ready. Host baru bisa memulai ketika minimal 2 pemain sudah siap.</p>
                </div>
              )}

              {state.scenario && (
                <div className="story-copy">
                  <span className={`neo-badge ${state.phase === "ended" ? "red" : "blue"}`}>{state.phase === "ended" ? "Multiple ending" : "Branching story"}</span>
                  <h1 className="brand-font">{state.scenario.title}</h1>
                  <p>{state.scenario.content}</p>
                </div>
              )}

              {state.phase === "discussion_phase" && state.scenario && (
                <div className="neo-panel result-panel" style={{ background: "var(--c-primary-soft)" }}>
                  <h2 className="brand-font">DISKUSI BERJALAN</h2>
                  <p style={{ fontWeight: 900, marginBottom: 0 }}>Gunakan chat untuk menentukan keputusan bersama. Voting akan dibuka setelah timer diskusi selesai.</p>
                </div>
              )}

              {state.phase === "voting_phase" && state.scenario && (
                <div className="vote-zone">
                  <div className="progress"><span style={{ width: `${voteProgress}%` }} /></div>
                  <div className="neo-grid" style={{ marginTop: 16 }}>
                    {state.scenario.choices.map((choice) => (
                      <button
                        key={choice.id}
                        className={`btn choice-card ${myVote === choice.id ? "selected" : ""}`}
                        disabled={Boolean(myVote)}
                        onClick={() => actions.vote(state.scenario!.id, choice.id)}
                      >
                        <Vote size={20} /> {choice.text}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {(state.phase === "result_phase" || state.phase === "result") && state.lastResult && (
                <div className="neo-panel result-panel">
                  <h2 className="brand-font">HASIL VOTING</h2>
                  {state.lastResult.breakdown.map((item) => (
                    <div key={item.choiceId} className="result-row">
                      <strong>{item.isWinner ? "MENANG - " : ""}{item.text}</strong>
                      <span>{item.count} vote</span>
                    </div>
                  ))}
                </div>
              )}

              {state.phase === "ended" && (
                <div className="neo-panel result-panel ending-panel">
                  <h2 className="brand-font">GAME END</h2>
                  <p>Reputasi dan trust pemain yang ikut voting sudah diperbarui. Cek leaderboard untuk melihat hasil akhir.</p>
                  <Link href="/leaderboard" className="btn btn-primary">Leaderboard</Link>
                </div>
              )}
            </section>

            <aside className="neo-grid">
              <section className="neo-card floating-card" style={{ padding: 16 }}>
                <h2 className="brand-font compact-title">PEMAIN</h2>
                <div className="neo-grid" style={{ gap: 10 }}>
                  {state.members.map((member) => (
                    <div key={member.id} className="player-row">
                      <div>
                        <strong>{member.username}</strong>
                        <div className="mini-text">Trust {member.trust_score} | Rep {member.reputation}</div>
                      </div>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
                        {member.id === authoritativeHostId && <span className="neo-badge yellow"><Crown size={13} /> Host</span>}
                        <span className={`neo-badge ${state.ready[String(member.id)] ? "green" : "red"}`}>{state.ready[String(member.id)] ? "Ready" : "Wait"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="neo-card floating-card" style={{ padding: 16 }}>
                <h2 className="brand-font compact-title"><MessageSquare size={22} /> CHAT</h2>
                <div className="chat-box dark-chat" ref={chatRef}>
                  {messages.map((msg, index) => (
                    <div key={`${msg.id || msg.clientMessageId || index}`} className={`chat-message ${msg.messageType === "system" ? "system" : ""}`}>
                      <strong>{msg.username || "System"}</strong>
                      <div>{msg.content}</div>
                    </div>
                  ))}
                  {typingUsers.length > 0 && (
                    <div className="typing-line">{typingUsers.join(", ")} sedang mengetik...</div>
                  )}
                </div>
                <form onSubmit={sendMessage} style={{ display: "flex", gap: 8, marginTop: 10 }}>
                  <input
                    className="input dark-input"
                    value={chat}
                    onChange={(event) => {
                      setChat(event.target.value);
                      actions.setTyping(Boolean(event.target.value));
                    }}
                    onBlur={() => actions.setTyping(false)}
                    placeholder="Diskusi keputusan..."
                  />
                  <button className="btn btn-primary" aria-label="Kirim chat"><Send size={18} /></button>
                </form>
              </section>
            </aside>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
