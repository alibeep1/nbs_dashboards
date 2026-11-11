// scmInterbranchApiParams.ts
// API query parameters for SCM Interbranch Analytics dashboard

/**
 * Interface for SCM Interbranch API query parameters
 * All parameters are optional and stored as strings
 *
 * Example usage:
 * //DateFilter:3
 * //BranchCode:100
 * //DestinationBranchCode:200
 * //ItemCode:90
 * //Status:0
 */
export interface IScmInterbranchApiParams {
  DateFilter?: string;
  BranchCode?: string;
  DestinationBranchCode?: string;
  ItemCode?: string;
  Status?: string;
}

/**
 * Builds query parameters from current SCM Interbranch filter values
 * Only includes parameters that have actual values (not undefined, null, or empty string)
 *
 * @param filters - Object containing SCM Interbranch filter values
 * @returns URLSearchParams object with non-null/undefined/empty values
 *
 * @example
 * ```ts
 * const filters: IScmInterbranchApiParams = {
 *   DateFilter: "3",
 *   BranchCode: "100",
 *   DestinationBranchCode: "200"
 * };
 * const params = buildFiltersQueryParams(filters);
 * console.log(params.toString());
 * // Output: "DateFilter=3&BranchCode=100&DestinationBranchCode=200"
 * ```
 */
export const buildScmInterbranchFiltersQueryParams = (
  filters: IScmInterbranchApiParams
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

  // Add DestinationBranchCode if it has a value
  if (
    filters.DestinationBranchCode !== undefined &&
    filters.DestinationBranchCode !== null &&
    filters.DestinationBranchCode.toString().length !== 0
  ) {
    params.append(
      "DestinationBranchCode",
      filters.DestinationBranchCode.toString()
    );
  }

  // Add ItemCode if it has a value
  if (
    filters.ItemCode !== undefined &&
    filters.ItemCode !== null &&
    filters.ItemCode.toString().length !== 0
  ) {
    params.append("ItemCode", filters.ItemCode.toString());
  }

  // Add Status if it has a value
  if (
    filters.Status !== undefined &&
    filters.Status !== null &&
    filters.Status.toString().length !== 0
  ) {
    params.append("Status", filters.Status.toString());
  }

  return params;
};
