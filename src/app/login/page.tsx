"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const router   = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <div
        className="relative overflow-hidden flex flex-col items-center justify-center py-12 px-4"
        style={{
          background:
            "linear-gradient(150deg, var(--color-navy) 0%, var(--color-blue-mid) 55%, var(--color-blue-light) 100%)",
        }}
      >
        <div className="hero-stripes" />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div
            className="w-16 h-16 rounded-full bg-blue-light/30 border-2 border-white/25 flex items-center justify-center"
          >
            <div
              className="w-10 h-10 rounded-full bg-blue-light flex items-center justify-center font-black text-navy text-sm"
              style={{ boxShadow: "0 0 0 2px rgba(255,255,255,.2)" }}
            >
              C
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-lg font-black text-white leading-tight">
              Club Ciclista Cultural<br />Real Sitio de Aranjuez
            </h1>
            <p className="text-sm text-white/50 mt-1">Acceso Directiva</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 flex items-start justify-center px-4 pt-8 pb-12 bg-canvas">
        <div className="w-full max-w-sm">
          <div className="bg-surface rounded-xl border border-border p-6 shadow-sm">
            {error && (
              <div className="mb-4 px-3 py-2.5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-[10px] font-extrabold text-fg-muted mb-1.5 uppercase tracking-[.1em]">
                  Correo electrónico
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-overlay border border-border rounded-lg px-3 py-2.5 text-sm text-fg placeholder-fg-subtle focus:outline-none focus:border-blue-mid focus:ring-2 focus:ring-blue-mid/20 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-[10px] font-extrabold text-fg-muted mb-1.5 uppercase tracking-[.1em]">
                  Contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-overlay border border-border rounded-lg px-3 py-2.5 text-sm text-fg placeholder-fg-subtle focus:outline-none focus:border-blue-mid focus:ring-2 focus:ring-blue-mid/20 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-mid text-white py-2.5 rounded-lg text-sm font-extrabold hover:bg-blue-mid/90 disabled:opacity-40 transition-colors mt-1"
              >
                {loading ? "Entrando…" : "Entrar →"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
