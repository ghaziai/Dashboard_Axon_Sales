"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { formatCurrency } from "@/lib/format";

const COLORS = [
  "#18181b",
  "#52525b",
  "#a1a1aa",
  "#d4d4d8",
  "#3f3f46",
  "#71717a",
  "#e4e4e7",
];

export function RevenuePieChart({ data }: { data: { label: string; revenue: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie data={data} dataKey="revenue" nameKey="label" innerRadius={60} outerRadius={100} paddingAngle={2}>
          {data.map((entry, index) => (
            <Cell key={entry.label} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => formatCurrency(Number(value))} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
