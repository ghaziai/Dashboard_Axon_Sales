import { getSalesData } from "@/lib/data/sales-facts";
import { buildSalesAnalysis } from "@/features/sales/services/sales-analysis";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { formatCurrency, formatMonthKey, formatNumber, formatPercent } from "@/lib/format";

export default async function SalesPage() {
  const { facts } = await getSalesData();
  const { yearlyRevenue, statusBreakdown, topMonths } = buildSalesAnalysis(facts);

  return (
    <div>
      <PageHeader
        title="Analisis Penjualan"
        description="Tren pendapatan tahunan, perbandingan tahun-ke-tahun, dan status pesanan."
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card title="Pendapatan per Tahun (YoY)">
          <DataTable
            rowKey={(row) => row.year}
            rows={yearlyRevenue}
            columns={[
              { header: "Tahun", render: (row) => row.year },
              { header: "Pesanan", align: "right", render: (row) => formatNumber(row.orders) },
              {
                header: "Pendapatan",
                align: "right",
                render: (row) => formatCurrency(row.revenue),
              },
              {
                header: "Perubahan YoY",
                align: "right",
                render: (row) => (row.changePct === null ? "—" : formatPercent(row.changePct)),
              },
            ]}
          />
        </Card>

        <Card title="Distribusi Pesanan berdasarkan Status">
          <DataTable
            rowKey={(row) => row.status}
            rows={statusBreakdown}
            columns={[
              { header: "Status", render: (row) => row.status },
              { header: "Pesanan", align: "right", render: (row) => formatNumber(row.orders) },
              {
                header: "Pendapatan",
                align: "right",
                render: (row) => formatCurrency(row.revenue),
              },
            ]}
          />
        </Card>
      </div>

      <div className="mt-6">
        <Card title="10 Periode (Bulan) dengan Pendapatan Tertinggi">
          <DataTable
            rowKey={(row) => row.month}
            rows={topMonths}
            columns={[
              { header: "Bulan", render: (row) => formatMonthKey(row.month) },
              {
                header: "Pendapatan",
                align: "right",
                render: (row) => formatCurrency(row.revenue),
              },
            ]}
          />
        </Card>
      </div>
    </div>
  );
}
