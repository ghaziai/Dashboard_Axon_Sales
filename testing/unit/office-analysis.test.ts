import { describe, expect, it } from "vitest";
import { buildOfficeAnalysis } from "@/features/offices/services/office-analysis";
import { SAMPLE_EMPLOYEES, SAMPLE_FACTS, SAMPLE_OFFICES, makeFact } from "./fixtures";

describe("buildOfficeAnalysis", () => {
  const analysis = buildOfficeAnalysis(SAMPLE_FACTS, SAMPLE_OFFICES, SAMPLE_EMPLOYEES);

  it("aggregates revenue and distinct customer count per office", () => {
    expect(analysis.officePerformance).toEqual([
      {
        officeCode: "O1",
        city: "Paris",
        country: "France",
        territory: "EMEA",
        employees: 1,
        customers: 1,
        revenue: 550,
      },
      {
        officeCode: "O2",
        city: "Tokyo",
        country: "Japan",
        territory: "Japan",
        employees: 1,
        customers: 1,
        revenue: 80,
      },
    ]);
  });

  it("includes offices with zero revenue instead of dropping them", () => {
    const officesWithExtra = [...SAMPLE_OFFICES, { officeCode: "O3", city: "Berlin", country: "Germany", territory: "EMEA" }];
    const result = buildOfficeAnalysis(SAMPLE_FACTS, officesWithExtra, SAMPLE_EMPLOYEES);
    const berlin = result.officePerformance.find((o) => o.officeCode === "O3");
    expect(berlin).toMatchObject({ employees: 0, customers: 0, revenue: 0 });
  });

  it("rolls up office revenue into territory revenue", () => {
    expect(analysis.territoryRevenue).toEqual([
      { label: "EMEA", revenue: 550 },
      { label: "Japan", revenue: 80 },
    ]);
  });

  it("skips order lines with no resolved office instead of crashing", () => {
    const factWithNoOffice = makeFact({ officeCode: null });
    const result = buildOfficeAnalysis([factWithNoOffice], SAMPLE_OFFICES, SAMPLE_EMPLOYEES);
    expect(result.officePerformance.every((o) => o.revenue === 0)).toBe(true);
  });
});
