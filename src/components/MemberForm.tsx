"use client";

import { useState } from "react";
import type { Member } from "@/lib/types";

interface MemberFormProps {
  member?: Member;
  onSubmit: (formData: FormData) => Promise<{ error?: string; success?: boolean }>;
  onCancel?: () => void;
}

export default function MemberForm({ member, onSubmit, onCancel }: MemberFormProps) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError("");
    setLoading(true);
    const result = await onSubmit(formData);
    if (result?.error) setError(result.error);
    setLoading(false);
  }

  return (
    <form action={handleSubmit} className="bg-overlay rounded-xl border border-border p-4 space-y-4">
      {member && <input type="hidden" name="id" value={member.id} />}

      {error && (
        <p className="text-red-300 text-sm bg-red-950/60 border border-red-700/50 px-3 py-2 rounded-lg">{error}</p>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <label htmlFor="name" className="block text-sm font-medium text-fg-muted mb-1.5">
            Nombre
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            defaultValue={member?.name}
            className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-fg placeholder-fg-subtle focus:outline-none focus:border-fg-muted focus:ring-1 focus:ring-fg-muted/30 transition-colors"
          />
        </div>
        <div className="w-full sm:w-40">
          <label htmlFor="seniority" className="block text-sm font-medium text-fg-muted mb-1.5">
            Antiguedad (mes/año)
          </label>
          <input
            id="seniority"
            name="seniority"
            type="month"
            required
            defaultValue={member?.seniority?.slice(0, 7)}
            className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-fg focus:outline-none focus:border-fg-muted focus:ring-1 focus:ring-fg-muted/30 transition-colors"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-fg text-canvas px-4 py-2 rounded-lg text-sm font-semibold hover:bg-fg/90 disabled:opacity-40 transition-colors"
        >
          {loading ? "Guardando..." : member ? "Actualizar" : "Crear socio"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-sm font-medium text-fg-muted hover:text-fg border border-border hover:bg-overlay transition-colors"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
