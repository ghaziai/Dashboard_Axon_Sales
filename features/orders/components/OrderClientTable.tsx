"use client";

import { useState } from "react";
import { DataTable } from "@/components/ui/DataTable";
import { formatCurrency, formatDate, formatNumber } from "@/lib/format";
import type { OrderSummary } from "@/features/orders/services/order-analysis";
import Link from "next/link";
import { Search } from "lucide-react";
import { OrderStatusBadge } from "./OrderStatusBadge";

export function OrderClientTable({ orders }: { orders: OrderSummary[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const statuses = Array.from(new Set(orders.map((o) => o.status))).sort();

  const filtered = orders.filter((o) => {
    const searchString = `${o.orderNumber} ${o.customerName}`.toLowerCase();
    const matchSearch = searchString.includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || o.status === statusFilter;
    return matchSearch && matchStatus;
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
            placeholder="Cari pesanan atau pelanggan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="status-filter" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Status:
          </label>
          <select
            id="status-filter"
            className="rounded-md border border-zinc-300 bg-white py-2 pl-3 pr-8 text-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">Semua</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <DataTable
        rowKey={(row) => row.orderNumber}
        rows={filtered}
        columns={[
          {
            header: "Nomor Pesanan",
            render: (row) => (
              <Link
                href={`/orders/${row.orderNumber}`}
                className="font-medium text-blue-600 hover:underline dark:text-blue-400"
              >
                #{row.orderNumber}
              </Link>
            ),
          },
          { header: "Tanggal", render: (row) => formatDate(row.orderDate) },
          { header: "Pelanggan", render: (row) => row.customerName },
          {
            header: "Status",
            render: (row) => <OrderStatusBadge status={row.status} />,
          },
          { header: "Jml Item", align: "right", render: (row) => formatNumber(row.totalItems) },
          { header: "Total Nilai", align: "right", render: (row) => formatCurrency(row.totalRevenue) },
        ]}
      />
    </div>
  );
}
