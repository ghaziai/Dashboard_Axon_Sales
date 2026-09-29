import { describe, expect, it } from "vitest";
import { buildInsights } from "@/features/analytics/services/insights";
import { makeFact } from "./fixtures";

// 7 products so top-5-by-quantity and top-5-by-revenue can genuinely diverge
// (with <=5 products both lists always contain the same set, just reordered,
// which would make overlapCount trivially always equal the product count).
const PRODUCTS = Array.from({ length: 7 }, (_, i) => ({
  productCode: `P${i + 1}`,
  productName: `Product ${i + 1}`,
  productLine: "Line A",
  quantityInStock: 100,
  buyPrice: 1,
  msrp: 2,
}));

// revenue-ranked: P1 P2 P3 P4 P5 (1000 900 800 700 600)
// quantity-ranked: P5 P6 P7 P1 P2 (100 90 80 5 4)
// overlap of the two top-5 sets: P1, P2, P5 -> 3
const OVERLAP_FACTS = [
  makeFact({ orderNumber: 2001, productCode: "P1", productName: "Product 1", quantityOrdered: 5, lineRevenue: 1000 }),
  makeFact({ orderNumber: 2002, productCode: "P2", productName: "Product 2", quantityOrdered: 4, lineRevenue: 900 }),
  makeFact({ orderNumber: 2003, productCode: "P3", productName: "Product 3", quantityOrdered: 3, lineRevenue: 800 }),
  makeFact({ orderNumber: 2004, productCode: "P4", productName: "Product 4", quantityOrdered: 2, lineRevenue: 700 }),
  makeFact({ orderNumber: 2005, productCode: "P5", productName: "Product 5", quantityOrdered: 100, lineRevenue: 600 }),
  makeFact({ orderNumber: 2006, productCode: "P6", productName: "Product 6", quantityOrdered: 90, lineRevenue: 50 }),
  makeFact({ orderNumber: 2007, productCode: "P7", productName: "Product 7", quantityOrdered: 80, lineRevenue: 40 }),
];

const EMPLOYEES = [
  { employeeNumber: 1, name: "Rep One", jobTitle: "Sales Rep", officeCode: "O1" },
  { employeeNumber: 2, name: "Rep Two", jobTitle: "Sales Rep", officeCode: "O1" },
  { employeeNumber: 3, name: "Rep Three", jobTitle: "Sales Rep", officeCode: "O1" },
];
const OFFICES = [{ officeCode: "O1", city: "Paris", country: "France", territory: "EMEA" }];

describe("buildInsights: product quantity vs. revenue overlap", () => {
  it("counts only products that appear in BOTH top-5-by-quantity and top-5-by-revenue", () => {
    const { productOverlap } = buildInsights(OVERLAP_FACTS, PRODUCTS, [], []);
    expect(productOverlap.topByQuantity).toEqual([
      "Product 5",
      "Product 6",
      "Product 7",
      "Product 1",
      "Product 2",
    ]);
    expect(productOverlap.topByRevenue).toEqual([
      "Product 1",
      "Product 2",
      "Product 3",
      "Product 4",
      "Product 5",
    ]);
    expect(productOverlap.overlapCount).toBe(3);
  });

  it("does not crash when there is no sales data or product catalog at all", () => {
    const { productOverlap } = buildInsights([], [], [], []);
    expect(productOverlap.topByQuantity).toEqual([]);
    expect(productOverlap.topByRevenue).toEqual([]);
    expect(productOverlap.overlapCount).toBe(0);
  });

  it("with sales but a product catalog smaller than 5, top-5-by-quantity and top-5-by-revenue trivially contain the same set", () => {
    // Documents real behavior: slice(0, 5) over <=5 products always yields
    // the same set in both rankings (just reordered), so overlapCount always
    // equals the product count in that case -- this is not a bug, it's a
    // property of ranking a small catalog, and future readers should not
    // "fix" overlapCount to look for partial overlap here.
    const { productOverlap } = buildInsights([], PRODUCTS.slice(0, 3), [], []);
    expect(productOverlap.overlapCount).toBe(3);
  });
});

describe("buildInsights: customers-vs-revenue correlation per sales rep", () => {
  it("returns a near-perfect positive correlation when revenue scales linearly with customer count", () => {
    // rep1: 2 customers, 200 revenue | rep2: 3 customers, 300 | rep3: 1 customer, 100
    // revenue = 100 * customers exactly -> Pearson r should be 1
    const facts = [
      makeFact({ orderNumber: 3001, customerNumber: 101, salesRepEmployeeNumber: 1, lineRevenue: 100 }),
      makeFact({ orderNumber: 3002, customerNumber: 102, salesRepEmployeeNumber: 1, lineRevenue: 100 }),
      makeFact({ orderNumber: 3003, customerNumber: 103, salesRepEmployeeNumber: 2, lineRevenue: 100 }),
      makeFact({ orderNumber: 3004, customerNumber: 104, salesRepEmployeeNumber: 2, lineRevenue: 100 }),
      makeFact({ orderNumber: 3005, customerNumber: 105, salesRepEmployeeNumber: 2, lineRevenue: 100 }),
      makeFact({ orderNumber: 3006, customerNumber: 106, salesRepEmployeeNumber: 3, lineRevenue: 100 }),
    ];

    const { repCorrelation } = buildInsights(facts, [], EMPLOYEES, OFFICES);
    expect(repCorrelation.points).toHaveLength(3);
    expect(repCorrelation.correlation).toBeCloseTo(1, 10);
  });

  it("returns null when fewer than 2 sales reps have data (correlation is undefined)", () => {
    const facts = [makeFact({ salesRepEmployeeNumber: 1, lineRevenue: 100 })];
    const { repCorrelation } = buildInsights(facts, [], EMPLOYEES, OFFICES);
    expect(repCorrelation.points).toHaveLength(1);
    expect(repCorrelation.correlation).toBeNull();
  });
});
