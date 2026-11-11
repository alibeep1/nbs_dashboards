// Region data structure
export interface Region {
  regionCode: string; // Used as the value/identifier
  regionName: string; // Used as the display label
  description?: string; // Optional additional info
}

// Props for the RegionFilterDropdown component
export interface RegionFilterDropdownProps {
  value?: string; // Selected region code
  onValueChange?: (code: string) => void;
  regions: Region[]; // Array of regions from API
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  loading?: boolean; // For when API is loading
  allowClear?: boolean; // Option to clear selection
  showAllOption?: boolean; // Option to show "All Regions"
  allOptionLabel?: string; // Custom label for "All" option
}
