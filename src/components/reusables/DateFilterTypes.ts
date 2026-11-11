// Date filter union type matching C# EDateFilter
export type EDateFilter = "Today" | "Wtd" | "Mtd" | "Ytd";

export const EDateFilter = {
  Today: "Today" as EDateFilter,
  Wtd: "Wtd" as EDateFilter,
  Mtd: "Mtd" as EDateFilter,
  Ytd: "Ytd" as EDateFilter,
};

export const DEFAULT_DATE_FILTER = EDateFilter.Ytd;

// Type for date filter options with display labels
export interface DateFilterOption {
  value: EDateFilter;
  label: string;
  description?: string;
}

// Predefined date filter options
export const DATE_FILTER_OPTIONS: DateFilterOption[] = [
  {
    value: EDateFilter.Today,
    label: "Today",
    description: "Current day",
  },
  {
    value: EDateFilter.Wtd,
    label: "Week-To-Date",
    description: "From start of current week",
  },
  {
    value: EDateFilter.Mtd,
    label: "Month-To-Date",
    description: "From start of current month",
  },
  {
    value: EDateFilter.Ytd,
    label: "Year-To-Date",
    description: "From start of current year",
  },
];

// Props for the DateFilterDropdown component
export interface DateFilterDropdownProps {
  value?: EDateFilter;
  onValueChange?: (value: EDateFilter) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  options?: DateFilterOption[];
}
