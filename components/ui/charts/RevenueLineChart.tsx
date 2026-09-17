"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrency, formatCurrencyCompact, formatMonthKey } from "@/lib/format";

export function RevenueLineChart({ data }: { data: { month: string; revenue: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200 dark:stroke-zinc-800" />
        <XAxis
          dataKey="month"
          tickFormatter={formatMonthKey}
          tick={{ fontSize: 12 }}
          stroke="currentColor"
          className="text-zinc-500"
        />
        <YAxis
          tickFormatter={(v) => formatCurrencyCompact(v)}
          tick={{ fontSize: 12 }}
          width={64}
          stroke="currentColor"
          className="text-zinc-500"
        />
        <Tooltip
          formatter={(value) => formatCurrency(Number(value))}
          labelFormatter={(label) => formatMonthKey(String(label))}
          contentStyle={{ fontSize: 12, borderRadius: 8 }}
        />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="#18181b"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
