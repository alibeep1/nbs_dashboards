import React, { useState, useEffect, useRef, useCallback } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { AgeRangeInputProps } from "./AgeRangeTypes";
// import { AgeRange, AgeRangeInputProps } from "./age-range-types";

export const AgeRangeInput: React.FC<AgeRangeInputProps> = ({
  value = {},
  onValueChange,
  className,
  disabled = false,
  minAge = 0,
  maxAge = 120,
  fromPlaceholder = "Age",
  toPlaceholder = "Age",
  fromLabel = "From",
  toLabel = "To",
  allowClear = true,
  showLabels = true,
  inputWidth = "73px",
  debounceMs = 500,
}) => {
  const [fromAge, setFromAge] = useState<string>(
    value.fromAge?.toString() || ""
  );
  const [toAge, setToAge] = useState<string>(value.toAge?.toString() || "");

  // Refs for debounce timers
  const fromDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const toDebounceRef = useRef<NodeJS.Timeout | null>(null);

  // Update local state when value prop changes (external updates)
  useEffect(() => {
    setFromAge(value.fromAge?.toString() || "");
    setToAge(value.toAge?.toString() || "");
  }, [value]);

  // Debounced update function
  const debouncedUpdate = useCallback(
    (fromValue: string, toValue: string) => {
      const fromAgeNum = fromValue ? parseInt(fromValue, 10) : undefined;
      const toAgeNum = toValue ? parseInt(toValue, 10) : undefined;

      // Validate the values
      const isFromValid =
        fromAgeNum === undefined ||
        (fromAgeNum >= minAge && fromAgeNum <= maxAge);
      const isToValid =
        toAgeNum === undefined || (toAgeNum >= minAge && toAgeNum <= maxAge);
      const isRangeValid =
        fromAgeNum === undefined ||
        toAgeNum === undefined ||
        fromAgeNum <= toAgeNum;

      if (isFromValid && isToValid && isRangeValid) {
        onValueChange?.({
          fromAge: fromAgeNum,
          toAge: toAgeNum,
        });
      }
    },
    [minAge, maxAge, onValueChange]
  );

  const handleFromAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setFromAge(newValue);

    // Clear existing timer
    if (fromDebounceRef.current) {
      clearTimeout(fromDebounceRef.current);
    }

    // Set new debounced timer
    fromDebounceRef.current = setTimeout(() => {
      debouncedUpdate(newValue, toAge);
    }, debounceMs);
  };

  const handleToAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setToAge(newValue);

    // Clear existing timer
    if (toDebounceRef.current) {
      clearTimeout(toDebounceRef.current);
    }

    // Set new debounced timer
    toDebounceRef.current = setTimeout(() => {
      debouncedUpdate(fromAge, newValue);
    }, debounceMs);
  };

  const handleClear = () => {
    // Clear any pending debounce timers
    if (fromDebounceRef.current) {
      clearTimeout(fromDebounceRef.current);
    }
    if (toDebounceRef.current) {
      clearTimeout(toDebounceRef.current);
    }

    setFromAge("");
    setToAge("");
    onValueChange?.({});
  };

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (fromDebounceRef.current) {
        clearTimeout(fromDebounceRef.current);
      }
      if (toDebounceRef.current) {
        clearTimeout(toDebounceRef.current);
      }
    };
  }, []);

  const hasValues = fromAge || toAge;

  return (
    <div className={cn("flex items-center gap-2.5 p-2.5", className)}>
      {showLabels && <span className="body-16 text-black">{fromLabel}</span>}

      <Input
        type="number"
        placeholder={fromPlaceholder}
        value={fromAge}
        onChange={handleFromAgeChange}
        min={minAge}
        max={maxAge}
        disabled={disabled}
        style={{ width: inputWidth }}
        className="h-8 rounded-2xl bg-white border-0 px-4 py-3 font-jakarta text-sm font-medium text-neutral-800 placeholder:text-neutral-300"
      />

      {showLabels && <span className="body-16 text-black">{toLabel}</span>}

      <Input
        type="number"
        placeholder={toPlaceholder}
        value={toAge}
        onChange={handleToAgeChange}
        min={minAge}
        max={maxAge}
        disabled={disabled}
        style={{ width: inputWidth }}
        className="h-8 rounded-2xl bg-white border-0 px-4 py-3 font-jakarta text-sm font-medium text-neutral-800 placeholder:text-neutral-300"
      />

      {allowClear && hasValues && !disabled && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="h-8 w-8 p-0 hover:bg-neutral-100 rounded-full"
          aria-label="Clear age range"
        >
          <X className="h-4 w-4 text-neutral-500" />
        </Button>
      )}
    </div>
  );
};

export default AgeRangeInput;
