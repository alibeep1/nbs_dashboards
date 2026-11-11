import React, { useEffect, useRef, useState } from "react";
// import { useDebounce } from "./hooks/useDebounce"; // Adjust import path
// import { createApiClient } from "./api/client"; // Adjust import path
import { FilterDropdown } from "./FilterDropdown"; // Adjust import path
import { useDebounce } from "@/hooks/useDebounce";
import { createApiClient } from "@/lib/api";

interface BaseFilterOption {
  value: string;
  label: string;
  description?: string;
}

// Generic type that extends base with any additional properties
type FilterOption<T = {}> = BaseFilterOption & T;

interface ApiFilterProps<T = {}> {
  token: string;
  endpoint: string;
  searchParam?: string;
  dataPointsKey?: string;
  placeholder: string;
  searchPlaceholder: string;
  icon: React.ComponentType<any>;
  allOptionLabel: string;
  allOptionDescription: string;
  debounceDelay?: number;
  onValueChange?: (value: string | undefined) => void;
  value?: string | undefined;
  allowClear?: boolean;
  showAllOption?: boolean;
  shouldFilter?: boolean;
  // Transform function to customize how API data is converted to options
  transformData?: (data: any) => FilterOption<T>[];
  // Additional query parameters
  queryParams?: Record<string, any>;
  // Error handling callback
  onError?: (error: any, context: "initial" | "search") => void;
}

const GenericApiFilter = <T = {},>({
  token,
  endpoint,
  searchParam = "request",
  dataPointsKey = "dataPoints",
  placeholder,
  searchPlaceholder,
  icon,
  allOptionLabel,
  allOptionDescription,
  debounceDelay = 300,
  onValueChange,
  value,
  allowClear = true,
  showAllOption = true,
  shouldFilter = false,
  transformData,
  queryParams = {},
  onError,
}: ApiFilterProps<T>) => {
  const [data, setData] = useState([]);
  const [options, setOptions] = useState<FilterOption<T>[]>([]);
  const [selectedValue, setSelectedValue] = useState<string | undefined>(value);
  const [searchText, setSearchText] = useState("");
  const hasRunSearchEffect = useRef(false);

  const debouncedSearchText = useDebounce(searchText, debounceDelay);

  // Default data transformation function
  const defaultTransformData = (apiData: any): FilterOption<T>[] => {
    return apiData?.[dataPointsKey] || [];
  };

  const fetchData = async (searchQuery?: string) => {
    if (!token) return;

    try {
      const api = createApiClient(token);
      const params = { ...queryParams };

      if (searchQuery?.trim()) {
        params[searchParam] = searchQuery;
      }

      const response = await api.get(endpoint, { params });
      setData(response.data);
    } catch (error) {
      console.error(`Error fetching data from ${endpoint}:`, error);
      onError?.(error, searchQuery ? "search" : "initial");
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [token]);

  // Transform data to options
  useEffect(() => {
    if (data) {
      const transformer = transformData || defaultTransformData;
      const transformedOptions = transformer(data);
      setOptions(transformedOptions);
    }
  }, [data, transformData]);

  // Handle search
  useEffect(() => {
    if (!token) return;

    if (!hasRunSearchEffect.current) {
      hasRunSearchEffect.current = true;
      return;
    }

    if (debouncedSearchText.trim()) {
      fetchData(debouncedSearchText);
    } else if (debouncedSearchText === "") {
      fetchData();
    }
  }, [debouncedSearchText, token]);

  // Sync external value changes
  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  const handleValueChange = (val: string | undefined) => {
    setSelectedValue(val);
    onValueChange?.(val);
  };

  return (
    <FilterDropdown
      width="160px"
      onValueChange={handleValueChange}
      onSearchChange={setSearchText}
      options={options}
      placeholder={placeholder}
      searchPlaceholder={searchPlaceholder}
      icon={icon}
      showAllOption={showAllOption}
      allOptionLabel={allOptionLabel}
      allOptionDescription={allOptionDescription}
      value={selectedValue}
      allowClear={allowClear}
      shouldFilter={shouldFilter}
    />
  );
};

export default GenericApiFilter;
