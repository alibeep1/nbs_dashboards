// Gender enum for filter options
export enum EGender {
  Male = "Male",
  Female = "Female",
}

// Type for gender filter options with display labels
export interface GenderFilterOption {
  value: EGender | "";
  label: string;
  description?: string;
}

// Predefined gender filter options
export const GENDER_FILTER_OPTIONS: GenderFilterOption[] = [
  {
    value: EGender.Male,
    label: "Male",
    description: "Male customers",
  },
  {
    value: EGender.Female,
    label: "Female",
    description: "Female customers",
  },
];

// Props for the GenderFilterDropdown component
export interface GenderFilterDropdownProps {
  value?: EGender | "";
  onValueChange?: (value: EGender | "") => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  options?: GenderFilterOption[];
  maxHeight?: string; // Maximum height for the dropdown content
  showAllOption?: boolean; // Option to show "All Genders"
  allowClear?: boolean; // Option to allow clearing selection
  allOptionLabel?: string; // Custom label for "All" option
}
