import { describe, expect, it } from "vitest";
import { monthKey } from "@/lib/data/sales-facts";

describe("monthKey", () => {
  it("extracts the YYYY-MM prefix from a full date string", () => {
    expect(monthKey("2003-11-27")).toBe("2003-11");
  });

  it("is stable for dates already at month granularity", () => {
    expect(monthKey("2024-01")).toBe("2024-01");
  });
});
