// scmOrderManagementApiParams.ts
// API query parameters for SCM Order Management Analytics dashboard

/**
 * Interface for SCM Order Management API query parameters
 * All parameters are optional and stored as strings
 *
 * Example usage:
 * //DateFilter:3
 * //BranchCode:100
 * //PreferredVendor:20
 * //SupplierCode:40
 * //Category:40
 * //ItemCode:40
 */
export interface IScmOrderManagementApiParams {
  DateFilter?: string;
  BranchCode?: string;
  PreferredVendor?: string;
  SupplierCode?: string;
  Category?: string;
  ItemCode?: string;
}

/**
 * Builds query parameters from current SCM Order Management filter values
 * Only includes parameters that have actual values (not undefined, null, or empty string)
 *
 * @param filters - Object containing SCM Order Management filter values
 * @returns URLSearchParams object with non-null/undefined/empty values
 *
 * @example
 * ```ts
 * const filters: IScmOrderManagementApiParams = {
 *   DateFilter: "3",
 *   BranchCode: "100",
 *   PreferredVendor: "20"
 * };
 * const params = buildFiltersQueryParams(filters);
 * console.log(params.toString());
 * // Output: "DateFilter=3&BranchCode=100&PreferredVendor=20"
 * ```
 */
export const buildScmOrderManagementFiltersQueryParams = (
  filters: IScmOrderManagementApiParams
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

  // Add PreferredVendor if it has a value
  if (
    filters.PreferredVendor !== undefined &&
    filters.PreferredVendor !== null &&
    filters.PreferredVendor.toString().length !== 0
  ) {
    params.append("PreferredVendor", filters.PreferredVendor.toString());
  }

  // Add SupplierCode if it has a value
  if (
    filters.SupplierCode !== undefined &&
    filters.SupplierCode !== null &&
    filters.SupplierCode.toString().length !== 0
  ) {
    params.append("SupplierCode", filters.SupplierCode.toString());
  }

  // Add Category if it has a value
  if (
    filters.Category !== undefined &&
    filters.Category !== null &&
    filters.Category.toString().length !== 0
  ) {
    params.append("Category", filters.Category.toString());
  }

  // Add ItemCode if it has a value
  if (
    filters.ItemCode !== undefined &&
    filters.ItemCode !== null &&
    filters.ItemCode.toString().length !== 0
  ) {
    params.append("ItemCode", filters.ItemCode.toString());
  }

  return params;
};
