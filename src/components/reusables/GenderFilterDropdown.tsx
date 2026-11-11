import React, { useState } from "react";
import { Users, ChevronDown, CircleX } from "lucide-react";
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
import {
  EGender,
  GENDER_FILTER_OPTIONS,
  type GenderFilterDropdownProps,
} from "./GenderFilterTypes";
// import {
//   EGender,
//   GenderFilterOption,
//   GenderFilterDropdownProps,
//   GENDER_FILTER_OPTIONS,
// } from "./gender-filter-types";

export const GenderFilterDropdown: React.FC<GenderFilterDropdownProps> = ({
  value = "",
  onValueChange,
  placeholder = "Select gender...",
  className,
  disabled = false,
  options = GENDER_FILTER_OPTIONS,
  maxHeight = "300px",
  showAllOption = true,
  allowClear = false,
  allOptionLabel = "All Genders",
}) => {
  const [open, setOpen] = useState(false);

  // Create options array with optional "All" option
  const allOptions = React.useMemo(() => {
    const genderOptions = options.map((option) => ({
      value: option.value,
      label: option.label,
      description: option.description,
      searchText: option.label.toLowerCase(),
    }));

    if (showAllOption) {
      return [
        {
          value: "" as const,
          label: allOptionLabel,
          description: "View data for all genders",
          searchText: allOptionLabel.toLowerCase(),
        },
        ...genderOptions,
      ];
    }

    return genderOptions;
  }, [options, showAllOption, allOptionLabel]);

  const selectedOption = allOptions.find((option) => option.value === value);
  const displayLabel = selectedOption?.label || placeholder;

  const handleSelect = (selectedValue: string) => {
    const genderValue = selectedValue as EGender | "";
    onValueChange?.(genderValue);
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
          disabled={disabled}
          className={cn(
            "w-[236px] justify-between bg-white rounded-2xl h-8 px-4 py-3 gap-2.5 border-0",
            className
          )}
        >
          <Users className="h-6 w-6 text-neutral-700" />
          <span className="flex-1 text-left font-jakarta text-base font-medium text-neutral-800 capitalize">
            {displayLabel}
          </span>
          {allowClear && value && (
            <button
              onClick={handleClear}
              className="h-4 w-4 rounded-full bg-neutral-500 text-white text-xs hover:bg-neutral-600 flex items-center justify-center"
              aria-label="Clear selection"
            >
              <CircleX className="h-3 w-3" />
            </button>
          )}
          <ChevronDown className="h-6 w-6 text-neutral-700" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[236px] p-0" style={{ maxHeight }}>
        <Command>
          <CommandInput placeholder={`Search genders...`} />
          <CommandEmpty>No gender found.</CommandEmpty>
          <CommandGroup
            className="overflow-y-auto"
            style={{ maxHeight: `calc(${maxHeight} - 60px)` }}
          >
            {allOptions.map((option) => (
              <CommandItem
                key={option.value || "all"}
                value={option.searchText}
                onSelect={() => handleSelect(option.value)}
                className="cursor-pointer"
              >
                <div className="flex flex-col">
                  <span className="font-medium">{option.label}</span>
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

export default GenderFilterDropdown;
