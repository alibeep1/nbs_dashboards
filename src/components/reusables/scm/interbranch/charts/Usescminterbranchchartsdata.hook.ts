// useScmInterbranchChartsData.hook.ts
// React hook for fetching and processing SCM Interbranch charts data

import { useState, useEffect } from "react";
// import { processChartsData } from "./ScmInterbranchChartProcessor";
import {
  type ScmInterbranchChartsApiResponse as ChartsApiResponse,
  type ProcessedScmInterbranchChartData as ProcessedChartsData,
} from "./ScmInterbranchChart.types";
import { createApiClient } from "@/lib/api";
import { processChartsData } from "./ScmInterbranchChartProcessor";
// import { createApiClient } from "../api/client"; // Adjust import path as needed

/**
 * Configuration options for the SCM Interbranch charts data hook
 */
interface UseScmInterbranchChartsDataOptions {
  endpoint?: string;
  enableLogging?: boolean;
  autoFetch?: boolean;
  refetchOnTokenChange?: boolean;
  queryParams?: URLSearchParams;
}

/**
 * Return type for the useScmInterbranchChartsData hook
 */
interface UseScmInterbranchChartsDataReturn {
  chartsData: ProcessedChartsData | null;
  rawData: ChartsApiResponse | null;
  loading: boolean;
  error: string | null;
  refetch: (queryParams?: URLSearchParams) => void;
  reset: () => void;
}

/**
 * Custom React hook for fetching and processing SCM Interbranch charts data
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
 * } = useScmInterbranchChartsData(token, {
 *   enableLogging: true,
 *   autoFetch: true,
 *   refetchOnTokenChange: true,
 * });
 *
 * // Access specific chart data
 * const transferVolume = chartsData?.TransferVolumeByRoute;
 * const pendingTransfers = chartsData?.PendingTransfersByDestination;
 * const fulfillmentTrend = chartsData?.TransferFulfillmentTrend;
 * ```
 */
export const useScmInterbranchChartsData = (
  token: string | null,
  options: UseScmInterbranchChartsDataOptions = {}
): UseScmInterbranchChartsDataReturn => {
  const {
    endpoint = "/scm/InterbranchAnalytics/v2/chart",
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
      console.log("🚀 Fetching SCM Interbranch charts data...");
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

      if (enableLogging) {
        console.log("✅ Raw API response received:", response);
      }

      // Store raw data
      setRawData(response.data);

      // Process the data (pass-through in this case, but kept for consistency)
      const processed = processChartsData(response.data);

      if (enableLogging) {
        console.log("✅ Processed charts data:", processed);
        console.log("📊 Chart summary:", {
          TransferVolumeByRoute: processed.TransferVolumeByRoute?.length ?? 0,
          PendingTransfersByDestination:
            processed.PendingTransfersByDestination?.length ?? 0,
          TransferFulfillmentTrend:
            processed.TransferFulfillmentTrend?.length ?? 0,
        });
      }

      setChartsData(processed);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to fetch SCM Interbranch charts data";
      setError(errorMessage);

      if (enableLogging) {
        console.error("❌ Error fetching SCM Interbranch charts data:", err);
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
      console.log("🔄 Resetting SCM Interbranch charts data state");
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
        console.log("🔄 Auto-fetching SCM Interbranch charts data on mount");
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
        console.log("🔄 Token changed, refetching SCM Interbranch charts data");
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
 * const processedData = useProcessScmInterbranchChartsData(rawApiData, true);
 * ```
 */
export const useProcessScmInterbranchChartsData = (
  rawData: ChartsApiResponse | null,
  enableLogging: boolean = false
): ProcessedChartsData | null => {
  const [processedData, setProcessedData] =
    useState<ProcessedChartsData | null>(null);

  useEffect(() => {
    if (rawData) {
      if (enableLogging) {
        console.log(
          "📊 [useProcessScmInterbranchChartsData] Processing data..."
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
