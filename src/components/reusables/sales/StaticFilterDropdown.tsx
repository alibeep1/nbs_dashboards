import React, { useEffect, useState } from "react";
import { FilterDropdown } from "./FilterDropdown"; // Adjust import path

interface BaseFilterOption {
  value: string;
  label: string;
  description?: string;
}

// Generic type that extends base with any additional properties
type FilterOption<T = {}> = BaseFilterOption & T;

interface StaticFilterProps<T = {}> {
  data: FilterOption<T>[];
  placeholder: string;
  searchPlaceholder: string;
  icon: React.ComponentType<any>;
  allOptionLabel: string;
  allOptionDescription: string;
  onValueChange?: (value: string | undefined) => void;
  value?: string | undefined;
  allowClear?: boolean;
  showAllOption?: boolean;
  shouldFilter?: boolean;
  width?: string;
}

const StaticDataFilter = <T = {},>({
  data,
  placeholder,
  searchPlaceholder,
  icon,
  allOptionLabel,
  allOptionDescription,
  onValueChange,
  value,
  allowClear = true,
  showAllOption = true,
  shouldFilter = true, // Usually want client-side filtering for static data
  width = "160px",
}: StaticFilterProps<T>) => {
  const [selectedValue, setSelectedValue] = useState<string | undefined>(value);

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
      width={width}
      onValueChange={handleValueChange}
      options={data}
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

export default StaticDataFilter;
