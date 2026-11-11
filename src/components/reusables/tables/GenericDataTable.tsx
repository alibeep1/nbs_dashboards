import { createApiClient } from "@/lib/api";
// import { CustomDataTable } from "../CustomDataTable";
// import { churnCustomersColumns } from "./ChurnCustomersTableColumns";
// import {
//   _mockChurnCustomersData,
//   // type IChurnCustomerApiResponse,
// } from "./ChurnCustomersTypes";
import { useEffect, useMemo, useState } from "react";
import {
  buildApiQueryParams,
  type ApiQueryParams,
} from "@/lib/FilterUtilities";
import { CustomDataTable } from "./CustomDataTable";
import type { ColumnDef } from "@tanstack/react-table";
// import {
//   _mockHighRefundCustomerData,
//   type IHighRefundCustomerApiResponse,
// } from "./HighRefundCustomersTypes";
// import { highRefundCustomersColumns } from "./HighRefundCustomersTableColumns";

/**
 * ChurnCustomersTable component renders a data table for churn customers.
 * It uses the CustomDataTable component with predefined columns and mock data.
 *
 * @returns {JSX.Element} The rendered ChurnCustomersTable component.
 */

interface GenericTableProps<T> {
  token?: string | null;
  apiQueryParams?: ApiQueryParams | URLSearchParams;
  urlExtension?: string;
  columns: ColumnDef<any, unknown>[];
  mockData?: T;
  moduleName?: string;
}

const serializeQueryParams = (
  params?: ApiQueryParams | URLSearchParams,
): string => {
  if (!params) return "";

  const entries =
    params instanceof URLSearchParams
      ? Array.from(params.entries())
      : Object.entries(params);

  return entries
    .filter(([, value]) => value !== undefined && value !== null)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${String(value)}`)
    .join("&");
};

export const GenericDataTable = <
  T extends {
    items: any[];
    pageIndex: number;
    totalPages: number;
    count: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  },
>({
  token = null,
  apiQueryParams,
  urlExtension = "",
  columns,
  mockData,
  moduleName = "CustomerAnalytics",
}: GenericTableProps<T>) => {
  // Pagination state
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [data, setData] = useState<T>(mockData as T);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const apiQueryParamsKey = serializeQueryParams(apiQueryParams);
  const queryParams = useMemo<Record<string, any>>(
    () => ({
      ...(apiQueryParams instanceof URLSearchParams
        ? Object.fromEntries(apiQueryParams.entries())
        : apiQueryParams),
      PageIndex: pageIndex,
      PageSize: pageSize,
    }),
    [apiQueryParamsKey, pageIndex, pageSize],
  );

  // Build query params based on the provided API query parameters

  useEffect(() => {
    if (!token) return;

    const api = createApiClient(token);

    // clg apiQueryParams

    console.log("apiQueryParams: ", apiQueryParams?.toString());
    // const queryParams = {
    //   ...apiQueryParams,
    //   PageIndex: pageIndex,
    //   PageSize: pageSize,
    // };

    console.log("query Params: ", queryParams);

    api
      .get<T>(`/${moduleName}/${urlExtension}/tables`, {
        params: queryParams,
      })
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [token, apiQueryParamsKey, pageIndex, pageSize, urlExtension, moduleName]);

  // Pagination event handlers
  const handlePageChange = (newPageIndex: number) => {
    setPageIndex(newPageIndex);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageIndex(1); // Reset to first page when changing page size
    setPageSize(newPageSize);
  };

  if (loading) {
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

  console.log("table data => queryParams", apiQueryParams);
  return (
    <>
      <CustomDataTable
        data={data?.items ?? []}
        columns={columns}
        pagination={{
          pageIndex: data?.pageIndex,
          pageSize: pageSize,
          totalPages: data?.totalPages,
          count: data?.count,
          hasPreviousPage: data?.hasPreviousPage,
          hasNextPage: data?.hasNextPage,
        }}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </>
  );
};
