"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";

export default function LandingPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Particle background effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number }[] = [];
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.5 + 0.1,
      });
    }

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(108,92,231,${p.alpha})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    const onResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);

  return (
    <main style={{ minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }} />

      {/* ── Navbar ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "1rem 2rem",
        background: "rgba(10,10,15,0.8)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.08)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontSize: "1.5rem" }}>🎯</span>
          <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: "1.25rem" }}>
            <span className="gradient-text">Truth</span>
            <span style={{ color: "var(--c-muted)" }}>or</span>
            <span className="gradient-text-danger"> Trap</span>
          </span>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <Link href="/login" className="btn btn-ghost btn-sm">Login</Link>
          <Link href="/register" className="btn btn-primary btn-sm">Mulai Main →</Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{
        position: "relative", zIndex: 1,
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        textAlign: "center", padding: "8rem 2rem 4rem",
        flexDirection: "column"
      }}>
        <div className="animate-fadeInUp" style={{ marginBottom: "1.5rem" }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "0.5rem",
            padding: "0.4rem 1rem", borderRadius: "999px",
            background: "rgba(108,92,231,0.15)", border: "1px solid rgba(108,92,231,0.3)",
            fontSize: "0.8rem", fontWeight: 600, color: "var(--c-primary-l)", letterSpacing: "0.05em"
          }}>
            🎮 INTERACTIVE STORY GAME
          </span>
        </div>

        <h1 className="animate-fadeInUp" style={{
          fontFamily: "'Space Grotesk',sans-serif", fontWeight: 900,
          fontSize: "clamp(3rem, 8vw, 6rem)", lineHeight: 1.05, marginBottom: "1.5rem",
          animationDelay: "0.1s"
        }}>
          <span className="gradient-text">Truth</span>
          <span style={{ color: "rgba(255,255,255,0.15)", margin: "0 0.3em" }}>or</span>
          <span className="gradient-text-danger">Trap</span>
        </h1>

        <p className="animate-fadeInUp" style={{
          maxWidth: "600px", fontSize: "1.15rem", color: "var(--c-muted)",
          lineHeight: 1.7, marginBottom: "2.5rem", animationDelay: "0.2s"
        }}>
          Bisakah kamu membedakan <strong style={{ color: "var(--c-success-l)" }}>fakta</strong> dari{" "}
          <strong style={{ color: "var(--c-danger-l)" }}>hoaks</strong>?
          Bergabunglah, berdiskusi secara realtime, dan buktikan literasi digitalmu!
        </p>

        <div className="animate-fadeInUp" style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center", animationDelay: "0.3s" }}>
          <Link href="/register" className="btn btn-primary btn-lg" style={{ minWidth: "180px" }}>
            🚀 Mulai Sekarang
          </Link>
          <Link href="/login" className="btn btn-ghost btn-lg">
            Sudah punya akun?
          </Link>
        </div>

        {/* Stats row */}
        <div className="animate-fadeInUp" style={{
          display: "flex", gap: "2rem", marginTop: "4rem", flexWrap: "wrap", justifyContent: "center",
          animationDelay: "0.4s"
        }}>
          {[
            { label: "Berita Aktif", value: "100+", icon: "📰" },
            { label: "Pemain Online", value: "24/7", icon: "🟢" },
            { label: "Room Diskusi", value: "∞", icon: "💬" },
          ].map((s) => (
            <div key={s.label} className="glass" style={{ padding: "1.25rem 2rem", textAlign: "center", minWidth: "130px" }}>
              <div style={{ fontSize: "1.5rem", marginBottom: "0.25rem" }}>{s.icon}</div>
              <div style={{ fontWeight: 800, fontSize: "1.5rem", color: "var(--c-primary-l)" }}>{s.value}</div>
              <div style={{ fontSize: "0.8rem", color: "var(--c-muted)" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section style={{ position: "relative", zIndex: 1, padding: "5rem 2rem", maxWidth: "1100px", margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: "2rem", marginBottom: "3rem" }}>
          Cara <span className="gradient-text">Bermain</span>
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "1.5rem" }}>
          {[
            { step: "01", icon: "🔐", title: "Daftar & Login", desc: "Buat akunmu dan masuk ke arena deteksi berita" },
            { step: "02", icon: "🏠", title: "Buat / Join Room", desc: "Bergabung atau buat ruang diskusi multiplayer" },
            { step: "03", icon: "📰", title: "Baca Berita", desc: "Terima berita dan analisis kebenarannya bersama" },
            { step: "04", icon: "🗳️", title: "Vote & Diskusi", desc: "Tentukan FAKTA atau HOAKS lewat chat realtime" },
            { step: "05", icon: "🏆", title: "Raih Skor", desc: "Jawaban benar = poin & reputasi naik!" },
          ].map((item) => (
            <div key={item.step} className="glass card-hover" style={{ padding: "1.75rem", position: "relative" }}>
              <div style={{ position: "absolute", top: "1rem", right: "1rem", fontSize: "0.7rem", fontWeight: 700, color: "var(--c-primary)", opacity: 0.5 }}>
                {item.step}
              </div>
              <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>{item.icon}</div>
              <h3 style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "0.5rem" }}>{item.title}</h3>
              <p style={{ fontSize: "0.85rem", color: "var(--c-muted)", lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ position: "relative", zIndex: 1, padding: "5rem 2rem", textAlign: "center" }}>
        <div className="glass animate-pulse-glow" style={{ maxWidth: "600px", margin: "0 auto", padding: "3rem 2rem" }}>
          <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: "2rem", marginBottom: "1rem" }}>
            Siap Menguji <span className="gradient-text">Literasi Digital</span>mu?
          </h2>
          <p style={{ color: "var(--c-muted)", marginBottom: "2rem" }}>
            Bergabung dengan ribuan pemain dan buktikan kamu bisa membedakan benar dari salah.
          </p>
          <Link href="/register" className="btn btn-primary btn-lg">
            🎯 Daftar Gratis Sekarang
          </Link>
        </div>
      </section>

      <footer style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "2rem", color: "var(--c-muted)", fontSize: "0.8rem", borderTop: "1px solid var(--c-border)" }}>
        © 2025 Truth or Trap — Edukasi Literasi Digital Indonesia 🇮🇩
      </footer>
    </main>
  );
}
