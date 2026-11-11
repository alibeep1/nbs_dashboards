// hrDashboardApiParams.ts
// API query parameters for HR Dashboard Analytics

/**
 * Interface for HR Dashboard API query parameters
 * All parameters are optional and stored as strings
 *
 * Example usage:
 * //DateFilter:0
 * //BranchCode:100
 * //JobPosition:xxx
 * //EmployeeType:10
 * //EmployeeStatus:1
 */
export interface IHrDashboardApiParams {
  DateFilter?: string;
  BranchCode?: string;
  JobPosition?: string;
  EmployeeType?: string;
  EmployeeStatus?: string;
}

/**
 * Builds query parameters from current HR Dashboard filter values
 * Only includes parameters that have actual values (not undefined, null, or empty string)
 *
 * @param filters - Object containing HR Dashboard filter values
 * @returns URLSearchParams object with non-null/undefined/empty values
 *
 * @example
 * ```ts
 * const filters: IHrDashboardApiParams = {
 *   DateFilter: "0",
 *   BranchCode: "100",
 *   JobPosition: "xxx"
 * };
 * const params = buildFiltersQueryParams(filters);
 * console.log(params.toString());
 * // Output: "DateFilter=0&BranchCode=100&JobPosition=xxx"
 * ```
 */
export const buildHrDashboardFiltersQueryParams = (
  filters: IHrDashboardApiParams
): URLSearchParams => {
  const params = new URLSearchParams();

  // Add DateFilter if it has a value
  if (
    filters.DateFilter !== undefined &&
    filters.DateFilter !== null &&
    filters.DateFilter.toString().length !== 0
  ) {
    params.append("DateFilter", filters.DateFilter.toString());
  }

  // Add BranchCode if it has a value
  if (
    filters.BranchCode !== undefined &&
    filters.BranchCode !== null &&
    filters.BranchCode.toString().length !== 0
  ) {
    params.append("BranchCode", filters.BranchCode.toString());
  }

  // Add JobPosition if it has a value
  if (
    filters.JobPosition !== undefined &&
    filters.JobPosition !== null &&
    filters.JobPosition.toString().length !== 0
  ) {
    params.append("JobPosition", filters.JobPosition.toString());
  }

  // Add EmployeeType if it has a value
  if (
    filters.EmployeeType !== undefined &&
    filters.EmployeeType !== null &&
    filters.EmployeeType.toString().length !== 0
  ) {
    params.append("EmployeeType", filters.EmployeeType.toString());
  }

  // Add EmployeeStatus if it has a value
  if (
    filters.EmployeeStatus !== undefined &&
    filters.EmployeeStatus !== null &&
    filters.EmployeeStatus.toString().length !== 0
  ) {
    params.append("EmployeeStatus", filters.EmployeeStatus.toString());
  }

  return params;
};
