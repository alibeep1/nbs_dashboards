// import { EDateFilter } from "./types/date-filter-types";
// import { EGender } from "./types/gender-filter-types";
// import { AgeRange } from "./types/age-range-types";

import type { AgeRange } from "@/components/reusables/AgeRangeTypes";
import type { EDateFilter } from "@/components/reusables/DateFilterTypes";
import { EGender } from "@/components/reusables/GenderFilterTypes";

// Interface for all filter values
export interface FilterValues {
  dateFilter: EDateFilter;
  branchCode?: string;
  regionCode?: string;
  gender?: EGender | "";
  ageRange?: AgeRange;
  pageSize?: number; // Optional, for pagination
  pageIndex?: number; // Optional, for pagination
}

// Interface for API query parameters (matches your API structure)
export interface ApiQueryParams {
  Branchcode?: string;
  Gender?: number; // 0 for Male, 1 for Female (based on your screenshot showing "0")
  "Age.ageFrom"?: number;
  "Age.ageTo"?: number;
  DateFilter?: EDateFilter;
  Regioncode?: string;
  PageSize?: number; // Optional, for pagination
  PageIndex?: number; // Optional, for pagination
}

// Map EGender enum to numbers (adjust these based on your C# enum values)
const GENDER_MAP: Record<EGender, number> = {
  [EGender.Male]: 0,
  [EGender.Female]: 1,
};

/**
 * Builds query parameters for API call from filter values
 * Only includes parameters that have valid values (not null, empty, or "all")
 */
export function buildApiQueryParams(filters: FilterValues): ApiQueryParams {
  const queryParams: ApiQueryParams = {};

  // Always include DateFilter (required)
  queryParams.DateFilter = filters.dateFilter;

  // Branch Code - only if selected (not empty)
  if (filters.branchCode && filters.branchCode.trim() !== "") {
    queryParams.Branchcode = filters.branchCode;
  }

  // Region Code - only if selected (not empty)
  if (filters.regionCode && filters.regionCode.trim() !== "") {
    queryParams.Regioncode = filters.regionCode;
  }

  // Gender - only if specific gender selected (not "All Genders")
  if (filters.gender !== "" && filters.gender !== undefined) {
    queryParams.Gender = GENDER_MAP[filters.gender as EGender];
  }

  // Age Range - only if at least one age is specified
  if (filters.ageRange) {
    if (
      filters.ageRange.fromAge !== undefined &&
      filters.ageRange.fromAge !== null
    ) {
      queryParams["Age.ageFrom"] = filters.ageRange.fromAge;
    }
    if (
      filters.ageRange.toAge !== undefined &&
      filters.ageRange.toAge !== null
    ) {
      queryParams["Age.ageTo"] = filters.ageRange.toAge;
    }
  }

  if (filters.pageSize !== undefined && filters.pageSize !== null) {
    queryParams.PageSize = filters.pageSize;
  }
  if (filters.pageIndex !== undefined && filters.pageIndex !== null) {
    queryParams.PageIndex = filters.pageIndex;
  }

  return queryParams;
}

/**
 * Helper function to convert query params to URL search string
 * Useful for GET requests or debugging
 */
export function buildQueryString(queryParams: ApiQueryParams): string {
  const searchParams = new URLSearchParams();

  Object.entries(queryParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, value.toString());
    }
  });

  return searchParams.toString();
}

/**
 * Complete helper function that takes individual filter states and returns query params
 * This is the main function you'll use in your component
 */
export function buildFiltersQueryParams(
  selectedDateFilter: EDateFilter,
  selectedBranch: string,
  selectedRegion: string,
  selectedGender: EGender | "",
  ageRange: AgeRange
): ApiQueryParams {
  return buildApiQueryParams({
    dateFilter: selectedDateFilter,
    branchCode: selectedBranch,
    regionCode: selectedRegion,
    gender: selectedGender,
    ageRange: ageRange,
  });
}
