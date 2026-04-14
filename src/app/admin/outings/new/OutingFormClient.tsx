"use client";

import { useState } from "react";
import type { Member } from "@/lib/types";
import { createOuting } from "../actions";

interface OutingFormClientProps {
  seasonId: string;
  seasonYear: number;
  members: Member[];
}

const MONTHS_ES = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];

function formatSeniority(seniority: string): string {
  const [year, month] = seniority.split("-");
  return `${MONTHS_ES[parseInt(month, 10) - 1]}/${year}`;
}

function getTodayString() {
  return new Date().toISOString().split("T")[0];
}

export default function OutingFormClient({ seasonId, seasonYear, members }: OutingFormClientProps) {
  const [attendees, setAttendees] = useState<Set<string>>(new Set());
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function toggleAttendee(memberId: string) {
    setAttendees((prev) => {
      const next = new Set(prev);
      if (next.has(memberId)) {
        next.delete(memberId);
        setCompleted((c) => { const nc = new Set(c); nc.delete(memberId); return nc; });
      } else {
        next.add(memberId);
        setCompleted((c) => new Set(c).add(memberId));
      }
      return next;
    });
  }

  function toggleCompleted(memberId: string) {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(memberId)) next.delete(memberId); else next.add(memberId);
      return next;
    });
  }

  function selectAll() {
    const allIds = new Set(members.map((m) => m.id));
    setAttendees(allIds);
    setCompleted(new Set(allIds));
  }

  function deselectAll() {
    setAttendees(new Set());
    setCompleted(new Set());
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    attendees.forEach((id) => fd.append("attendee", id));
    completed.forEach((id) => fd.append("completed", id));
    const result = await createOuting(fd);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-fg">Nueva Salida</h1>
        <p className="text-sm text-fg-muted mt-0.5">Temporada {seasonYear}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="hidden" name="season_id" value={seasonId} />

        {error && (
          <p className="text-red-300 text-sm bg-red-950/60 border border-red-700/50 px-3 py-2 rounded-lg">{error}</p>
        )}

        <div className="bg-surface rounded-xl border border-border p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="date" className="block text-sm font-medium text-fg-muted mb-1.5">
                Fecha
              </label>
              <input
                id="date"
                name="date"
                type="date"
                required
                defaultValue={getTodayString()}
                className="w-full bg-overlay border border-border rounded-lg px-3 py-2 text-sm text-fg focus:outline-none focus:border-fg-muted focus:ring-1 focus:ring-fg-muted/30 transition-colors"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="description" className="block text-sm font-medium text-fg-muted mb-1.5">
                Descripcion (opcional)
              </label>
              <input
                id="description"
                name="description"
                type="text"
                placeholder="Ej: Ruta Chinchon"
                className="w-full bg-overlay border border-border rounded-lg px-3 py-2 text-sm text-fg placeholder-fg-subtle focus:outline-none focus:border-fg-muted focus:ring-1 focus:ring-fg-muted/30 transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-xl border border-border p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-fg">
              Asistencia
              {attendees.size > 0 && (
                <span className="ml-2 text-sm font-normal text-fg-muted">{attendees.size} socios</span>
              )}
            </h2>
            <div className="flex gap-3">
              <button type="button" onClick={selectAll} className="text-sm text-fg-muted hover:text-fg transition-colors">
                Todos
              </button>
              <span className="text-border">|</span>
              <button type="button" onClick={deselectAll} className="text-sm text-fg-muted hover:text-fg transition-colors">
                Ninguno
              </button>
            </div>
          </div>

          {members.length === 0 && (
            <p className="text-fg-muted text-sm text-center py-6">No hay socios registrados.</p>
          )}

          <div className="space-y-1">
            {members.map((member) => {
              const isAttending = attendees.has(member.id);
              const isCompleted = completed.has(member.id);
              return (
                <div
                  key={member.id}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg border transition-colors ${
                    isAttending
                      ? "bg-overlay border-border"
                      : "bg-transparent border-transparent hover:bg-overlay/50"
                  }`}
                >
                  <label className="flex items-center gap-3 flex-1 cursor-pointer min-w-0">
                    <input
                      type="checkbox"
                      checked={isAttending}
                      onChange={() => toggleAttendee(member.id)}
                      className="w-4 h-4 rounded border-border bg-surface shrink-0 accent-fg"
                    />
                    <span className={`text-sm truncate ${isAttending ? "text-fg" : "text-fg-muted"}`}>
                      {member.name}
                    </span>
                    <span className="text-xs text-fg-subtle font-mono shrink-0">
                      {formatSeniority(member.seniority)}
                    </span>
                  </label>

                  {isAttending && (
                    <label className="flex items-center gap-2 cursor-pointer ml-3 shrink-0">
                      <input
                        type="checkbox"
                        checked={isCompleted}
                        onChange={() => toggleCompleted(member.id)}
                        className="w-4 h-4 rounded border-border bg-surface accent-emerald-500"
                      />
                      <span className="hidden sm:inline text-sm text-fg-muted">Completo</span>
                    </label>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || attendees.size === 0}
          className="w-full bg-fg text-canvas py-2.5 rounded-lg text-sm font-semibold hover:bg-fg/90 disabled:opacity-30 transition-colors"
        >
          {loading ? "Guardando..." : "Guardar salida"}
        </button>
      </form>
    </div>
  );
}
