import type { CustomerRow, SaleFact } from "@/lib/data/sales-facts";

export type CustomerPerformance = {
  customerNumber: number;
  customerName: string;
  country: string;
  orders: number;
  revenue: number;
  creditLimit: number | null;
};

export type CountryRevenue = { label: string; revenue: number; quantity: number };

export type CustomerAnalysis = {
  topByRevenue: CustomerPerformance[];
  revenueByCountry: CountryRevenue[];
  allCustomers: CustomerPerformance[];
};

export function buildCustomerAnalysis(facts: SaleFact[], customers: CustomerRow[]): CustomerAnalysis {
  const perf = new Map<number, CustomerPerformance & { orderSet: Set<number> }>();
  for (const c of customers) {
    perf.set(c.customerNumber, {
      customerNumber: c.customerNumber,
      customerName: c.customerName,
      country: c.country,
      orders: 0,
      revenue: 0,
      creditLimit: c.creditLimit,
      orderSet: new Set(),
    });
  }

  const countryMap = new Map<string, CountryRevenue>();
  for (const f of facts) {
    const entry = perf.get(f.customerNumber);
    if (entry) {
      entry.revenue += f.lineRevenue;
      entry.orderSet.add(f.orderNumber);
    }

    const countryEntry = countryMap.get(f.country) ?? { label: f.country, revenue: 0, quantity: 0 };
    countryEntry.revenue += f.lineRevenue;
    countryEntry.quantity += f.quantityOrdered;
    countryMap.set(f.country, countryEntry);
  }

  const allCustomers: CustomerPerformance[] = [...perf.values()].map((c) => ({
    customerNumber: c.customerNumber,
    customerName: c.customerName,
    country: c.country,
    orders: c.orderSet.size,
    revenue: c.revenue,
    creditLimit: c.creditLimit,
  }));

  const topByRevenue = [...allCustomers].sort((a, b) => b.revenue - a.revenue).slice(0, 10);
  const revenueByCountry = [...countryMap.values()].sort((a, b) => b.revenue - a.revenue);

  return { topByRevenue, revenueByCountry, allCustomers };
}
