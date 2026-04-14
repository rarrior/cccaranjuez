"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";

const PRIMARY_LINKS = [
  { href: "/admin/outings",        label: "Salidas",       exact: false },
  { href: "/admin/classification", label: "Clasificacion", exact: true  },
];

const SECONDARY_LINKS = [
  { href: "/admin/members", label: "Socios",     exact: true },
  { href: "/admin/seasons", label: "Temporadas", exact: true },
];

export default function Nav() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isSecondaryActive = SECONDARY_LINKS.some(({ href }) => pathname === href);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="border-b border-border bg-canvas">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between h-12">
          <Link href={isAdmin ? "/admin" : "/"} className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-fg flex items-center justify-center shrink-0">
              <span className="text-canvas font-black text-[10px]">C</span>
            </div>
            <span className="font-semibold text-sm text-fg">CCC Aranjuez</span>
          </Link>

          {isAdmin && (
            <nav className="flex items-center gap-1">
              {PRIMARY_LINKS.map(({ href, label, exact }) => {
                const isActive = exact ? pathname === href : pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                      isActive
                        ? "bg-overlay text-fg"
                        : "text-fg-muted hover:text-fg hover:bg-overlay"
                    }`}
                  >
                    {label}
                  </Link>
                );
              })}

              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => setOpen((v) => !v)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    isSecondaryActive
                      ? "bg-overlay text-fg"
                      : "text-fg-muted hover:text-fg hover:bg-overlay"
                  }`}
                >
                  Más
                  <svg
                    className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {open && (
                  <div className="absolute right-0 top-full mt-1 w-36 bg-surface border border-border rounded-lg shadow-lg py-1 z-50">
                    {SECONDARY_LINKS.map(({ href, label }) => {
                      const isActive = pathname === href;
                      return (
                        <Link
                          key={href}
                          href={href}
                          onClick={() => setOpen(false)}
                          className={`block px-3 py-2 text-xs font-medium transition-colors ${
                            isActive
                              ? "text-fg bg-overlay"
                              : "text-fg-muted hover:text-fg hover:bg-overlay"
                          }`}
                        >
                          {label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
