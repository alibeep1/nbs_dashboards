// useItemsCatalogueChartsData.hook.ts
// React hook for fetching and processing items catalogue charts data

import { useState, useEffect } from "react";
import { processChartsDataByTitle } from "./ItemsCatalogueChartProcessor";
import {
  type ItemsCatalogueChartsApiResponse as ChartsApiResponse,
  type ProcessedItemsCatalogueChartData as ProcessedChartsData,
} from "./ItemsCatalogueChart.types";
import { createApiClient } from "@/lib/api";
// import { createApiClient } from "../api/client"; // Adjust import path as needed

/**
 * Configuration options for the items catalogue charts data hook
 */
interface UseItemsCatalogueChartsDataOptions {
  endpoint?: string;
  enableLogging?: boolean;
  autoFetch?: boolean;
  refetchOnTokenChange?: boolean;
  queryParams?: URLSearchParams;
}

/**
 * Return type for the useItemsCatalogueChartsData hook
 */
interface UseItemsCatalogueChartsDataReturn {
  chartsData: ProcessedChartsData | null;
  rawData: ChartsApiResponse | null;
  loading: boolean;
  error: string | null;
  refetch: (arg: URLSearchParams) => void;
  reset: () => void;
}

/**
 * Custom React hook for fetching and processing items catalogue charts data
 *
 * @param token - Authentication token
 * @param options - Configuration options
 * @returns Object containing charts data, loading state, error state, and control functions
 *
 * @example
 * ```tsx
 * const { chartsData, loading, error, refetch } = useItemsCatalogueChartsData(token, {
 *   enableLogging: true,
 *   autoFetch: true
 * });
 * ```
 */
export const useItemsCatalogueChartsData = (
  token: string,
  options: UseItemsCatalogueChartsDataOptions = {}
): UseItemsCatalogueChartsDataReturn => {
  const {
    endpoint = "/ItemsCatalogueAnalytics/chart",
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
  const fetchData = async () => {
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
        console.log(
          "🚀 Making API call to fetch items catalogue charts data..."
        );
      }

      const api = createApiClient(token);
      // Append query params if provided
      const url = options.queryParams
        ? `${endpoint}?${options.queryParams.toString()}`
        : endpoint;
      const response = await api.get<ChartsApiResponse>(url);

      if (enableLogging) {
        console.log("📥 Raw API response received:", response.data);
      }

      // Store raw data
      setRawData(response.data);

      // Process the data using our title-based processor
      const processedData = processChartsDataByTitle(response.data, {
        enableLogging,
        logPrefix: "📊 [useItemsCatalogueChartsData]",
      });

      if (enableLogging) {
        console.log("✨ Data processing complete, updating state");
      }

      setChartsData(processedData);
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Unknown error occurred";

      if (enableLogging) {
        console.error("❌ Error fetching items catalogue charts data:", err);
      }

      setError(errorMessage);
      setChartsData(null);
      setRawData(null);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Function to manually refetch data
   */
  const refetch = (arg: URLSearchParams) => {
    if (enableLogging) {
      console.log("🔄 Manual refetch triggered");
    }
    options.queryParams = arg;
    fetchData();
  };

  /**
   * Function to reset all state
   */
  const reset = () => {
    if (enableLogging) {
      console.log("🧹 Resetting items catalogue charts data state");
    }
    setChartsData(null);
    setRawData(null);
    setError(null);
    setLoading(false);
  };

  // Effect to fetch data when token changes or component mounts
  useEffect(() => {
    if (autoFetch && (refetchOnTokenChange || !chartsData)) {
      fetchData();
    }
  }, [token]); // Only depend on token

  // Effect to fetch data on initial mount if autoFetch is enabled
  useEffect(() => {
    if (autoFetch && !chartsData && token) {
      fetchData();
    }
  }, []); // Empty dependency array for initial mount

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
 */
export const useProcessItemsCatalogueChartsData = (
  rawData: ChartsApiResponse | null,
  enableLogging: boolean = false
): ProcessedChartsData | null => {
  const [processedData, setProcessedData] =
    useState<ProcessedChartsData | null>(null);

  useEffect(() => {
    if (rawData) {
      const processed = processChartsDataByTitle(rawData, {
        enableLogging,
        logPrefix: "📊 [useProcessItemsCatalogueChartsData]",
      });
      setProcessedData(processed);
    } else {
      setProcessedData(null);
    }
  }, [rawData, enableLogging]);

  return processedData;
};
