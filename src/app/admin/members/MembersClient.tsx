"use client";

import { useState } from "react";
import type { Member } from "@/lib/types";
import MemberForm from "@/components/MemberForm";
import { createMember, updateMember, deleteMember } from "./actions";

const MONTHS_ES = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];

function formatSeniority(seniority: string): string {
  const [year, month] = seniority.split("-");
  return `${MONTHS_ES[parseInt(month, 10) - 1]}/${year}`;
}

export default function MembersClient({ members }: { members: Member[] }) {
  const [showNew, setShowNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  async function handleCreate(formData: FormData) {
    const result = await createMember(formData);
    if (result.success) setShowNew(false);
    return result;
  }

  async function handleUpdate(formData: FormData) {
    const result = await updateMember(formData);
    if (result.success) setEditingId(null);
    return result;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-fg">Socios</h1>
        <button
          onClick={() => setShowNew(!showNew)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            showNew
              ? "bg-overlay text-fg hover:bg-overlay/80 border border-border"
              : "bg-fg text-canvas hover:bg-fg/90"
          }`}
        >
          {showNew ? "Cancelar" : "Nuevo socio"}
        </button>
      </div>

      {showNew && (
        <div className="mb-6">
          <MemberForm onSubmit={handleCreate} onCancel={() => setShowNew(false)} />
        </div>
      )}

      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-4 py-3 text-xs font-semibold text-fg-muted">Antiguedad</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-fg-muted">Nombre</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-fg-muted">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id} className="border-b border-border-sub last:border-0 hover:bg-overlay transition-colors">
                {editingId === member.id ? (
                  <td colSpan={3} className="p-3">
                    <MemberForm
                      member={member}
                      onSubmit={handleUpdate}
                      onCancel={() => setEditingId(null)}
                    />
                  </td>
                ) : (
                  <>
                    <td className="px-4 py-3 text-fg-muted font-mono text-xs">
                      {formatSeniority(member.seniority)}
                    </td>
                    <td className="px-4 py-3 text-fg">{member.name}</td>
                    <td className="px-4 py-3 text-right space-x-4">
                      <button
                        onClick={() => setEditingId(member.id)}
                        className="text-sm text-fg-muted hover:text-fg transition-colors"
                      >
                        Editar
                      </button>
                      <form
                        action={deleteMember}
                        className="inline"
                        onSubmit={(e) => {
                          if (!confirm(`Eliminar a ${member.name}? Se perderan sus registros de asistencia.`)) {
                            e.preventDefault();
                          }
                        }}
                      >
                        <input type="hidden" name="id" value={member.id} />
                        <button type="submit" className="text-sm text-red-500 hover:text-red-400 transition-colors">
                          Eliminar
                        </button>
                      </form>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {members.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-12 text-center text-fg-muted text-sm">
                  No hay socios registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
