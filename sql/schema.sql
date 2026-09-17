-- Target PostgreSQL (Supabase) schema for the classicmodels dataset.
--
-- Derived directly from sql/source/classicmodels_mysql_dump.sql after the
-- full inspection documented in docs/data-dictionary.md. Column names are
-- kept identical to the source (camelCase, double-quoted) -- no renaming
-- decision has been made yet (see data-dictionary.md §11).
--
-- Tables are created in dependency order (root tables first) so this file
-- can be run top to bottom with no forward references.
--
-- STATUS: Written from source inspection, not yet executed against a real
-- PostgreSQL/Supabase instance -- syntax has been reviewed manually but not
-- validated by actually running it. Do that before relying on it.

-- 1. offices -- no outgoing foreign keys
CREATE TABLE "offices" (
  "officeCode" varchar(10) NOT NULL,
  "city" varchar(50) NOT NULL,
  "phone" varchar(50) NOT NULL,
  "addressLine1" varchar(50) NOT NULL,
  "addressLine2" varchar(50),
  "state" varchar(50),
  "country" varchar(50) NOT NULL,
  "postalCode" varchar(15) NOT NULL,
  "territory" varchar(10) NOT NULL,
  CONSTRAINT "pk_offices" PRIMARY KEY ("officeCode")
);

-- 2. employees -- FK to offices, self-referencing FK (reportsTo)
CREATE TABLE "employees" (
  "employeeNumber" integer NOT NULL,
  "lastName" varchar(50) NOT NULL,
  "firstName" varchar(50) NOT NULL,
  "extension" varchar(10) NOT NULL,
  "email" varchar(100) NOT NULL,
  "officeCode" varchar(10) NOT NULL,
  "reportsTo" integer,
  "jobTitle" varchar(50) NOT NULL,
  CONSTRAINT "pk_employees" PRIMARY KEY ("employeeNumber"),
  CONSTRAINT "fk_employees_office" FOREIGN KEY ("officeCode")
    REFERENCES "offices" ("officeCode"),
  -- Source data is already topologically ordered (managers before their
  -- reports), but DEFERRABLE removes any dependency on insert order being
  -- preserved during migration -- checked at transaction commit instead.
  CONSTRAINT "fk_employees_reports_to" FOREIGN KEY ("reportsTo")
    REFERENCES "employees" ("employeeNumber")
    DEFERRABLE INITIALLY DEFERRED
);
CREATE INDEX "idx_employees_office_code" ON "employees" ("officeCode");
CREATE INDEX "idx_employees_reports_to" ON "employees" ("reportsTo");

-- 3. customers -- FK to employees (nullable: not every customer has a rep)
CREATE TABLE "customers" (
  "customerNumber" integer NOT NULL,
  "customerName" varchar(50) NOT NULL,
  "contactLastName" varchar(50) NOT NULL,
  "contactFirstName" varchar(50) NOT NULL,
  "phone" varchar(50) NOT NULL,
  "addressLine1" varchar(50) NOT NULL,
  "addressLine2" varchar(50),
  "city" varchar(50) NOT NULL,
  "state" varchar(50),
  "postalCode" varchar(15),
  "country" varchar(50) NOT NULL,
  "salesRepEmployeeNumber" integer,
  "creditLimit" numeric(10,2),
  CONSTRAINT "pk_customers" PRIMARY KEY ("customerNumber"),
  CONSTRAINT "fk_customers_sales_rep" FOREIGN KEY ("salesRepEmployeeNumber")
    REFERENCES "employees" ("employeeNumber")
);
CREATE INDEX "idx_customers_sales_rep" ON "customers" ("salesRepEmployeeNumber");

-- 4. productlines -- no outgoing foreign keys
CREATE TABLE "productlines" (
  "productLine" varchar(50) NOT NULL,
  "textDescription" varchar(4000),
  "htmlDescription" text,
  "image" bytea,
  CONSTRAINT "pk_productlines" PRIMARY KEY ("productLine")
);

-- 5. products -- FK to productlines
CREATE TABLE "products" (
  "productCode" varchar(15) NOT NULL,
  "productName" varchar(70) NOT NULL,
  "productLine" varchar(50) NOT NULL,
  "productScale" varchar(10) NOT NULL,
  "productVendor" varchar(50) NOT NULL,
  "productDescription" text NOT NULL,
  "quantityInStock" smallint NOT NULL,
  "buyPrice" numeric(10,2) NOT NULL,
  "MSRP" numeric(10,2) NOT NULL,
  CONSTRAINT "pk_products" PRIMARY KEY ("productCode"),
  CONSTRAINT "fk_products_productline" FOREIGN KEY ("productLine")
    REFERENCES "productlines" ("productLine")
);
CREATE INDEX "idx_products_productline" ON "products" ("productLine");

-- 6. orders -- FK to customers
CREATE TABLE "orders" (
  "orderNumber" integer NOT NULL,
  "orderDate" date NOT NULL,
  "requiredDate" date NOT NULL,
  "shippedDate" date,
  "status" varchar(15) NOT NULL,
  "comments" text,
  "customerNumber" integer NOT NULL,
  CONSTRAINT "pk_orders" PRIMARY KEY ("orderNumber"),
  CONSTRAINT "fk_orders_customer" FOREIGN KEY ("customerNumber")
    REFERENCES "customers" ("customerNumber")
);
CREATE INDEX "idx_orders_customer" ON "orders" ("customerNumber");

-- 7. payments -- FK to customers, composite primary key
CREATE TABLE "payments" (
  "customerNumber" integer NOT NULL,
  "checkNumber" varchar(50) NOT NULL,
  "paymentDate" date NOT NULL,
  "amount" numeric(10,2) NOT NULL,
  CONSTRAINT "pk_payments" PRIMARY KEY ("customerNumber", "checkNumber"),
  CONSTRAINT "fk_payments_customer" FOREIGN KEY ("customerNumber")
    REFERENCES "customers" ("customerNumber")
);

-- 8. orderdetails -- FK to orders and products, composite primary key
CREATE TABLE "orderdetails" (
  "orderNumber" integer NOT NULL,
  "productCode" varchar(15) NOT NULL,
  "quantityOrdered" integer NOT NULL,
  "priceEach" numeric(10,2) NOT NULL,
  "orderLineNumber" smallint NOT NULL,
  CONSTRAINT "pk_orderdetails" PRIMARY KEY ("orderNumber", "productCode"),
  CONSTRAINT "fk_orderdetails_order" FOREIGN KEY ("orderNumber")
    REFERENCES "orders" ("orderNumber"),
  CONSTRAINT "fk_orderdetails_product" FOREIGN KEY ("productCode")
    REFERENCES "products" ("productCode")
);
CREATE INDEX "idx_orderdetails_product" ON "orderdetails" ("productCode");
