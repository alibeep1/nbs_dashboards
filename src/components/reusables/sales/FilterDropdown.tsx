import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { ChevronDown, CircleX, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Generic option interface
export interface FilterOption {
  value: string;
  label: string;
  description?: string;
}

export interface FilterDropdownProps {
  value?: string;
  onValueChange?: (value: string) => void;
  onSearchChange?: (searchText: string) => void;
  options?: FilterOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  allowClear?: boolean;
  showAllOption?: boolean;
  allOptionLabel?: string;
  allOptionDescription?: string;
  icon?: React.ComponentType<{ className?: string }>;
  emptyMessage?: string;
  loadingMessage?: string;
  width?: string;
  shouldFilter?: boolean;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  value,
  onValueChange,
  onSearchChange,
  options = [],
  placeholder = "Select option...",
  searchPlaceholder = "Search...",
  className,
  disabled = false,
  loading = false,
  allowClear = false,
  showAllOption = false,
  allOptionLabel = "All Options",
  allOptionDescription = "View all data",
  icon: Icon,
  emptyMessage = "No options found.",
  loadingMessage = "Loading...",
  width = "w-[236px]",
  shouldFilter = true,
}) => {
  const [open, setOpen] = useState(false);

  // Create options array with optional "All" option
  const allOptions = React.useMemo(() => {
    // console.log("Filter Dropdown > options inside useMemo: ", options);
    const baseOptions = options.map((option) => ({
      ...option,
    }));

    if (showAllOption) {
      return [
        {
          value: "",
          label: allOptionLabel,
          description: allOptionDescription,
        },
        ...baseOptions,
      ];
    }

    return baseOptions;
  }, [options, showAllOption, allOptionLabel, allOptionDescription]);

  const selectedOption = allOptions.find((option) => option.value === value);
  const displayLabel = selectedOption?.label || placeholder;

  const handleSelect = (selectedValue: string) => {
    onValueChange?.(selectedValue);
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onValueChange?.("");
    // Also clear the search text when clearing the selection
    onSearchChange?.("");
  };

  // console.log("Filterdropdown > [before return] options: ", allOptions);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled || loading}
          className={cn(
            `${width} justify-between bg-white rounded-2xl h-8 px-4 py-4 gap-2.5 border-0`,
            className
          )}
        >
          {loading ? (
            <Loader2 className="h-6 w-6 text-neutral-700 animate-spin" />
          ) : Icon ? (
            <Icon className="h-6 w-6 text-neutral-700" />
          ) : null}
          <span className="flex-1 text-start font-jakarta text-sm font-medium text-neutral-700 capitalize truncate">
            {displayLabel}
          </span>
          <div className="flex items-center gap-1">
            {allowClear && value && !loading && (
              <button
                onClick={handleClear}
                className="h-4 w-4 rounded-full bg-neutral-500 text-white text-xs hover:bg-neutral-600 flex items-center justify-center"
                aria-label="Clear selection"
              >
                <CircleX className="h-3 w-3" />
              </button>
            )}
            <ChevronDown className="h-6 w-6 text-neutral-700" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className={`${width} p-0`}>
        <Command shouldFilter={shouldFilter}>
          <CommandInput
            placeholder={searchPlaceholder}
            onValueChange={onSearchChange}
          />
          <CommandEmpty>{loading ? loadingMessage : emptyMessage}</CommandEmpty>
          <CommandGroup>
            {allOptions.map((option) => (
              <CommandItem
                key={option.value || "all"}
                value={option.value}
                keywords={[option.label, option.description || ""]}
                onSelect={(currentValue) => handleSelect(currentValue)}
                className="cursor-pointer"
              >
                <div className="flex flex-col w-full">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{option.label}</span>
                    {option.value && (
                      <span className="text-xs text-neutral-500 ml-2">
                        {option.value}
                      </span>
                    )}
                  </div>
                  {option.description && (
                    <span className="text-sm text-neutral-500">
                      {option.description}
                    </span>
                  )}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default FilterDropdown;
