// ItemsCatalogueChartProcessor.ts
// Chart data processing logic and helper functions for Items Catalogue

import {
  type ItemsCatalogueChartsApiResponse as ChartsApiResponse,
  type ProcessedItemsCatalogueChartData as ProcessedChartsData,
  ChartTitles,
  type IDistributionByItemType,
  type IDistributionByCategory,
  type IItemsWithExpiryBatch,
  type INewItemsOverTime,
  type ITopBrandsByItemCount,
} from "./ItemsCatalogueChart.types";

/**
 * Configuration for logging during processing
 */
interface ProcessingConfig {
  enableLogging?: boolean;
  logPrefix?: string;
}

/**
 * Helper function to safely log messages
 */
const log = (message: string, data?: any, config?: ProcessingConfig) => {
  if (config?.enableLogging !== false) {
    const prefix = config?.logPrefix || "📊";
    console.log(`${prefix} ${message}`, data || "");
  }
};

/**
 * Helper function to check if an array contains valid chart data
 */
const isValidChartArray = (chartArray: any[]): boolean => {
  return (
    Array.isArray(chartArray) &&
    chartArray.length > 0 &&
    chartArray[0]?.chartTitle
  );
};

/**
 * Helper function to get the chart title from an array
 */
const getChartTitle = (chartArray: any[]): string | null => {
  if (!isValidChartArray(chartArray)) return null;
  return chartArray[0].chartTitle;
};

/**
 * Helper function to count non-empty chart arrays
 */
const getChartArrayStats = (rawData: ChartsApiResponse) => {
  const totalArrays = rawData.length;
  const nonEmptyArrays = rawData.filter((arr) => arr.length > 0).length;
  const validChartArrays = rawData.filter(isValidChartArray).length;

  return {
    totalArrays,
    emptyArrays: totalArrays - nonEmptyArrays,
    nonEmptyArrays,
    validChartArrays,
    invalidChartArrays: nonEmptyArrays - validChartArrays,
  };
};

/**
 * Main function to process raw charts data into organized structure
 * Uses title-based processing for flexibility and reliability
 */
export const processChartsDataByTitle = (
  rawData: ChartsApiResponse,
  config?: ProcessingConfig
): ProcessedChartsData => {
  log(
    "🔄 Starting to process items catalogue charts data...",
    undefined,
    config
  );

  // Log initial statistics
  const stats = getChartArrayStats(rawData);
  log("📊 Data statistics:", stats, config);

  // Initialize the result object with empty arrays
  const result: ProcessedChartsData = {
    distributionByItemType: [],
    distributionByCategory: [],
    itemsWithExpiryBatch: [],
    newItemsOverTime: [],
    topBrandsByItemCount: [],
  };

  // Process each array in the raw data
  rawData.forEach((chartArray, index) => {
    log(
      `Processing array at index ${index}:`,
      `${chartArray.length} items`,
      config
    );

    // Skip empty arrays
    if (chartArray.length === 0) {
      log(`⏭️  Skipping empty array at index ${index}`, undefined, config);
      return;
    }

    // Get chart title
    const chartTitle = getChartTitle(chartArray);
    if (!chartTitle) {
      log(
        `⚠️  Array at index ${index} has no valid chartTitle:`,
        chartArray[0],
        config
      );
      return;
    }

    log(`🏷️  Found chart type: "${chartTitle}"`, undefined, config);

    // Assign data based on chart title
    switch (chartTitle) {
      case ChartTitles.DISTRIBUTION_BY_ITEM_TYPE:
        log(
          `✅ Assigning ${chartArray.length} items to distributionByItemType`,
          undefined,
          config
        );
        result.distributionByItemType = chartArray as IDistributionByItemType[];
        break;

      case ChartTitles.DISTRIBUTION_BY_CATEGORY:
        log(
          `✅ Assigning ${chartArray.length} items to distributionByCategory`,
          undefined,
          config
        );
        result.distributionByCategory = chartArray as IDistributionByCategory[];
        break;

      case ChartTitles.ITEMS_WITH_EXPIRY_BATCH:
        log(
          `✅ Assigning ${chartArray.length} items to itemsWithExpiryBatch`,
          undefined,
          config
        );
        result.itemsWithExpiryBatch = chartArray as IItemsWithExpiryBatch[];
        break;

      case ChartTitles.NEW_ITEMS_OVER_TIME:
        log(
          `✅ Assigning ${chartArray.length} items to newItemsOverTime`,
          undefined,
          config
        );
        result.newItemsOverTime = chartArray as INewItemsOverTime[];
        break;

      case ChartTitles.TOP_BRANDS_BY_ITEM_COUNT:
        log(
          `✅ Assigning ${chartArray.length} items to topBrandsByItemCount`,
          undefined,
          config
        );
        result.topBrandsByItemCount = chartArray as ITopBrandsByItemCount[];
        break;

      default:
        log(`❓ Unknown chart type: "${chartTitle}"`, undefined, config);
        break;
    }
  });

  // Log final results
  const resultSummary = {
    distributionByItemType: result.distributionByItemType.length,
    distributionByCategory: result.distributionByCategory.length,
    itemsWithExpiryBatch: result.itemsWithExpiryBatch.length,
    newItemsOverTime: result.newItemsOverTime.length,
    topBrandsByItemCount: result.topBrandsByItemCount.length,
  };

  log(
    "🎉 Finished processing items catalogue charts data:",
    resultSummary,
    config
  );
  return result;
};

/**
 * Helper function to get a specific chart type from processed data
 */
export const getChartData = <T extends keyof ProcessedChartsData>(
  processedData: ProcessedChartsData | null,
  chartType: T
): ProcessedChartsData[T] => {
  return processedData?.[chartType] || ([] as ProcessedChartsData[T]);
};

/**
 * Helper function to check if a specific chart type has data
 */
export const hasChartData = (
  processedData: ProcessedChartsData | null,
  chartType: keyof ProcessedChartsData
): boolean => {
  return (processedData?.[chartType]?.length || 0) > 0;
};

/**
 * Helper function to get summary statistics of processed data
 */
export const getProcessedDataSummary = (
  processedData: ProcessedChartsData | null
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
      distributionByItemType: processedData.distributionByItemType.length,
      distributionByCategory: processedData.distributionByCategory.length,
      itemsWithExpiryBatch: processedData.itemsWithExpiryBatch.length,
      newItemsOverTime: processedData.newItemsOverTime.length,
      topBrandsByItemCount: processedData.topBrandsByItemCount.length,
    },
  };
};

/**
 * Helper function to validate processed data structure
 */
export const validateProcessedData = (
  processedData: ProcessedChartsData
): boolean => {
  const requiredKeys: (keyof ProcessedChartsData)[] = [
    "distributionByItemType",
    "distributionByCategory",
    "itemsWithExpiryBatch",
    "newItemsOverTime",
    "topBrandsByItemCount",
  ];

  return requiredKeys.every((key) => Array.isArray(processedData[key]));
};
