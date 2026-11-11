import type { EDateFilter } from "../DateFilterTypes";

export interface ICorpSalesApiParams {
  DateFilter?: EDateFilter;
  Branchcode?: number;
  PaymentStatus?: number;
  CorpCustomerCode?: number;
}

/**
 * Builds query parameters from current corporate sales filter values
 * @param filters - Object containing corporate sales filter values
 * @returns URLSearchParams object with non-null/undefined values
 */
export const buildFiltersQueryParams = (
  filters: ICorpSalesApiParams
): URLSearchParams => {
  const params = new URLSearchParams();

  // Add each filter to params if it has a value
  if (filters.DateFilter !== undefined && filters.DateFilter !== null) {
    params.append("DateFilter", filters.DateFilter.toString());
  }

  if (
    filters.Branchcode !== undefined &&
    filters.Branchcode !== null &&
    filters.Branchcode.toString().length !== 0
  ) {
    params.append("Branchcode", filters.Branchcode.toString());
  }

  if (
    filters.PaymentStatus !== undefined &&
    filters.PaymentStatus !== null &&
    filters.PaymentStatus.toString().length !== 0
  ) {
    params.append("PaymentStatus", filters.PaymentStatus.toString());
  }

  if (
    filters.CorpCustomerCode !== undefined &&
    filters.CorpCustomerCode !== null &&
    filters.CorpCustomerCode.toString().length !== 0
  ) {
    params.append("CustomerCode", filters.CorpCustomerCode.toString());
  }

  return params;
};

// Example usage:
// const selectedFilters: ICorpSalesApiParams = {
//   DateFilter: 7,
//   Branchcode: 200,
//   PaymentStatus: 1,
//   CorpCustomerCode: 12345
// };
// const queryParams = buildCorpSalesQueryParams(selectedFilters);
// console.log(queryParams.toString()); // "DateFilter=7&Branchcode=200&PaymentStatus=1&CorpCustomerCode=12345"
