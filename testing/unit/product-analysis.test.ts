import { describe, expect, it } from "vitest";
import { buildProductAnalysis } from "@/features/products/services/product-analysis";
import { SAMPLE_FACTS, SAMPLE_PRODUCTS } from "./fixtures";

describe("buildProductAnalysis", () => {
  const analysis = buildProductAnalysis(SAMPLE_FACTS, SAMPLE_PRODUCTS);

  it("includes every product from the catalog, even ones with zero sales", () => {
    expect(analysis.allProducts).toHaveLength(4);
    const unsold = analysis.allProducts.find((p) => p.productCode === "P4");
    expect(unsold).toMatchObject({ revenue: 0, quantity: 0 });
  });

  it("sums revenue/quantity per product across multiple order lines", () => {
    // Widget A (P1) sold in both order 1001 (200) and order 1002 (80)
    const widgetA = analysis.allProducts.find((p) => p.productCode === "P1");
    expect(widgetA).toMatchObject({ revenue: 280, quantity: 14 });
  });

  it("ranks topByRevenue desc and excludes nothing incorrectly", () => {
    expect(analysis.topByRevenue.map((p) => p.productCode)).toEqual(["P1", "P3", "P2", "P4"]);
  });

  it("ranks topByQuantity independently from revenue", () => {
    expect(analysis.topByQuantity.map((p) => p.productCode)).toEqual(["P1", "P2", "P3", "P4"]);
  });

  it("aggregates revenue by product line across products in that line", () => {
    // Gadgets = P1 (200 + 80) + P2 (150) = 430; Tools = P3 (200)
    expect(analysis.revenueByLine).toEqual([
      { label: "Gadgets", revenue: 430, quantity: 19 },
      { label: "Tools", revenue: 200, quantity: 2 },
    ]);
  });

  it("ignores order lines for a product not present in the product catalog, without crashing", () => {
    const factForUnknownProduct = { ...SAMPLE_FACTS[0], productCode: "DOES_NOT_EXIST" };
    const result = buildProductAnalysis([factForUnknownProduct], SAMPLE_PRODUCTS);
    // revenue is still counted into its productLine bucket even though no per-product row exists
    expect(result.allProducts.every((p) => p.revenue === 0)).toBe(true);
    expect(result.revenueByLine).toEqual([{ label: "Gadgets", revenue: 200, quantity: 10 }]);
  });
});
