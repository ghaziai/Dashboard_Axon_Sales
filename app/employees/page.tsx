import { getSalesData } from "@/lib/data/sales-facts";
import { buildEmployeeAnalysis } from "@/features/employees/services/employee-analysis";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { RevenueBarChart } from "@/components/ui/charts/RevenueBarChart";
import { formatCurrency, formatNumber } from "@/lib/format";

export default async function EmployeesPage() {
  const { facts, employees, offices } = await getSalesData();
  const { repPerformance } = buildEmployeeAnalysis(facts, employees, offices);

  return (
    <div>
      <PageHeader
        title="Analisis Karyawan"
        description="Kinerja perwakilan penjualan: pendapatan, jumlah pelanggan, dan jumlah pesanan yang ditangani."
      />

      <Card title="Pendapatan per Perwakilan Penjualan">
        <RevenueBarChart
          data={repPerformance.map((r) => ({ label: r.name, revenue: r.revenue }))}
          height={Math.max(280, repPerformance.length * 32)}
        />
      </Card>

      <div className="mt-6">
        <Card title="Rincian Kinerja Perwakilan Penjualan">
          <DataTable
            rowKey={(row) => row.employeeNumber}
            rows={repPerformance}
            columns={[
              { header: "Nama", render: (row) => row.name },
              { header: "Jabatan", render: (row) => row.jobTitle },
              { header: "Kantor", render: (row) => row.officeCity },
              { header: "Pelanggan", align: "right", render: (row) => formatNumber(row.customers) },
              { header: "Pesanan", align: "right", render: (row) => formatNumber(row.orders) },
              { header: "Pendapatan", align: "right", render: (row) => formatCurrency(row.revenue) },
            ]}
          />
        </Card>
      </div>
    </div>
  );
}
