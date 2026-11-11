// scmInventoryApiParams.tsx
// API query parameters for SCM Inventory Analytics Dashboard

/**
 * Interface for SCM Inventory Analytics API query parameters
 *
 * Available filters:
 * - StoreCode: Warehouse/Store identifier (e.g., 100)
 * - Category: Product category ID (e.g., 40)
 * - ItemCode: Specific item code (e.g., 90)
 * - DateFilter: Time range filter (e.g., 3)
 */
export interface IScmInventoryApiParams {
  StoreCode?: string;
  Category?: string;
  ItemCode?: string;
  DateFilter?: string;
}

/**
 * Builds query parameters from current SCM Inventory filter values
 * @param filters - Object containing SCM Inventory filter values
 * @returns URLSearchParams object with non-null/undefined values
 *
 * @example
 * ```tsx
 * const filters: IScmInventoryApiParams = {
 *   StoreCode: "100",
 *   Category: "40",
 *   DateFilter: "3"
 * };
 * const params = buildScmInventoryQueryParams(filters);
 * // Returns: "StoreCode=100&Category=40&DateFilter=3"
 * ```
 */
export const buildScmInventoryQueryParams = (
  filters: IScmInventoryApiParams
): URLSearchParams => {
  const params = new URLSearchParams();

  // Add StoreCode filter if it has a value
  if (
    filters.StoreCode !== undefined &&
    filters.StoreCode !== null &&
    filters.StoreCode.toString().length !== 0
  ) {
    params.append("StoreCode", filters.StoreCode.toString());
  }

  // Add Category filter if it has a value
  if (
    filters.Category !== undefined &&
    filters.Category !== null &&
    filters.Category.toString().length !== 0
  ) {
    params.append("Category", filters.Category.toString());
  }

  // Add ItemCode filter if it has a value
  if (
    filters.ItemCode !== undefined &&
    filters.ItemCode !== null &&
    filters.ItemCode.toString().length !== 0
  ) {
    params.append("ItemCode", filters.ItemCode.toString());
  }

  // Add DateFilter if it has a value
  if (
    filters.DateFilter !== undefined &&
    filters.DateFilter !== null &&
    filters.DateFilter.toString().length !== 0
  ) {
    params.append("DateFilter", filters.DateFilter.toString());
  }

  return params;
};

/**
 * Helper function to check if any filters are active
 * @param filters - Object containing SCM Inventory filter values
 * @returns boolean indicating if any filter has a value
 */
export const hasActiveFilters = (filters: IScmInventoryApiParams): boolean => {
  return !!(
    (filters.StoreCode && filters.StoreCode.length > 0) ||
    (filters.Category && filters.Category.length > 0) ||
    (filters.ItemCode && filters.ItemCode.length > 0) ||
    (filters.DateFilter && filters.DateFilter.length > 0)
  );
};

/**
 * Helper function to clear all filters
 * @returns Empty IScmInventoryApiParams object
 */
export const clearAllFilters = (): IScmInventoryApiParams => {
  return {
    StoreCode: undefined,
    Category: undefined,
    ItemCode: undefined,
    DateFilter: undefined,
  };
};
