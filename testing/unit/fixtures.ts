import type { SaleFact } from "@/lib/data/sales-facts";

/**
 * Builds one SaleFact with sane defaults, overridden per test. Keeps test
 * files focused on the fields that actually matter for the assertion instead
 * of repeating the full 17-field shape everywhere.
 */
export function makeFact(overrides: Partial<SaleFact> = {}): SaleFact {
  return {
    orderNumber: 1000,
    orderDate: "2023-01-01",
    status: "Shipped",
    quantityOrdered: 1,
    priceEach: 100,
    lineRevenue: 100,
    productCode: "P1",
    productName: "Product 1",
    productLine: "Line A",
    customerNumber: 1,
    customerName: "Customer 1",
    country: "France",
    salesRepEmployeeNumber: 1,
    employeeName: "Employee 1",
    officeCode: "O1",
    officeCity: "Paris",
    territory: "EMEA",
    ...overrides,
  };
}

/**
 * A small, hand-computed dataset shared by dashboard/sales/product/customer/
 * employee/office tests so their outputs can be cross-checked against each
 * other (e.g. total revenue from the overview must equal the sum of yearly
 * revenue from sales-analysis), mirroring how sql/tests.sql's row-count
 * check cross-validates against docs/data-dictionary.md.
 *
 * Two customers (Acme Corp / France / rep Alice, Toko Maju / Japan / rep
 * Budi), three orders, four order lines. Expected aggregates are documented
 * inline in each test file rather than here.
 */
export const SAMPLE_FACTS: SaleFact[] = [
  makeFact({
    orderNumber: 1001,
    orderDate: "2023-01-15",
    status: "Shipped",
    productCode: "P1",
    productName: "Widget A",
    productLine: "Gadgets",
    quantityOrdered: 10,
    priceEach: 20,
    lineRevenue: 200,
    customerNumber: 1,
    customerName: "Acme Corp",
    country: "France",
    salesRepEmployeeNumber: 1,
    employeeName: "Alice Tan",
    officeCode: "O1",
    officeCity: "Paris",
    territory: "EMEA",
  }),
  makeFact({
    orderNumber: 1001,
    orderDate: "2023-01-15",
    status: "Shipped",
    productCode: "P2",
    productName: "Widget B",
    productLine: "Gadgets",
    quantityOrdered: 5,
    priceEach: 30,
    lineRevenue: 150,
    customerNumber: 1,
    customerName: "Acme Corp",
    country: "France",
    salesRepEmployeeNumber: 1,
    employeeName: "Alice Tan",
    officeCode: "O1",
    officeCity: "Paris",
    territory: "EMEA",
  }),
  makeFact({
    orderNumber: 1002,
    orderDate: "2023-02-10",
    status: "Shipped",
    productCode: "P1",
    productName: "Widget A",
    productLine: "Gadgets",
    quantityOrdered: 4,
    priceEach: 20,
    lineRevenue: 80,
    customerNumber: 2,
    customerName: "Toko Maju",
    country: "Japan",
    salesRepEmployeeNumber: 2,
    employeeName: "Budi Santoso",
    officeCode: "O2",
    officeCity: "Tokyo",
    territory: "Japan",
  }),
  makeFact({
    orderNumber: 1003,
    orderDate: "2024-01-20",
    status: "Cancelled",
    productCode: "P3",
    productName: "Gizmo C",
    productLine: "Tools",
    quantityOrdered: 2,
    priceEach: 100,
    lineRevenue: 200,
    customerNumber: 1,
    customerName: "Acme Corp",
    country: "France",
    salesRepEmployeeNumber: 1,
    employeeName: "Alice Tan",
    officeCode: "O1",
    officeCity: "Paris",
    territory: "EMEA",
  }),
];

export const SAMPLE_PRODUCTS = [
  { productCode: "P1", productName: "Widget A", productLine: "Gadgets", quantityInStock: 100, buyPrice: 10, msrp: 25 },
  { productCode: "P2", productName: "Widget B", productLine: "Gadgets", quantityInStock: 50, buyPrice: 15, msrp: 35 },
  { productCode: "P3", productName: "Gizmo C", productLine: "Tools", quantityInStock: 20, buyPrice: 50, msrp: 120 },
  { productCode: "P4", productName: "Unsold Gadget", productLine: "Gadgets", quantityInStock: 5, buyPrice: 5, msrp: 10 },
];

export const SAMPLE_CUSTOMERS = [
  { customerNumber: 1, customerName: "Acme Corp", country: "France", creditLimit: 50000, salesRepEmployeeNumber: 1 },
  { customerNumber: 2, customerName: "Toko Maju", country: "Japan", creditLimit: 30000, salesRepEmployeeNumber: 2 },
  { customerNumber: 3, customerName: "Dormant Co", country: "Germany", creditLimit: 1000, salesRepEmployeeNumber: null },
];

export const SAMPLE_EMPLOYEES = [
  { employeeNumber: 1, name: "Alice Tan", jobTitle: "Sales Rep", officeCode: "O1" },
  { employeeNumber: 2, name: "Budi Santoso", jobTitle: "Sales Rep", officeCode: "O2" },
];

export const SAMPLE_OFFICES = [
  { officeCode: "O1", city: "Paris", country: "France", territory: "EMEA" },
  { officeCode: "O2", city: "Tokyo", country: "Japan", territory: "Japan" },
];
