// Interface for a single KPI item
export interface KpiItem {
  title: string;
  value: string;
  previousValue: string;
  percentChange: string;
}

// Interface for the complete KPI API response (array of KPI items)
export interface KpiResponse extends Array<KpiItem> {}

// Alternative: If you prefer explicit array type
export type KpiApiResponse = KpiItem[];

const plainNumericStringPattern = /^[+-]?\d+(\.\d+)?$/;

export function formatKpiValue(value: string | undefined): string {
  if (value === undefined) {
    return "";
  }

  const trimmedValue = value.trim();

  if (!plainNumericStringPattern.test(trimmedValue)) {
    return value;
  }

  const numericValue = Number(trimmedValue);

  if (!Number.isFinite(numericValue)) {
    return value;
  }

  return new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 2,
  }).format(numericValue);
}

// Enhanced interface with optional computed properties for better type safety
export interface EnhancedKpiItem {
  title: string;
  value: string;
  previousValue: string;
  percentChange: string;

  // Optional computed properties (you can add these in your component)
  numericValue?: number;
  numericPreviousValue?: number;
  numericPercentChange?: number;
  isPositive?: boolean;
  isNegative?: boolean;
}

// Utility type for when you need to work with numeric values
export interface ParsedKpiItem {
  title: string;
  value: number;
  previousValue: number;
  percentChange: number;
  percentChangeFormatted: string;
  isPositive: boolean;
  isNegative: boolean;
  isUnchanged: boolean;
}

// Helper function to parse KPI item from API response to numeric values
export function parseKpiItem(item: KpiItem): ParsedKpiItem {
  const numericValue = parseFloat(item.value) || 0;
  const numericPreviousValue = parseFloat(item.previousValue) || 0;
  const numericPercentChange =
    parseFloat(item.percentChange.replace("%", "")) || 0;

  return {
    title: item.title,
    value: numericValue,
    previousValue: numericPreviousValue,
    percentChange: numericPercentChange,
    percentChangeFormatted: item.percentChange,
    isPositive: numericPercentChange > 0,
    isNegative: numericPercentChange < 0,
    isUnchanged: numericPercentChange === 0,
  };
}

// Helper function to parse entire KPI response
export function parseKpiResponse(response: KpiResponse): ParsedKpiItem[] {
  return response.map(parseKpiItem);
}
