import type { EmployeeRow, OfficeRow, SaleFact } from "@/lib/data/sales-facts";

export type OfficePerformance = {
  officeCode: string;
  city: string;
  country: string;
  territory: string;
  employees: number;
  customers: number;
  revenue: number;
};

export type TerritoryRevenue = { label: string; revenue: number };

export type OfficeAnalysis = {
  officePerformance: OfficePerformance[];
  territoryRevenue: TerritoryRevenue[];
};

export function buildOfficeAnalysis(
  facts: SaleFact[],
  offices: OfficeRow[],
  employees: EmployeeRow[],
): OfficeAnalysis {
  const employeeCountByOffice = new Map<string, number>();
  for (const e of employees) {
    employeeCountByOffice.set(e.officeCode, (employeeCountByOffice.get(e.officeCode) ?? 0) + 1);
  }

  const revenueByOffice = new Map<string, number>();
  const customersByOffice = new Map<string, Set<number>>();
  for (const f of facts) {
    if (!f.officeCode) continue;
    revenueByOffice.set(f.officeCode, (revenueByOffice.get(f.officeCode) ?? 0) + f.lineRevenue);
    const set = customersByOffice.get(f.officeCode) ?? new Set<number>();
    set.add(f.customerNumber);
    customersByOffice.set(f.officeCode, set);
  }

  const officePerformance: OfficePerformance[] = offices
    .map((o) => ({
      officeCode: o.officeCode,
      city: o.city,
      country: o.country,
      territory: o.territory,
      employees: employeeCountByOffice.get(o.officeCode) ?? 0,
      customers: customersByOffice.get(o.officeCode)?.size ?? 0,
      revenue: revenueByOffice.get(o.officeCode) ?? 0,
    }))
    .sort((a, b) => b.revenue - a.revenue);

  const territoryMap = new Map<string, number>();
  for (const o of officePerformance) {
    territoryMap.set(o.territory, (territoryMap.get(o.territory) ?? 0) + o.revenue);
  }
  const territoryRevenue = [...territoryMap.entries()]
    .map(([label, revenue]) => ({ label, revenue }))
    .sort((a, b) => b.revenue - a.revenue);

  return { officePerformance, territoryRevenue };
}
