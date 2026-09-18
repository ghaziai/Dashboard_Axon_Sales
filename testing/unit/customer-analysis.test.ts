import { describe, expect, it } from "vitest";
import { buildCustomerAnalysis } from "@/features/customers/services/customer-analysis";
import { SAMPLE_CUSTOMERS, SAMPLE_FACTS } from "./fixtures";

describe("buildCustomerAnalysis", () => {
  const analysis = buildCustomerAnalysis(SAMPLE_FACTS, SAMPLE_CUSTOMERS);

  it("includes every customer from the roster, even ones with zero orders", () => {
    expect(analysis.allCustomers).toHaveLength(3);
    const dormant = analysis.allCustomers.find((c) => c.customerNumber === 3);
    expect(dormant).toMatchObject({ revenue: 0, orders: 0 });
  });

  it("counts distinct orders per customer, not order lines", () => {
    // Acme Corp has 2 lines in order 1001 + 1 line in order 1003 = 2 distinct orders
    const acme = analysis.allCustomers.find((c) => c.customerNumber === 1);
    expect(acme).toMatchObject({ revenue: 550, orders: 2 });
  });

  it("ranks topByRevenue desc, capped at 10", () => {
    expect(analysis.topByRevenue.map((c) => c.customerName)).toEqual([
      "Acme Corp",
      "Toko Maju",
      "Dormant Co",
    ]);
  });

  it("preserves each customer's declared credit limit unchanged", () => {
    const acme = analysis.allCustomers.find((c) => c.customerNumber === 1);
    expect(acme?.creditLimit).toBe(50000);
  });

  it("aggregates revenue by country", () => {
    expect(analysis.revenueByCountry).toEqual([
      { label: "France", revenue: 550, quantity: 17 },
      { label: "Japan", revenue: 80, quantity: 4 },
    ]);
  });

  it("total revenue across allCustomers matches total revenue across revenueByCountry (cross-check)", () => {
    const fromCustomers = analysis.allCustomers.reduce((sum, c) => sum + c.revenue, 0);
    const fromCountries = analysis.revenueByCountry.reduce((sum, c) => sum + c.revenue, 0);
    expect(fromCustomers).toBe(fromCountries);
  });
});
