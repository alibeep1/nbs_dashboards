import React, { useState } from "react";
import {
  Building2,
  ChevronDown,
  CircleX,
  Loader2,
  RemoveFormattingIcon,
} from "lucide-react";
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
import { cn } from "@/lib/utils";
// import { options } from "node_modules/axios/index.d.cts";
import type { BranchFilterDropdownProps } from "./BranchFilterTypes";
// import { Branch, BranchFilterDropdownProps } from './branch-filter-types';

export const BranchFilterDropdown: React.FC<BranchFilterDropdownProps> = ({
  value,
  onValueChange,
  branches = [],
  placeholder = "Select branch...",
  className,
  disabled = false,
  loading = false,
  allowClear = false,
  showAllOption = false,
  allOptionLabel = "All Branches",
}) => {
  const [open, setOpen] = useState(false);

  // Create options array with optional "All" option
  const options = React.useMemo(() => {
    const branchOptions = branches.map((branch) => ({
      value: branch.code,
      label: branch.name,
      description: branch.description,
      searchText: `${branch.code} ${branch.name}`.toLowerCase(),
    }));

    if (showAllOption) {
      return [
        {
          value: "",
          label: allOptionLabel,
          description: "View data for all branches",
          searchText: allOptionLabel.toLowerCase(),
        },
        ...branchOptions,
      ];
    }

    return branchOptions;
  }, [branches, showAllOption, allOptionLabel]);

  const selectedOption = options.find((option) => option.value === value);
  const displayLabel = selectedOption?.label || placeholder;

  const handleSelect = (selectedValue: string) => {
    onValueChange?.(selectedValue);
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onValueChange?.("");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled || loading}
          className={cn(
            "w-[236px] justify-between bg-white rounded-2xl h-11 px-4 py-3 gap-2.5 border-0",
            className
          )}
        >
          {loading ? (
            <Loader2 className="h-6 w-6 text-neutral-700 animate-spin" />
          ) : (
            <Building2 className="h-6 w-6 text-neutral-700" />
          )}
          <span className="flex-1 text-left font-jakarta text-base font-medium text-neutral-800 capitalize truncate">
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
      <PopoverContent className="w-[236px] p-0">
        <Command>
          <CommandInput placeholder={`Search branches...`} />
          <CommandEmpty>
            {loading ? "Loading branches..." : "No branches found."}
          </CommandEmpty>
          <CommandGroup>
            {options.map((option) => (
              <CommandItem
                key={option.value || "all"}
                value={option.searchText}
                onSelect={() => handleSelect(option.value)}
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

export default BranchFilterDropdown;
