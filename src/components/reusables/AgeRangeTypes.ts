// Age range data structure
export interface AgeRange {
  fromAge?: number;
  toAge?: number;
}

// Props for the AgeRangeInput component
export interface AgeRangeInputProps {
  value?: AgeRange;
  onValueChange?: (value: AgeRange) => void;
  className?: string;
  disabled?: boolean;
  minAge?: number; // Minimum allowed age (default: 0)
  maxAge?: number; // Maximum allowed age (default: 120)
  fromPlaceholder?: string; // Placeholder for "from" input
  toPlaceholder?: string; // Placeholder for "to" input
  fromLabel?: string; // Label for "from" input
  toLabel?: string; // Label for "to" input
  allowClear?: boolean; // Show clear button
  showLabels?: boolean; // Show "From" and "To" labels
  inputWidth?: string; // Width for each input
  debounceMs?: number; // Debounce delay in milliseconds (default: 500)
}
