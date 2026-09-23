import { getSalesData } from "@/lib/data/sales-facts";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { formatCurrency, formatNumber, formatDate } from "@/lib/format";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { OrderStatusBadge } from "@/features/orders/components/OrderStatusBadge";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const orderId = Number(resolvedParams.id);
  if (isNaN(orderId)) notFound();

  const { facts } = await getSalesData();
  
  const orderLines = facts.filter((f) => f.orderNumber === orderId);
  if (orderLines.length === 0) {
    notFound();
  }

  // Get common order details from the first line
  const orderInfo = orderLines[0];
  const totalItems = orderLines.reduce((sum, line) => sum + line.quantityOrdered, 0);
  const totalRevenue = orderLines.reduce((sum, line) => sum + line.lineRevenue, 0);

  return (
    <div>
      <div className="mb-4">
        <Link
          href="/orders"
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Pesanan
        </Link>
      </div>
      
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <PageHeader
          title={`Pesanan #${orderInfo.orderNumber}`}
          description={`Tanggal: ${formatDate(orderInfo.orderDate)}`}
        />
        <div>
          <OrderStatusBadge status={orderInfo.status} />
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card title="Informasi Pelanggan">
          <div className="text-sm space-y-1">
            <p><strong className="font-semibold">Nama:</strong> {orderInfo.customerName}</p>
            <p><strong className="font-semibold">Negara:</strong> {orderInfo.country}</p>
            <p><strong className="font-semibold">Sales Rep:</strong> {orderInfo.employeeName ?? "-"}</p>
          </div>
        </Card>
        
        <Card title="Ringkasan Pesanan">
          <div className="text-sm space-y-1">
            <p><strong className="font-semibold">Total Item:</strong> {formatNumber(totalItems)}</p>
            <p><strong className="font-semibold">Total Nilai:</strong> {formatCurrency(totalRevenue)}</p>
          </div>
        </Card>
      </div>

      <Card title="Item Pesanan">
        <DataTable
          rowKey={(row) => row.productCode}
          rows={orderLines}
          columns={[
            {
              header: "Kode Produk",
              render: (row) => (
                <Link href={`/products/${row.productCode}`} className="font-medium text-blue-600 hover:underline dark:text-blue-400">
                  {row.productCode}
                </Link>
              ),
            },
            { header: "Nama Produk", render: (row) => row.productName },
            { header: "Lini Produk", render: (row) => row.productLine },
            { header: "Kuantitas", align: "right", render: (row) => formatNumber(row.quantityOrdered) },
            { header: "Harga Satuan", align: "right", render: (row) => formatCurrency(row.priceEach) },
            { header: "Subtotal", align: "right", render: (row) => formatCurrency(row.lineRevenue) },
          ]}
        />
      </Card>
    </div>
  );
}
