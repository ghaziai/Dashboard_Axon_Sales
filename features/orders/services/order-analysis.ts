import type { SaleFact } from "@/lib/data/sales-facts";

export type OrderSummary = {
  orderNumber: number;
  orderDate: string;
  customerName: string;
  status: string;
  totalItems: number;
  totalRevenue: number;
};

export type OrderAnalysis = {
  allOrders: OrderSummary[];
  averageOrderValue: number;
  statusDistribution: { name: string; value: number }[];
  totalRevenue: number;
  totalOrders: number;
  topCustomers: { label: string; revenue: number }[];
};

export function buildOrderAnalysis(facts: SaleFact[]): OrderAnalysis {
  const ordersMap = new Map<number, OrderSummary>();
  const statusCount = new Map<string, number>();
  const customerRev = new Map<string, number>();

  for (const f of facts) {
    const order = ordersMap.get(f.orderNumber) ?? {
      orderNumber: f.orderNumber,
      orderDate: f.orderDate,
      customerName: f.customerName,
      status: f.status,
      totalItems: 0,
      totalRevenue: 0,
    };

    order.totalItems += f.quantityOrdered;
    order.totalRevenue += f.lineRevenue;
    ordersMap.set(f.orderNumber, order);
  }

  const allOrders = [...ordersMap.values()].sort(
    (a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
  );

  const totalRevenue = allOrders.reduce((sum, o) => sum + o.totalRevenue, 0);
  const totalOrders = allOrders.length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  for (const o of allOrders) {
    statusCount.set(o.status, (statusCount.get(o.status) ?? 0) + 1);
    customerRev.set(o.customerName, (customerRev.get(o.customerName) ?? 0) + o.totalRevenue);
  }

  const statusDistribution = [...statusCount.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const topCustomers = [...customerRev.entries()]
    .map(([label, revenue]) => ({ label, revenue }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  return {
    allOrders,
    averageOrderValue,
    statusDistribution,
    totalRevenue,
    totalOrders,
    topCustomers,
  };
}
