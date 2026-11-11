// HrDashboardChart.types.tsx
// Type definitions for HR Dashboard Analytics charts

/**
 * Chart #9: Headcount by Branch & Department (Job-based)
 * Shows employee count per branch and department/job
 */
export interface HeadcountByBranchDepartmentChart {
  chartTitle: string;
  branch_Name: string;
  job_Name?: string;
  joB_Name?: string;
  headcount: number;
}

/**
 * Chart #17: Hiring & Attrition Trend
 * Shows new hires vs exits over time
 */
export interface HiringAttritionTrendChart {
  chartTitle: string;
  month_period: string;
  new_hires: number;
  exits: number;
}

/**
 * Chart #18: Top Leave Types Granted
 * Shows most common leave types
 */
export interface TopLeaveTypesChart {
  chartTitle: string;
  leave_Type: string;
  days_Count: number;
  percentage: number;
}

/**
 * Chart #19: Overtime by Branch
 * Shows overtime hours per branch
 */
export interface OvertimeByBranchChart {
  chartTitle: string;
  branch: string;
  overtime_Hours: number;
  employee_Count: number;
  days_Count: number;
}

/**
 * Chart #20: Average Tenure by Department
 * Shows average employee tenure per department
 */
export interface AverageTenureByDepartmentChart {
  chartTitle: string;
  branchName: string;
  departmentName: string;
  employeeCount: number;
  averageTenureYears: number;
  averageTenureMonths: number;
}

/**
 * Chart #21: Average Tenure by Branch
 * Shows average employee tenure per branch
 */
export interface AverageTenureByBranchChart {
  chartTitle: string;
  branch: string;
  averageTenureYears: number;
  totalEmployees: number;
}

/**
 * Chart #22: Headcount Trend Over Time
 * Shows headcount growth over time
 */
export interface HeadcountTrendChart {
  chartTitle: string;
  yearMonth: string;
  monthDate: string; // ISO date string
  newHires: number;
  cumulativeHeadcount: number;
}

/**
 * Chart #23: Total Payroll Cost by Branch & Department
 * Shows payroll costs breakdown
 */
export interface PayrollCostByBranchDepartmentChart {
  chartTitle: string;
  branchCode: string;
  branchName: string;
  departmentCode: string;
  departmentName: string;
  totalPayrollCost: number;
  employeeCount: number;
}

/**
 * Chart #24: Salary Distribution by Role
 * Shows employee count per salary range
 */
export interface SalaryDistributionChart {
  chartTitle: string;
  salaryRange: string;
  employeeCount: number;
  sortOrder: number;
}

/**
 * Chart #25: Sick Leave Patterns
 * Shows sick leave trends over time
 */
export interface SickLeavePatternsChart {
  chartTitle: string;
  month: string;
  sick_Days: number;
  employees_Affected: number;
}

/**
 * Chart #26: Employee Age Distribution
 * Shows employee count per age group
 */
export interface EmployeeAgeDistributionChart {
  chartTitle: string;
  age_Group: string;
  count: number;
  percentage: number;
}

/**
 * Chart #27: Attendance Overview by Branch & Day
 * Shows attendance status per branch for each day of the week
 */
export interface AttendanceOverviewChart {
  chartTitle: string;
  branch: string;
  monday: string | null;
  tuesday: string | null;
  wednesday: string | null;
  thursday: string | null;
  friday: string | null;
  saturday: string | null;
  sunday: string | null;
}

/**
 * API Response structure - Direct dictionary with chart arrays
 * This is the exact structure returned from the API
 */
export interface HrDashboardChartsApiResponse {
  HeadcountByBranchDepartment: HeadcountByBranchDepartmentChart[];
  HiringAttritionTrend: HiringAttritionTrendChart[];
  TopLeaveTypes: TopLeaveTypesChart[];
  OvertimeByBranch: OvertimeByBranchChart[];
  AverageTenureByDepartment: AverageTenureByDepartmentChart[];
  AverageTenureByBranch: AverageTenureByBranchChart[];
  HeadcountTrend: HeadcountTrendChart[];
  PayrollCostByBranchDepartment: PayrollCostByBranchDepartmentChart[];
  SalaryDistribution: SalaryDistributionChart[];
  SickLeavePatterns: SickLeavePatternsChart[];
  EmployeeAgeDistribution: EmployeeAgeDistributionChart[];
  AttendanceOverview: AttendanceOverviewChart[];
}

/**
 * Processed chart data type (same as API response in this case)
 * Kept separate for consistency with other dashboard hooks
 */
export type ProcessedHrDashboardChartData = HrDashboardChartsApiResponse;

export interface GroupedSeriesConfig {
  key: string;
  label: string;
}

export interface GroupedHeadcountByBranchDepartmentChart {
  branch_Name: string;
  totalHeadcount: number;
  [seriesKey: string]: string | number;
}

export interface GroupedAverageTenureByDepartmentChart {
  departmentName: string;
  employeeCount: number;
  averageTenureYears: number;
  averageTenureMonths: number;
}

/**
 * Union type of all chart data types
 */
export type HrDashboardChartData =
  | HeadcountByBranchDepartmentChart
  | HiringAttritionTrendChart
  | TopLeaveTypesChart
  | OvertimeByBranchChart
  | AverageTenureByDepartmentChart
  | AverageTenureByBranchChart
  | HeadcountTrendChart
  | PayrollCostByBranchDepartmentChart
  | SalaryDistributionChart
  | SickLeavePatternsChart
  | EmployeeAgeDistributionChart
  | AttendanceOverviewChart;

/**
 * Chart type keys for type-safe access
 */
export type HrDashboardChartType = keyof HrDashboardChartsApiResponse;

/**
 * Constant array of all chart types
 */
export const HR_DASHBOARD_CHART_TYPES: HrDashboardChartType[] = [
  "HeadcountByBranchDepartment",
  "HiringAttritionTrend",
  "TopLeaveTypes",
  "OvertimeByBranch",
  "AverageTenureByDepartment",
  "AverageTenureByBranch",
  "HeadcountTrend",
  "PayrollCostByBranchDepartment",
  "SalaryDistribution",
  "SickLeavePatterns",
  "EmployeeAgeDistribution",
  "AttendanceOverview",
];
