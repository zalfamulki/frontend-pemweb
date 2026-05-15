"use client";

import Link from "next/link";
import { LogIn, Play, Users, Vote, MessageSquare, Trophy } from "lucide-react";

const steps = [
  { icon: Users, title: "Masuk Room", copy: "Buat room atau gabung ke sesi teman." },
  { icon: MessageSquare, title: "Diskusi Tim", copy: "Chat real-time untuk membaca situasi cerita." },
  { icon: Vote, title: "Voting", copy: "Keputusan mayoritas mengubah alur cerita." },
  { icon: Trophy, title: "Ending", copy: "Setiap jalur punya konsekuensi dan skor." },
];

export default function LandingPage() {
  return (
    <main className="page-shell">
      <div className="neo-container">
        <nav className="neo-nav">
          <Link href="/" className="brand-font" style={{ fontSize: 24, textDecoration: "none" }}>
            TRUTH OR TRAP
          </Link>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link href="/login" className="btn btn-ghost btn-sm"><LogIn size={16} /> Login</Link>
            <Link href="/register" className="btn btn-primary btn-sm"><Play size={16} /> Main</Link>
          </div>
        </nav>

        <section className="neo-card" style={{ padding: 28, background: "var(--c-blue)" }}>
          <span className="neo-badge yellow">Interactive storytelling multiplayer</span>
          <h1 className="brand-font" style={{ fontSize: "clamp(44px, 9vw, 104px)", lineHeight: .92, margin: "20px 0" }}>
            PILIHANMU MENENTUKAN ENDING.
          </h1>
          <p style={{ maxWidth: 720, fontSize: 20, fontWeight: 800 }}>
            Masuk ke cerita investigasi, debat dengan tim lewat chat real-time, lalu ambil keputusan bersama memakai voting.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 24 }}>
            <Link href="/register" className="btn btn-primary btn-lg"><Play size={20} /> Mulai Game</Link>
            <Link href="/login" className="btn btn-ghost btn-lg"><LogIn size={20} /> Sudah Punya Akun</Link>
          </div>
        </section>

        <section className="neo-grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", marginTop: 26 }}>
          {steps.map((item, index) => {
            const Icon = item.icon;
            const colors = ["var(--c-green)", "var(--c-pink)", "var(--c-primary-soft)", "var(--c-violet)"];
            return (
              <article key={item.title} className="stat-tile" style={{ background: colors[index] }}>
                <Icon size={30} />
                <h2 className="brand-font" style={{ fontSize: 20, margin: "12px 0 6px" }}>{item.title}</h2>
                <p style={{ margin: 0, fontWeight: 800 }}>{item.copy}</p>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}
