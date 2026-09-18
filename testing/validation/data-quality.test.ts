import { beforeAll, describe, expect, it } from "vitest";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Mirrors sql/tests.sql, run against the live Supabase project instead of
// pasted manually into the SQL editor. Uses the public anon key only --
// RLS is open for anon (read), so no service-role secret is needed here,
// same as the app itself.

const EXPECTED_ROW_COUNTS: Record<string, number> = {
  offices: 7,
  employees: 23,
  customers: 122,
  productlines: 7,
  products: 110,
  orders: 326,
  payments: 273,
  orderdetails: 2996,
};

let supabase: SupabaseClient;

beforeAll(() => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set to run data validation tests " +
        "(see .env.local, or the CI workflow's Data validation step).",
    );
  }
  supabase = createClient(url, anonKey);
});

/** PostgREST's max-rows setting caps a single select at 1000 rows -- page through it. */
async function fetchAllValues(table: string, column: string): Promise<Set<string | number>> {
  const pageSize = 1000;
  const values = new Set<string | number>();
  for (let from = 0; ; from += pageSize) {
    const { data, error } = await supabase
      .from(table)
      .select(column)
      .range(from, from + pageSize - 1);
    if (error) throw error;
    if (!data || data.length === 0) break;
    for (const row of data as unknown as Record<string, string | number>[]) values.add(row[column]);
    if (data.length < pageSize) break;
  }
  return values;
}

describe("NULL checks", () => {
  it("orderdetails.orderNumber has no NULLs", async () => {
    const { count, error } = await supabase
      .from("orderdetails")
      .select("*", { count: "exact", head: true })
      .is("orderNumber", null);
    expect(error).toBeNull();
    expect(count).toBe(0);
  });
});

describe("invalid-value checks", () => {
  it("orderdetails.quantityOrdered has no values <= 0", async () => {
    const { count, error } = await supabase
      .from("orderdetails")
      .select("*", { count: "exact", head: true })
      .lte("quantityOrdered", 0);
    expect(error).toBeNull();
    expect(count).toBe(0);
  });

  it("orderdetails.priceEach has no negative values", async () => {
    const { count, error } = await supabase
      .from("orderdetails")
      .select("*", { count: "exact", head: true })
      .lt("priceEach", 0);
    expect(error).toBeNull();
    expect(count).toBe(0);
  });
});

describe("relationship / foreign-key integrity (no orphan rows)", () => {
  it("every orderdetails.orderNumber exists in orders", async () => {
    const [childValues, parentValues] = await Promise.all([
      fetchAllValues("orderdetails", "orderNumber"),
      fetchAllValues("orders", "orderNumber"),
    ]);
    const orphans = [...childValues].filter((v) => !parentValues.has(v));
    expect(orphans).toEqual([]);
  });

  it("every orders.customerNumber exists in customers", async () => {
    const [childValues, parentValues] = await Promise.all([
      fetchAllValues("orders", "customerNumber"),
      fetchAllValues("customers", "customerNumber"),
    ]);
    const orphans = [...childValues].filter((v) => !parentValues.has(v));
    expect(orphans).toEqual([]);
  });

  it("every employees.officeCode exists in offices", async () => {
    const [childValues, parentValues] = await Promise.all([
      fetchAllValues("employees", "officeCode"),
      fetchAllValues("offices", "officeCode"),
    ]);
    const orphans = [...childValues].filter((v) => !parentValues.has(v));
    expect(orphans).toEqual([]);
  });
});

describe("row counts (catches a partial/duplicated reload)", () => {
  for (const [table, expected] of Object.entries(EXPECTED_ROW_COUNTS)) {
    it(`${table} has ${expected} rows`, async () => {
      const { count, error } = await supabase.from(table).select("*", { count: "exact", head: true });
      expect(error).toBeNull();
      expect(count).toBe(expected);
    });
  }
});
