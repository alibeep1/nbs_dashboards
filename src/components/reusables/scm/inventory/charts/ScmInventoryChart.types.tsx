// ScmInventoryChart.types.tsx
// Type definitions for SCM Inventory Analytics charts

/**
 * Raw API response structure for SCM Inventory charts
 * The API returns an array of arrays, where each inner array represents a different chart
 */
export type ScmInventoryChartsApiResponse = [
  StockValueByWarehouseChart[],
  StockQuantityByCategoryChart[],
  DamagedExpiredLostTrendChart[],
  LowStockItemsChart[],
  StaticItemsChart[],
  SupplyByProductChart[]
];

/**
 * Chart 1: Stock Value by Warehouse
 * Shows the total stock value distributed across different warehouses
 */
export interface StockValueByWarehouseChart {
  chartTitle: "Stock Value by Warehouse";
  storeName: string;
  stockValue: number;
}

/**
 * Chart 2: Stock Quantity by Category
 * Shows the total quantity of stock grouped by product category
 */
export interface StockQuantityByCategoryChart {
  chartTitle: "Stock Quantity by Category";
  cdlDescr: string; // Category description
  quantity: number;
}

/**
 * Chart 3: Damaged, Expired, and Lost Trend
 * Tracks damaged, expired, and lost inventory over time
 */
export interface DamagedExpiredLostTrendChart {
  chartTitle: "Damaged, Expired, and Lost Trend";
  damaged: number;
  expired: number;
  lost: number;
  month: string;
  monthOrderBy: number;
}

/**
 * Chart 4: Low Stock Items
 * Lists items that are running low on stock
 */
export interface LowStockItemsChart {
  chartTitle: "Low Stock Items";
  itemName: string;
  onOrderQty: number;
  currentQty: number;
}

/**
 * Chart 5: Static Items (No Movement in 60+ days)
 * Shows items that haven't moved in over 60 days
 */
export interface StaticItemsChart {
  chartTitle: "Static Items (No Movement in 60+ days)";
  item: string;
  qty: number;
  lastMove: string; // ISO date string
  totalValue: number;
}

/**
 * Chart 6: Supply by Product Name
 * Comprehensive supply information by product
 */
export interface SupplyByProductChart {
  chartTitle: "Supply by Product Name";
  itemCode: string;
  item: string;
  qty: number;
  returnQty: number;
  lastMove: string; // ISO date string
  totalValue: number;
  softReserved: number;
}

/**
 * Processed chart data structure
 * Organizes raw API data into typed arrays for each chart type
 */
export interface ProcessedScmInventoryChartData {
  stockValueByWarehouse: StockValueByWarehouseChart[];
  stockQuantityByCategory: StockQuantityByCategoryChart[];
  damagedExpiredLostTrend: DamagedExpiredLostTrendChart[];
  lowStockItems: LowStockItemsChart[];
  staticItems: StaticItemsChart[];
  supplyByProduct: SupplyByProductChart[];
}

/**
 * Union type of all possible chart data items
 */
export type ScmInventoryChartItem =
  | StockValueByWarehouseChart
  | StockQuantityByCategoryChart
  | DamagedExpiredLostTrendChart
  | LowStockItemsChart
  | StaticItemsChart
  | SupplyByProductChart;

/**
 * Mapping of chart titles to their corresponding data types
 */
export type ChartTitleMap = {
  "Stock Value by Warehouse": StockValueByWarehouseChart;
  "Stock Quantity by Category": StockQuantityByCategoryChart;
  "Damaged, Expired, and Lost Trend": DamagedExpiredLostTrendChart;
  "Low Stock Items": LowStockItemsChart;
  "Static Items (No Movement in 60+ days)": StaticItemsChart;
  "Supply by Product Name": SupplyByProductChart;
};

/**
 * Valid chart title literals
 */
export type ScmInventoryChartTitle = keyof ChartTitleMap;

/**
 * Type guard to check if a chart title is valid
 */
export const isValidScmInventoryChartTitle = (
  title: string
): title is ScmInventoryChartTitle => {
  return [
    "Stock Value by Warehouse",
    "Stock Quantity by Category",
    "Damaged, Expired, and Lost Trend",
    "Low Stock Items",
    "Static Items (No Movement in 60+ days)",
    "Supply by Product Name",
  ].includes(title);
};

/**
 * Options for processing chart data
 */
export interface ProcessChartDataOptions {
  enableLogging?: boolean;
  logPrefix?: string;
}
