// HrDashboardChartProcessor.tsx
// Utility functions for HR Dashboard charts data
// Note: Since API returns data already organized, no complex processing needed

import type {
  HrDashboardChartsApiResponse,
  ProcessedHrDashboardChartData,
  HrDashboardChartType,
  HeadcountByBranchDepartmentChart,
  GroupedAverageTenureByDepartmentChart,
  GroupedHeadcountByBranchDepartmentChart,
  GroupedSeriesConfig,
  HiringAttritionTrendChart,
  TopLeaveTypesChart,
  OvertimeByBranchChart,
  AverageTenureByDepartmentChart,
  AverageTenureByBranchChart,
  PayrollCostByBranchDepartmentChart,
  SalaryDistributionChart,
  SickLeavePatternsChart,
} from "./Hrdashboardchart.types";

/**
 * Process charts data (pass-through since API already returns organized data)
 * Kept for consistency with other dashboard processors
 */
export const processChartsData = (
  rawData: HrDashboardChartsApiResponse
): ProcessedHrDashboardChartData => {
  return rawData;
};

/**
 * Type-safe helper to get chart data by type
 */
export const getChartData = <T extends HrDashboardChartType>(
  processedData: ProcessedHrDashboardChartData | null,
  chartType: T
): ProcessedHrDashboardChartData[T] => {
  return processedData?.[chartType] || ([] as ProcessedHrDashboardChartData[T]);
};

/**
 * Check if a specific chart type has data
 */
export const hasChartData = (
  processedData: ProcessedHrDashboardChartData | null,
  chartType: HrDashboardChartType
): boolean => {
  return (processedData?.[chartType]?.length || 0) > 0;
};

/**
 * Get summary statistics of processed data
 */
export const getProcessedDataSummary = (
  processedData: ProcessedHrDashboardChartData | null
) => {
  if (!processedData) return null;

  return {
    totalChartTypes: Object.keys(processedData).length,
    chartsWithData: Object.values(processedData).filter((arr) => arr.length > 0)
      .length,
    totalDataPoints: Object.values(processedData).reduce(
      (sum, arr) => sum + arr.length,
      0
    ),
    breakdown: {
      headcountByBranchDepartment:
        processedData.HeadcountByBranchDepartment.length,
      hiringAttritionTrend: processedData.HiringAttritionTrend.length,
      topLeaveTypes: processedData.TopLeaveTypes.length,
      overtimeByBranch: processedData.OvertimeByBranch.length,
      averageTenureByDepartment: processedData.AverageTenureByDepartment.length,
      averageTenureByBranch: processedData.AverageTenureByBranch.length,
      headcountTrend: processedData.HeadcountTrend.length,
      payrollCostByBranchDepartment:
        processedData.PayrollCostByBranchDepartment.length,
      salaryDistribution: processedData.SalaryDistribution.length,
      sickLeavePatterns: processedData.SickLeavePatterns.length,
      employeeAgeDistribution: processedData.EmployeeAgeDistribution.length,
      attendanceOverview: processedData.AttendanceOverview.length,
    },
  };
};

// ============================================================================
// Sorting Utilities
// ============================================================================

/**
 * Sort Headcount by Branch & Department
 */
export const sortHeadcountByBranchDepartment = {
  byHeadcount: (
    data: HeadcountByBranchDepartmentChart[],
    order: "asc" | "desc" = "desc"
  ): HeadcountByBranchDepartmentChart[] => {
    return [...data].sort((a, b) =>
      order === "desc" ? b.headcount - a.headcount : a.headcount - b.headcount
    );
  },

  byBranch: (
    data: HeadcountByBranchDepartmentChart[],
    order: "asc" | "desc" = "asc"
  ): HeadcountByBranchDepartmentChart[] => {
    return [...data].sort((a, b) =>
      order === "asc"
        ? a.branch_Name.localeCompare(b.branch_Name)
        : b.branch_Name.localeCompare(a.branch_Name)
    );
  },
};

const getHeadcountJobName = (
  item: HeadcountByBranchDepartmentChart
): string => item.job_Name || item.joB_Name || "Unassigned";

const createSeriesKey = (label: string, index: number): string =>
  `series_${index}_${label.replace(/[^a-zA-Z0-9]+/g, "_").replace(/^_|_$/g, "")}`;

/**
 * Group Headcount by Branch & Department into one row per branch.
 * Each job/department becomes a chart series so the branch remains the x-axis.
 */
export const groupHeadcountByBranchDepartment = (
  data: HeadcountByBranchDepartmentChart[] = []
): {
  data: GroupedHeadcountByBranchDepartmentChart[];
  series: GroupedSeriesConfig[];
} => {
  const seriesByLabel = new Map<string, GroupedSeriesConfig>();
  const rowsByBranch = new Map<string, GroupedHeadcountByBranchDepartmentChart>();

  data.forEach((item) => {
    const branchName = item.branch_Name || "Unassigned";
    const jobName = getHeadcountJobName(item);
    const headcount = Number(item.headcount) || 0;

    if (!seriesByLabel.has(jobName)) {
      seriesByLabel.set(jobName, {
        key: createSeriesKey(jobName, seriesByLabel.size),
        label: jobName,
      });
    }

    const series = seriesByLabel.get(jobName);
    if (!series) return;

    const existingRow =
      rowsByBranch.get(branchName) ||
      ({
        branch_Name: branchName,
        totalHeadcount: 0,
      } satisfies GroupedHeadcountByBranchDepartmentChart);

    existingRow[series.key] = Number(existingRow[series.key] || 0) + headcount;
    existingRow.totalHeadcount += headcount;
    rowsByBranch.set(branchName, existingRow);
  });

  return {
    data: Array.from(rowsByBranch.values()).sort((a, b) =>
      a.branch_Name.localeCompare(b.branch_Name)
    ),
    series: Array.from(seriesByLabel.values()),
  };
};

/**
 * Sort Top Leave Types
 */
export const sortTopLeaveTypes = {
  byDaysCount: (
    data: TopLeaveTypesChart[],
    order: "asc" | "desc" = "desc"
  ): TopLeaveTypesChart[] => {
    return [...data].sort((a, b) =>
      order === "desc"
        ? b.days_Count - a.days_Count
        : a.days_Count - b.days_Count
    );
  },

  byPercentage: (
    data: TopLeaveTypesChart[],
    order: "asc" | "desc" = "desc"
  ): TopLeaveTypesChart[] => {
    return [...data].sort((a, b) =>
      order === "desc"
        ? b.percentage - a.percentage
        : a.percentage - b.percentage
    );
  },
};

/**
 * Sort Overtime by Branch
 */
export const sortOvertimeByBranch = {
  byOvertimeHours: (
    data: OvertimeByBranchChart[],
    order: "asc" | "desc" = "desc"
  ): OvertimeByBranchChart[] => {
    return [...data].sort((a, b) =>
      order === "desc"
        ? b.overtime_Hours - a.overtime_Hours
        : a.overtime_Hours - b.overtime_Hours
    );
  },

  byBranch: (
    data: OvertimeByBranchChart[],
    order: "asc" | "desc" = "asc"
  ): OvertimeByBranchChart[] => {
    return [...data].sort((a, b) =>
      order === "asc"
        ? a.branch.localeCompare(b.branch)
        : b.branch.localeCompare(a.branch)
    );
  },
};

/**
 * Sort Average Tenure by Department
 */
export const sortAverageTenureByDepartment = {
  byTenureYears: (
    data: AverageTenureByDepartmentChart[],
    order: "asc" | "desc" = "desc"
  ): AverageTenureByDepartmentChart[] => {
    return [...data].sort((a, b) =>
      order === "desc"
        ? b.averageTenureYears - a.averageTenureYears
      : a.averageTenureYears - b.averageTenureYears
    );
  },
};

/**
 * Group Average Tenure by department, combining branch rows with employee-count weighting.
 */
export const groupAverageTenureByDepartment = (
  data: AverageTenureByDepartmentChart[] = []
): GroupedAverageTenureByDepartmentChart[] => {
  const rowsByDepartment = new Map<
    string,
    {
      departmentName: string;
      employeeCount: number;
      weightedTenureYears: number;
      weightedTenureMonths: number;
    }
  >();

  data.forEach((item) => {
    const departmentName = item.departmentName || "Unassigned";
    const employeeCount = Number(item.employeeCount) || 0;
    const existingRow = rowsByDepartment.get(departmentName) || {
      departmentName,
      employeeCount: 0,
      weightedTenureYears: 0,
      weightedTenureMonths: 0,
    };

    existingRow.employeeCount += employeeCount;
    existingRow.weightedTenureYears +=
      (Number(item.averageTenureYears) || 0) * employeeCount;
    existingRow.weightedTenureMonths +=
      (Number(item.averageTenureMonths) || 0) * employeeCount;
    rowsByDepartment.set(departmentName, existingRow);
  });

  return Array.from(rowsByDepartment.values())
    .map((item) => ({
      departmentName: item.departmentName,
      employeeCount: item.employeeCount,
      averageTenureYears:
        item.employeeCount > 0
          ? item.weightedTenureYears / item.employeeCount
          : 0,
      averageTenureMonths:
        item.employeeCount > 0
          ? item.weightedTenureMonths / item.employeeCount
          : 0,
    }))
    .sort((a, b) => a.departmentName.localeCompare(b.departmentName));
};

/**
 * Sort Average Tenure by Branch
 */
export const sortAverageTenureByBranch = {
  byTenureYears: (
    data: AverageTenureByBranchChart[],
    order: "asc" | "desc" = "desc"
  ): AverageTenureByBranchChart[] => {
    return [...data].sort((a, b) =>
      order === "desc"
        ? b.averageTenureYears - a.averageTenureYears
        : a.averageTenureYears - b.averageTenureYears
    );
  },
};

/**
 * Sort Payroll Cost by Branch & Department
 */
export const sortPayrollCost = {
  byTotalCost: (
    data: PayrollCostByBranchDepartmentChart[],
    order: "asc" | "desc" = "desc"
  ): PayrollCostByBranchDepartmentChart[] => {
    return [...data].sort((a, b) =>
      order === "desc"
        ? b.totalPayrollCost - a.totalPayrollCost
        : a.totalPayrollCost - b.totalPayrollCost
    );
  },
};

/**
 * Sort Salary Distribution (uses sortOrder from API)
 */
export const sortSalaryDistribution = (
  data: SalaryDistributionChart[]
): SalaryDistributionChart[] => {
  return [...data].sort((a, b) => a.sortOrder - b.sortOrder);
};

// ============================================================================
// Filtering Utilities
// ============================================================================

/**
 * Filter headcount by specific branch
 */
export const filterByBranch = <
  T extends { branch?: string; branch_Name?: string }
>(
  data: T[],
  branchName: string
): T[] => {
  return data.filter((item) => {
    const branch = item.branch || item.branch_Name || "";
    return branch.toLowerCase().includes(branchName.toLowerCase());
  });
};

/**
 * Filter by minimum headcount/employee count
 */
export const filterByMinEmployeeCount = <
  T extends {
    headcount?: number;
    employeeCount?: number;
    totalEmployees?: number;
  }
>(
  data: T[],
  minCount: number
): T[] => {
  return data.filter((item) => {
    const count =
      item.headcount || item.employeeCount || item.totalEmployees || 0;
    return count >= minCount;
  });
};

/**
 * Filter overtime by minimum hours
 */
export const filterByMinOvertimeHours = (
  data: OvertimeByBranchChart[],
  minHours: number
): OvertimeByBranchChart[] => {
  return data.filter((item) => item.overtime_Hours >= minHours);
};

/**
 * Filter by date range (for trend charts)
 */
export const filterByDateRange = <
  T extends { month?: string; month_period?: string }
>(
  data: T[],
  startMonth: string,
  endMonth: string
): T[] => {
  return data.filter((item) => {
    const month = item.month || item.month_period || "";
    return month >= startMonth && month <= endMonth;
  });
};

// ============================================================================
// Aggregation Utilities
// ============================================================================

/**
 * Get total headcount across all branches/departments
 */
export const getTotalHeadcount = (
  data: HeadcountByBranchDepartmentChart[]
): number => {
  return data.reduce((sum, item) => sum + item.headcount, 0);
};

/**
 * Get total overtime hours across all branches
 */
export const getTotalOvertimeHours = (
  data: OvertimeByBranchChart[]
): number => {
  return data.reduce((sum, item) => sum + item.overtime_Hours, 0);
};

/**
 * Get total payroll cost across all branches/departments
 */
export const getTotalPayrollCost = (
  data: PayrollCostByBranchDepartmentChart[]
): number => {
  return data.reduce((sum, item) => sum + item.totalPayrollCost, 0);
};

/**
 * Calculate net hiring (new hires - exits) for a specific month
 */
export const getNetHiring = (item: HiringAttritionTrendChart): number => {
  return item.new_hires - item.exits;
};

/**
 * Calculate attrition rate for a specific month (exits / previous headcount)
 */
export const calculateAttritionRate = (
  exits: number,
  previousHeadcount: number
): number => {
  if (previousHeadcount === 0) return 0;
  return (exits / previousHeadcount) * 100;
};

/**
 * Get average tenure across all branches
 */
export const getAverageTenureAcrossBranches = (
  data: AverageTenureByBranchChart[]
): number => {
  if (data.length === 0) return 0;
  const totalTenure = data.reduce(
    (sum, item) => sum + item.averageTenureYears * item.totalEmployees,
    0
  );
  const totalEmployees = data.reduce(
    (sum, item) => sum + item.totalEmployees,
    0
  );
  return totalEmployees > 0 ? totalTenure / totalEmployees : 0;
};

/**
 * Get total sick leave days
 */
export const getTotalSickLeaveDays = (
  data: SickLeavePatternsChart[]
): number => {
  return data.reduce((sum, item) => sum + item.sick_Days, 0);
};

/**
 * Get top N leave types
 */
export const getTopNLeaveTypes = (
  data: TopLeaveTypesChart[],
  n: number
): TopLeaveTypesChart[] => {
  return sortTopLeaveTypes.byDaysCount(data, "desc").slice(0, n);
};

/**
 * Get top N branches by overtime
 */
export const getTopNBranchesByOvertime = (
  data: OvertimeByBranchChart[],
  n: number
): OvertimeByBranchChart[] => {
  return sortOvertimeByBranch.byOvertimeHours(data, "desc").slice(0, n);
};

/**
 * Get top N departments by payroll cost
 */
export const getTopNDepartmentsByPayroll = (
  data: PayrollCostByBranchDepartmentChart[],
  n: number
): PayrollCostByBranchDepartmentChart[] => {
  return sortPayrollCost.byTotalCost(data, "desc").slice(0, n);
};

/**
 * Calculate hiring rate (new hires / previous headcount)
 */
export const calculateHiringRate = (
  newHires: number,
  previousHeadcount: number
): number => {
  if (previousHeadcount === 0) return 0;
  return (newHires / previousHeadcount) * 100;
};

/**
 * Get headcount growth rate between two periods
 */
export const getHeadcountGrowthRate = (
  currentHeadcount: number,
  previousHeadcount: number
): number => {
  if (previousHeadcount === 0) return 0;
  return ((currentHeadcount - previousHeadcount) / previousHeadcount) * 100;
};
