"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { UserPlus } from "lucide-react";
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
    <main className="page-shell" style={{ display: "grid", placeItems: "center" }}>
      <section className="neo-card" style={{ width: "min(460px,100%)", padding: 24, background: "var(--c-green)" }}>
        <Link href="/" className="brand-font" style={{ fontSize: 24, textDecoration: "none" }}>TRUTH OR TRAP</Link>
        <h1 className="brand-font" style={{ fontSize: 42, margin: "18px 0 6px" }}>REGISTER</h1>
        <p style={{ marginTop: 0, fontWeight: 800 }}>Buat identitas pemain untuk room multiplayer real-time.</p>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 14, marginTop: 22 }}>
          <div>
            <label className="label">Username</label>
            <input className="input" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} autoComplete="username" />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} autoComplete="email" />
          </div>
          <div>
            <label className="label">Password</label>
            <input className="input" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} autoComplete="new-password" />
          </div>
          <div>
            <label className="label">Konfirmasi Password</label>
            <input className="input" type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} autoComplete="new-password" />
          </div>
          <button className="btn btn-primary" disabled={loading} type="submit">
            <UserPlus size={18} /> {loading ? "Mendaftar..." : "Daftar"}
          </button>
        </form>

        <p style={{ fontWeight: 800, textAlign: "center", marginBottom: 0 }}>
          Sudah punya akun? <Link href="/login">Login</Link>
        </p>
      </section>
    </main>
  );
}
