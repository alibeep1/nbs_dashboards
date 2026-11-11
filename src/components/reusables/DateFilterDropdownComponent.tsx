import React, { useState } from "react";
import { Calendar, ChevronDown } from "lucide-react";
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
  DEFAULT_DATE_FILTER,
  type EDateFilter,
  type DateFilterDropdownProps,
  DATE_FILTER_OPTIONS,
} from "./DateFilterTypes.ts";

export const DateFilterDropdown: React.FC<DateFilterDropdownProps> = ({
  value = DEFAULT_DATE_FILTER,
  onValueChange,
  placeholder = "Select time period...",
  className,
  disabled = false,
  options = DATE_FILTER_OPTIONS,
}) => {
  const [open, setOpen] = useState(false);

  const selectedOption = options.find((option) => option.value === value);
  const displayLabel = selectedOption?.label || placeholder;

  const handleSelect = (selectedValue: string) => {
    const enumValue = selectedValue as EDateFilter;
    onValueChange?.(enumValue);
    setOpen(false);
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
          <Calendar className="h-6 w-6 text-neutral-700" />
          <span className="flex-1 text-left font-jakarta text-sm font-medium text-neutral-800 capitalize">
            {displayLabel}
          </span>
          <ChevronDown className="h-6 w-6 text-neutral-700" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[236px] p-0">
        <Command>
          <CommandInput
            placeholder={`Search ${placeholder.toLowerCase()}...`}
          />
          <CommandEmpty>No time period found.</CommandEmpty>
          <CommandGroup>
            {options.map((option) => (
              <CommandItem
                key={option.value}
                value={option.value}
                onSelect={handleSelect}
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

export default DateFilterDropdown;
