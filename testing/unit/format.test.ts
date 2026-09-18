import { describe, expect, it } from "vitest";
import {
  formatCurrency,
  formatCurrencyCompact,
  formatMonthKey,
  formatNumber,
  formatPercent,
} from "@/lib/format";

describe("formatCurrency", () => {
  it("formats whole USD amounts with no decimals", () => {
    expect(formatCurrency(9604191)).toBe("$9,604,191");
  });

  it("formats zero", () => {
    expect(formatCurrency(0)).toBe("$0");
  });
});

describe("formatCurrencyCompact", () => {
  it("compacts large amounts", () => {
    expect(formatCurrencyCompact(988025)).toBe("$988.0K");
  });
});

describe("formatNumber", () => {
  it("adds thousands separators", () => {
    expect(formatNumber(105516)).toBe("105,516");
  });
});

describe("formatPercent", () => {
  it("prefixes positive values with a plus sign", () => {
    expect(formatPercent(36.1)).toBe("+36.1%");
  });

  it("does not add a plus sign for negative values", () => {
    expect(formatPercent(-60.8)).toBe("-60.8%");
  });

  it("rounds to one decimal place", () => {
    expect(formatPercent(12.345)).toBe("+12.3%");
  });
});

describe("formatMonthKey", () => {
  it("formats a YYYY-MM key as Indonesian month + year", () => {
    expect(formatMonthKey("2003-11")).toBe("Nov 2003");
  });

  it("handles January correctly (0-indexed Date month off-by-one risk)", () => {
    expect(formatMonthKey("2024-01")).toBe("Jan 2024");
  });
});
