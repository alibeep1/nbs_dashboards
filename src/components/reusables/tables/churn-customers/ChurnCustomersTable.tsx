import { createApiClient } from "@/lib/api";
import { CustomDataTable } from "../CustomDataTable";
import { churnCustomersColumns } from "./ChurnCustomersTableColumns";
import {
  _mockChurnCustomersData,
  type IChurnCustomerApiResponse,
} from "./ChurnCustomersTypes";
import { useEffect, useMemo, useState } from "react";
import {
  buildApiQueryParams,
  type ApiQueryParams,
} from "@/lib/FilterUtilities";

/**
 * ChurnCustomersTable component renders a data table for churn customers.
 * It uses the CustomDataTable component with predefined columns and mock data.
 *
 * @returns {JSX.Element} The rendered ChurnCustomersTable component.
 */

interface ChurnCustomersTableProps {
  token?: string | null;
  apiQueryParams?: ApiQueryParams;
}

const serializeQueryParams = (params?: ApiQueryParams): string => {
  if (!params) return "";

  return Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${String(value)}`)
    .join("&");
};

export const ChurnCustomersTable = ({
  token = null,
  apiQueryParams,
}: ChurnCustomersTableProps) => {
  // Pagination state
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [churnCustomersData, setChurnCustomersData] =
    useState<IChurnCustomerApiResponse>(_mockChurnCustomersData);
  const [churnCustomersLoading, setChurnCustomersLoading] =
    useState<boolean>(true);
  const [churnCustomersError, setChurnCustomersError] = useState<string | null>(
    null
  );
  const apiQueryParamsKey = serializeQueryParams(apiQueryParams);
  const queryParams = useMemo<ApiQueryParams>(
    () => ({
      ...apiQueryParams,
      PageIndex: pageIndex,
      PageSize: pageSize,
    }),
    [apiQueryParamsKey, pageIndex, pageSize]
  );

  // Build query params based on the provided API query parameters

  useEffect(() => {
    if (!token) return;

    const api = createApiClient(token);

    api
      .get<IChurnCustomerApiResponse>(
        "/CustomerAnalytics/churn-risk-customers/tables",
        {
          params: queryParams,
        }
      )
      .then((res) => {
        setChurnCustomersData(res.data);
        setChurnCustomersLoading(false);
      })
      .catch((err) => {
        setChurnCustomersError(err.message);
        setChurnCustomersLoading(false);
      });
  }, [token, apiQueryParamsKey, pageIndex, pageSize]);

  // Pagination event handlers
  const handlePageChange = (newPageIndex: number) => {
    setPageIndex(newPageIndex);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageIndex(1); // Reset to first page when changing page size
    setPageSize(newPageSize);
  };

  if (churnCustomersLoading) {
    return (
      <div className="space-y-3 p-4">
        {/* Table header skeleton */}
        <div className="flex space-x-4 pb-2 border-b border-gray-200">
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
        </div>
        {/* Table rows skeleton */}
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex space-x-4 py-2">
            <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
            <div className="h-4 w-32 bg-gray-100 rounded animate-pulse" />
            <div className="h-4 w-20 bg-gray-100 rounded animate-pulse" />
            <div className="h-4 w-16 bg-gray-100 rounded animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  console.log("queryParams", apiQueryParams);
  return (
    <>
      <CustomDataTable
        data={churnCustomersData.items}
        columns={churnCustomersColumns}
        pagination={{
          pageIndex: churnCustomersData.pageIndex,
          pageSize: pageSize,
          totalPages: churnCustomersData.totalPages,
          count: churnCustomersData.count,
          hasPreviousPage: churnCustomersData.hasPreviousPage,
          hasNextPage: churnCustomersData.hasNextPage,
        }}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </>
  );
};
