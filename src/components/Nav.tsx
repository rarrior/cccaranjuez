"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";

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
    <header className="bg-navy border-b border-white/10">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">

          <Link href={isAdmin ? "/admin" : "/"} className="flex items-center gap-2.5">
            <Image src="/icons/escudo-cccaranjuez.png" alt="CCC Aranjuez" width={36} height={36} />
            <div>
              <span className="font-extrabold text-sm text-white leading-none block">CCC Aranjuez</span>
              {isAdmin && (
                <span className="text-[10px] text-white/40 leading-none">Admin</span>
              )}
            </div>
          </Link>

          {isAdmin && (
            <nav className="flex items-center gap-0.5">
              {PRIMARY_LINKS.map(({ href, label, exact }) => {
                const isActive = exact ? pathname === href : pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`relative px-3 py-2 rounded-md text-xs font-bold transition-colors ${
                      isActive
                        ? "text-white"
                        : "text-white/45 hover:text-white/75 hover:bg-white/5"
                    }`}
                  >
                    {label}
                    {isActive && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-accent rounded-full" />
                    )}
                  </Link>
                );
              })}

              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => setOpen((v) => !v)}
                  className={`relative flex items-center gap-1 px-3 py-2 rounded-md text-xs font-bold transition-colors ${
                    isSecondaryActive
                      ? "text-white"
                      : "text-white/45 hover:text-white/75 hover:bg-white/5"
                  }`}
                >
                  Más
                  <svg
                    className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                  {isSecondaryActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-accent rounded-full" />
                  )}
                </button>

                {open && (
                  <div className="absolute right-0 top-full mt-1 w-36 bg-surface border border-border rounded-xl shadow-xl py-1 z-50">
                    {SECONDARY_LINKS.map(({ href, label }) => {
                      const isActive = pathname === href;
                      return (
                        <Link
                          key={href}
                          href={href}
                          onClick={() => setOpen(false)}
                          className={`block px-3 py-2 text-xs font-semibold transition-colors ${
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
