"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LogIn, Play, Users, Vote, MessageSquare, Trophy, Shield, Zap, Target } from "lucide-react";

const steps = [
  { 
    icon: Users, 
    title: "Masuk Room", 
    copy: "Buat room atau gabung ke sesi teman dengan kode unik.",
    color: "var(--c-green)"
  },
  { 
    icon: MessageSquare, 
    title: "Diskusi Tim", 
    copy: "Chat real-time untuk menganalisis keaslian berita bersama.",
    color: "var(--c-pink)"
  },
  { 
    icon: Vote, 
    title: "Voting", 
    copy: "Keputusan mayoritas menentukan nasib cerita dan kota.",
    color: "var(--c-primary-soft)"
  },
  { 
    icon: Trophy, 
    title: "Ending", 
    copy: "Setiap jalur punya konsekuensi unik dan skor reputasi.",
    color: "var(--c-violet)"
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 } as const
  }
};

export default function LandingPage() {
  return (
    <main className="page-shell">
      <div className="mesh-bg" />
      <div className="scanline" />
      
      <motion.div 
        className="neo-container"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.nav className="neo-nav" variants={itemVariants}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <motion.div 
              className="btn btn-primary btn-sm" 
              style={{ padding: 8, minHeight: 'auto' }}
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <Shield size={20} fill="white" />
            </motion.div>
            <Link href="/" className="brand-font" style={{ fontSize: 24, textDecoration: "none" }}>
              TRUTH OR TRAP
            </Link>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link href="/login" className="btn btn-ghost">
              <LogIn size={18} /> <span className="hidden sm:inline">Login</span>
            </Link>
            <Link href="/register" className="btn btn-primary">
              <Zap size={18} /> <span className="hidden sm:inline">Main Sekarang</span>
            </Link>
          </div>
        </motion.nav>

        <motion.section 
          className="neo-card" 
          style={{ padding: 48, background: "var(--c-blue)", position: 'relative', overflow: 'hidden' }}
          variants={itemVariants}
          whileHover={{ scale: 1.01 }}
        >
          <div style={{ position: 'relative', zIndex: 10 }}>
            <motion.span 
              className="neo-badge yellow floating"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px' }}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Target size={14} /> Interactive Storytelling Multiplayer
            </motion.span>
            
            <h1 className="brand-font" style={{ fontSize: "clamp(48px, 8vw, 96px)", lineHeight: 0.9, margin: "24px 0", color: "var(--c-ink)" }}>
              DETEKSI HOAKS,<br /> <span style={{ color: 'white', textShadow: '4px 4px 0 black' }}>SELAMATKAN KOTA.</span>
            </h1>
            
            <p style={{ maxWidth: 700, fontSize: 24, fontWeight: 700, lineHeight: 1.4, color: "var(--c-ink)", background: 'rgba(255,255,255,0.3)', padding: 12, borderRadius: 12 }}>
              Masuk ke dunia investigasi digital. Berdebat dengan tim lewat chat real-time, 
              analisis petunjuk, dan ambil keputusan kritis sebelum waktu habis.
            </p>
            
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 40 }}>
              <motion.div whileHover={{ scale: 1.05, rotate: -1 }} whileTap={{ scale: 0.95 }}>
                <Link href="/register" className="btn btn-primary" style={{ height: 72, padding: "0 40px", fontSize: 22 }}>
                  <Play size={28} fill="white" /> Mulai Investigasi
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05, rotate: 1 }} whileTap={{ scale: 0.95 }}>
                <Link href="/login" className="btn btn-ghost" style={{ height: 72, padding: "0 40px", fontSize: 22 }}>
                  Lihat Leaderboard
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Decorative elements */}
          <motion.div 
            style={{ 
              position: 'absolute', right: -40, bottom: -40, opacity: 0.1, 
              fontSize: 240, fontWeight: 900, pointerEvents: 'none' 
            }}
            animate={{ 
              rotate: [0, 10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          >
            TRUTH
          </motion.div>
        </motion.section>

        <section className="neo-grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 32, marginTop: 48 }}>
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.article 
                key={item.title} 
                className="stat-tile" 
                style={{ background: item.color, position: 'relative', overflow: 'hidden' }}
                variants={itemVariants}
                whileHover={{ 
                  y: -15, 
                  rotate: index % 2 === 0 ? 3 : -3,
                  boxShadow: "16px 16px 0px var(--c-border)"
                }}
              >
                <div style={{ 
                  width: 64, height: 64, background: 'white', border: '3px solid black', 
                  borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 20, boxShadow: '4px 4px 0 black'
                }}>
                  <Icon size={32} />
                </div>
                <h2 className="brand-font" style={{ fontSize: 28, marginBottom: 12 }}>{item.title}</h2>
                <p style={{ margin: 0, fontWeight: 800, fontSize: 18, lineHeight: 1.4 }}>{item.copy}</p>
                
                <div style={{ position: 'absolute', right: 10, top: 10, opacity: 0.2 }}>
                  <Icon size={80} />
                </div>
              </motion.article>
            );
          })}
        </section>

        <motion.footer 
          style={{ marginTop: 64, padding: 32, textAlign: 'center', fontWeight: 800, fontSize: 14, opacity: 0.6 }}
          variants={itemVariants}
        >
          © 2026 TRUTH OR TRAP — UAS PEMROGRAMAN WEB
        </motion.footer>
      </motion.div>
    </main>
  );
}

