import { monthKey, type SaleFact } from "@/lib/data/sales-facts";

export type MonthlyRevenue = { month: string; revenue: number };
export type RankedEntry = { label: string; revenue: number; quantity: number };

export type OverviewSummary = {
  totalRevenue: number;
  totalOrders: number;
  totalQuantity: number;
  avgOrderValue: number;
  monthlyRevenue: MonthlyRevenue[];
  bestMonth: MonthlyRevenue | null;
  topProducts: RankedEntry[];
  topCustomers: RankedEntry[];
};

export function buildOverviewSummary(facts: SaleFact[]): OverviewSummary {
  const totalRevenue = facts.reduce((sum, f) => sum + f.lineRevenue, 0);
  const totalQuantity = facts.reduce((sum, f) => sum + f.quantityOrdered, 0);
  const totalOrders = new Set(facts.map((f) => f.orderNumber)).size;
  const avgOrderValue = totalOrders === 0 ? 0 : totalRevenue / totalOrders;

  const monthlyMap = new Map<string, number>();
  for (const f of facts) {
    const key = monthKey(f.orderDate);
    monthlyMap.set(key, (monthlyMap.get(key) ?? 0) + f.lineRevenue);
  }
  const monthlyRevenue = [...monthlyMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, revenue]) => ({ month, revenue }));

  const bestMonth = monthlyRevenue.reduce<MonthlyRevenue | null>(
    (best, current) => (!best || current.revenue > best.revenue ? current : best),
    null,
  );

  const topProducts = rankBy(facts, (f) => f.productName).slice(0, 5);
  const topCustomers = rankBy(facts, (f) => f.customerName).slice(0, 5);

  return {
    totalRevenue,
    totalOrders,
    totalQuantity,
    avgOrderValue,
    monthlyRevenue,
    bestMonth,
    topProducts,
    topCustomers,
  };
}

export function rankBy(facts: SaleFact[], keyOf: (f: SaleFact) => string): RankedEntry[] {
  const map = new Map<string, RankedEntry>();
  for (const f of facts) {
    const label = keyOf(f);
    const entry = map.get(label) ?? { label, revenue: 0, quantity: 0 };
    entry.revenue += f.lineRevenue;
    entry.quantity += f.quantityOrdered;
    map.set(label, entry);
  }
  return [...map.values()].sort((a, b) => b.revenue - a.revenue);
}
