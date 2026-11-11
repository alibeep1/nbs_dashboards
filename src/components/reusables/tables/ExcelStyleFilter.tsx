import { useMemo, useState, useEffect } from "react";
import type { Column } from "@tanstack/react-table";
import { Filter, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface ExcelStyleFilterProps<TData> {
  column: Column<TData, unknown>;
}

export function ExcelStyleFilter<TData>({
  column,
}: ExcelStyleFilterProps<TData>) {
  const [searchValue, setSearchValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // Get all unique values from the column - this updates when data changes
  const uniqueValues = useMemo(() => {
    const facetedValues = column.getFacetedUniqueValues();
    const values = Array.from(facetedValues.keys())
      .filter((val) => val !== null && val !== undefined)
      .sort();
    return values.map(String);
  }, [column.getFacetedUniqueValues()]);

  // Filter values based on search
  const filteredValues = useMemo(() => {
    if (!searchValue) return uniqueValues;
    return uniqueValues.filter((value) =>
      value.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [uniqueValues, searchValue]);

  // Get current filter value
  const filterValue = (column.getFilterValue() as string[]) || [];

  // Check if all items are selected (no filter applied)
  const allSelected = filterValue.length === 0;

  // Reset search when dropdown closes
  useEffect(() => {
    if (!isOpen) {
      setSearchValue("");
    }
  }, [isOpen]);

  // Handle select all
  const handleSelectAll = () => {
    column.setFilterValue(undefined);
  };

  // Handle individual item toggle
  const handleToggle = (value: string) => {
    const currentFilter = filterValue;

    if (allSelected) {
      // If all are selected (no filter), clicking one means we want to show only that one
      // So we need to select all EXCEPT this one
      const newFilter = uniqueValues.filter((v) => v !== value);
      column.setFilterValue(
        newFilter.length === uniqueValues.length ? undefined : newFilter
      );
    } else if (currentFilter.includes(value)) {
      // Item is currently selected, remove it from filter (hide it)
      const newFilter = currentFilter.filter((v) => v !== value);
      column.setFilterValue(newFilter.length === 0 ? undefined : newFilter);
    } else {
      // Item is not selected, add it to filter (show it)
      const newFilter = [...currentFilter, value];
      // If we've selected all items, clear the filter (same as select all)
      column.setFilterValue(
        newFilter.length === uniqueValues.length ? undefined : newFilter
      );
    }
  };

  // Clear all filters (deselect all)
  const handleClearAll = () => {
    // Set filter to empty array to hide everything
    column.setFilterValue(uniqueValues.slice());
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className={`p-1 rounded hover:bg-gray-200 transition-colors ${
            filterValue.length > 0
              ? "bg-blue-100 text-blue-600"
              : "text-gray-500"
          }`}
          title="Filter column"
        >
          <Filter className="w-4 h-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 p-0" align="start">
        {/* Search box */}
        <div className="p-2 border-b">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pl-8 h-9"
            />
          </div>
        </div>

        {/* Select All / Clear All buttons */}
        <div className="p-2 border-b flex gap-2">
          <button
            onClick={handleSelectAll}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            Select All
          </button>
          <span className="text-gray-300">|</span>
          <button
            onClick={handleClearAll}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            Clear All
          </button>
        </div>

        {/* Values list */}
        <div className="max-h-64 overflow-y-auto">
          {filteredValues.length === 0 ? (
            <div className="p-4 text-sm text-gray-500 text-center">
              No results found
            </div>
          ) : (
            <div className="p-2">
              {filteredValues.map((value) => {
                // If no filter is applied (allSelected), all items are checked
                // If filter is applied, only items IN the filter array are checked
                const isChecked = allSelected || filterValue.includes(value);

                return (
                  <label
                    key={value}
                    className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                  >
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={() => handleToggle(value)}
                    />
                    <span className="text-sm flex-1 truncate" title={value}>
                      {value}
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer with count */}
        <div className="p-2 border-t bg-gray-50 text-xs text-gray-600">
          {allSelected
            ? `Showing all (${uniqueValues.length})`
            : `Showing ${filterValue.length} of ${uniqueValues.length}`}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
