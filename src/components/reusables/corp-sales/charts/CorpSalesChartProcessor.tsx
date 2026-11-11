// CorpSalesChartProcessor.ts
// Chart data processing logic and helper functions for Corporate Sales

import {
  type CorpSalesChartsApiResponse as ChartsApiResponse,
  type ProcessedCorpSalesChartData as ProcessedChartsData,
  ChartTitles,
  type IInvoicesIssuedOverTime,
  type ITopCustomersBySalesVolume,
  type IPaymentStatusSplit,
  type IPaymentMethodDistribution,
  type ICorporateCustomersContribution,
  type IReturnInvoicesOverTime,
  type IAveragePaymentDelayByCustomerDays,
  type ISeasonalPaymentPatterns,
  type IInvoiceSizeDistribution,
} from "./CorpSalesChart.types.tsx";

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
  log("🔄 Starting to process corp sales charts data...", undefined, config);

  // Log initial statistics
  const stats = getChartArrayStats(rawData);
  log("📊 Data statistics:", stats, config);

  // Initialize the result object with empty arrays
  const result: ProcessedChartsData = {
    invoicesIssuedOverTime: [],
    topCustomersBySalesVolume: [],
    paymentStatusSplit: [],
    paymentMethodDistribution: [],
    corporateCustomersContribution: [],
    returnInvoicesOverTime: [],
    averagePaymentDelayByCustomerDays: [],
    seasonalPaymentPatterns: [],
    invoiceSizeDistribution: [],
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
      case ChartTitles.INVOICES_ISSUED_OVER_TIME:
        log(
          `✅ Assigning ${chartArray.length} items to invoicesIssuedOverTime`,
          undefined,
          config
        );
        result.invoicesIssuedOverTime = chartArray as IInvoicesIssuedOverTime[];
        break;

      case ChartTitles.TOP_CUSTOMERS_BY_SALES_VOLUME:
        log(
          `✅ Assigning ${chartArray.length} items to topCustomersBySalesVolume`,
          undefined,
          config
        );
        result.topCustomersBySalesVolume =
          chartArray as ITopCustomersBySalesVolume[];
        break;

      case ChartTitles.PAYMENT_STATUS_SPLIT:
        log(
          `✅ Assigning ${chartArray.length} items to paymentStatusSplit`,
          undefined,
          config
        );
        result.paymentStatusSplit = chartArray as IPaymentStatusSplit[];
        break;

      case ChartTitles.PAYMENT_METHOD_DISTRIBUTION:
        log(
          `✅ Assigning ${chartArray.length} items to paymentMethodDistribution`,
          undefined,
          config
        );
        result.paymentMethodDistribution =
          chartArray as IPaymentMethodDistribution[];
        break;

      case ChartTitles.CORPORATE_CUSTOMERS_CONTRIBUTION:
        log(
          `✅ Assigning ${chartArray.length} items to corporateCustomersContribution`,
          undefined,
          config
        );
        result.corporateCustomersContribution =
          chartArray as ICorporateCustomersContribution[];
        break;

      case ChartTitles.RETURN_INVOICES_OVER_TIME:
        log(
          `✅ Assigning ${chartArray.length} items to returnInvoicesOverTime`,
          undefined,
          config
        );
        result.returnInvoicesOverTime = chartArray as IReturnInvoicesOverTime[];
        break;

      case ChartTitles.AVERAGE_PAYMENT_DELAY_BY_CUSTOMER:
        log(
          `✅ Assigning ${chartArray.length} items to averagePaymentDelayByCustomerDays`,
          undefined,
          config
        );
        result.averagePaymentDelayByCustomerDays =
          chartArray as IAveragePaymentDelayByCustomerDays[];
        break;

      case ChartTitles.SEASONAL_PAYMENT_PATTERNS:
        log(
          `✅ Assigning ${chartArray.length} items to seasonalPaymentPatterns`,
          undefined,
          config
        );
        result.seasonalPaymentPatterns =
          chartArray as ISeasonalPaymentPatterns[];
        break;

      case ChartTitles.INVOICE_SIZE_DISTRIBUTION:
        log(
          `✅ Assigning ${chartArray.length} items to invoiceSizeDistribution`,
          undefined,
          config
        );
        result.invoiceSizeDistribution =
          chartArray as IInvoiceSizeDistribution[];
        break;

      default:
        log(`❓ Unknown chart type: "${chartTitle}"`, undefined, config);
        break;
    }
  });

  // Log final results
  const resultSummary = {
    invoicesIssuedOverTime: result.invoicesIssuedOverTime.length,
    topCustomersBySalesVolume: result.topCustomersBySalesVolume.length,
    paymentStatusSplit: result.paymentStatusSplit.length,
    paymentMethodDistribution: result.paymentMethodDistribution.length,
    corporateCustomersContribution:
      result.corporateCustomersContribution.length,
    returnInvoicesOverTime: result.returnInvoicesOverTime.length,
    averagePaymentDelayByCustomerDays:
      result.averagePaymentDelayByCustomerDays.length,
    seasonalPaymentPatterns: result.seasonalPaymentPatterns.length,
    invoiceSizeDistribution: result.invoiceSizeDistribution.length,
  };

  log("🎉 Finished processing corp sales charts data:", resultSummary, config);
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
      invoicesIssuedOverTime: processedData.invoicesIssuedOverTime.length,
      topCustomersBySalesVolume: processedData.topCustomersBySalesVolume.length,
      paymentStatusSplit: processedData.paymentStatusSplit.length,
      paymentMethodDistribution: processedData.paymentMethodDistribution.length,
      corporateCustomersContribution:
        processedData.corporateCustomersContribution.length,
      returnInvoicesOverTime: processedData.returnInvoicesOverTime.length,
      averagePaymentDelayByCustomerDays:
        processedData.averagePaymentDelayByCustomerDays.length,
      seasonalPaymentPatterns: processedData.seasonalPaymentPatterns.length,
      invoiceSizeDistribution: processedData.invoiceSizeDistribution.length,
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
    "invoicesIssuedOverTime",
    "topCustomersBySalesVolume",
    "paymentStatusSplit",
    "paymentMethodDistribution",
    "corporateCustomersContribution",
    "returnInvoicesOverTime",
    "averagePaymentDelayByCustomerDays",
    "seasonalPaymentPatterns",
    "invoiceSizeDistribution",
  ];

  return requiredKeys.every((key) => Array.isArray(processedData[key]));
};
