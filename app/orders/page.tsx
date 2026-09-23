import { getSalesData } from "@/lib/data/sales-facts";
import { buildOrderAnalysis } from "@/features/orders/services/order-analysis";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { OrderClientTable } from "@/features/orders/components/OrderClientTable";
import { StatusPieChart } from "@/features/orders/components/StatusPieChart";
import { RevenueBarChart } from "@/components/ui/charts/RevenueBarChart";
import { formatCurrency, formatNumber } from "@/lib/format";
import { KpiCard } from "@/components/ui/KpiCard";

export default async function OrdersPage() {
  const { facts } = await getSalesData();
  const analysis = buildOrderAnalysis(facts);

  return (
    <div>
      <PageHeader
        title="Manajemen Pesanan"
        description="Analisis dan pelacakan pesanan pelanggan secara menyeluruh."
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard label="Total Pesanan" value={formatNumber(analysis.totalOrders)} />
        <KpiCard label="Total Nilai Pesanan" value={formatCurrency(analysis.totalRevenue)} />
        <KpiCard label="Rata-rata Nilai Pesanan (AOV)" value={formatCurrency(analysis.averageOrderValue)} />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card title="Distribusi Status Pesanan">
            <StatusPieChart data={analysis.statusDistribution} />
          </Card>
        </div>
        <div className="lg:col-span-2">
          <Card title="Top 5 Pelanggan (Nilai Pesanan)">
            <RevenueBarChart data={analysis.topCustomers} height={280} />
          </Card>
        </div>
      </div>

      <div className="mb-6">
        <Card title="Daftar Lengkap Pesanan">
          <OrderClientTable orders={analysis.allOrders} />
        </Card>
      </div>
    </div>
  );
}
