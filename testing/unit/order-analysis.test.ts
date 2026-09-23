import { describe, it, expect } from "vitest";
import { buildOrderAnalysis } from "@/features/orders/services/order-analysis";
import { SAMPLE_FACTS } from "./fixtures";

describe("order-analysis", () => {
  it("builds order summaries and aggregates from sale facts", () => {
    const analysis = buildOrderAnalysis(SAMPLE_FACTS);

    // There are 3 unique orders in SAMPLE_FACTS: 1001, 1002, 1003
    expect(analysis.totalOrders).toBe(3);
    
    // Total revenue = 200 + 150 + 80 + 200 = 630
    expect(analysis.totalRevenue).toBe(630);
    
    // Average Order Value = 630 / 3 = 210
    expect(analysis.averageOrderValue).toBe(210);

    // Check order 1001 (has 2 items: 200 + 150 = 350 revenue, 10 + 5 = 15 items)
    const order1001 = analysis.allOrders.find(o => o.orderNumber === 1001);
    expect(order1001).toBeDefined();
    expect(order1001?.totalRevenue).toBe(350);
    expect(order1001?.totalItems).toBe(15);
    expect(order1001?.status).toBe("Shipped");

    // Check status distribution (2 Shipped, 1 Cancelled)
    expect(analysis.statusDistribution).toEqual([
      { name: "Shipped", value: 2 },
      { name: "Cancelled", value: 1 },
    ]);

    // Check topCustomers (Acme Corp = 550, Toko Maju = 80)
    expect(analysis.topCustomers).toEqual([
      { label: "Acme Corp", revenue: 550 },
      { label: "Toko Maju", revenue: 80 },
    ]);
  });

  it("handles empty facts", () => {
    const analysis = buildOrderAnalysis([]);
    expect(analysis.allOrders).toEqual([]);
    expect(analysis.totalOrders).toBe(0);
    expect(analysis.totalRevenue).toBe(0);
    expect(analysis.averageOrderValue).toBe(0);
    expect(analysis.statusDistribution).toEqual([]);
    expect(analysis.topCustomers).toEqual([]);
  });
});
