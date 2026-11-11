// ScmInterbranchChart.types.tsx
// Type definitions for SCM Interbranch Analytics charts

/**
 * Chart #9: Transfer Volume by Route
 * Shows the volume of transfers between branches
 */
export interface TransferVolumeByRouteChart {
  chartTitle: string;
  routeName: string;
  fromBranchCode: string;
  toBranchCode: string;
  transferCount: number;
  firstTransferDate: string; // ISO date string
  lastTransferDate: string; // ISO date string
  avgMonthlyTransfers: number;
}

/**
 * Chart #10: Pending Transfers by Destination
 * Shows pending transfers awaiting receipt at destination branches
 */
export interface PendingTransfersByDestinationChart {
  chartTitle: string;
  toBranch: string;
  items: string;
  qty: number;
  ginDate: string; // ISO date string (Goods Issue Note date)
  days: number; // Days pending
}

/**
 * Chart #11: Transfer Fulfillment Trend
 * Shows weekly trend of GINs (issued) vs GRNs (received)
 */
export interface TransferFulfillmentTrendChart {
  chartTitle: string;
  weekLabel: string;
  weekNumber: number;
  year: number;
  giNs: number; // Goods Issue Notes (outgoing)
  grNs: number; // Goods Receipt Notes (incoming)
}

/**
 * API Response structure - Direct dictionary with chart arrays
 * This is the exact structure returned from the API
 */
export interface ScmInterbranchChartsApiResponse {
  TransferVolumeByRoute: TransferVolumeByRouteChart[];
  PendingTransfersByDestination: PendingTransfersByDestinationChart[];
  TransferFulfillmentTrend: TransferFulfillmentTrendChart[];
}

/**
 * Processed chart data type (same as API response in this case)
 * Kept separate for consistency with other dashboard hooks
 */
export type ProcessedScmInterbranchChartData = ScmInterbranchChartsApiResponse;

/**
 * Union type of all chart data types
 */
export type ScmInterbranchChartData =
  | TransferVolumeByRouteChart
  | PendingTransfersByDestinationChart
  | TransferFulfillmentTrendChart;

/**
 * Chart type keys for type-safe access
 */
export type ScmInterbranchChartType = keyof ScmInterbranchChartsApiResponse;

/**
 * Constant array of all chart types
 */
export const SCM_INTERBRANCH_CHART_TYPES: ScmInterbranchChartType[] = [
  "TransferVolumeByRoute",
  "PendingTransfersByDestination",
  "TransferFulfillmentTrend",
];
