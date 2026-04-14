"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
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
    <div className="min-h-screen flex items-center justify-center px-4 bg-canvas">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-10 h-10 rounded-full bg-fg flex items-center justify-center mb-4">
            <span className="text-canvas font-black text-sm">C</span>
          </div>
          <h1 className="text-lg font-semibold text-fg">CCC Real Sitio de Aranjuez</h1>
          <p className="text-sm text-fg-muted mt-1">Acceso Directiva</p>
        </div>

        <div className="bg-surface rounded-xl border border-border p-6">
          {error && (
            <div className="mb-4 px-3 py-2.5 rounded-lg bg-red-950/60 border border-red-700/50 text-red-300 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-fg-muted mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-overlay border border-border rounded-lg px-3 py-2.5 text-sm text-fg placeholder-fg-subtle focus:outline-none focus:border-fg-muted focus:ring-1 focus:ring-fg-muted/30 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-fg-muted mb-1.5">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-overlay border border-border rounded-lg px-3 py-2.5 text-sm text-fg placeholder-fg-subtle focus:outline-none focus:border-fg-muted focus:ring-1 focus:ring-fg-muted/30 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-fg text-canvas py-2.5 rounded-lg text-sm font-semibold hover:bg-fg/90 disabled:opacity-40 transition-colors mt-1"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
