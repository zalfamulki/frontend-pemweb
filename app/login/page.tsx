"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuthStore } from "@/lib/store";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, initAuth } = useAuthStore();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    if (isAuthenticated) router.replace("/dashboard");
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error("Semua field wajib diisi");
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success("Selamat datang kembali! 🎉");
      router.push("/dashboard");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Login gagal";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      padding: "2rem",
      background: "radial-gradient(ellipse at 30% 50%, rgba(108,92,231,0.12) 0%, transparent 60%), var(--c-bg)"
    }}>
      <div className="animate-fadeInUp" style={{ width: "100%", maxWidth: "420px" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 900, fontSize: "2rem" }}>
              <span className="gradient-text">Truth</span>
              <span style={{ color: "var(--c-muted)", fontSize: "1.5rem" }}> or </span>
              <span className="gradient-text-danger">Trap</span>
            </span>
          </Link>
          <p style={{ color: "var(--c-muted)", marginTop: "0.5rem", fontSize: "0.9rem" }}>
            Masuk dan buktikan literasi digitalmu
          </p>
        </div>

        <div className="glass" style={{ padding: "2rem" }}>
          <h1 style={{ fontWeight: 700, fontSize: "1.4rem", marginBottom: "1.5rem", textAlign: "center" }}>
            Login
          </h1>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 500, color: "var(--c-muted)", marginBottom: "0.4rem" }}>
                Email
              </label>
              <input
                id="login-email"
                type="email"
                className="input"
                placeholder="kamu@email.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                autoComplete="email"
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 500, color: "var(--c-muted)", marginBottom: "0.4rem" }}>
                Password
              </label>
              <input
                id="login-password"
                type="password"
                className="input"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                autoComplete="current-password"
              />
            </div>
            <button
              id="login-submit"
              type="submit"
              className="btn btn-primary"
              style={{ marginTop: "0.5rem", width: "100%", padding: "0.875rem" }}
              disabled={loading}
            >
              {loading ? "⏳ Masuk..." : "🔐 Login"}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.875rem", color: "var(--c-muted)" }}>
            Belum punya akun?{" "}
            <Link href="/register" style={{ color: "var(--c-primary-l)", fontWeight: 600, textDecoration: "none" }}>
              Daftar sekarang
            </Link>
          </div>
        </div>

        {/* Demo hint */}
        <div style={{
          marginTop: "1rem", padding: "0.75rem 1rem", borderRadius: "10px",
          background: "rgba(108,92,231,0.1)", border: "1px solid rgba(108,92,231,0.2)",
          fontSize: "0.8rem", color: "var(--c-muted)", textAlign: "center"
        }}>
          🔑 Admin demo: <strong style={{ color: "var(--c-primary-l)" }}>admin@truthortrap.id</strong> / <strong style={{ color: "var(--c-primary-l)" }}>Admin@1234</strong>
        </div>
      </div>
    </main>
  );
}
