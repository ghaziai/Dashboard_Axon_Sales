import { getSalesData } from "@/lib/data/sales-facts";
import { buildProductAnalysis } from "@/features/products/services/product-analysis";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { RevenueBarChart } from "@/components/ui/charts/RevenueBarChart";
import { ProductClientTable } from "@/features/products/components/ProductClientTable";

export default async function ProductsPage() {
  const { facts, products } = await getSalesData();
  const { topByRevenue, revenueByLine } = buildProductAnalysis(facts, products);

  return (
    <div>
      <PageHeader
        title="Analisis Produk"
        description="Produk dan lini produk dengan kontribusi pendapatan dan kuantitas tertinggi."
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card title="10 Produk dengan Pendapatan Tertinggi">
          <RevenueBarChart
            data={topByRevenue.map((p) => ({ label: p.productName, revenue: p.revenue }))}
            height={340}
          />
        </Card>
        <Card title="Pendapatan berdasarkan Lini Produk">
          <RevenueBarChart
            data={revenueByLine.map((l) => ({ label: l.label, revenue: l.revenue }))}
            height={340}
          />
        </Card>
      </div>

      <div className="mt-6">
        <Card title="Daftar Lengkap Produk">
          <ProductClientTable products={buildProductAnalysis(facts, products).allProducts} />
        </Card>
      </div>
    </div>
  );
}
