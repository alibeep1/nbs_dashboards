// charts.processor.ts
// Chart data processing logic and helper functions

import {
  type SalesChartsApiResponse as ChartsApiResponse,
  type ProcessedSalesChartsData as ProcessedChartsData,
  SalesChartTitles as ChartTitles,
  type BranchSalesTrend,
  type TopSellingItems,
  type TotalRefundValueTrend,
  type SalesByCategory,
  type HourlySalesHeatmap,
  type TopReturnedItems,
  type TopBrands,
  type SalesByBranch,
  type PromotionLinkedSales,
  type ManualDiscountsOvertime,
  type MarketingCampaignSalesVolume,
  type SalesByCustomerType,
} from "./SalesChart.types";

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
  log("🔄 Starting to process charts data...", undefined, config);

  // Log initial statistics
  const stats = getChartArrayStats(rawData);
  log("📊 Data statistics:", stats, config);

  // Initialize the result object with empty arrays
  const result: ProcessedChartsData = {
    branchSalesTrend: [],
    topSellingItems: [],
    totalRefundValueTrend: [],
    salesByCategory: [],
    hourlySalesHeatmap: [],
    topReturnedItems: [],
    topBrands: [],
    salesByBranch: [],
    promotionLinkedSales: [],
    manualDiscountsOvertime: [],
    marketingCampaignSalesVolume: [],
    salesByCustomerType: [],
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
      case ChartTitles.BRANCH_SALES_TREND:
        log(
          `✅ Assigning ${chartArray.length} items to branchSalesTrend`,
          undefined,
          config
        );
        result.branchSalesTrend = chartArray as BranchSalesTrend[];
        break;

      case ChartTitles.TOP_SELLING_ITEMS:
        log(
          `✅ Assigning ${chartArray.length} items to topSellingItems`,
          undefined,
          config
        );
        result.topSellingItems = chartArray as TopSellingItems[];
        break;

      case ChartTitles.TOTAL_REFUND_VALUE_TREND:
        log(
          `✅ Assigning ${chartArray.length} items to totalRefundValueTrend`,
          undefined,
          config
        );
        result.totalRefundValueTrend = chartArray as TotalRefundValueTrend[];
        break;

      case ChartTitles.SALES_BY_CATEGORY:
        log(
          `✅ Assigning ${chartArray.length} items to salesByCategory`,
          undefined,
          config
        );
        result.salesByCategory = chartArray as SalesByCategory[];
        break;

      case ChartTitles.HOURLY_SALES_HEATMAP:
        log(
          `✅ Assigning ${chartArray.length} items to hourlySalesHeatmap`,
          undefined,
          config
        );
        result.hourlySalesHeatmap = chartArray as HourlySalesHeatmap[];
        break;

      case ChartTitles.TOP_RETURNED_ITEMS:
        log(
          `✅ Assigning ${chartArray.length} items to topReturnedItems`,
          undefined,
          config
        );
        result.topReturnedItems = chartArray as TopReturnedItems[];
        break;

      case ChartTitles.TOP_BRANDS:
        log(
          `✅ Assigning ${chartArray.length} items to topBrands`,
          undefined,
          config
        );
        result.topBrands = chartArray as TopBrands[];
        break;

      case ChartTitles.SALES_BY_BRANCH:
        log(
          `✅ Assigning ${chartArray.length} items to salesByBranch`,
          undefined,
          config
        );
        result.salesByBranch = chartArray as SalesByBranch[];
        break;

      case ChartTitles.PROMOTION_LINKED_SALES:
        log(
          `✅ Assigning ${chartArray.length} items to promotionLinkedSales`,
          undefined,
          config
        );
        result.promotionLinkedSales = chartArray as PromotionLinkedSales[];
        break;
      case ChartTitles.MANUAL_DISCOUNTS_OVERTIME:
        log(
          `✅ Assigning ${chartArray.length} items to manualDiscountsOvertime`,
          undefined,
          config
        );
        result.manualDiscountsOvertime =
          chartArray as ManualDiscountsOvertime[];
        break;

      case ChartTitles.MARKETING_CAMPAIGN_SALES_VOLUME:
        log(
          `✅ Assigning ${chartArray.length} items to marketingCampaignSalesVolume`,
          undefined,
          config
        );
        result.marketingCampaignSalesVolume =
          chartArray as MarketingCampaignSalesVolume[];
        break;

      case ChartTitles.SALES_BY_CUSTOMER_TYPE:
        log(
          `✅ Assigning ${chartArray.length} items to salesByCustomerType`,
          undefined,
          config
        );

        result.salesByCustomerType = chartArray as SalesByCustomerType[];
        break;

      default:
        log(`❓ Unknown chart type: "${chartTitle}"`, undefined, config);
        break;
    }
  });

  // Log final results
  const resultSummary = {
    branchSalesTrend: result.branchSalesTrend.length,
    topSellingItems: result.topSellingItems.length,
    totalRefundValueTrend: result.totalRefundValueTrend.length,
    salesByCategory: result.salesByCategory.length,
    hourlySalesHeatmap: result.hourlySalesHeatmap.length,
    topReturnedItems: result.topReturnedItems.length,
    topBrands: result.topBrands.length,
    salesByBranch: result.salesByBranch.length,
    promotionLinkedSales: result.promotionLinkedSales.length,
    manualDiscountsOvertime: result.manualDiscountsOvertime.length,
    marketingCampaignSalesVolume: result.marketingCampaignSalesVolume.length,
    salesByCustomerType: result.salesByCustomerType.length,
  };

  log("🎉 Finished processing charts data:", resultSummary, config);
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
      branchSalesTrend: processedData.branchSalesTrend.length,
      topSellingItems: processedData.topSellingItems.length,
      totalRefundValueTrend: processedData.totalRefundValueTrend.length,
      salesByCategory: processedData.salesByCategory.length,
      hourlySalesHeatmap: processedData.hourlySalesHeatmap.length,
      topReturnedItems: processedData.topReturnedItems.length,
      topBrands: processedData.topBrands.length,
      salesByBranch: processedData.salesByBranch.length,
      promotionLinkedSales: processedData.promotionLinkedSales.length,
      manualDiscountsOvertime: processedData.manualDiscountsOvertime.length,
      marketingCampaignSalesVolume:
        processedData.marketingCampaignSalesVolume.length,
      salesByCustomerType: processedData.salesByCustomerType.length,
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
    "branchSalesTrend",
    "topSellingItems",
    "totalRefundValueTrend",
    "salesByCategory",
    "hourlySalesHeatmap",
    "topReturnedItems",
    "topBrands",
    "salesByBranch",
    "promotionLinkedSales",
    "manualDiscountsOvertime",
    "marketingCampaignSalesVolume",
    "salesByCustomerType",
  ];

  return requiredKeys.every((key) => Array.isArray(processedData[key]));
};
