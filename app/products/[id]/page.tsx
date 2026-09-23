import { getSalesData } from "@/lib/data/sales-facts";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { formatCurrency, formatNumber, formatDate } from "@/lib/format";
import Link from "next/link";
import { notFound } from "next/navigation";
import { KpiCard } from "@/components/ui/KpiCard";
import { ArrowLeft } from "lucide-react";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const { facts, products } = await getSalesData();
  
  const product = products.find((p) => p.productCode === resolvedParams.id);
  if (!product) {
    notFound();
  }

  const productSales = facts.filter((f) => f.productCode === resolvedParams.id);
  
  const totalRevenue = productSales.reduce((sum, f) => sum + f.lineRevenue, 0);
  const totalSold = productSales.reduce((sum, f) => sum + f.quantityOrdered, 0);
  const margin = product.msrp ? (product.msrp - product.buyPrice) / product.msrp : 0;

  return (
    <div>
      <div className="mb-4">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Produk
        </Link>
      </div>
      
      <PageHeader
        title={product.productName}
        description={`Lini Produk: ${product.productLine} | Kode: ${product.productCode}`}
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Stok Tersisa"
          value={formatNumber(product.quantityInStock)}
        />
        <KpiCard
          label="Total Terjual"
          value={formatNumber(totalSold)}
        />
        <KpiCard
          label="Total Pendapatan"
          value={formatCurrency(totalRevenue)}
        />
        <KpiCard
          label="Margin Laba (MSRP)"
          value={`${(margin * 100).toFixed(1)}%`}
        />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card title="Harga Modal">
          <div className="text-2xl font-bold">{formatCurrency(product.buyPrice)}</div>
        </Card>
        <Card title="Harga Eceran Disarankan (MSRP)">
          <div className="text-2xl font-bold">{formatCurrency(product.msrp)}</div>
        </Card>
      </div>

      <Card title="Riwayat Penjualan">
        <DataTable
          rowKey={(row) => `${row.orderNumber}-${row.productCode}`}
          rows={productSales.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())}
          columns={[
            {
              header: "Nomor Pesanan",
              render: (row) => (
                <Link href={`/orders/${row.orderNumber}`} className="font-medium text-blue-600 hover:underline dark:text-blue-400">
                  #{row.orderNumber}
                </Link>
              ),
            },
            { header: "Tanggal", render: (row) => formatDate(row.orderDate) },
            { header: "Pelanggan", render: (row) => row.customerName },
            { header: "Status", render: (row) => row.status },
            { header: "Kuantitas", align: "right", render: (row) => formatNumber(row.quantityOrdered) },
            { header: "Harga Satuan", align: "right", render: (row) => formatCurrency(row.priceEach) },
            { header: "Subtotal", align: "right", render: (row) => formatCurrency(row.lineRevenue) },
          ]}
        />
      </Card>
    </div>
  );
}
