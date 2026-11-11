// ScmOrderManagementChartProcessor.tsx
// Utility functions for SCM Order Management charts data
// Note: Since API returns data already organized, no complex processing needed

import type {
  ScmOrderManagementChartsApiResponse,
  ProcessedScmOrderManagementChartData,
  ScmOrderManagementChartType,
  IRStatusDistributionApprovalChart,
  IRStatusDistributionFulfillmentChart,
  MostRequestedItemsChart,
  GRNCountByBranchChart,
} from "./ScmOrderManagementChart.types";

/**
 * Process charts data (pass-through since API already returns organized data)
 * Kept for consistency with other dashboard processors
 */
export const processChartsData = (
  rawData: ScmOrderManagementChartsApiResponse
): ProcessedScmOrderManagementChartData => {
  return rawData;
};

/**
 * Type-safe helper to get chart data by type
 */
export const getChartData = <T extends ScmOrderManagementChartType>(
  processedData: ProcessedScmOrderManagementChartData | null,
  chartType: T
): ProcessedScmOrderManagementChartData[T] => {
  return (
    processedData?.[chartType] ||
    ([] as ProcessedScmOrderManagementChartData[T])
  );
};

/**
 * Check if a specific chart type has data
 */
export const hasChartData = (
  processedData: ProcessedScmOrderManagementChartData | null,
  chartType: ScmOrderManagementChartType
): boolean => {
  return (processedData?.[chartType]?.length || 0) > 0;
};

/**
 * Get summary statistics of processed data
 */
export const getProcessedDataSummary = (
  processedData: ProcessedScmOrderManagementChartData | null
) => {
  if (!processedData) return null;

  return {
    totalChartTypes: Object.keys(processedData).length,
    chartsWithData: Object.values(processedData).filter((arr) => arr.length > 0)
      .length,
    totalDataPoints: Object.values(processedData).reduce(
      (sum, arr) => sum + arr.length,
      0
    ),
    breakdown: {
      irStatusDistributionApproval:
        processedData.IRStatusDistributionApproval.length,
      irStatusDistributionFulfillment:
        processedData.IRStatusDistributionFulfillment.length,
      mostRequestedItems: processedData.MostRequestedItems.length,
      grnCountByBranch: processedData.GRNCountByBranch.length,
    },
  };
};

// ============================================================================
// Sorting Utilities
// ============================================================================

/**
 * Sort Most Requested Items charts
 */
export const sortMostRequestedItems = {
  byQuantity: (
    data: MostRequestedItemsChart[],
    order: "asc" | "desc" = "desc"
  ): MostRequestedItemsChart[] => {
    return [...data].sort((a, b) =>
      order === "desc"
        ? b.requestedQuantity - a.requestedQuantity
        : a.requestedQuantity - b.requestedQuantity
    );
  },

  byItemName: (
    data: MostRequestedItemsChart[],
    order: "asc" | "desc" = "asc"
  ): MostRequestedItemsChart[] => {
    return [...data].sort((a, b) =>
      order === "asc"
        ? a.itemName.localeCompare(b.itemName)
        : b.itemName.localeCompare(a.itemName)
    );
  },
};

/**
 * Sort GRN Count by Branch charts
 */
export const sortGRNCountByBranch = {
  byTotalGRNs: (
    data: GRNCountByBranchChart[],
    order: "asc" | "desc" = "desc"
  ): GRNCountByBranchChart[] => {
    return [...data].sort((a, b) =>
      order === "desc" ? b.totalGRNs - a.totalGRNs : a.totalGRNs - b.totalGRNs
    );
  },

  byBranch: (
    data: GRNCountByBranchChart[],
    order: "asc" | "desc" = "asc"
  ): GRNCountByBranchChart[] => {
    return [...data].sort((a, b) =>
      order === "asc"
        ? a.branch.localeCompare(b.branch)
        : b.branch.localeCompare(a.branch)
    );
  },
};

// ============================================================================
// Filtering Utilities
// ============================================================================

/**
 * Filter Most Requested Items by minimum quantity
 */
export const filterByMinQuantity = (
  data: MostRequestedItemsChart[],
  minQuantity: number
): MostRequestedItemsChart[] => {
  return data.filter((item) => item.requestedQuantity >= minQuantity);
};

/**
 * Filter GRN Count by Branch by minimum GRN count
 */
export const filterByMinGRNCount = (
  data: GRNCountByBranchChart[],
  minCount: number
): GRNCountByBranchChart[] => {
  return data.filter((item) => item.totalGRNs >= minCount);
};

/**
 * Filter GRN Count by specific branch
 */
export const filterByBranch = (
  data: GRNCountByBranchChart[],
  branchName: string
): GRNCountByBranchChart[] => {
  return data.filter((item) =>
    item.branch.toLowerCase().includes(branchName.toLowerCase())
  );
};

// ============================================================================
// IR Status Distribution Helpers
// ============================================================================

/**
 * Get approval status with highest count
 */
export const getHighestApprovalStatus = (
  data: IRStatusDistributionApprovalChart | null
): { status: string; count: number } | null => {
  if (!data) return null;

  const statuses = [
    { status: "Pending", count: data.pending },
    { status: "Approved", count: data.approved },
    { status: "Cancelled", count: data.cancelled },
    { status: "Forced Closed", count: data.forcedClosed },
  ];

  return statuses.reduce((max, current) =>
    current.count > max.count ? current : max
  );
};

/**
 * Get fulfillment status with highest count
 */
export const getHighestFulfillmentStatus = (
  data: IRStatusDistributionFulfillmentChart | null
): { status: string; count: number } | null => {
  if (!data) return null;

  const statuses = [
    { status: "Created", count: data.created },
    { status: "To Vendor PO", count: data.toVendorPO },
    { status: "Partially Fulfilled", count: data.partiallyFulfilled },
    { status: "Fully Fulfilled", count: data.fullyFulfilled },
  ];

  return statuses.reduce((max, current) =>
    current.count > max.count ? current : max
  );
};

/**
 * Calculate approval rate (approved / total)
 */
export const getApprovalRate = (
  data: IRStatusDistributionApprovalChart | null
): number => {
  if (!data || data.total === 0) return 0;
  return (data.approved / data.total) * 100;
};

/**
 * Calculate fulfillment rate (fully fulfilled / total)
 */
export const getFulfillmentRate = (
  data: IRStatusDistributionFulfillmentChart | null
): number => {
  if (!data || data.total === 0) return 0;
  return (data.fullyFulfilled / data.total) * 100;
};

// ============================================================================
// Aggregation Utilities
// ============================================================================

/**
 * Get total requested quantity across all items
 */
export const getTotalRequestedQuantity = (
  data: MostRequestedItemsChart[]
): number => {
  return data.reduce((sum, item) => sum + item.requestedQuantity, 0);
};

/**
 * Get total GRNs across all branches
 */
export const getTotalGRNs = (data: GRNCountByBranchChart[]): number => {
  return data.reduce((sum, item) => sum + item.totalGRNs, 0);
};

/**
 * Get average GRNs per branch
 */
export const getAvgGRNsPerBranch = (data: GRNCountByBranchChart[]): number => {
  if (data.length === 0) return 0;
  return getTotalGRNs(data) / data.length;
};

/**
 * Get top N most requested items
 */
export const getTopNRequestedItems = (
  data: MostRequestedItemsChart[],
  n: number
): MostRequestedItemsChart[] => {
  return sortMostRequestedItems.byQuantity(data, "desc").slice(0, n);
};

/**
 * Get top N branches by GRN count
 */
export const getTopNBranchesByGRN = (
  data: GRNCountByBranchChart[],
  n: number
): GRNCountByBranchChart[] => {
  return sortGRNCountByBranch.byTotalGRNs(data, "desc").slice(0, n);
};
