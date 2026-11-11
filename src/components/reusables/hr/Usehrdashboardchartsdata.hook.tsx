// useHrDashboardChartsData.hook.ts
// React hook for fetching and processing HR Dashboard charts data

import { useState, useEffect } from "react";
import { processChartsData } from "./Hrdashboardchartprocessor";
import {
  type HrDashboardChartsApiResponse as ChartsApiResponse,
  type ProcessedHrDashboardChartData as ProcessedChartsData,
} from "./Hrdashboardchart.types";
import { createApiClient } from "@/lib/api";
// import type { ChartsApiResponse } from "@/lib/response/IChartsResponse";
// import { processChartsData } from "./Hrdashboardchartprocessor";
// import { createApiClient } from "../api/client"; // Adjust import path as needed

/**
 * Configuration options for the HR Dashboard charts data hook
 */
interface UseHrDashboardChartsDataOptions {
  endpoint?: string;
  enableLogging?: boolean;
  autoFetch?: boolean;
  refetchOnTokenChange?: boolean;
  queryParams?: URLSearchParams;
}

/**
 * Return type for the useHrDashboardChartsData hook
 */
interface UseHrDashboardChartsDataReturn {
  chartsData: ProcessedChartsData | null;
  rawData: ChartsApiResponse | null;
  loading: boolean;
  error: string | null;
  refetch: (queryParams?: URLSearchParams) => void;
  reset: () => void;
}

/**
 * Custom React hook for fetching and processing HR Dashboard charts data
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
 * } = useHrDashboardChartsData(token, {
 *   enableLogging: true,
 *   autoFetch: true,
 *   refetchOnTokenChange: true,
 * });
 *
 * // Access specific chart data
 * const headcount = chartsData?.HeadcountByBranchDepartment;
 * const hiringTrend = chartsData?.HiringAttritionTrend;
 * const leaveTypes = chartsData?.TopLeaveTypes;
 * const overtime = chartsData?.OvertimeByBranch;
 * ```
 */
export const useHrDashboardChartsData = (
  token: string | null,
  options: UseHrDashboardChartsDataOptions = {}
): UseHrDashboardChartsDataReturn => {
  const {
    endpoint = "/hr/HrAnalytics/chart",
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
      console.log("🚀 Fetching HR Dashboard charts data...");
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
          HeadcountByBranchDepartment:
            processed?.HeadcountByBranchDepartment?.length,
          HiringAttritionTrend: processed?.HiringAttritionTrend?.length,
          TopLeaveTypes: processed?.TopLeaveTypes?.length,
          OvertimeByBranch: processed?.OvertimeByBranch?.length,
          AverageTenureByDepartment:
            processed?.AverageTenureByDepartment?.length,
          AverageTenureByBranch: processed?.AverageTenureByBranch?.length,
          HeadcountTrend: processed?.HeadcountTrend?.length,
          PayrollCostByBranchDepartment:
            processed?.PayrollCostByBranchDepartment?.length,
          SalaryDistribution: processed?.SalaryDistribution?.length,
          SickLeavePatterns: processed?.SickLeavePatterns?.length,
          EmployeeAgeDistribution: processed?.EmployeeAgeDistribution?.length,
          AttendanceOverview: processed?.AttendanceOverview?.length,
        });
      }

      setChartsData(processed);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to fetch HR Dashboard charts data";
      setError(errorMessage);

      if (enableLogging) {
        console.error("❌ Error fetching HR Dashboard charts data:", err);
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
      console.log("🔄 Resetting HR Dashboard charts data state");
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
        console.log("🔄 Auto-fetching HR Dashboard charts data on mount");
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
        console.log("🔄 Token changed, refetching HR Dashboard charts data");
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
 * const processedData = useProcessHrDashboardChartsData(rawApiData, true);
 * ```
 */
export const useProcessHrDashboardChartsData = (
  rawData: ChartsApiResponse | null,
  enableLogging: boolean = false
): ProcessedChartsData | null => {
  const [processedData, setProcessedData] =
    useState<ProcessedChartsData | null>(null);

  useEffect(() => {
    if (rawData) {
      if (enableLogging) {
        console.log("📊 [useProcessHrDashboardChartsData] Processing data...");
      }
      const processed = processChartsData(rawData);
      setProcessedData(processed);
    } else {
      setProcessedData(null);
    }
  }, [rawData, enableLogging]);

  return processedData;
};
