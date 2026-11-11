// ScmInventoryTables.types.ts
// Type definitions for SCM Inventory table API responses

/**
 * Items Near Expiry Table Response
 */
export interface ItemNearExpiryItem {
  itemCode: string;
  name: string;
  expiryDate: string; // ISO date string
  warehouse: string;
  daysLeft: number;
}

export interface ITableItemsNearExpiryApiResponse {
  items: ItemNearExpiryItem[];
  pageIndex: number;
  totalPages: number;
  count: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

/**
 * Low Stock Items Table Response (if needed in future)
 */
export interface LowStockItem {
  itemName: string;
  onOrderQty: number;
  currentQty: number;
}

export interface ITableLowStockItemsApiResponse {
  items: LowStockItem[];
  pageIndex: number;
  totalPages: number;
  count: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

/**
 * Static Items Table Response (if needed in future)
 */
export interface StaticItem {
  item: string;
  qty: number;
  lastMove: string; // ISO date string
  totalValue: number;
}

export interface ITableStaticItemsApiResponse {
  items: StaticItem[];
  pageIndex: number;
  totalPages: number;
  count: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

/**
 * Stocktaking Summary Table Response
 */
export interface StocktakingSummaryItem {
  warehouse: string;
  sNo: string; // Serial number for the stocktaking session
  lastCount: string; // ISO date string
  countedBy: string; // Email of the person who counted
  status: string; // Status of the stocktaking (e.g., "VERIFIed COUNTING + POSTed Results", "Back to RE- COUNTING")
}

export interface ITableStocktakingSummaryApiResponse {
  items: StocktakingSummaryItem[];
  pageIndex: number;
  totalPages: number;
  count: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
