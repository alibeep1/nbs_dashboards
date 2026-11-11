import { Trees } from "lucide-react";
import GenericApiFilter from "./GenericApiFilter";
import type { FilterProps } from "./BranchFilter";

// Example usage - your refactored ItemGroupFilter with level property
export interface ItemGroupOption {
  level: string;
}

const AltItemGroupFilter: React.FC<FilterProps> = ({ token }) => {
  return (
    <GenericApiFilter<ItemGroupOption>
      token={token}
      endpoint="/items/tree?level=1"
      placeholder="Item Group"
      searchPlaceholder="Search item groups..."
      icon={Trees} // Make sure to import Trees
      allOptionLabel="All Item Groups"
      allOptionDescription="View all item groups"
      onError={(error, context) => {
        console.error(`Error fetching Item Groups (${context}):`, error);
      }}
    />
  );
};

export default AltItemGroupFilter;
