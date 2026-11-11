// ScmInterbranchChartProcessor.tsx
// Utility functions for SCM Interbranch charts data
// Note: Since API returns data already organized, no complex processing needed

import type {
  ScmInterbranchChartsApiResponse,
  ProcessedScmInterbranchChartData,
  ScmInterbranchChartType,
  TransferVolumeByRouteChart,
  PendingTransfersByDestinationChart,
  TransferFulfillmentTrendChart,
} from "./ScmInterbranchChart.types";

/**
 * Process charts data (pass-through since API already returns organized data)
 * Kept for consistency with other dashboard processors
 */
export const processChartsData = (
  rawData: ScmInterbranchChartsApiResponse
): ProcessedScmInterbranchChartData => {
  return rawData;
};

/**
 * Type-safe helper to get chart data by type
 */
export const getChartData = <T extends ScmInterbranchChartType>(
  processedData: ProcessedScmInterbranchChartData | null,
  chartType: T
): ProcessedScmInterbranchChartData[T] => {
  return (
    processedData?.[chartType] || ([] as ProcessedScmInterbranchChartData[T])
  );
};

/**
 * Check if a specific chart type has data
 */
export const hasChartData = (
  processedData: ProcessedScmInterbranchChartData | null,
  chartType: ScmInterbranchChartType
): boolean => {
  return (processedData?.[chartType]?.length || 0) > 0;
};

/**
 * Get summary statistics of processed data
 */
export const getProcessedDataSummary = (
  processedData: ProcessedScmInterbranchChartData | null
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
      transferVolumeByRoute: processedData.TransferVolumeByRoute.length,
      pendingTransfersByDestination:
        processedData.PendingTransfersByDestination.length,
      transferFulfillmentTrend: processedData.TransferFulfillmentTrend.length,
    },
  };
};

// ============================================================================
// Sorting Utilities
// ============================================================================

/**
 * Sort Transfer Volume by Route charts
 */
export const sortTransferVolumeByRoute = {
  byTransferCount: (
    data: TransferVolumeByRouteChart[],
    order: "asc" | "desc" = "desc"
  ): TransferVolumeByRouteChart[] => {
    return [...data].sort((a, b) =>
      order === "desc"
        ? b.transferCount - a.transferCount
        : a.transferCount - b.transferCount
    );
  },

  byAvgMonthlyTransfers: (
    data: TransferVolumeByRouteChart[],
    order: "asc" | "desc" = "desc"
  ): TransferVolumeByRouteChart[] => {
    return [...data].sort((a, b) =>
      order === "desc"
        ? b.avgMonthlyTransfers - a.avgMonthlyTransfers
        : a.avgMonthlyTransfers - b.avgMonthlyTransfers
    );
  },

  byRouteName: (
    data: TransferVolumeByRouteChart[],
    order: "asc" | "desc" = "asc"
  ): TransferVolumeByRouteChart[] => {
    return [...data].sort((a, b) =>
      order === "asc"
        ? a.routeName.localeCompare(b.routeName)
        : b.routeName.localeCompare(a.routeName)
    );
  },
};

/**
 * Sort Pending Transfers by Destination charts
 */
export const sortPendingTransfersByDestination = {
  byDays: (
    data: PendingTransfersByDestinationChart[],
    order: "asc" | "desc" = "desc"
  ): PendingTransfersByDestinationChart[] => {
    return [...data].sort((a, b) =>
      order === "desc" ? b.days - a.days : a.days - b.days
    );
  },

  byQty: (
    data: PendingTransfersByDestinationChart[],
    order: "asc" | "desc" = "desc"
  ): PendingTransfersByDestinationChart[] => {
    return [...data].sort((a, b) =>
      order === "desc" ? b.qty - a.qty : a.qty - b.qty
    );
  },

  byBranch: (
    data: PendingTransfersByDestinationChart[],
    order: "asc" | "desc" = "asc"
  ): PendingTransfersByDestinationChart[] => {
    return [...data].sort((a, b) =>
      order === "asc"
        ? a.toBranch.localeCompare(b.toBranch)
        : b.toBranch.localeCompare(a.toBranch)
    );
  },

  byGINDate: (
    data: PendingTransfersByDestinationChart[],
    order: "asc" | "desc" = "desc"
  ): PendingTransfersByDestinationChart[] => {
    return [...data].sort((a, b) => {
      const dateA = new Date(a.ginDate).getTime();
      const dateB = new Date(b.ginDate).getTime();
      return order === "desc" ? dateB - dateA : dateA - dateB;
    });
  },
};

/**
 * Sort Transfer Fulfillment Trend charts
 */
export const sortTransferFulfillmentTrend = {
  byWeekNumber: (
    data: TransferFulfillmentTrendChart[],
    order: "asc" | "desc" = "asc"
  ): TransferFulfillmentTrendChart[] => {
    return [...data].sort((a, b) => {
      // Sort by year first, then week number
      if (a.year !== b.year) {
        return order === "asc" ? a.year - b.year : b.year - a.year;
      }
      return order === "asc"
        ? a.weekNumber - b.weekNumber
        : b.weekNumber - a.weekNumber;
    });
  },

  byGINs: (
    data: TransferFulfillmentTrendChart[],
    order: "asc" | "desc" = "desc"
  ): TransferFulfillmentTrendChart[] => {
    return [...data].sort((a, b) =>
      order === "desc" ? b.giNs - a.giNs : a.giNs - b.giNs
    );
  },

  byGRNs: (
    data: TransferFulfillmentTrendChart[],
    order: "asc" | "desc" = "desc"
  ): TransferFulfillmentTrendChart[] => {
    return [...data].sort((a, b) =>
      order === "desc" ? b.grNs - a.grNs : a.grNs - b.grNs
    );
  },
};

// ============================================================================
// Filtering Utilities
// ============================================================================

/**
 * Filter pending transfers by minimum days
 */
export const filterPendingByMinDays = (
  data: PendingTransfersByDestinationChart[],
  minDays: number
): PendingTransfersByDestinationChart[] => {
  return data.filter((item) => item.days >= minDays);
};

/**
 * Filter transfers by date range
 */
export const filterByDateRange = (
  data: TransferVolumeByRouteChart[],
  startDate: Date,
  endDate: Date
): TransferVolumeByRouteChart[] => {
  return data.filter((item) => {
    const lastTransfer = new Date(item.lastTransferDate);
    return lastTransfer >= startDate && lastTransfer <= endDate;
  });
};

/**
 * Filter by specific branch (from or to)
 */
export const filterByBranch = (
  data: TransferVolumeByRouteChart[],
  branchCode: string,
  direction: "from" | "to" | "either" = "either"
): TransferVolumeByRouteChart[] => {
  return data.filter((item) => {
    if (direction === "from") return item.fromBranchCode === branchCode;
    if (direction === "to") return item.toBranchCode === branchCode;
    return (
      item.fromBranchCode === branchCode || item.toBranchCode === branchCode
    );
  });
};

// ============================================================================
// Aggregation Utilities
// ============================================================================

/**
 * Get total transfer count across all routes
 */
export const getTotalTransferCount = (
  data: TransferVolumeByRouteChart[]
): number => {
  return data.reduce((sum, item) => sum + item.transferCount, 0);
};

/**
 * Get total pending quantity
 */
export const getTotalPendingQty = (
  data: PendingTransfersByDestinationChart[]
): number => {
  return data.reduce((sum, item) => sum + item.qty, 0);
};

/**
 * Get fulfillment rate (GRNs / GINs ratio) for a specific week
 */
export const getFulfillmentRate = (
  item: TransferFulfillmentTrendChart
): number => {
  if (item.giNs === 0) return 0;
  return (item.grNs / item.giNs) * 100;
};

/**
 * Get average fulfillment rate across all weeks
 */
export const getAvgFulfillmentRate = (
  data: TransferFulfillmentTrendChart[]
): number => {
  if (data.length === 0) return 0;
  const rates = data.map((item) => getFulfillmentRate(item));
  return rates.reduce((sum, rate) => sum + rate, 0) / rates.length;
};
