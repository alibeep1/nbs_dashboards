import { useEffect, useState } from "react";
import { useToken } from "./hooks/useToken";
import { formatKpiValue, type KpiApiResponse } from "./lib/response/IKpiResponse";
import { createApiClient } from "./lib/api";
import DateFilterDropdown from "./components/reusables/DateFilterDropdownComponent";
import {
  BookOpen,
  Box,
  Building,
  CircleDot,
  Receipt,
  RefreshCcw,
  ShoppingBasket,
  TrendingUp,
} from "lucide-react";
import GenericApiFilter from "./components/reusables/sales/GenericApiFilter";
import { percentChangeFormat } from "./lib/PercentChangeFormat";
import { useScmInventoryChartsData } from "./components/reusables/scm/inventory/charts/Usescminventorychartsdata.hook";
import { SimpleBarChart } from "./components/ui/charts/SimpleBarChart";
import { SimpleAreaChartGradient } from "./components/ui/charts/SimpleAreaChartGradient";
import { StackedAreaChart } from "./components/ui/charts/SimpleStackedAreaChartGradient";
import React from "react";
import {
  getDamageTypeColorArray,
  transformDamagedExpiredLostData,
} from "./components/reusables/scm/inventory/charts/Transformdamagedexpiredlostdata";
import { Bar } from "recharts";
import { GenericDataTable } from "./components/reusables/tables/GenericDataTable";
import type {
  ITableItemsNearExpiryApiResponse,
  ITableStocktakingSummaryApiResponse,
} from "./components/reusables/scm/inventory/tables/Scminventorytables.types";
import {
  itemsNearExpiryColumns,
  stocktakingSummaryColumns,
} from "./components/reusables/scm/inventory/tables/Scminventorytables.columns";
import {
  buildScmInventoryQueryParams,
  type IScmInventoryApiParams,
} from "./components/reusables/scm/inventory/apiParams";
import {
  DEFAULT_DATE_FILTER,
  type EDateFilter,
} from "./components/reusables/DateFilterTypes";

function ScmInventoryDashboard() {
  const token = useToken();

  const [filters, setFilters] = useState<IScmInventoryApiParams>({
    DateFilter: DEFAULT_DATE_FILTER,
  });

  const [selectedDateFilter, setSelectedDateFilter] =
    useState<EDateFilter>(DEFAULT_DATE_FILTER);

  const [kpiData, setkpiData] = useState<KpiApiResponse>([]);
  const [kpiLoading, setkpiLoading] = useState(true);

  // Generic handler for any filter change
  const handleFilterChange = (
    filterKey: keyof IScmInventoryApiParams,
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
    error: chartsError,
    refetch,
    reset,
  } = useScmInventoryChartsData(token, {
    queryParams: buildScmInventoryQueryParams(filters),
    enableLogging: true,
    autoFetch: false,
    refetchOnTokenChange: false,
  });

  // trigger a refetch when filters change
  useEffect(() => {
    if (token && filters) {
      const _queryParams = buildScmInventoryQueryParams(filters);
      refetch(_queryParams);
    }
  }, [token, filters]);

  useEffect(() => {
    if (!token) return;

    const api = createApiClient(token);

    // Build query parameters from current filter values
    // const queryParams = buildFiltersQueryParams(
    //   selectedDateFilter,
    //   selectedBranch,
    //   selectedRegion,
    //   selectedGender,
    //   ageRange
    // );
    const queryParams = buildScmInventoryQueryParams(filters);

    api
      .get<KpiApiResponse>("/scm/InventoryAnalytics/kpi", {
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

  // Transform the data for StackedAreaChart
  const transformedDamageData = React.useMemo(() => {
    if (!chartsData?.damagedExpiredLostTrend) return [];
    return transformDamagedExpiredLostData(chartsData.damagedExpiredLostTrend);
  }, [chartsData?.damagedExpiredLostTrend]);

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
          &gt; Supply Chain &gt; Inventory Management
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
            onValueChange={(value) => handleFilterChange("StoreCode", value)}
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
          {/* Render charts using chartsData */}
          {/* Stock Value By Warehouse */}
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
                chartsData?.stockValueByWarehouse[0]?.chartTitle
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
                  data={chartsData?.stockValueByWarehouse}
                  xKey="storeName"
                  yKey="stockValue"
                  showYAxis={true}
                  showYAxisLabels={true}
                  strokeColor="#3b82f6"
                  fillColor="#3b82f6"
                  label=" EGP "
                />
              )}
            </div>
          </div>

          {/* Stock Quantity by Category */}
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
                "Stock Quantity by Category"
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
                  data={chartsData?.stockQuantityByCategory}
                  xKey="cdlDescr"
                  yKey="quantity"
                  showYAxis={true}
                  showYAxisLabels={true}
                  strokeColor="#10b981"
                  fillColor="#10b981"
                  label=" EGP "
                />
              )}
            </div>
          </div>

          {/* Damaged, Expired, and Lost Items Trend */}
          <div
            className="chart-card"
            style={{
              gridArea: "2 / 1 / span 1 / span 2",
            }}
          >
            <div className="chart-title">
              {chartsLoading ? (
                <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
              ) : (
                "Damaged, Expired & Lost Trend"
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
                <StackedAreaChart
                  data={transformedDamageData}
                  xKey="month"
                  yKey="count"
                  stackKey="type"
                  colors={getDamageTypeColorArray()}
                  showGrid={true}
                  showYAxis={true}
                  //   sortData={true} // Already sorted by monthOrderBy
                />
                // <SimpleAreaChartGradient
                //   data={chartsData?.damagedExpiredLostTrend}

                //   xKey="month"
                //   yKey="damaged"
                //   showYAxis={true}
                //   showYAxisLabels={true}
                //   strokeColor="#10b981"
                //   fillColor="#10b981"
                //   label=" EGP "
                // />
              )}
            </div>
          </div>

          {/* Damaged, Expired, and Lost Items Trend */}
          <div
            className="chart-card"
            style={{
              gridArea: "2 / 3 / span 1 / span 2",
            }}
          >
            <div className="chart-title">
              {chartsLoading ? (
                <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
              ) : (
                "Low-Stock Items"
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
                  data={chartsData?.lowStockItems}
                  xKey="itemName"
                  yKey="currentQty"
                  label="Current Qty"
                  layout="inverted-vertical"
                  fillColor="#ef4444"
                  showYAxisLabels={true}
                  //   stackKey="type"
                  //   colors={getDamageTypeColorArray()}
                  //   showGrid={true}
                  //   showYAxis={true}
                  //   sortData={true} // Already sorted by monthOrderBy
                >
                  <Bar
                    dataKey={"onOrderQty"}
                    fill={"#f59e0b"}
                    stroke={"#f59e0b"}
                    radius={8}
                  />
                </SimpleBarChart>
                // <SimpleAreaChartGradient
                //   data={chartsData?.damagedExpiredLostTrend}

                //   xKey="month"
                //   yKey="damaged"
                //   showYAxis={true}
                //   showYAxisLabels={true}
                //   strokeColor="#10b981"
                //   fillColor="#10b981"
                //   label=" EGP "
                // />
              )}
            </div>
          </div>

          {/* Static Items */}
          <div
            className="chart-card"
            style={{
              gridArea: "3 / 1 / span 1 / span 2",
            }}
          >
            <div className="chart-title">
              {chartsLoading ? (
                <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
              ) : (
                "Static Items"
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
                  data={chartsData?.staticItems}
                  xKey="item"
                  yKey="totalValue"
                  label="Current Qty"
                  layout="vertical"
                  fillColor="#f59e0b"
                  showYAxisLabels={true}
                  metadata={{
                    show: true,
                    columns: [
                      {
                        key: "qty",
                        label: "Current Quantity",
                        formatter: (value) => `${Number(value).toFixed(1)}`,
                      },
                      {
                        key: "lastMove",
                        label: "Last Move",
                        formatter: (value) => value,
                      },
                    ],
                  }}
                  //   stackKey="type"
                  //   colors={getDamageTypeColorArray()}
                  //   showGrid={true}
                  //   showYAxis={true}
                  //   sortData={true} // Already sorted by monthOrderBy
                />

                // <SimpleAreaChartGradient
                //   data={chartsData?.damagedExpiredLostTrend}

                //   xKey="month"
                //   yKey="damaged"
                //   showYAxis={true}
                //   showYAxisLabels={true}
                //   strokeColor="#10b981"
                //   fillColor="#10b981"
                //   label=" EGP "
                // />
              )}
            </div>
          </div>

          {/* Supply by Product */}
          <div
            className="chart-card"
            style={{
              gridArea: "3 / 3 / span 1 / span 2",
            }}
          >
            <div className="chart-title">
              {chartsLoading ? (
                <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
              ) : (
                "Supply By Product"
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
                  data={chartsData?.supplyByProduct}
                  xKey="item"
                  yKey="qty"
                  label="Current Qty"
                  layout="vertical"
                  //   fillColor="#ef4444"
                  showYAxisLabels={true}
                  //   metadata={{
                  //     show: true,
                  //     columns: [
                  //       {
                  //         key: "qty",
                  //         label: "Current Quantity",
                  //         formatter: (value) => `${Number(value).toFixed(1)}`,
                  //       },
                  //       {
                  //         key: "lastMove",
                  //         label: "Last Move",
                  //         formatter: (value) => value,
                  //       },
                  //     ],
                  //   }}
                  //   stackKey="type"
                  //   colors={getDamageTypeColorArray()}
                  //   showGrid={true}
                  //   showYAxis={true}
                  //   sortData={true} // Already sorted by monthOrderBy
                >
                  <Bar dataKey={"returnQty"} fill={"#3b82f6"} />
                  <Bar dataKey={"softReserved"} fill={"#f59e0b"} />
                </SimpleBarChart>

                // <SimpleAreaChartGradient
                //   data={chartsData?.damagedExpiredLostTrend}

                //   xKey="month"
                //   yKey="damaged"
                //   showYAxis={true}
                //   showYAxisLabels={true}
                //   strokeColor="#10b981"
                //   fillColor="#10b981"
                //   label=" EGP "
                // />
              )}
            </div>
          </div>

          <div
            className="data-table"
            style={{ gridArea: "4 / 1/ span 1 / span 4" }}
          >
            <div className="data-table-header">
              <div className="data-table-title"> Items Near Expiry </div>
              <input
                type="text"
                placeholder="Search By Name"
                className="data-table-search"
                style={{ width: "340px" }}
              />
            </div>
            <div className="flex-1">
              <GenericDataTable<ITableItemsNearExpiryApiResponse>
                // apiQueryParams={buildFiltersQueryParams(filters)}
                token={token}
                moduleName="scm/InventoryAnalytics"
                urlExtension="items-near-expiry"
                columns={itemsNearExpiryColumns}
              />
            </div>
          </div>

          <div
            className="data-table"
            style={{ gridArea: "5 / 1/ span 1 / span 4" }}
          >
            <div className="data-table-header">
              <div className="data-table-title"> Stocktaking Summary </div>
              <input
                type="text"
                placeholder="Search By Name"
                className="data-table-search"
                style={{ width: "340px" }}
              />
            </div>
            <div
              className="flex-1"
              style={{
                maxHeight: "600px", // Or whatever height you prefer
                overflow: "auto", // Enable scrolling
              }}
            >
              <GenericDataTable<ITableStocktakingSummaryApiResponse>
                apiQueryParams={buildScmInventoryQueryParams(filters)}
                token={token}
                moduleName="scm/InventoryAnalytics"
                urlExtension="stocktaking-summary"
                columns={stocktakingSummaryColumns}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScmInventoryDashboard;
