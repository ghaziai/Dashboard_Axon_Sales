"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrency, formatCurrencyCompact } from "@/lib/format";

export function RevenueBarChart({
  data,
  height = 300,
}: {
  data: { label: string; revenue: number }[];
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-zinc-200 dark:stroke-zinc-800" />
        <XAxis
          type="number"
          tickFormatter={(v) => formatCurrencyCompact(v)}
          tick={{ fontSize: 12 }}
          stroke="currentColor"
          className="text-zinc-500"
        />
        <YAxis
          type="category"
          dataKey="label"
          tick={{ fontSize: 12 }}
          width={140}
          stroke="currentColor"
          className="text-zinc-500"
        />
        <Tooltip formatter={(value) => formatCurrency(Number(value))} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
        <Bar dataKey="revenue" fill="#18181b" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
