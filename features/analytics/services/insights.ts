import type { EmployeeRow, ProductRow, SaleFact } from "@/lib/data/sales-facts";
import { buildProductAnalysis } from "@/features/products/services/product-analysis";
import { buildEmployeeAnalysis } from "@/features/employees/services/employee-analysis";

export type ProductOverlapInsight = {
  topByQuantity: string[];
  topByRevenue: string[];
  overlapCount: number;
};

export type RepCorrelationInsight = {
  points: { name: string; customers: number; revenue: number }[];
  correlation: number | null;
};

export type Insights = {
  productOverlap: ProductOverlapInsight;
  repCorrelation: RepCorrelationInsight;
};

export function buildInsights(
  facts: SaleFact[],
  products: ProductRow[],
  employees: EmployeeRow[],
  offices: { officeCode: string; city: string; country: string; territory: string }[],
): Insights {
  const { topByQuantity, topByRevenue } = buildProductAnalysis(facts, products);
  const top5Quantity = topByQuantity.slice(0, 5).map((p) => p.productName);
  const top5Revenue = topByRevenue.slice(0, 5).map((p) => p.productName);
  const overlapCount = top5Quantity.filter((name) => top5Revenue.includes(name)).length;

  const { repPerformance } = buildEmployeeAnalysis(facts, employees, offices);
  const points = repPerformance.map((r) => ({
    name: r.name,
    customers: r.customers,
    revenue: r.revenue,
  }));
  const correlation = pearsonCorrelation(
    points.map((p) => p.customers),
    points.map((p) => p.revenue),
  );

  return {
    productOverlap: { topByQuantity: top5Quantity, topByRevenue: top5Revenue, overlapCount },
    repCorrelation: { points, correlation },
  };
}

function pearsonCorrelation(xs: number[], ys: number[]): number | null {
  const n = xs.length;
  if (n < 2) return null;

  const meanX = xs.reduce((a, b) => a + b, 0) / n;
  const meanY = ys.reduce((a, b) => a + b, 0) / n;

  let numerator = 0;
  let sumSqX = 0;
  let sumSqY = 0;
  for (let i = 0; i < n; i++) {
    const dx = xs[i] - meanX;
    const dy = ys[i] - meanY;
    numerator += dx * dy;
    sumSqX += dx * dx;
    sumSqY += dy * dy;
  }

  const denominator = Math.sqrt(sumSqX * sumSqY);
  return denominator === 0 ? null : numerator / denominator;
}
