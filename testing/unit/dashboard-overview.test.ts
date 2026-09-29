import { describe, expect, it } from "vitest";
import { buildOverviewSummary, rankBy } from "@/features/dashboard/services/overview";
import { SAMPLE_FACTS, makeFact } from "./fixtures";

describe("buildOverviewSummary", () => {
  const summary = buildOverviewSummary(SAMPLE_FACTS);

  it("sums revenue across all order lines", () => {
    // 200 + 150 + 80 + 200
    expect(summary.totalRevenue).toBe(630);
  });

  it("sums quantity across all order lines", () => {
    // 10 + 5 + 4 + 2
    expect(summary.totalQuantity).toBe(21);
  });

  it("counts distinct orders, not order lines", () => {
    // 3 orders (1001, 1002, 1003), 4 lines
    expect(summary.totalOrders).toBe(3);
  });

  it("computes average order value as revenue / distinct orders", () => {
    expect(summary.avgOrderValue).toBeCloseTo(630 / 3, 10);
  });

  it("buckets revenue by month and sorts chronologically", () => {
    expect(summary.monthlyRevenue).toEqual([
      { month: "2023-01", revenue: 350 },
      { month: "2023-02", revenue: 80 },
      { month: "2024-01", revenue: 200 },
    ]);
  });

  it("picks the highest-revenue month as bestMonth", () => {
    expect(summary.bestMonth).toEqual({ month: "2023-01", revenue: 350 });
  });

  it("ranks top products by revenue, highest first", () => {
    expect(summary.topProducts.map((p) => p.label)).toEqual([
      "Widget A",
      "Gizmo C",
      "Widget B",
    ]);
  });

  it("ranks top customers by revenue, highest first", () => {
    expect(summary.topCustomers).toEqual([
      { label: "Acme Corp", revenue: 550, quantity: 17 },
      { label: "Toko Maju", revenue: 80, quantity: 4 },
    ]);
  });

  it("does not crash and returns zeroed values for an empty dataset", () => {
    const empty = buildOverviewSummary([]);
    expect(empty.totalRevenue).toBe(0);
    expect(empty.totalOrders).toBe(0);
    expect(empty.avgOrderValue).toBe(0); // guards the totalOrders === 0 branch (not NaN)
    expect(empty.bestMonth).toBeNull();
    expect(empty.monthlyRevenue).toEqual([]);
  });
});

describe("rankBy", () => {
  it("aggregates revenue and quantity per key, sorted by revenue desc", () => {
    const facts = [
      makeFact({ productName: "A", lineRevenue: 10, quantityOrdered: 1 }),
      makeFact({ productName: "A", lineRevenue: 5, quantityOrdered: 2 }),
      makeFact({ productName: "B", lineRevenue: 50, quantityOrdered: 1 }),
    ];
    expect(rankBy(facts, (f) => f.productName)).toEqual([
      { label: "B", revenue: 50, quantity: 1 },
      { label: "A", revenue: 15, quantity: 3 },
    ]);
  });
});
