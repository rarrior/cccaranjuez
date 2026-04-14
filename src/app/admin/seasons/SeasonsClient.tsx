"use client";

import { useState } from "react";
import type { Season } from "@/lib/types";
import { createSeason, activateSeason } from "./actions";

export default function SeasonsClient({ seasons }: { seasons: Season[] }) {
  const [showNew, setShowNew] = useState(false);
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData();
    fd.set("year", year.toString());
    const result = await createSeason(fd);
    if (result.error) setError(result.error);
    else setShowNew(false);
    setLoading(false);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-fg">Temporadas</h1>
        <button
          onClick={() => setShowNew(!showNew)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            showNew
              ? "bg-overlay text-fg hover:bg-overlay/80 border border-border"
              : "bg-fg text-canvas hover:bg-fg/90"
          }`}
        >
          {showNew ? "Cancelar" : "Nueva temporada"}
        </button>
      </div>

      {showNew && (
        <form onSubmit={handleCreate} className="bg-overlay rounded-xl border border-border p-4 mb-6 flex gap-4 items-end">
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-fg-muted mb-1.5">
              Año
            </label>
            <input
              id="year"
              type="number"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              min={2020}
              max={2100}
              className="bg-surface border border-border rounded-lg px-3 py-2 text-sm text-fg w-28 focus:outline-none focus:border-fg-muted focus:ring-1 focus:ring-fg-muted/30 transition-colors"
            />
          </div>
          {error && <p className="text-red-300 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="bg-fg text-canvas px-4 py-2 rounded-lg text-sm font-semibold hover:bg-fg/90 disabled:opacity-40 transition-colors"
          >
            {loading ? "Creando..." : "Crear y activar"}
          </button>
        </form>
      )}

      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-4 py-3 text-xs font-semibold text-fg-muted">Año</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-fg-muted">Estado</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-fg-muted">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {seasons.map((season) => (
              <tr key={season.id} className="border-b border-border-sub last:border-0 hover:bg-overlay transition-colors">
                <td className="px-4 py-3 text-fg font-medium">{season.year}</td>
                <td className="px-4 py-3">
                  {season.is_active ? (
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
                      Activa
                    </span>
                  ) : (
                    <span className="text-fg-muted text-sm">Inactiva</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  {!season.is_active && (
                    <form action={activateSeason} className="inline">
                      <input type="hidden" name="id" value={season.id} />
                      <button type="submit" className="text-sm text-fg-muted hover:text-fg transition-colors">
                        Activar
                      </button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
            {seasons.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-12 text-center text-fg-muted text-sm">
                  No hay temporadas. Crea una para empezar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
