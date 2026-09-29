import { describe, expect, it } from "vitest";
import { buildSalesAnalysis } from "@/features/sales/services/sales-analysis";
import { SAMPLE_FACTS } from "./fixtures";

describe("buildSalesAnalysis", () => {
  const analysis = buildSalesAnalysis(SAMPLE_FACTS);

  it("aggregates revenue and distinct order count per year, sorted chronologically", () => {
    expect(analysis.yearlyRevenue).toEqual([
      { year: "2023", revenue: 430, orders: 2, changePct: null },
      { year: "2024", revenue: 200, orders: 1, changePct: expect.any(Number) },
    ]);
  });

  it("computes year-over-year change as a percentage of the prior year", () => {
    const [, year2024] = analysis.yearlyRevenue;
    // (200 - 430) / 430 * 100
    expect(year2024.changePct).toBeCloseTo(((200 - 430) / 430) * 100, 10);
  });

  it("leaves changePct null for the first year in the series (nothing to compare against)", () => {
    expect(analysis.yearlyRevenue[0].changePct).toBeNull();
  });

  it("breaks down revenue and order count by status, sorted by revenue desc", () => {
    expect(analysis.statusBreakdown).toEqual([
      { status: "Shipped", orders: 2, revenue: 430 },
      { status: "Cancelled", orders: 1, revenue: 200 },
    ]);
  });

  it("ranks top months by revenue desc, capped at 10", () => {
    expect(analysis.topMonths).toEqual([
      { month: "2023-01", revenue: 350 },
      { month: "2024-01", revenue: 200 },
      { month: "2023-02", revenue: 80 },
    ]);
  });

  it("total revenue across yearlyRevenue matches total revenue across topMonths (cross-check)", () => {
    const fromYears = analysis.yearlyRevenue.reduce((sum, y) => sum + y.revenue, 0);
    const fromMonths = analysis.topMonths.reduce((sum, m) => sum + m.revenue, 0);
    expect(fromYears).toBe(fromMonths);
  });
});
