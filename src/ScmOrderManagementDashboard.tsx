import { useEffect, useState } from "react";
import { useToken } from "./hooks/useToken";
import { formatKpiValue, type KpiApiResponse } from "./lib/response/IKpiResponse";
import { createApiClient } from "./lib/api";
import {
  BookOpen,
  Box,
  Building,
  CircleDot,
  Receipt,
  RefreshCcw,
  ShoppingBasket,
  TrendingUp,
  Truck,
} from "lucide-react";
import { percentChangeFormat } from "./lib/PercentChangeFormat";
import { useScmOrderManagementChartsData } from "./components/reusables/scm/order-management/charts/Usescmordermanagementchartsdata.hook";
import { SimplePieChart } from "./components/ui/charts/SimplePieChartComponent";
import { SimpleBarChart } from "./components/ui/charts/SimpleBarChart";
import { GenericDataTable } from "./components/reusables/tables/GenericDataTable";
import type {
  ITablePendingIRsApiResponse,
  ITablePOsAwaitingApprovalApiResponse,
} from "./components/reusables/scm/order-management/tables/Scmordermanagementtables.types";
import {
  pendingIRsColumns,
  posAwaitingApprovalColumns,
} from "./components/reusables/scm/order-management/tables/Scmordermanagementtable.columns";
import {
  buildScmOrderManagementFiltersQueryParams,
  type IScmOrderManagementApiParams,
} from "./components/reusables/scm/order-management/apiParams";
import {
  DEFAULT_DATE_FILTER,
  type EDateFilter,
} from "./components/reusables/DateFilterTypes";
import DateFilterDropdown from "./components/reusables/DateFilterDropdownComponent";
import GenericApiFilter from "./components/reusables/sales/GenericApiFilter";

type StatusPieSlice = {
  label: string;
  value: number;
};

const buildStatusPieData = (
  values: Array<[label: string, value: number | undefined]>
): StatusPieSlice[] => {
  const slices = values.map(([label, value]) => ({
    label,
    value: value ?? 0,
  }));

  if (!slices.some((slice) => slice.value > 0)) {
    return [];
  }

  return slices.filter((slice) => slice.value > 0);
};

function ScmOrderManagementDashboard() {
  const token = useToken();

  const [kpiData, setkpiData] = useState<KpiApiResponse>([]);
  const [kpiLoading, setkpiLoading] = useState(true);

  const [filters, setFilters] = useState<IScmOrderManagementApiParams>({
    DateFilter: DEFAULT_DATE_FILTER,
  });
  const [selectedDateFilter, setSelectedDateFilter] =
    useState<EDateFilter>(DEFAULT_DATE_FILTER);

  // Generic handler for any filter change
  const handleFilterChange = (
    filterKey: keyof IScmOrderManagementApiParams,
    value: number | string | undefined
  ) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: value,
    }));
  };

  const {
    chartsData,
    rawData,
    loading: chartsLoading,
    error,
    refetch,
    reset,
  } = useScmOrderManagementChartsData(token, {
    queryParams: buildScmOrderManagementFiltersQueryParams(filters),
    enableLogging: true,
    autoFetch: false,
    refetchOnTokenChange: false,
  });

  // trigger a refetch when filters change
  useEffect(() => {
    if (token && filters) {
      const _queryParams = buildScmOrderManagementFiltersQueryParams(filters);
      refetch(_queryParams);
    }
  }, [token, filters]);

  useEffect(() => {
    if (!token) return;

    const api = createApiClient(token);

    const queryParams = buildScmOrderManagementFiltersQueryParams(filters);

    api
      .get<KpiApiResponse>("/scm/OrderManagementAnalytics/kpi", {
        params: queryParams,
      })
      .then((res) => {
        setkpiData(res.data);
        setkpiLoading(false);
      })
      .catch((err) => {
        // setError(err.message);
        setkpiLoading(false);
      });
  }, [token, filters]);

  const approvalStatus = chartsData?.IRStatusDistributionApproval?.[0];
  const approvalPieData = buildStatusPieData([
    ["Pending", approvalStatus?.pending],
    ["Approved", approvalStatus?.approved],
    ["Cancelled", approvalStatus?.cancelled],
    ["Forced Closed", approvalStatus?.forcedClosed],
  ]);

  const fulfillmentStatus = chartsData?.IRStatusDistributionFulfillment?.[0];
  const fulfillmentPieData = buildStatusPieData([
    ["Created", fulfillmentStatus?.created],
    ["To Vendor PO", fulfillmentStatus?.toVendorPO],
    ["Partially Fulfilled", fulfillmentStatus?.partiallyFulfilled],
    ["Fully Fulfilled", fulfillmentStatus?.fullyFulfilled],
  ]);

  if (!token) {
    return <div className="p-4 text-red-500">No token provided.</div>;
  }

  return (
    <div className="dashboard-container">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span className="muted text-sm">Dashboards</span>
        <span className=" text-sm">
          {" "}
          &gt; Supply Chain &gt; Order Management
        </span>
      </div>
      {/* Filters */}
      <div className="gap-1 flex flex-col">
        <h4 className="text-md font-medium">Filters</h4>
        <div className="filter-container">
          {/* Time Period Dropdown */}
          <DateFilterDropdown
            value={selectedDateFilter}
            onValueChange={(value) => {
              handleFilterChange("DateFilter", value);
              setSelectedDateFilter(value);
            }}
          />
          {/* Branch */}
          <GenericApiFilter
            token={token}
            allowClear={true}
            shouldFilter={false}
            endpoint="/sa/branch"
            dataPointsKey="branches"
            placeholder="branch"
            searchPlaceholder="Search branches..."
            icon={Building}
            allOptionLabel="All Branches"
            allOptionDescription="View data for all branches"
            // Custom search parameters for branch API
            queryParams={{
              searchColumn: "branchName",
            }}
            // Override the default search param name
            searchParam="searchValue"
            onError={(error, context) => {
              console.error(`Error fetching branches (${context}):`, error);
            }}
            onValueChange={(value) => handleFilterChange("BranchCode", value)}
          />

          {/* Category */}
          <GenericApiFilter
            token={token}
            allowClear={true}
            shouldFilter={false}
            debounceDelay={500}
            endpoint="items/tree?level=1"
            dataPointsKey="dataPoints"
            placeholder="Parent Category"
            searchPlaceholder="Search Parent Categories..."
            icon={BookOpen}
            allOptionLabel="All Parent Categories"
            allOptionDescription="View data for all Parent Categories"
            // Custom search parameters for branch API
            // queryParams={{
            //   searchColumn: "branchName",
            // }}
            // Override the default search param name
            searchParam="request"
            onError={(error, context) => {
              console.error(`Error fetching items (${context}):`, error);
            }}
            onValueChange={(value) => handleFilterChange("Category", value)}
          />

          <GenericApiFilter
            token={token}
            allowClear={true}
            shouldFilter={false}
            endpoint="/items/suppliers/search"
            dataPointsKey="dataPoints"
            placeholder="Supplier"
            searchPlaceholder="Search Suppliers..."
            icon={Truck}
            allOptionLabel="All Suppliers"
            allOptionDescription="View data for all suppliers"
            // Custom search parameters for branch API
            // queryParams={{
            //   searchColumn: "branchName",
            // }}
            // Override the default search param name
            // searchParam="searchValue"
            onError={(error, context) => {
              console.error(`Error fetching suppliers (${context}):`, error);
            }}
            onValueChange={(value) => handleFilterChange("SupplierCode", value)}
          />

          {/* Item Code */}
          <GenericApiFilter
            token={token}
            allowClear={true}
            shouldFilter={false}
            debounceDelay={500}
            endpoint="/items/search"
            dataPointsKey="dataPoints"
            placeholder="Item"
            searchPlaceholder="Search Items..."
            icon={ShoppingBasket}
            allOptionLabel="All Items"
            allOptionDescription="View data for all items"
            // Custom search parameters for items API
            // queryParams={{
            //   searchColumn: "branchName",
            // }}
            // Override the default search param name
            // searchParam="searchValue"
            onError={(error, context) => {
              console.error(`Error fetching items (${context}):`, error);
            }}
            onValueChange={(value) => handleFilterChange("ItemCode", value)}
          />
        </div>
      </div>

      {/* KPI Section */}
      <div className=" gap-1 flex flex-col">
        <h4 className="text-md font-medium">KPIs</h4>

        {kpiLoading ? (
          <div className="cards-grid">
            {/* Active Customers Card Skeleton */}
            <div className="info-card" style={{ width: "338px" }}>
              <div className="info-card-content">
                <div className="info-card-header">
                  <div className="info-card-icon">
                    <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                  </div>
                  <div className="info-card-label">
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
                <div className="info-card-value">
                  <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
              <div className="info-card-change">
                <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>

            {/* New Customers Card Skeleton */}
            <div className="info-card" style={{ width: "153px" }}>
              <div className="info-card-content">
                <div className="info-card-header">
                  <div className="info-card-icon">
                    <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                  </div>
                  <div className="info-card-label">
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
                <div className="info-card-value">
                  <div className="h-8 w-12 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
              <div className="info-card-change">
                <div className="h-4 w-10 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>

            {/* Repeat Customers Card Skeleton */}
            <div className="info-card" style={{ width: "153px" }}>
              <div className="info-card-content">
                <div className="info-card-header">
                  <div className="info-card-icon">
                    <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                  </div>
                  <div className="info-card-label">
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
                <div className="info-card-value">
                  <div className="h-8 w-12 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
              <div className="info-card-change">
                <div className="h-4 w-10 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
            {/* Repeat Customers Card Skeleton */}
            <div className="info-card" style={{ width: "153px" }}>
              <div className="info-card-content">
                <div className="info-card-header">
                  <div className="info-card-icon">
                    <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                  </div>
                  <div className="info-card-label">
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
                <div className="info-card-value">
                  <div className="h-8 w-12 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
              <div className="info-card-change">
                <div className="h-4 w-10 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
        ) : (
          <div className="cards-grid">
            <div className="info-card" style={{ width: "338px" }}>
              <div className="info-card-content">
                <div className="info-card-header">
                  <div className="info-card-icon">
                    <CircleDot className="h-4 w-4" />
                  </div>
                  <div className="info-card-label">{kpiData[0]?.title}</div>
                </div>
                <div className="info-card-value">
                  {formatKpiValue(kpiData[0]?.value)}
                </div>
              </div>
              <div
                className={`info-card-change ${percentChangeFormat(
                  kpiData[0].percentChange
                )}`}
              >
                {kpiData[0].percentChange}
              </div>
            </div>
            {kpiData.map((item, index) => {
              if (index === 0) return null; // Skip the first item as it's already rendered
              return (
                <div
                  className="info-card"
                  style={{ width: "153px" }}
                  key={index}
                >
                  <div className="info-card-content">
                    <div className="info-card-header">
                      <div className="info-card-icon">
                        {/* You can customize icons based on index or item properties */}
                        {index === 1 && <Box className="h-4 w-4" />}
                        {index === 2 && <TrendingUp className="h-4 w-4" />}
                        {index === 3 && <RefreshCcw className="h-4 w-4" />}
                        {index === 4 && <Receipt className="h-4 w-4" />}
                        {/* {index === 6 && <Percent className="h-4 w-4" />}
                        {index === 7 && <ShoppingBasket className="h-4 w-4" />}
                        {index === 9 && <TrendingDown className="h-4 w-4" />} */}
                      </div>
                      <div className="info-card-label">{item.title}</div>
                    </div>
                    <div className="info-card-value">
                      {formatKpiValue(item.value)}
                    </div>
                  </div>
                  <div
                    className={`info-card-change ${percentChangeFormat(
                      item.percentChange
                    )}`}
                  >
                    {item.percentChange}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {/* Charts and Tables Section */}
      <div className="gap-1 flex flex-col">
        {/* Use a friendly title */}
        <h4 className="text-md font-medium">Insights</h4>
        {/* Charts and Graphs Section */}
        <div className="charts-container">
          {/* IR Distribution by Approval */}
          <div
            className="chart-card"
            style={{ gridArea: "1 / 1/ span 1 / span 1" }}
          >
            <div className="chart-title">
              {chartsLoading ? (
                <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
              ) : (
                "IR Distribution by Approval Status"
              )}
            </div>
            <div className="flex-1">
              {chartsLoading ? (
                <div className="w-full h-64 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
                  <div className="space-y-3 w-full px-4">
                    {/* Simulated area chart skeleton */}
                    <div className="flex items-end justify-between space-x-2 h-32">
                      {[...Array(8)].map((_, i) => (
                        <div
                          key={i}
                          className="bg-gray-200 rounded-t animate-pulse"
                          style={{
                            height: `${Math.random() * 80 + 20}%`,
                            width: "12%",
                          }}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between">
                      {[...Array(8)].map((_, i) => (
                        <div
                          key={i}
                          className="h-3 w-8 bg-gray-200 rounded animate-pulse"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <SimplePieChart
                  data={approvalPieData}
                  labelKey="label"
                  valueKey="value"
                  showLegend={true}
                />
              )}
            </div>
          </div>

          {/* IR Distribution by Fulfillment */}
          <div
            className="chart-card"
            style={{ gridArea: "1 / 4/ span 1 / span 1" }}
          >
            <div className="chart-title">
              {chartsLoading ? (
                <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
              ) : (
                "IR Distribution by Fulfillment Status"
              )}
            </div>
            <div className="flex-1">
              {chartsLoading ? (
                <div className="w-full h-64 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
                  <div className="space-y-3 w-full px-4">
                    <div className="flex items-end justify-between space-x-2 h-32">
                      {[...Array(8)].map((_, i) => (
                        <div
                          key={i}
                          className="bg-gray-200 rounded-t animate-pulse"
                          style={{
                            height: `${Math.random() * 80 + 20}%`,
                            width: "12%",
                          }}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between">
                      {[...Array(8)].map((_, i) => (
                        <div
                          key={i}
                          className="h-3 w-8 bg-gray-200 rounded animate-pulse"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <SimplePieChart
                  data={fulfillmentPieData}
                  labelKey="label"
                  valueKey="value"
                  showLegend={true}
                />
              )}
            </div>
          </div>

          {/* Most Requested Items */}
          <div
            className="chart-card"
            style={{ gridArea: "1 / 2/ span 1 / span 2" }}
          >
            <div className="chart-title">
              {chartsLoading ? (
                <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
              ) : (
                "Most Requested Items"
              )}
            </div>
            <div className="flex-1">
              {chartsLoading ? (
                <div className="w-full h-64 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
                  <div className="space-y-3 w-full px-4">
                    {/* Simulated area chart skeleton */}
                    <div className="flex items-end justify-between space-x-2 h-32">
                      {[...Array(8)].map((_, i) => (
                        <div
                          key={i}
                          className="bg-gray-200 rounded-t animate-pulse"
                          style={{
                            height: `${Math.random() * 80 + 20}%`,
                            width: "12%",
                          }}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between">
                      {[...Array(8)].map((_, i) => (
                        <div
                          key={i}
                          className="h-3 w-8 bg-gray-200 rounded animate-pulse"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                // For your charts API data:
                <SimpleBarChart
                  data={chartsData?.MostRequestedItems}
                  xKey="itemName"
                  yKey="requestedQuantity"
                  showYAxis={true}
                  showYAxisLabels={true}
                  strokeColor="#3b82f6"
                  fillColor="#3b82f6"
                  label=" Requested Quantity"
                />
              )}
            </div>
          </div>

          {/* GRN Count by Branch */}
          <div
            className="chart-card"
            style={{ gridArea: "2 / 1/ span 1 / span 2" }}
          >
            <div className="chart-title">
              {chartsLoading ? (
                <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
              ) : (
                "GRN Count by Branch"
              )}
            </div>
            <div className="flex-1">
              {chartsLoading ? (
                <div className="w-full h-64 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
                  <div className="space-y-3 w-full px-4">
                    {/* Simulated area chart skeleton */}
                    <div className="flex items-end justify-between space-x-2 h-32">
                      {[...Array(8)].map((_, i) => (
                        <div
                          key={i}
                          className="bg-gray-200 rounded-t animate-pulse"
                          style={{
                            height: `${Math.random() * 80 + 20}%`,
                            width: "12%",
                          }}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between">
                      {[...Array(8)].map((_, i) => (
                        <div
                          key={i}
                          className="h-3 w-8 bg-gray-200 rounded animate-pulse"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                // For your charts API data:
                <SimpleBarChart
                  data={chartsData?.GRNCountByBranch}
                  xKey="branch"
                  yKey="totalGRNs"
                  showYAxis={true}
                  showYAxisLabels={true}
                  strokeColor="#3b82f6"
                  fillColor="#3b82f6"
                  label=" GRNs"
                />
              )}
            </div>
          </div>

          <div
            className="data-table"
            style={{ gridArea: "2 / 3/ span 1 / span 2" }}
          >
            <div className="data-table-header">
              <div className="data-table-title">Pending IRs</div>
              <input
                type="text"
                placeholder="Search By Name"
                className="data-table-search"
                style={{ width: "340px" }}
              />
            </div>
            <div className="flex-1">
              <GenericDataTable<ITablePendingIRsApiResponse>
                apiQueryParams={buildScmOrderManagementFiltersQueryParams(
                  filters
                )}
                token={token}
                moduleName="scm/OrderManagementAnalytics"
                urlExtension="pending-ir"
                columns={pendingIRsColumns}
              />
            </div>
          </div>

          <div
            className="data-table"
            style={{ gridArea: "2 / 1/ span 1 / span 2" }}
          >
            <div className="data-table-header">
              <div className="data-table-title">POs Awaiting Approval</div>
              <input
                type="text"
                placeholder="Search By Name"
                className="data-table-search"
                style={{ width: "340px" }}
              />
            </div>
            <div className="flex-1">
              <GenericDataTable<ITablePOsAwaitingApprovalApiResponse>
                apiQueryParams={buildScmOrderManagementFiltersQueryParams(
                  filters
                )}
                token={token}
                moduleName="scm/OrderManagementAnalytics"
                urlExtension="po-awaiting-approval"
                columns={posAwaitingApprovalColumns}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScmOrderManagementDashboard;
