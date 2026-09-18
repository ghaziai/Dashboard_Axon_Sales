import { describe, expect, it } from "vitest";
import { buildEmployeeAnalysis } from "@/features/employees/services/employee-analysis";
import { SAMPLE_EMPLOYEES, SAMPLE_FACTS, SAMPLE_OFFICES, makeFact } from "./fixtures";

describe("buildEmployeeAnalysis", () => {
  const analysis = buildEmployeeAnalysis(SAMPLE_FACTS, SAMPLE_EMPLOYEES, SAMPLE_OFFICES);

  it("aggregates revenue and distinct customer/order counts per sales rep", () => {
    expect(analysis.repPerformance).toEqual([
      {
        employeeNumber: 1,
        name: "Alice Tan",
        jobTitle: "Sales Rep",
        officeCity: "Paris",
        customers: 1,
        orders: 2,
        revenue: 550,
      },
      {
        employeeNumber: 2,
        name: "Budi Santoso",
        jobTitle: "Sales Rep",
        officeCity: "Tokyo",
        customers: 1,
        orders: 1,
        revenue: 80,
      },
    ]);
  });

  it("sorts reps by revenue desc", () => {
    expect(analysis.repPerformance[0].revenue).toBeGreaterThan(analysis.repPerformance[1].revenue);
  });

  it("excludes order lines with no assigned sales rep instead of crashing", () => {
    const factWithNoRep = makeFact({ salesRepEmployeeNumber: null });
    const result = buildEmployeeAnalysis([factWithNoRep], SAMPLE_EMPLOYEES, SAMPLE_OFFICES);
    expect(result.repPerformance).toEqual([]);
  });

  it("falls back to a placeholder name/office when the rep is not in the employee roster", () => {
    const factForUnknownRep = makeFact({ salesRepEmployeeNumber: 999 });
    const result = buildEmployeeAnalysis([factForUnknownRep], SAMPLE_EMPLOYEES, SAMPLE_OFFICES);
    expect(result.repPerformance).toEqual([
      {
        employeeNumber: 999,
        name: "#999",
        jobTitle: "—",
        officeCity: "—",
        customers: 1,
        orders: 1,
        revenue: 100,
      },
    ]);
  });
});
