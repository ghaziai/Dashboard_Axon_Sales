import type { ProductRow, SaleFact } from "@/lib/data/sales-facts";

export type ProductPerformance = {
  productCode: string;
  productName: string;
  productLine: string;
  revenue: number;
  quantity: number;
  quantityInStock: number;
  buyPrice: number;
  msrp: number;
};

export type LineRevenue = { label: string; revenue: number; quantity: number };

export type ProductAnalysis = {
  topByRevenue: ProductPerformance[];
  topByQuantity: ProductPerformance[];
  revenueByLine: LineRevenue[];
  allProducts: ProductPerformance[];
};

export function buildProductAnalysis(facts: SaleFact[], products: ProductRow[]): ProductAnalysis {
  const perf = new Map<string, ProductPerformance>();
  for (const p of products) {
    perf.set(p.productCode, {
      productCode: p.productCode,
      productName: p.productName,
      productLine: p.productLine,
      revenue: 0,
      quantity: 0,
      quantityInStock: p.quantityInStock,
      buyPrice: p.buyPrice,
      msrp: p.msrp,
    });
  }

  const lineMap = new Map<string, LineRevenue>();
  for (const f of facts) {
    const entry = perf.get(f.productCode);
    if (entry) {
      entry.revenue += f.lineRevenue;
      entry.quantity += f.quantityOrdered;
    }

    const lineEntry = lineMap.get(f.productLine) ?? { label: f.productLine, revenue: 0, quantity: 0 };
    lineEntry.revenue += f.lineRevenue;
    lineEntry.quantity += f.quantityOrdered;
    lineMap.set(f.productLine, lineEntry);
  }

  const allProducts = [...perf.values()];
  const topByRevenue = [...allProducts].sort((a, b) => b.revenue - a.revenue).slice(0, 10);
  const topByQuantity = [...allProducts].sort((a, b) => b.quantity - a.quantity).slice(0, 10);
  const revenueByLine = [...lineMap.values()].sort((a, b) => b.revenue - a.revenue);

  return { topByRevenue, topByQuantity, revenueByLine, allProducts };
}
