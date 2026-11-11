import type { EDateFilter } from "../DateFilterTypes";

export interface ISalesApiParams {
  DateFilter?: EDateFilter;
  Branchcode?: number;
  ItemGroup?: number;
  Itemcode?: number;
  SalesRepCode?: number;
  SalesChannelCode?: number;
  ItemSupplierCode?: number;
}

/**
 * Builds query parameters from current filter values
 * @param filters - Object containing filter values
 * @returns URLSearchParams object with non-null/undefined values
 */
export const buildFiltersQueryParams = (
  filters: ISalesApiParams
): URLSearchParams => {
  const params = new URLSearchParams();

  // Add each filter to params if it has a value
  if (filters.DateFilter !== undefined && filters.DateFilter !== null) {
    params.append("DateFilter", filters.DateFilter.toString());
  }

  if (
    filters.Branchcode !== undefined &&
    filters.Branchcode !== null &&
    // and filter.branchcode.length !==0
    filters.Branchcode.toString().length !== 0
    // filters.Branchcode !== 0
  ) {
    params.append("Branchcode", filters.Branchcode.toString());
  }

  if (
    filters.ItemGroup !== undefined &&
    filters.ItemGroup !== null &&
    filters.ItemGroup.toString().length !== 0
  ) {
    params.append("ItemGroup", filters.ItemGroup.toString());
  }

  if (
    filters.Itemcode !== undefined &&
    filters.Itemcode !== null &&
    filters.Itemcode.toString().length !== 0
  ) {
    params.append("Itemcode", filters.Itemcode.toString());
  }

  if (
    filters.SalesRepCode !== undefined &&
    filters.SalesRepCode !== null &&
    filters.SalesRepCode.toString().length !== 0
  ) {
    params.append("SalesRepCode", filters.SalesRepCode.toString());
  }

  if (
    filters.SalesChannelCode !== undefined &&
    filters.SalesChannelCode !== null &&
    filters.SalesChannelCode.toString().length !== 0
  ) {
    params.append("SalesChannelCode", filters.SalesChannelCode.toString());
  }

  if (
    filters.ItemSupplierCode !== undefined &&
    filters.ItemSupplierCode !== null &&
    filters.ItemSupplierCode.toString().length !== 0
  ) {
    params.append("ItemSupplierCode", filters.ItemSupplierCode.toString());
  }

  return params;
};

// Example usage:
// const selectedFilters: ApiParams = {
//   DateFilter: 3,
//   Branchcode: 100,
//   ItemGroup: 10
// };
// const queryParams = buildFiltersQueryParams(selectedFilters);
// console.log(queryParams.toString()); // "DateFilter=3&Branchcode=100&ItemGroup=10"
