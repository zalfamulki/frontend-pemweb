"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuthStore } from "@/lib/store";

export default function RegisterPage() {
  const router = useRouter();
  const { register, isAuthenticated, initAuth } = useAuthStore();
  const [form, setForm] = useState({ username: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => { initAuth(); }, [initAuth]);
  useEffect(() => { if (isAuthenticated) router.replace("/dashboard"); }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.username || !form.email || !form.password) return toast.error("Semua field wajib diisi");
    if (form.password.length < 6) return toast.error("Password minimal 6 karakter");
    if (form.password !== form.confirmPassword) return toast.error("Password tidak cocok");
    setLoading(true);
    try {
      await register(form.username, form.email, form.password);
      toast.success("Akun berhasil dibuat! Selamat bermain 🎉");
      router.push("/dashboard");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Registrasi gagal";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const strength = form.password.length === 0 ? 0 : form.password.length < 6 ? 1 : form.password.length < 10 ? 2 : 3;
  const strengthColors = ["", "#e74c3c", "#fdcb6e", "#00b894"];
  const strengthLabels = ["", "Lemah", "Sedang", "Kuat"];

  return (
    <main style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      padding: "2rem",
      background: "radial-gradient(ellipse at 70% 50%, rgba(231,76,60,0.08) 0%, transparent 60%), var(--c-bg)"
    }}>
      <div className="animate-fadeInUp" style={{ width: "100%", maxWidth: "440px" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 900, fontSize: "2rem" }}>
              <span className="gradient-text">Truth</span>
              <span style={{ color: "var(--c-muted)", fontSize: "1.5rem" }}> or </span>
              <span className="gradient-text-danger">Trap</span>
            </span>
          </Link>
          <p style={{ color: "var(--c-muted)", marginTop: "0.5rem", fontSize: "0.9rem" }}>
            Bergabung dan mulai petualangan deteksi hoaks
          </p>
        </div>

        <div className="glass" style={{ padding: "2rem" }}>
          <h1 style={{ fontWeight: 700, fontSize: "1.4rem", marginBottom: "1.5rem", textAlign: "center" }}>
            Daftar Akun
          </h1>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 500, color: "var(--c-muted)", marginBottom: "0.4rem" }}>
                Username
              </label>
              <input id="reg-username" type="text" className="input" placeholder="nama_hero" value={form.username}
                onChange={e => setForm(f => ({ ...f, username: e.target.value }))} autoComplete="username" />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 500, color: "var(--c-muted)", marginBottom: "0.4rem" }}>
                Email
              </label>
              <input id="reg-email" type="email" className="input" placeholder="kamu@email.com" value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))} autoComplete="email" />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 500, color: "var(--c-muted)", marginBottom: "0.4rem" }}>
                Password
              </label>
              <input id="reg-password" type="password" className="input" placeholder="••••••••" value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))} autoComplete="new-password" />
              {form.password && (
                <div style={{ marginTop: "0.4rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <div style={{ flex: 1, height: "4px", borderRadius: "2px", background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${(strength / 3) * 100}%`, background: strengthColors[strength], transition: "all 0.3s", borderRadius: "2px" }} />
                  </div>
                  <span style={{ fontSize: "0.72rem", color: strengthColors[strength], fontWeight: 600 }}>{strengthLabels[strength]}</span>
                </div>
              )}
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 500, color: "var(--c-muted)", marginBottom: "0.4rem" }}>
                Konfirmasi Password
              </label>
              <input id="reg-confirm" type="password" className="input" placeholder="••••••••" value={form.confirmPassword}
                onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))} autoComplete="new-password" />
              {form.confirmPassword && form.password !== form.confirmPassword && (
                <p style={{ fontSize: "0.8rem", color: "var(--c-danger-l)", marginTop: "0.3rem" }}>⚠ Password tidak cocok</p>
              )}
            </div>
            <button id="reg-submit" type="submit" className="btn btn-primary"
              style={{ marginTop: "0.5rem", width: "100%", padding: "0.875rem" }} disabled={loading}>
              {loading ? "⏳ Mendaftar..." : "🚀 Daftar Sekarang"}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.875rem", color: "var(--c-muted)" }}>
            Sudah punya akun?{" "}
            <Link href="/login" style={{ color: "var(--c-primary-l)", fontWeight: 600, textDecoration: "none" }}>Login</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
