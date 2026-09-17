import { getSalesData } from "@/lib/data/sales-facts";
import { buildOfficeAnalysis } from "@/features/offices/services/office-analysis";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { RevenuePieChart } from "@/components/ui/charts/RevenuePieChart";
import { formatCurrency, formatNumber } from "@/lib/format";

export default async function OfficesPage() {
  const { facts, offices, employees } = await getSalesData();
  const { officePerformance, territoryRevenue } = buildOfficeAnalysis(facts, offices, employees);

  return (
    <div>
      <PageHeader
        title="Analisis Kantor"
        description="Kinerja geografis: pendapatan, jumlah perwakilan, dan jumlah pelanggan per kantor/wilayah."
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card title="Pendapatan berdasarkan Wilayah (Territory)">
          <RevenuePieChart data={territoryRevenue} />
        </Card>
        <Card title="Distribusi Kantor">
          <DataTable
            rowKey={(row) => row.officeCode}
            rows={officePerformance}
            columns={[
              { header: "Kota", render: (row) => row.city },
              { header: "Negara", render: (row) => row.country },
              { header: "Wilayah", render: (row) => row.territory },
              { header: "Karyawan", align: "right", render: (row) => formatNumber(row.employees) },
            ]}
          />
        </Card>
      </div>

      <div className="mt-6">
        <Card title="Kinerja per Kantor">
          <DataTable
            rowKey={(row) => row.officeCode}
            rows={officePerformance}
            columns={[
              { header: "Kota", render: (row) => row.city },
              { header: "Wilayah", render: (row) => row.territory },
              { header: "Pelanggan", align: "right", render: (row) => formatNumber(row.customers) },
              { header: "Pendapatan", align: "right", render: (row) => formatCurrency(row.revenue) },
            ]}
          />
        </Card>
      </div>
    </div>
  );
}
