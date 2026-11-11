// useScmOrderManagementChartsData.hook.ts
// React hook for fetching and processing SCM Order Management charts data

import { useState, useEffect } from "react";
import { processChartsData } from "./ScmOrderManagementChartProcessor";
import {
  type ScmOrderManagementChartsApiResponse as ChartsApiResponse,
  type ProcessedScmOrderManagementChartData as ProcessedChartsData,
} from "./ScmOrderManagementChart.types";
import { createApiClient } from "@/lib/api";
// import { createApiClient } from "../api/client"; // Adjust import path as needed

/**
 * Configuration options for the SCM Order Management charts data hook
 */
interface UseScmOrderManagementChartsDataOptions {
  endpoint?: string;
  enableLogging?: boolean;
  autoFetch?: boolean;
  refetchOnTokenChange?: boolean;
  queryParams?: URLSearchParams;
}

/**
 * Return type for the useScmOrderManagementChartsData hook
 */
interface UseScmOrderManagementChartsDataReturn {
  chartsData: ProcessedChartsData | null;
  rawData: ChartsApiResponse | null;
  loading: boolean;
  error: string | null;
  refetch: (queryParams?: URLSearchParams) => void;
  reset: () => void;
}

/**
 * Custom React hook for fetching and processing SCM Order Management charts data
 *
 * @param token - Authentication token for API requests
 * @param options - Configuration options for the hook
 * @returns Object containing charts data, loading state, error, and control functions
 *
 * @example
 * ```tsx
 * const {
 *   chartsData,
 *   rawData,
 *   loading,
 *   error,
 *   refetch,
 *   reset,
 * } = useScmOrderManagementChartsData(token, {
 *   enableLogging: true,
 *   autoFetch: true,
 *   refetchOnTokenChange: true,
 * });
 *
 * // Access specific chart data
 * const approvalStatus = chartsData?.IRStatusDistributionApproval;
 * const fulfillmentStatus = chartsData?.IRStatusDistributionFulfillment;
 * const mostRequested = chartsData?.MostRequestedItems;
 * const grnByBranch = chartsData?.GRNCountByBranch;
 * ```
 */
export const useScmOrderManagementChartsData = (
  token: string | null,
  options: UseScmOrderManagementChartsDataOptions = {}
): UseScmOrderManagementChartsDataReturn => {
  const {
    endpoint = "/scm/OrderManagementAnalytics/v2/charts",
    enableLogging = false,
    autoFetch = true,
    refetchOnTokenChange = false,
  } = options;

  // State management
  const [chartsData, setChartsData] = useState<ProcessedChartsData | null>(
    null
  );
  const [rawData, setRawData] = useState<ChartsApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Internal fetch function
   * Handles API call, data processing, and state updates
   */
  const fetchData = async (queryParams?: URLSearchParams) => {
    if (!token) {
      if (enableLogging) {
        console.warn("⚠️ No token provided, skipping fetch");
      }
      return;
    }

    setLoading(true);
    setError(null);

    if (enableLogging) {
      console.log("🚀 Fetching SCM Order Management charts data...");
      console.log("📍 Endpoint:", endpoint);
      if (queryParams) {
        console.log("🔍 Query params:", queryParams.toString());
      }
    }

    try {
      const client = createApiClient(token);
      const url = queryParams
        ? `${endpoint}?${queryParams.toString()}`
        : endpoint;

      const response = await client.get<ChartsApiResponse>(url);
      const responseData = response.data;

      if (enableLogging) {
        console.log("✅ Raw API response received:", response);
      }

      // Store raw data
      setRawData(responseData);

      // Process the data (pass-through in this case, but kept for consistency)
      const processed = processChartsData(responseData);

      if (enableLogging) {
        console.log("✅ Processed charts data:", processed);
        console.log("📊 Chart summary:", {
          IRStatusDistributionApproval:
            processed?.IRStatusDistributionApproval?.length ?? 0,
          IRStatusDistributionFulfillment:
            processed?.IRStatusDistributionFulfillment?.length ?? 0,
          MostRequestedItems: processed?.MostRequestedItems?.length ?? 0,
          GRNCountByBranch: processed?.GRNCountByBranch?.length ?? 0,
        });
      }

      setChartsData(processed);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to fetch SCM Order Management charts data";
      setError(errorMessage);

      if (enableLogging) {
        console.error(
          "❌ Error fetching SCM Order Management charts data:",
          err
        );
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
      console.log("🔄 Resetting SCM Order Management charts data state");
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
        console.log(
          "🔄 Auto-fetching SCM Order Management charts data on mount"
        );
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
        console.log(
          "🔄 Token changed, refetching SCM Order Management charts data"
        );
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
 * const processedData = useProcessScmOrderManagementChartsData(rawApiData, true);
 * ```
 */
export const useProcessScmOrderManagementChartsData = (
  rawData: ChartsApiResponse | null,
  enableLogging: boolean = false
): ProcessedChartsData | null => {
  const [processedData, setProcessedData] =
    useState<ProcessedChartsData | null>(null);

  useEffect(() => {
    if (rawData) {
      if (enableLogging) {
        console.log(
          "📊 [useProcessScmOrderManagementChartsData] Processing data..."
        );
      }
      const processed = processChartsData(rawData);
      setProcessedData(processed);
    } else {
      setProcessedData(null);
    }
  }, [rawData, enableLogging]);

  return processedData;
};
