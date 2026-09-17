import { getSalesData } from "@/lib/data/sales-facts";
import { buildOverviewSummary } from "@/features/dashboard/services/overview";
import { PageHeader } from "@/components/ui/PageHeader";
import { KpiCard } from "@/components/ui/KpiCard";
import { Card } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { RevenueLineChart } from "@/components/ui/charts/RevenueLineChart";
import { formatCurrency, formatMonthKey, formatNumber } from "@/lib/format";

export default async function OverviewPage() {
  const { facts } = await getSalesData();
  const summary = buildOverviewSummary(facts);

  return (
    <div>
      <PageHeader
        title="Ikhtisar"
        description="Ringkasan kinerja penjualan Axon dari seluruh pesanan yang tercatat."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Total Pendapatan" value={formatCurrency(summary.totalRevenue)} />
        <KpiCard label="Total Pesanan" value={formatNumber(summary.totalOrders)} />
        <KpiCard label="Total Kuantitas Terjual" value={formatNumber(summary.totalQuantity)} />
        <KpiCard
          label="Rata-rata Nilai Pesanan"
          value={formatCurrency(summary.avgOrderValue)}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card title="Tren Pendapatan Bulanan" className="lg:col-span-2">
          <RevenueLineChart data={summary.monthlyRevenue} />
        </Card>
        <Card title="Periode Kinerja Terbaik">
          {summary.bestMonth ? (
            <div>
              <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                {formatMonthKey(summary.bestMonth.month)}
              </p>
              <p className="mt-2 text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
                {formatCurrency(summary.bestMonth.revenue)}
              </p>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Bulan dengan pendapatan tertinggi sepanjang riwayat pesanan.
              </p>
            </div>
          ) : (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Belum ada data.</p>
          )}
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card title="5 Produk dengan Pendapatan Tertinggi">
          <DataTable
            rowKey={(row) => row.label}
            rows={summary.topProducts}
            columns={[
              { header: "Produk", render: (row) => row.label },
              {
                header: "Pendapatan",
                align: "right",
                render: (row) => formatCurrency(row.revenue),
              },
            ]}
          />
        </Card>
        <Card title="5 Pelanggan dengan Pendapatan Tertinggi">
          <DataTable
            rowKey={(row) => row.label}
            rows={summary.topCustomers}
            columns={[
              { header: "Pelanggan", render: (row) => row.label },
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
