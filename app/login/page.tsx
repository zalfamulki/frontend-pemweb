"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { LogIn, ArrowLeft } from "lucide-react";
import { useAuthStore } from "@/lib/store";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, initAuth } = useAuthStore();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => { initAuth(); }, [initAuth]);
  useEffect(() => { if (isAuthenticated) router.replace("/lobby"); }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error("Email dan password wajib diisi");
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success("Login berhasil");
      router.push("/lobby");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Login gagal";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-shell" style={{ display: "grid", placeItems: "center", position: 'relative' }}>
      <div className="mesh-bg" />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
        style={{ width: "min(480px, 94%)" }}
      >
        <div style={{ marginBottom: 20 }}>
          <button onClick={() => router.push('/')} className="btn btn-ghost btn-sm">
            <ArrowLeft size={16} /> Kembali
          </button>
        </div>
        
        <section className="neo-card" style={{ padding: 40, background: "var(--c-pink)" }}>
          <h1 className="brand-font" style={{ fontSize: 48, lineHeight: 1, marginBottom: 12 }}>MASUK</h1>
          <p style={{ fontWeight: 800, fontSize: 18, marginBottom: 32 }}>Selamat datang kembali, Detektif. Lanjutkan investigasi Anda.</p>

          <form onSubmit={handleSubmit} style={{ display: "grid", gap: 20 }}>
            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
              <label className="label">Email Investigasi</label>
              <input 
                className="input" 
                type="email" 
                placeholder="detektif@truth.id"
                value={form.email} 
                onChange={(e) => setForm({ ...form, email: e.target.value })} 
                autoComplete="email" 
              />
            </motion.div>
            
            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
              <label className="label">Kunci Akses (Password)</label>
              <input 
                className="input" 
                type="password" 
                placeholder="••••••••"
                value={form.password} 
                onChange={(e) => setForm({ ...form, password: e.target.value })} 
                autoComplete="current-password" 
              />
            </motion.div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn btn-primary btn-lg" 
              style={{ marginTop: 12 }}
              disabled={loading} 
              type="submit"
            >
              <LogIn size={20} fill="white" /> {loading ? "Memproses..." : "Buka Akses"}
            </motion.button>
          </form>

          <div style={{ marginTop: 32, textAlign: "center", fontWeight: 800 }}>
            Belum terdaftar? <Link href="/register" style={{ textDecoration: 'underline' }}>Buat Identitas Baru</Link>
          </div>
        </section>
      </motion.div>
    </main>
  );
}

