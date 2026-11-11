import { useEffect, useState } from "react";
import { useToken } from "./hooks/useToken";
import { createApiClient } from "./lib/api";
import {
  formatKpiValue,
  type KpiApiResponse,
} from "./lib/response/IKpiResponse";
import {
  Box,
  CircleDot,
  Import,
  Info,
  Receipt,
  RefreshCcw,
  Send,
  ShoppingBasket,
  TrendingUp,
} from "lucide-react";
import { percentChangeFormat } from "./lib/PercentChangeFormat";
import { useScmInterbranchChartsData } from "./components/reusables/scm/interbranch/charts/Usescminterbranchchartsdata.hook";
import { SimpleBarChart } from "./components/ui/charts/SimpleBarChart";
import { StackedBarChart } from "./components/ui/charts/StackedBarChart";
import { GenericDataTable } from "./components/reusables/tables/GenericDataTable";
import type {
  ITablePendingTransfersByDestinationApiResponse,
  ITableTransfersWithMismatchedQtyApiResponse,
} from "./components/reusables/scm/interbranch/tables/Scminterbranchtables.types";
import {
  transfersWithMismatchedQtyColumns,
  pendingTransfersByDestinationColumns,
} from "./components/reusables/scm/interbranch/tables/Scminterbranchtables.columns";
import DateFilterDropdown from "./components/reusables/DateFilterDropdownComponent";
import {
  buildScmInterbranchFiltersQueryParams,
  type IScmInterbranchApiParams,
} from "./components/reusables/scm/interbranch/apiParams";
import {
  DEFAULT_DATE_FILTER,
  type EDateFilter,
} from "./components/reusables/DateFilterTypes";
import GenericApiFilter from "./components/reusables/sales/GenericApiFilter";
import StaticDataFilter from "./components/reusables/sales/StaticFilterDropdown";

function ScmInterbranchDashboard() {
  const token = useToken();

  const [kpiData, setkpiData] = useState<KpiApiResponse>([]);
  const [kpiLoading, setkpiLoading] = useState(true);

  const [filters, setFilters] = useState<IScmInterbranchApiParams>({
    DateFilter: DEFAULT_DATE_FILTER,
  });
  const [selectedDateFilter, setSelectedDateFilter] =
    useState<EDateFilter>(DEFAULT_DATE_FILTER);

  // Generic handler for any filter change
  const handleFilterChange = (
    filterKey: keyof IScmInterbranchApiParams,
    value: number | string | undefined,
  ) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: value,
    }));
  };

  const {
    chartsData,
    loading: chartsLoading,
    refetch,
  } = useScmInterbranchChartsData(token, {
    queryParams: buildScmInterbranchFiltersQueryParams(filters),
    enableLogging: true,
    autoFetch: false,
    refetchOnTokenChange: false,
  });

  // trigger a refetch when filters change
  useEffect(() => {
    if (token && filters) {
      const _queryParams = buildScmInterbranchFiltersQueryParams(filters);
      refetch(_queryParams);
    }
  }, [token, filters]);

  useEffect(() => {
    if (!token) return;

    const api = createApiClient(token);

    const queryParams = buildScmInterbranchFiltersQueryParams(filters);

    api
      .get<KpiApiResponse>("/scm/InterbranchAnalytics/kpi", {
        params: queryParams,
      })
      .then((res) => {
        setkpiData(res.data);
        setkpiLoading(false);
      })
      .catch(() => {
        // setError(err.message);
        setkpiLoading(false);
      });
  }, [token, filters]);

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
          &gt; Supply Chain &gt; Interbranch Movement
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

          {/* ORIGIN Branch */}
          <GenericApiFilter
            token={token}
            allowClear={true}
            shouldFilter={false}
            endpoint="/sa/branch"
            dataPointsKey="branches"
            placeholder="origin branch"
            searchPlaceholder="Search branches..."
            icon={Send}
            allOptionLabel="All Origin Branches"
            allOptionDescription="View data for all origin branches"
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

          {/* DESTINATION Branch */}
          <GenericApiFilter
            token={token}
            allowClear={true}
            shouldFilter={false}
            endpoint="/sa/branch"
            dataPointsKey="branches"
            placeholder="destination branch"
            searchPlaceholder="Search branches..."
            icon={Import}
            allOptionLabel="All Destination Branches"
            allOptionDescription="View data for all destination branches"
            // Custom search parameters for branch API
            queryParams={{
              searchColumn: "branchName",
            }}
            // Override the default search param name
            searchParam="searchValue"
            onError={(error, context) => {
              console.error(`Error fetching branches (${context}):`, error);
            }}
            onValueChange={(value) =>
              handleFilterChange("DestinationBranchCode", value)
            }
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

          <StaticDataFilter
            // token={token}
            allowClear={true}
            shouldFilter={true}
            data={[
              { value: "", label: "All" },
              // { value: "", label: "Stock" },
              { value: "15", label: "Open" },
              { value: "90", label: "Fully Received" },
              //   { value: "15", label: "Unpaid" },
            ]}
            // endpoint="/sa/branch"
            // dataPointsKey="branches"
            placeholder="Status"
            searchPlaceholder="Search Status..."
            icon={Info}
            allOptionLabel="All Status"
            allOptionDescription="View data for all status"
            onValueChange={(value) => handleFilterChange("Status", value)}
          />
        </div>
      </div>
      {/* </div> */}
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
                  kpiData[0]?.percentChange,
                )}`}
              >
                {kpiData[0]?.percentChange}
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
                      <div className="info-card-label">{item?.title}</div>
                    </div>
                    <div className="info-card-value">
                      {formatKpiValue(item?.value)}
                    </div>
                  </div>
                  <div
                    className={`info-card-change ${percentChangeFormat(
                      item?.percentChange,
                    )}`}
                  >
                    {item?.percentChange}
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
          {/* Placeholder for charts and graphs */}
          {/* Transfer Volume by Route */}
          <div
            className="chart-card"
            style={{
              gridArea: "1 / 1 / span 1 / span 2",
            }}
          >
            <div className="chart-title">
              {chartsLoading ? (
                <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
              ) : (
                "Transfer Volume by Route"
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
                <SimpleBarChart
                  data={chartsData?.TransferVolumeByRoute ?? []}
                  xKey="routeName"
                  yKey="transferCount"
                  showYAxisLabels={true}
                  strokeColor="#3b82f6"
                  fillColor="#3b82f6"
                  label=" Transfer Count"
                />
              )}
            </div>
          </div>
          {/* Transfer Fulfillment Trend */}
          <div
            className="chart-card"
            style={{
              gridArea: "1 / 3 / span 1 / span 2",
            }}
          >
            <div className="chart-title">
              {chartsLoading ? (
                <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
              ) : (
                "Transfer Fulfillment Trend"
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
                <StackedBarChart
                  data={
                    chartsData?.TransferFulfillmentTrend.map((item) => ({
                      weekLabel: item.weekLabel,
                      giNs: item.giNs,
                      grNs: item.grNs,
                    })) ?? []
                  }
                  xKey="weekLabel"
                  series={[
                    { key: "giNs", label: "GINs", color: "#3b82f6" },
                    { key: "grNs", label: "GRNs", color: "#10b981" },
                  ]}
                  showYAxisLabels={true}
                />
              )}
            </div>
          </div>

          <div
            className="data-table"
            style={{ gridArea: "2 / 3/ span 1 / span 4" }}
          >
            <div className="data-table-header">
              <div className="data-table-title">
                Transfers with Mismatched Quantities
              </div>
              <input
                type="text"
                placeholder="Search By Name"
                className="data-table-search"
                style={{ width: "340px" }}
              />
            </div>
            <div className="flex-1">
              <GenericDataTable<ITableTransfersWithMismatchedQtyApiResponse>
                apiQueryParams={buildScmInterbranchFiltersQueryParams(filters)}
                token={token}
                moduleName="scm/InterbranchAnalytics"
                urlExtension="transfers-mismatched-qty"
                columns={transfersWithMismatchedQtyColumns}
              />
            </div>
          </div>

          <div
            className="data-table"
            style={{ gridArea: "2 / 1/ span 1 / span 2" }}
          >
            <div className="data-table-header">
              <div className="data-table-title">
                Pending Transfers by Destination
              </div>
              <input
                type="text"
                placeholder="Search By Name"
                className="data-table-search"
                style={{ width: "340px" }}
              />
            </div>
            <div className="flex-1">
              <GenericDataTable<ITablePendingTransfersByDestinationApiResponse>
                apiQueryParams={buildScmInterbranchFiltersQueryParams(filters)}
                token={token}
                moduleName="scm/InterbranchAnalytics"
                urlExtension="pending-transfers"
                columns={pendingTransfersByDestinationColumns}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScmInterbranchDashboard;
