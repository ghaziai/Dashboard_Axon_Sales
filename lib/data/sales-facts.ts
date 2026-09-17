import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

/**
 * The project's PostgREST max-rows setting caps every select at 1000 rows
 * regardless of an explicit .range() -- page through it to get every row.
 */
async function fetchAllRows<T>(
  supabase: Awaited<ReturnType<typeof createClient>>,
  table: string,
  columns: string,
): Promise<T[]> {
  const pageSize = 1000;
  const rows: T[] = [];
  for (let from = 0; ; from += pageSize) {
    const { data, error } = await supabase
      .from(table)
      .select(columns)
      .range(from, from + pageSize - 1);
    if (error) throw new Error(`Gagal memuat data Supabase (${table}): ${error.message}`);
    if (!data || data.length === 0) break;
    rows.push(...(data as T[]));
    if (data.length < pageSize) break;
  }
  return rows;
}

export type SaleFact = {
  orderNumber: number;
  orderDate: string;
  status: string;
  quantityOrdered: number;
  priceEach: number;
  lineRevenue: number;
  productCode: string;
  productName: string;
  productLine: string;
  customerNumber: number;
  customerName: string;
  country: string;
  salesRepEmployeeNumber: number | null;
  employeeName: string | null;
  officeCode: string | null;
  officeCity: string | null;
  territory: string | null;
};

export type OfficeRow = {
  officeCode: string;
  city: string;
  country: string;
  territory: string;
};

export type EmployeeRow = {
  employeeNumber: number;
  name: string;
  jobTitle: string;
  officeCode: string;
};

export type CustomerRow = {
  customerNumber: number;
  customerName: string;
  country: string;
  creditLimit: number | null;
  salesRepEmployeeNumber: number | null;
};

export type ProductRow = {
  productCode: string;
  productName: string;
  productLine: string;
  quantityInStock: number;
  buyPrice: number;
  msrp: number;
};

export type SalesData = {
  facts: SaleFact[];
  offices: OfficeRow[];
  employees: EmployeeRow[];
  customers: CustomerRow[];
  products: ProductRow[];
};

/**
 * Fetches every base table and joins order lines into a flat fact array.
 * The dataset (~3.9k rows total across 8 tables) is small enough to fetch in
 * full and join/aggregate in memory -- no SQL views or RPC needed.
 * Cached per-request so every page/section reading this only hits Supabase once.
 */
export const getSalesData = cache(async (): Promise<SalesData> => {
  const supabase = await createClient();

  const [officesRes, employeesRes, customersRes, productsRes, ordersRes] = await Promise.all([
    supabase.from("offices").select("officeCode, city, country, territory"),
    supabase.from("employees").select("employeeNumber, firstName, lastName, jobTitle, officeCode"),
    supabase
      .from("customers")
      .select("customerNumber, customerName, country, creditLimit, salesRepEmployeeNumber"),
    supabase
      .from("products")
      .select("productCode, productName, productLine, quantityInStock, buyPrice, MSRP"),
    supabase.from("orders").select("orderNumber, orderDate, status, customerNumber"),
  ]);

  for (const res of [officesRes, employeesRes, customersRes, productsRes, ordersRes]) {
    if (res.error) throw new Error(`Gagal memuat data Supabase: ${res.error.message}`);
  }

  const orderDetailsData = await fetchAllRows<{
    orderNumber: number;
    productCode: string;
    quantityOrdered: number;
    priceEach: number;
  }>(supabase, "orderdetails", "orderNumber, productCode, quantityOrdered, priceEach");

  const offices: OfficeRow[] = (officesRes.data ?? []).map((o) => ({
    officeCode: o.officeCode,
    city: o.city,
    country: o.country,
    territory: o.territory,
  }));
  const officeByCode = new Map(offices.map((o) => [o.officeCode, o]));

  const employees: EmployeeRow[] = (employeesRes.data ?? []).map((e) => ({
    employeeNumber: e.employeeNumber,
    name: `${e.firstName} ${e.lastName}`,
    jobTitle: e.jobTitle,
    officeCode: e.officeCode,
  }));
  const employeeByNumber = new Map(employees.map((e) => [e.employeeNumber, e]));

  const customers: CustomerRow[] = (customersRes.data ?? []).map((c) => ({
    customerNumber: c.customerNumber,
    customerName: c.customerName,
    country: c.country,
    creditLimit: c.creditLimit,
    salesRepEmployeeNumber: c.salesRepEmployeeNumber,
  }));
  const customerByNumber = new Map(customers.map((c) => [c.customerNumber, c]));

  const products: ProductRow[] = (productsRes.data ?? []).map((p) => ({
    productCode: p.productCode,
    productName: p.productName,
    productLine: p.productLine,
    quantityInStock: p.quantityInStock,
    buyPrice: Number(p.buyPrice),
    msrp: Number(p.MSRP),
  }));
  const productByCode = new Map(products.map((p) => [p.productCode, p]));

  const orderByNumber = new Map((ordersRes.data ?? []).map((o) => [o.orderNumber, o]));

  const facts: SaleFact[] = orderDetailsData.flatMap((line) => {
    const order = orderByNumber.get(line.orderNumber);
    const product = productByCode.get(line.productCode);
    if (!order || !product) return [];

    const customer = customerByNumber.get(order.customerNumber);
    const employee = customer?.salesRepEmployeeNumber
      ? employeeByNumber.get(customer.salesRepEmployeeNumber)
      : undefined;
    const office = employee ? officeByCode.get(employee.officeCode) : undefined;

    const quantityOrdered = line.quantityOrdered;
    const priceEach = Number(line.priceEach);

    return [
      {
        orderNumber: order.orderNumber,
        orderDate: order.orderDate,
        status: order.status,
        quantityOrdered,
        priceEach,
        lineRevenue: quantityOrdered * priceEach,
        productCode: product.productCode,
        productName: product.productName,
        productLine: product.productLine,
        customerNumber: order.customerNumber,
        customerName: customer?.customerName ?? "Unknown",
        country: customer?.country ?? "Unknown",
        salesRepEmployeeNumber: customer?.salesRepEmployeeNumber ?? null,
        employeeName: employee?.name ?? null,
        officeCode: employee?.officeCode ?? null,
        officeCity: office?.city ?? null,
        territory: office?.territory ?? null,
      },
    ];
  });

  return { facts, offices, employees, customers, products };
});

export function monthKey(dateString: string): string {
  return dateString.slice(0, 7);
}
