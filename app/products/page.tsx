import { getSalesData } from "@/lib/data/sales-facts";
import { buildProductAnalysis } from "@/features/products/services/product-analysis";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { RevenueBarChart } from "@/components/ui/charts/RevenueBarChart";
import { formatCurrency, formatNumber } from "@/lib/format";

export default async function ProductsPage() {
  const { facts, products } = await getSalesData();
  const { topByRevenue, topByQuantity, revenueByLine } = buildProductAnalysis(facts, products);

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
        <Card title="10 Produk Terlaris (berdasarkan Kuantitas)">
          <DataTable
            rowKey={(row) => row.productCode}
            rows={topByQuantity}
            columns={[
              { header: "Produk", render: (row) => row.productName },
              { header: "Lini Produk", render: (row) => row.productLine },
              { header: "Kuantitas Terjual", align: "right", render: (row) => formatNumber(row.quantity) },
              { header: "Pendapatan", align: "right", render: (row) => formatCurrency(row.revenue) },
              {
                header: "Stok Tersisa",
                align: "right",
                render: (row) => formatNumber(row.quantityInStock),
              },
            ]}
          />
        </Card>
      </div>
    </div>
  );
}
