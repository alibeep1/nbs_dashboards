// ScmOrderManagementTables.types.ts
// Type definitions for SCM Order Management Analytics tables

/**
 * Table #10: Pending IRs
 * Shows Internal Requests that are pending processing
 */
export interface ITablePendingIRs {
  sno: string; // Serial Number / IR Number
  totalItems: number; // Number of items in the IR
  forBranch: string; // Branch requesting the items
  date: string; // IR creation date (ISO format)
  irIntoPO: string; // Status or indicator if IR converted to PO
}

/**
 * Table #12: POs Awaiting Approval
 * Shows Purchase Orders pending approval
 */
export interface ITablePOsAwaitingApproval {
  sno: string; // Serial Number / PO Number
  vendor: string; // Vendor name
  amount: number; // PO total amount
  totalItems: number; // Number of items in the PO
  createdBy: string; // User who created the PO
  date: string; // PO creation date (ISO format)
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
export type ITablePendingIRsApiResponse =
  PaginatedApiResponse<ITablePendingIRs>;

export type ITablePOsAwaitingApprovalApiResponse =
  PaginatedApiResponse<ITablePOsAwaitingApproval>;
