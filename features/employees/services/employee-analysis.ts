import type { EmployeeRow, OfficeRow, SaleFact } from "@/lib/data/sales-facts";

export type RepPerformance = {
  employeeNumber: number;
  name: string;
  jobTitle: string;
  officeCity: string;
  customers: number;
  orders: number;
  revenue: number;
};

export type EmployeeAnalysis = {
  repPerformance: RepPerformance[];
};

export function buildEmployeeAnalysis(
  facts: SaleFact[],
  employees: EmployeeRow[],
  offices: OfficeRow[],
): EmployeeAnalysis {
  const officeByCode = new Map(offices.map((o) => [o.officeCode, o]));

  const agg = new Map<number, { customers: Set<number>; orders: Set<number>; revenue: number }>();
  for (const f of facts) {
    if (f.salesRepEmployeeNumber === null) continue;
    const entry = agg.get(f.salesRepEmployeeNumber) ?? {
      customers: new Set<number>(),
      orders: new Set<number>(),
      revenue: 0,
    };
    entry.customers.add(f.customerNumber);
    entry.orders.add(f.orderNumber);
    entry.revenue += f.lineRevenue;
    agg.set(f.salesRepEmployeeNumber, entry);
  }

  const repPerformance: RepPerformance[] = [...agg.entries()]
    .map(([employeeNumber, entry]) => {
      const employee = employees.find((e) => e.employeeNumber === employeeNumber);
      const office = employee ? officeByCode.get(employee.officeCode) : undefined;
      return {
        employeeNumber,
        name: employee?.name ?? `#${employeeNumber}`,
        jobTitle: employee?.jobTitle ?? "—",
        officeCity: office?.city ?? "—",
        customers: entry.customers.size,
        orders: entry.orders.size,
        revenue: entry.revenue,
      };
    })
    .sort((a, b) => b.revenue - a.revenue);

  return { repPerformance };
}
