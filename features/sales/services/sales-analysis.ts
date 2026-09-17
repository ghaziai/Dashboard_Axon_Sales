import { monthKey, type SaleFact } from "@/lib/data/sales-facts";

export type YearlyRevenue = { year: string; revenue: number; orders: number; changePct: number | null };
export type StatusBreakdown = { status: string; orders: number; revenue: number };
export type TopMonth = { month: string; revenue: number };

export type SalesAnalysis = {
  yearlyRevenue: YearlyRevenue[];
  statusBreakdown: StatusBreakdown[];
  topMonths: TopMonth[];
};

export function buildSalesAnalysis(facts: SaleFact[]): SalesAnalysis {
  const yearMap = new Map<string, { revenue: number; orders: Set<number> }>();
  const monthMap = new Map<string, number>();
  const statusMap = new Map<string, { orders: Set<number>; revenue: number }>();

  for (const f of facts) {
    const year = f.orderDate.slice(0, 4);
    const year_entry = yearMap.get(year) ?? { revenue: 0, orders: new Set<number>() };
    year_entry.revenue += f.lineRevenue;
    year_entry.orders.add(f.orderNumber);
    yearMap.set(year, year_entry);

    const mKey = monthKey(f.orderDate);
    monthMap.set(mKey, (monthMap.get(mKey) ?? 0) + f.lineRevenue);

    const statusEntry = statusMap.get(f.status) ?? { orders: new Set<number>(), revenue: 0 };
    statusEntry.orders.add(f.orderNumber);
    statusEntry.revenue += f.lineRevenue;
    statusMap.set(f.status, statusEntry);
  }

  const sortedYears = [...yearMap.entries()].sort(([a], [b]) => a.localeCompare(b));
  const yearlyRevenue: YearlyRevenue[] = sortedYears.map(([year, entry], index) => {
    const prevRevenue = index > 0 ? sortedYears[index - 1][1].revenue : null;
    const changePct = prevRevenue ? ((entry.revenue - prevRevenue) / prevRevenue) * 100 : null;
    return { year, revenue: entry.revenue, orders: entry.orders.size, changePct };
  });

  const statusBreakdown: StatusBreakdown[] = [...statusMap.entries()]
    .map(([status, entry]) => ({ status, orders: entry.orders.size, revenue: entry.revenue }))
    .sort((a, b) => b.revenue - a.revenue);

  const topMonths: TopMonth[] = [...monthMap.entries()]
    .map(([month, revenue]) => ({ month, revenue }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);

  return { yearlyRevenue, statusBreakdown, topMonths };
}
