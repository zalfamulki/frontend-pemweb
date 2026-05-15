"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { LogIn } from "lucide-react";
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
    <main className="page-shell" style={{ display: "grid", placeItems: "center" }}>
      <section className="neo-card" style={{ width: "min(440px,100%)", padding: 24, background: "var(--c-pink)" }}>
        <Link href="/" className="brand-font" style={{ fontSize: 24, textDecoration: "none" }}>TRUTH OR TRAP</Link>
        <h1 className="brand-font" style={{ fontSize: 42, margin: "18px 0 6px" }}>LOGIN</h1>
        <p style={{ marginTop: 0, fontWeight: 800 }}>Masuk ke lobby dan lanjutkan sesi cerita tim.</p>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 14, marginTop: 22 }}>
          <div>
            <label className="label">Email</label>
            <input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} autoComplete="email" />
          </div>
          <div>
            <label className="label">Password</label>
            <input className="input" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} autoComplete="current-password" />
          </div>
          <button className="btn btn-primary" disabled={loading} type="submit">
            <LogIn size={18} /> {loading ? "Masuk..." : "Login"}
          </button>
        </form>

        <p style={{ fontWeight: 800, textAlign: "center", marginBottom: 0 }}>
          Belum punya akun? <Link href="/register">Daftar</Link>
        </p>
      </section>
    </main>
  );
}
