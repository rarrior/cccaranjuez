"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/admin",                label: "Dashboard",    exact: true  },
  { href: "/admin/members",        label: "Socios",       exact: true  },
  { href: "/admin/outings",        label: "Salidas",      exact: false },
  { href: "/admin/seasons",        label: "Temporadas",   exact: true  },
  { href: "/admin/classification", label: "Clasificacion",exact: true  },
];

export default function Nav() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <header className="border-b border-border bg-canvas">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between h-12">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-fg flex items-center justify-center shrink-0">
              <span className="text-canvas font-black text-[10px]">C</span>
            </div>
            <span className="font-semibold text-sm text-fg">CCC Aranjuez</span>
          </Link>

          {isAdmin && (
            <nav className="flex items-center gap-1">
              {NAV_LINKS.map(({ href, label, exact }) => {
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
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
