// ScmInterbranchTables.types.ts
// Type definitions for SCM Interbranch Analytics tables

/**
 * Table #12: Transfers with Mismatched Qty
 * Shows transfer requests where there's a variance between IR, GIN, and GRN quantities
 */
export interface ITableTransfersWithMismatchedQty {
  irNo: string; // Internal Request Number
  irQty: number; // Quantity on Internal Request
  ginQty: number; // Quantity on Goods Issue Note
  grnQty: number; // Quantity on Goods Receipt Note
  variance: number; // Calculated variance (difference)
}

/**
 * Table #14: Transfer SLA Compliance
 * Shows statistics on transfer completion within SLA timeframes
 */
export interface ITableTransferSLACompliance {
  onTimeCount: number; // Number of transfers completed on time
  delayedCount: number; // Number of delayed transfers
  totalRequests: number; // Total transfer requests
  onTimePercentage: number; // Percentage of on-time transfers
  delayedPercentage: number; // Percentage of delayed transfers
}

/**
 * Table: Pending Transfers by Destination
 * Shows pending transfers awaiting receipt at destination branches
 */
export interface ITablePendingTransfersByDestination {
  toBranch: string; // Destination branch name
  items: string; // Item name(s)
  qty: number; // Quantity pending
  ginDate: string; // Goods Issue Note date (ISO format)
  days: number; // Days pending since GIN
}

/**
 * Generic paginated API response wrapper
 * All table endpoints return data in this structure
 */
export interface PaginatedApiResponse<T> {
  items: T[];
  pageIndex: number;
  totalPages: number;
  count: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

/**
 * Type aliases for specific paginated responses
 * These make the GenericDataTable usage cleaner
 */
export type ITableTransfersWithMismatchedQtyApiResponse =
  PaginatedApiResponse<ITableTransfersWithMismatchedQty>;

export type ITableTransferSLAComplianceApiResponse =
  PaginatedApiResponse<ITableTransferSLACompliance>;

export type ITablePendingTransfersByDestinationApiResponse =
  PaginatedApiResponse<ITablePendingTransfersByDestination>;
