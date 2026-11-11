// ScmOrderManagementChart.types.tsx
// Type definitions for SCM Order Management Analytics charts

/**
 * Chart #8a: IR Status Distribution (Approval Status)
 * Shows the distribution of Internal Requests by approval status
 */
export interface IRStatusDistributionApprovalChart {
  chartTitle: string;
  pending: number;
  pendingPercentage: number;
  approved: number;
  approvedPercentage: number;
  cancelled: number;
  cancelledPercentage: number;
  forcedClosed: number;
  forcedClosedPercentage: number;
  total: number;
}

/**
 * Chart #8b: IR Status Distribution (Fulfillment Status)
 * Shows the distribution of Internal Requests by fulfillment status
 */
export interface IRStatusDistributionFulfillmentChart {
  chartTitle: string;
  created: number;
  createdPercentage: number;
  toVendorPO: number;
  toVendorPOPercentage: number;
  partiallyFulfilled: number;
  partiallyFulfilledPercentage: number;
  fullyFulfilled: number;
  fullyFulfilledPercentage: number;
  total: number;
}

/**
 * Chart #9: Most Requested Items
 * Shows items with highest requested quantities
 */
export interface MostRequestedItemsChart {
  chartTitle: string;
  itemName: string;
  requestedQuantity: number;
}

/**
 * Chart #13: GRN Count by Branch (Heatmap)
 * Shows total GRN count for each branch
 */
export interface GRNCountByBranchChart {
  chartTitle: string;
  totalGRNs: number;
  branch: string;
}

/**
 * API Response structure - Direct dictionary with chart arrays
 * This is the exact structure returned from the API
 */
export interface ScmOrderManagementChartsApiResponse {
  IRStatusDistributionApproval: IRStatusDistributionApprovalChart[];
  IRStatusDistributionFulfillment: IRStatusDistributionFulfillmentChart[];
  MostRequestedItems: MostRequestedItemsChart[];
  GRNCountByBranch: GRNCountByBranchChart[];
}

/**
 * Processed chart data type (same as API response in this case)
 * Kept separate for consistency with other dashboard hooks
 */
export type ProcessedScmOrderManagementChartData =
  ScmOrderManagementChartsApiResponse;

/**
 * Union type of all chart data types
 */
export type ScmOrderManagementChartData =
  | IRStatusDistributionApprovalChart
  | IRStatusDistributionFulfillmentChart
  | MostRequestedItemsChart
  | GRNCountByBranchChart;

/**
 * Chart type keys for type-safe access
 */
export type ScmOrderManagementChartType =
  keyof ScmOrderManagementChartsApiResponse;

/**
 * Constant array of all chart types
 */
export const SCM_ORDER_MANAGEMENT_CHART_TYPES: ScmOrderManagementChartType[] = [
  "IRStatusDistributionApproval",
  "IRStatusDistributionFulfillment",
  "MostRequestedItems",
  "GRNCountByBranch",
];
