-- Automated data-quality validation queries for the migrated PostgreSQL
-- dataset. Every query here is expected to return 0 on a valid dataset.
--
-- STATUS: Executed against Supabase project flngoumoilywdcozcxom on
-- 2026-09-17, immediately after running sql/migration.sql. All six
-- returned 0 -- confirmed, not assumed.

-- NULL checks on required columns
SELECT COUNT(*) FROM "orderdetails" WHERE "orderNumber" IS NULL; -- expect 0

-- Invalid-value checks
SELECT COUNT(*) FROM "orderdetails" WHERE "quantityOrdered" <= 0; -- expect 0
SELECT COUNT(*) FROM "orderdetails" WHERE "priceEach" < 0; -- expect 0

-- Relationship / foreign-key integrity checks (orphan rows)
SELECT COUNT(*)
FROM "orderdetails" od
LEFT JOIN "orders" o ON od."orderNumber" = o."orderNumber"
WHERE o."orderNumber" IS NULL; -- expect 0

SELECT COUNT(*)
FROM "orders" o
LEFT JOIN "customers" c ON o."customerNumber" = c."customerNumber"
WHERE c."customerNumber" IS NULL; -- expect 0

SELECT COUNT(*)
FROM "employees" e
LEFT JOIN "offices" o ON e."officeCode" = o."officeCode"
WHERE o."officeCode" IS NULL; -- expect 0

-- Row count check -- compare against docs/data-dictionary.md §9 whenever
-- the dataset is reloaded, to catch a partial/duplicated load early.
SELECT 'offices' AS t, COUNT(*) FROM "offices"
UNION ALL SELECT 'employees', COUNT(*) FROM "employees"
UNION ALL SELECT 'customers', COUNT(*) FROM "customers"
UNION ALL SELECT 'productlines', COUNT(*) FROM "productlines"
UNION ALL SELECT 'products', COUNT(*) FROM "products"
UNION ALL SELECT 'orders', COUNT(*) FROM "orders"
UNION ALL SELECT 'payments', COUNT(*) FROM "payments"
UNION ALL SELECT 'orderdetails', COUNT(*) FROM "orderdetails";
-- expect: offices 7, employees 23, customers 122, productlines 7,
-- products 110, orders 326, payments 273, orderdetails 2996
