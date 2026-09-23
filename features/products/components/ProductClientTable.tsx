"use client";

import { useState } from "react";
import { DataTable } from "@/components/ui/DataTable";
import { formatCurrency, formatNumber } from "@/lib/format";
import type { ProductPerformance } from "@/features/products/services/product-analysis";
import Link from "next/link";
import { Search } from "lucide-react";

export function ProductClientTable({ products }: { products: ProductPerformance[] }) {
  const [search, setSearch] = useState("");
  const [lineFilter, setLineFilter] = useState("All");

  const lines = Array.from(new Set(products.map((p) => p.productLine))).sort();

  const filtered = products.filter((p) => {
    const matchSearch = p.productName.toLowerCase().includes(search.toLowerCase());
    const matchLine = lineFilter === "All" || p.productLine === lineFilter;
    return matchSearch && matchLine;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-zinc-400" />
          </div>
          <input
            type="text"
            className="block w-full rounded-md border border-zinc-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            placeholder="Cari nama produk..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="line-filter" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Lini Produk:
          </label>
          <select
            id="line-filter"
            className="rounded-md border border-zinc-300 bg-white py-2 pl-3 pr-8 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            value={lineFilter}
            onChange={(e) => setLineFilter(e.target.value)}
          >
            <option value="All">Semua</option>
            {lines.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>
      </div>

      <DataTable
        rowKey={(row) => row.productCode}
        rows={filtered}
        columns={[
          {
            header: "Produk",
            render: (row) => (
              <Link
                href={`/products/${row.productCode}`}
                className="font-medium text-blue-600 hover:underline dark:text-blue-400"
              >
                {row.productName}
              </Link>
            ),
          },
          { header: "Lini Produk", render: (row) => row.productLine },
          { header: "Stok", align: "right", render: (row) => formatNumber(row.quantityInStock) },
          { header: "Terjual", align: "right", render: (row) => formatNumber(row.quantity) },
          { header: "Pendapatan", align: "right", render: (row) => formatCurrency(row.revenue) },
          {
            header: "Margin Laba",
            align: "right",
            render: (row) => {
              if (!row.msrp) return "-";
              const margin = (row.msrp - row.buyPrice) / row.msrp;
              return `${(margin * 100).toFixed(1)}%`;
            },
          },
        ]}
      />
    </div>
  );
}
