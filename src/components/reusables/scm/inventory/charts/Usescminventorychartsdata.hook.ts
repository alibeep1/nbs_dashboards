// useScmInventoryChartsData.hook.ts
// React hook for fetching and processing SCM Inventory charts data

import { useState, useEffect } from "react";
// import { processChartsDataByTitle } from "./ScmInventoryChartProcessor";
import {
  type ScmInventoryChartsApiResponse as ChartsApiResponse,
  type ProcessedScmInventoryChartData as ProcessedChartsData,
} from "./ScmInventoryChart.types";
import { createApiClient } from "@/lib/api";
import { processChartsDataByTitle } from "./Scminventorychartprocessor";
// import { createApiClient } from "../api/client"; // Adjust import path as needed

/**
 * Configuration options for the SCM Inventory charts data hook
 */
interface UseScmInventoryChartsDataOptions {
  endpoint?: string;
  enableLogging?: boolean;
  autoFetch?: boolean;
  refetchOnTokenChange?: boolean;
  queryParams?: URLSearchParams;
}

/**
 * Return type for the useScmInventoryChartsData hook
 */
interface UseScmInventoryChartsDataReturn {
  chartsData: ProcessedChartsData | null;
  rawData: ChartsApiResponse | null;
  loading: boolean;
  error: string | null;
  refetch: (queryParams?: URLSearchParams) => void;
  reset: () => void;
}

/**
 * Custom React hook for fetching and processing SCM Inventory charts data
 *
 * @param token - Authentication token
 * @param options - Configuration options
 * @returns Object containing charts data, loading state, error state, and control functions
 *
 * @example
 * ```tsx
 * const { chartsData, loading, error, refetch, reset } = useScmInventoryChartsData(token, {
 *   enableLogging: true,
 *   autoFetch: true,
 *   refetchOnTokenChange: true
 * });
 *
 * // Access specific chart data
 * const warehouseData = chartsData?.stockValueByWarehouse;
 * const lowStockData = chartsData?.lowStockItems;
 *
 * // Manually refetch with query params
 * const handleRefetch = () => {
 *   const params = new URLSearchParams({ dateFrom: '2025-01-01' });
 *   refetch(params);
 * };
 * ```
 */
export const useScmInventoryChartsData = (
  token: string,
  options: UseScmInventoryChartsDataOptions = {}
): UseScmInventoryChartsDataReturn => {
  const {
    endpoint = "/scm/InventoryAnalytics/chart",
    enableLogging = true,
    autoFetch = true,
    refetchOnTokenChange = true,
  } = options;

  // State management
  const [chartsData, setChartsData] = useState<ProcessedChartsData | null>(
    null
  );
  const [rawData, setRawData] = useState<ChartsApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(autoFetch);
  const [error, setError] = useState<string | null>(null);

  /**
   * Function to fetch data from API
   */
  const fetchData = async (queryParams?: URLSearchParams) => {
    if (!token) {
      if (enableLogging) {
        console.log("🚫 No token available, skipping API call");
      }
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (enableLogging) {
        console.log("🚀 Making API call to fetch SCM Inventory charts data...");
      }

      const api = createApiClient(token);
      // Append query params if provided
      const url = queryParams
        ? `${endpoint}?${queryParams.toString()}`
        : endpoint;

      const response = await api.get<ChartsApiResponse>(url);

      if (enableLogging) {
        console.log(
          "✅ API call successful, raw data received:",
          response.data
        );
      }

      // Store raw data
      setRawData(response.data);

      // Process the data
      const processed = processChartsDataByTitle(response.data, {
        enableLogging,
        logPrefix: "📊 [useScmInventoryChartsData]",
      });

      setChartsData(processed);

      if (enableLogging) {
        console.log("✅ Data processing complete:", processed);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to fetch SCM Inventory charts data";
      setError(errorMessage);

      if (enableLogging) {
        console.error("❌ Error fetching SCM Inventory charts data:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Manual refetch function
   * Allows users to trigger a new API call with optional query parameters
   */
  const refetch = (queryParams?: URLSearchParams) => {
    if (enableLogging) {
      console.log("🔄 Manual refetch triggered");
    }
    fetchData(queryParams);
  };

  /**
   * Reset function
   * Clears all state back to initial values
   */
  const reset = () => {
    if (enableLogging) {
      console.log("🔄 Resetting SCM Inventory charts data state");
    }
    setChartsData(null);
    setRawData(null);
    setError(null);
    setLoading(false);
  };

  /**
   * Effect: Auto-fetch on mount if enabled
   */
  useEffect(() => {
    if (autoFetch && token) {
      if (enableLogging) {
        console.log("🔄 Auto-fetching SCM Inventory charts data on mount");
      }
      fetchData(options.queryParams);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  /**
   * Effect: Refetch when token changes if enabled
   */
  useEffect(() => {
    if (refetchOnTokenChange && token) {
      if (enableLogging) {
        console.log("🔄 Token changed, refetching SCM Inventory charts data");
      }
      fetchData(options.queryParams);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, refetchOnTokenChange]);

  return {
    chartsData,
    rawData,
    loading,
    error,
    refetch,
    reset,
  };
};

/**
 * Hook variant that only processes data without fetching
 * Useful when you already have raw data from another source
 *
 * @param rawData - Raw API response data
 * @param enableLogging - Whether to log processing steps
 * @returns Processed chart data or null
 *
 * @example
 * ```tsx
 * const processedData = useProcessScmInventoryChartsData(rawApiData, true);
 * ```
 */
export const useProcessScmInventoryChartsData = (
  rawData: ChartsApiResponse | null,
  enableLogging: boolean = false
): ProcessedChartsData | null => {
  const [processedData, setProcessedData] =
    useState<ProcessedChartsData | null>(null);

  useEffect(() => {
    if (rawData) {
      const processed = processChartsDataByTitle(rawData, {
        enableLogging,
        logPrefix: "📊 [useProcessScmInventoryChartsData]",
      });
      setProcessedData(processed);
    } else {
      setProcessedData(null);
    }
  }, [rawData, enableLogging]);

  return processedData;
};
