import { getSalesData } from "@/lib/data/sales-facts";
import { buildCustomerAnalysis } from "@/features/customers/services/customer-analysis";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { RevenueBarChart } from "@/components/ui/charts/RevenueBarChart";
import { formatCurrency, formatNumber } from "@/lib/format";

export default async function CustomersPage() {
  const { facts, customers } = await getSalesData();
  const { topByRevenue, revenueByCountry } = buildCustomerAnalysis(facts, customers);

  return (
    <div>
      <PageHeader
        title="Analisis Pelanggan"
        description="Pelanggan dan distribusi geografis dengan kontribusi pendapatan tertinggi."
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card title="10 Pelanggan dengan Pendapatan Tertinggi">
          <RevenueBarChart
            data={topByRevenue.map((c) => ({ label: c.customerName, revenue: c.revenue }))}
            height={340}
          />
        </Card>
        <Card title="Pendapatan berdasarkan Negara">
          <RevenueBarChart
            data={revenueByCountry.slice(0, 10).map((c) => ({ label: c.label, revenue: c.revenue }))}
            height={340}
          />
        </Card>
      </div>

      <div className="mt-6">
        <Card title="10 Pelanggan Teratas — Rincian">
          <DataTable
            rowKey={(row) => row.customerNumber}
            rows={topByRevenue}
            columns={[
              { header: "Pelanggan", render: (row) => row.customerName },
              { header: "Negara", render: (row) => row.country },
              { header: "Jumlah Pesanan", align: "right", render: (row) => formatNumber(row.orders) },
              { header: "Pendapatan", align: "right", render: (row) => formatCurrency(row.revenue) },
              {
                header: "Batas Kredit",
                align: "right",
                render: (row) => (row.creditLimit ? formatCurrency(row.creditLimit) : "—"),
              },
            ]}
          />
        </Card>
      </div>
    </div>
  );
}
