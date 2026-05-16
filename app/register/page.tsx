"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { UserPlus, ArrowLeft, ShieldCheck } from "lucide-react";
import { useAuthStore } from "@/lib/store";

export default function RegisterPage() {
  const router = useRouter();
  const { register, isAuthenticated, initAuth } = useAuthStore();
  const [form, setForm] = useState({ username: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => { initAuth(); }, [initAuth]);
  useEffect(() => { if (isAuthenticated) router.replace("/lobby"); }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.username || !form.email || !form.password) return toast.error("Semua field wajib diisi");
    if (form.password.length < 6) return toast.error("Password minimal 6 karakter");
    if (form.password !== form.confirmPassword) return toast.error("Konfirmasi password tidak cocok");
    setLoading(true);
    try {
      await register(form.username, form.email, form.password);
      toast.success("Akun berhasil dibuat");
      router.push("/lobby");
    } catch (err: unknown) {
      const data = (err as { response?: { data?: { message?: string; errors?: { message: string }[] } } })?.response?.data;
      const msg = data?.errors?.map((item) => item.message).join(", ") || data?.message || "Registrasi gagal. Pastikan backend berjalan.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-shell" style={{ display: "grid", placeItems: "center", position: 'relative' }}>
      <div className="mesh-bg" />
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
        style={{ width: "min(500px, 94%)" }}
      >
        <div style={{ marginBottom: 20 }}>
          <button onClick={() => router.push('/')} className="btn btn-ghost btn-sm">
            <ArrowLeft size={16} /> Kembali
          </button>
        </div>

        <section className="neo-card" style={{ padding: 40, background: "var(--c-green)" }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 className="brand-font" style={{ fontSize: 48, lineHeight: 1, marginBottom: 12 }}>DAFTAR</h1>
              <p style={{ fontWeight: 800, fontSize: 18, marginBottom: 32 }}>Bergabunglah dengan tim investigasi digital terbaik.</p>
            </div>
            <div className="btn btn-ghost floating" style={{ padding: 12, borderRadius: 20 }}>
              <ShieldCheck size={32} />
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>
            <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
              <label className="label">Nama Detektif (Username)</label>
              <input className="input" placeholder="User123" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} autoComplete="username" />
            </motion.div>
            
            <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
              <label className="label">Email Kontak</label>
              <input className="input" type="email" placeholder="email@contoh.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} autoComplete="email" />
            </motion.div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
                <label className="label">Password</label>
                <input className="input" type="password" placeholder="••••••" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} autoComplete="new-password" />
              </motion.div>
              <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
                <label className="label">Konfirmasi</label>
                <input className="input" type="password" placeholder="••••••" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} autoComplete="new-password" />
              </motion.div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn btn-primary btn-lg" 
              style={{ marginTop: 12 }}
              disabled={loading} 
              type="submit"
            >
              <UserPlus size={20} fill="white" /> {loading ? "Mendaftarkan..." : "Buat Akun Sekarang"}
            </motion.button>
          </form>

          <div style={{ marginTop: 32, textAlign: "center", fontWeight: 800 }}>
            Sudah terdaftar? <Link href="/login" style={{ textDecoration: 'underline' }}>Masuk di sini</Link>
          </div>
        </section>
      </motion.div>
    </main>
  );
}

