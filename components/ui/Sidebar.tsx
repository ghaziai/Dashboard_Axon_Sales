"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Ikhtisar" },
  { href: "/sales", label: "Analisis Penjualan" },
  { href: "/products", label: "Analisis Produk" },
  { href: "/customers", label: "Analisis Pelanggan" },
  { href: "/employees", label: "Analisis Karyawan" },
  { href: "/offices", label: "Analisis Kantor" },
  { href: "/insights", label: "Wawasan Lanjutan" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="px-5 py-5">
        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          Axon Sales
        </p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Dasbor Penjualan
        </p>
      </div>
      <nav className="flex flex-col gap-0.5 px-3">
        {NAV_ITEMS.map((item) => {
          const active =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900"
                  : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
