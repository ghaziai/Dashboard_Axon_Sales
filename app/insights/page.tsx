import { getSalesData } from "@/lib/data/sales-facts";
import { buildInsights } from "@/features/analytics/services/insights";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { formatCurrency, formatNumber } from "@/lib/format";

export default async function InsightsPage() {
  const { facts, products, employees, offices } = await getSalesData();
  const { productOverlap, repCorrelation } = buildInsights(facts, products, employees, offices);

  return (
    <div>
      <PageHeader
        title="Wawasan Lanjutan"
        description="Pertanyaan analitik lintas-entitas yang tidak terikat pada satu domain fitur."
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card title="Produk terlaris vs. produk berpendapatan tertinggi">
          <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
            Dari 5 produk dengan kuantitas terjual tertinggi,{" "}
            <strong>{productOverlap.overlapCount} dari 5</strong> juga masuk daftar 5
            produk dengan pendapatan tertinggi — kuantitas tinggi tidak selalu berarti
            pendapatan tertinggi, karena harga per unit berbeda-beda antar produk.
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Top 5 Kuantitas
              </p>
              <ol className="list-inside list-decimal space-y-1 text-zinc-700 dark:text-zinc-300">
                {productOverlap.topByQuantity.map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ol>
            </div>
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Top 5 Pendapatan
              </p>
              <ol className="list-inside list-decimal space-y-1 text-zinc-700 dark:text-zinc-300">
                {productOverlap.topByRevenue.map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ol>
            </div>
          </div>
        </Card>

        <Card title="Jumlah pelanggan vs. pendapatan per perwakilan penjualan">
          <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
            Koefisien korelasi Pearson antara jumlah pelanggan yang ditangani dan
            pendapatan yang dihasilkan per perwakilan penjualan:{" "}
            <strong>
              {repCorrelation.correlation === null
                ? "tidak dapat dihitung"
                : repCorrelation.correlation.toFixed(2)}
            </strong>
            {repCorrelation.correlation !== null && (
              <>
                {" "}
                (
                {Math.abs(repCorrelation.correlation) > 0.6
                  ? "korelasi kuat"
                  : Math.abs(repCorrelation.correlation) > 0.3
                    ? "korelasi sedang"
                    : "korelasi lemah"}
                ).
              </>
            )}
          </p>
          <DataTable
            rowKey={(row) => row.name}
            rows={repCorrelation.points}
            columns={[
              { header: "Perwakilan", render: (row) => row.name },
              { header: "Pelanggan", align: "right", render: (row) => formatNumber(row.customers) },
              { header: "Pendapatan", align: "right", render: (row) => formatCurrency(row.revenue) },
            ]}
          />
        </Card>
      </div>
    </div>
  );
}
