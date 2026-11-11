// Branch data structure
export interface Branch {
  code: string; // Used as the value/identifier
  name: string; // Used as the display label
  description?: string; // Optional additional info
}

// Props for the BranchFilterDropdown component
export interface BranchFilterDropdownProps {
  value?: string; // Selected branch code
  onValueChange?: (code: string) => void;
  branches: Branch[]; // Array of branches from API
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  loading?: boolean; // For when API is loading
  allowClear?: boolean; // Option to clear selection
  showAllOption?: boolean; // Option to show "All Branches"
  allOptionLabel?: string; // Custom label for "All" option
}
