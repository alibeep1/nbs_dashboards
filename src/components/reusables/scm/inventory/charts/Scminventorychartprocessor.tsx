// ScmInventoryChartProcessor.tsx
// Processor for SCM Inventory Analytics chart data

import {
  type ScmInventoryChartsApiResponse,
  type ProcessedScmInventoryChartData,
  type ScmInventoryChartItem,
  type ScmInventoryChartTitle,
  type ProcessChartDataOptions,
  isValidScmInventoryChartTitle,
  type StockValueByWarehouseChart,
  type StockQuantityByCategoryChart,
  type DamagedExpiredLostTrendChart,
  type LowStockItemsChart,
  type StaticItemsChart,
  type SupplyByProductChart,
} from "./ScmInventoryChart.types";

/**
 * Process raw SCM Inventory charts API response into organized, typed data structure
 * Groups chart items by their chartTitle into separate arrays
 *
 * @param rawData - Raw API response containing nested arrays of chart data
 * @param options - Processing options including logging preferences
 * @returns Processed data organized by chart type
 *
 * @example
 * ```typescript
 * const processedData = processChartsDataByTitle(apiResponse, {
 *   enableLogging: true,
 *   logPrefix: '📊 [ScmInventoryProcessor]'
 * });
 * console.log(processedData.stockValueByWarehouse);
 * console.log(processedData.lowStockItems);
 * ```
 */
export const processChartsDataByTitle = (
  rawData: ScmInventoryChartsApiResponse,
  options: ProcessChartDataOptions = {}
): ProcessedScmInventoryChartData => {
  const { enableLogging = false, logPrefix = "📊 [ScmInventoryProcessor]" } =
    options;

  if (enableLogging) {
    console.log(
      `${logPrefix} Starting to process SCM Inventory charts data...`
    );
  }

  // Initialize the result object with empty arrays
  const result: ProcessedScmInventoryChartData = {
    stockValueByWarehouse: [],
    stockQuantityByCategory: [],
    damagedExpiredLostTrend: [],
    lowStockItems: [],
    staticItems: [],
    supplyByProduct: [],
  };

  // Flatten the nested array structure
  const flattenedData: ScmInventoryChartItem[] = rawData.flat();

  if (enableLogging) {
    console.log(`${logPrefix} Total items to process: ${flattenedData.length}`);
  }

  // Process each item and categorize by chartTitle
  flattenedData.forEach((item, index) => {
    const chartTitle = item.chartTitle;

    if (!isValidScmInventoryChartTitle(chartTitle)) {
      if (enableLogging) {
        console.warn(
          `${logPrefix} Unknown chart title at index ${index}: "${chartTitle}"`
        );
      }
      return;
    }

    // Type-safe routing based on chartTitle
    switch (chartTitle) {
      case "Stock Value by Warehouse":
        result.stockValueByWarehouse.push(item as StockValueByWarehouseChart);
        break;

      case "Stock Quantity by Category":
        result.stockQuantityByCategory.push(
          item as StockQuantityByCategoryChart
        );
        break;

      case "Damaged, Expired, and Lost Trend":
        result.damagedExpiredLostTrend.push(
          item as DamagedExpiredLostTrendChart
        );
        break;

      case "Low Stock Items":
        result.lowStockItems.push(item as LowStockItemsChart);
        break;

      case "Static Items (No Movement in 60+ days)":
        result.staticItems.push(item as StaticItemsChart);
        break;

      case "Supply by Product Name":
        result.supplyByProduct.push(item as SupplyByProductChart);
        break;

      default:
        // This should never happen due to type checking, but kept for safety
        if (enableLogging) {
          console.warn(`${logPrefix} Unhandled chart title: "${chartTitle}"`);
        }
    }
  });

  if (enableLogging) {
    console.log(`${logPrefix} Processing complete. Summary:`);
    console.log(
      `  - Stock Value by Warehouse: ${result.stockValueByWarehouse.length} items`
    );
    console.log(
      `  - Stock Quantity by Category: ${result.stockQuantityByCategory.length} items`
    );
    console.log(
      `  - Damaged, Expired, Lost Trend: ${result.damagedExpiredLostTrend.length} items`
    );
    console.log(`  - Low Stock Items: ${result.lowStockItems.length} items`);
    console.log(`  - Static Items: ${result.staticItems.length} items`);
    console.log(
      `  - Supply by Product: ${result.supplyByProduct.length} items`
    );
  }

  return result;
};

/**
 * Helper function to get a specific chart's data from processed data
 * Provides type-safe access to individual chart arrays
 *
 * @param processedData - The processed chart data object
 * @param chartType - The type of chart data to retrieve
 * @returns Array of chart items for the specified type
 *
 * @example
 * ```typescript
 * const warehouseData = getChartData(processedData, 'stockValueByWarehouse');
 * const lowStockData = getChartData(processedData, 'lowStockItems');
 * ```
 */
export const getChartData = <T extends keyof ProcessedScmInventoryChartData>(
  processedData: ProcessedScmInventoryChartData | null,
  chartType: T
): ProcessedScmInventoryChartData[T] => {
  return (
    processedData?.[chartType] || ([] as ProcessedScmInventoryChartData[T])
  );
};

/**
 * Helper function to check if a specific chart type has data
 *
 * @param processedData - The processed chart data object
 * @param chartType - The type of chart to check
 * @returns True if the chart has data, false otherwise
 *
 * @example
 * ```typescript
 * if (hasChartData(processedData, 'lowStockItems')) {
 *   // Render low stock items chart
 * }
 * ```
 */
export const hasChartData = (
  processedData: ProcessedScmInventoryChartData | null,
  chartType: keyof ProcessedScmInventoryChartData
): boolean => {
  return (processedData?.[chartType]?.length || 0) > 0;
};

/**
 * Helper function to get summary statistics of processed data
 * Provides an overview of data distribution across all charts
 *
 * @param processedData - The processed chart data object
 * @returns Summary object with counts and breakdown, or null if no data
 *
 * @example
 * ```typescript
 * const summary = getProcessedDataSummary(processedData);
 * console.log(`Total chart types: ${summary.totalChartTypes}`);
 * console.log(`Charts with data: ${summary.chartsWithData}`);
 * ```
 */
export const getProcessedDataSummary = (
  processedData: ProcessedScmInventoryChartData | null
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
      stockValueByWarehouse: processedData.stockValueByWarehouse.length,
      stockQuantityByCategory: processedData.stockQuantityByCategory.length,
      damagedExpiredLostTrend: processedData.damagedExpiredLostTrend.length,
      lowStockItems: processedData.lowStockItems.length,
      staticItems: processedData.staticItems.length,
      supplyByProduct: processedData.supplyByProduct.length,
    },
  };
};

/**
 * Helper function to validate processed data structure
 * Ensures all required chart type arrays are present
 *
 * @param processedData - The processed chart data object to validate
 * @returns True if structure is valid, false otherwise
 *
 * @example
 * ```typescript
 * if (validateProcessedData(processedData)) {
 *   // Safe to use all chart types
 * }
 * ```
 */
export const validateProcessedData = (
  processedData: ProcessedScmInventoryChartData
): boolean => {
  const requiredKeys: (keyof ProcessedScmInventoryChartData)[] = [
    "stockValueByWarehouse",
    "stockQuantityByCategory",
    "damagedExpiredLostTrend",
    "lowStockItems",
    "staticItems",
    "supplyByProduct",
  ];

  return requiredKeys.every((key) => Array.isArray(processedData[key]));
};

/**
 * Sort stock value by warehouse data by stock value (descending)
 */
export const sortByStockValue = (
  data: StockValueByWarehouseChart[]
): StockValueByWarehouseChart[] => {
  return [...data].sort((a, b) => b.stockValue - a.stockValue);
};

/**
 * Sort stock quantity by category data by quantity (descending)
 */
export const sortByQuantity = (
  data: StockQuantityByCategoryChart[]
): StockQuantityByCategoryChart[] => {
  return [...data].sort((a, b) => b.quantity - a.quantity);
};

/**
 * Sort damaged/expired/lost trend by month order
 */
export const sortByMonth = (
  data: DamagedExpiredLostTrendChart[]
): DamagedExpiredLostTrendChart[] => {
  return [...data].sort((a, b) => a.monthOrderBy - b.monthOrderBy);
};

/**
 * Sort static items by last move date (most recent first)
 */
export const sortByLastMove = (
  data: StaticItemsChart[]
): StaticItemsChart[] => {
  return [...data].sort(
    (a, b) => new Date(b.lastMove).getTime() - new Date(a.lastMove).getTime()
  );
};

/**
 * Filter static items by minimum days since last movement
 */
export const filterByDaysSinceMove = (
  data: StaticItemsChart[],
  minDays: number
): StaticItemsChart[] => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - minDays);

  return data.filter((item) => new Date(item.lastMove) <= cutoffDate);
};

/**
 * Get total stock value across all warehouses
 */
export const getTotalStockValue = (
  data: StockValueByWarehouseChart[]
): number => {
  return data.reduce((sum, item) => sum + item.stockValue, 0);
};

/**
 * Get total quantity across all categories
 */
export const getTotalQuantity = (
  data: StockQuantityByCategoryChart[]
): number => {
  return data.reduce((sum, item) => sum + item.quantity, 0);
};
