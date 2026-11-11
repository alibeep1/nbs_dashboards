// transformDamagedExpiredLostData.ts
// Utility to transform Damaged, Expired, and Lost Trend data for StackedAreaChart

import type { DamagedExpiredLostTrendChart } from "./ScmInventoryChart.types";

/**
 * Transform the Damaged, Expired, and Lost Trend data from wide format to long format
 * for use with StackedAreaChart component
 *
 * Input (wide format):
 * [
 *   { month: "May", damaged: 0, expired: 0, lost: 0, monthOrderBy: 5 },
 *   { month: "Jun", damaged: 5, expired: 2, lost: 1, monthOrderBy: 6 },
 * ]
 *
 * Output (long format):
 * [
 *   { month: "May", count: 0, type: "damaged", monthOrderBy: 5 },
 *   { month: "May", count: 0, type: "expired", monthOrderBy: 5 },
 *   { month: "May", count: 0, type: "lost", monthOrderBy: 5 },
 *   { month: "Jun", count: 5, type: "damaged", monthOrderBy: 6 },
 *   { month: "Jun", count: 2, type: "expired", monthOrderBy: 6 },
 *   { month: "Jun", count: 1, type: "lost", monthOrderBy: 6 },
 * ]
 */

export interface TransformedDamagedExpiredLostData {
  month: string;
  count: number;
  type: "damaged" | "expired" | "lost";
  monthOrderBy: number;
  chartTitle?: string;
}

export const transformDamagedExpiredLostData = (
  data: DamagedExpiredLostTrendChart[]
): TransformedDamagedExpiredLostData[] => {
  if (!data || data.length === 0) return [];

  const transformed: TransformedDamagedExpiredLostData[] = [];

  data.forEach((item) => {
    // Add damaged entry
    transformed.push({
      month: item.month,
      count: Number(item.damaged),
      type: "damaged",
      monthOrderBy: item.monthOrderBy,
      chartTitle: item.chartTitle,
    });

    // Add expired entry
    transformed.push({
      month: item.month,
      count: Number(item.expired),
      type: "expired",
      monthOrderBy: item.monthOrderBy,
      chartTitle: item.chartTitle,
    });

    // Add lost entry
    transformed.push({
      month: item.month,
      count: Number(item.lost),
      type: "lost",
      monthOrderBy: item.monthOrderBy,
      chartTitle: item.chartTitle,
    });
  });

  // Sort by monthOrderBy to ensure correct chronological order

  return transformed.sort((a, b) => a.monthOrderBy - b.monthOrderBy);
};

/**
 * Get color mapping for damage types
 */
export const getDamageTypeColors = () => ({
  damaged: "#ef4444", // red-500 - for damaged items
  expired: "#f59e0b", // amber-500 - for expired items
  lost: "#6b7280", // gray-500 - for lost items
});

/**
 * Get color array for StackedAreaChart
 */
export const getDamageTypeColorArray = (): string[] => {
  const colorMap = getDamageTypeColors();
  return [colorMap.damaged, colorMap.expired, colorMap.lost];
};
