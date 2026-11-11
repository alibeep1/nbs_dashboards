import {
  BookOpen,
  Box,
  CircleDot,
  Info,
  Percent,
  Receipt,
  RefreshCcw,
  ShoppingBasket,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import GenericApiFilter from "./components/reusables/sales/GenericApiFilter";
import { useToken } from "./hooks/useToken";
import StaticDataFilter from "./components/reusables/sales/StaticFilterDropdown";
import { percentChangeFormat } from "./lib/PercentChangeFormat";
import { useEffect, useMemo, useState } from "react";
import {
  formatKpiValue,
  type KpiApiResponse,
} from "./lib/response/IKpiResponse";
import { createApiClient } from "./lib/api";
import { useItemsCatalogueChartsData } from "./components/reusables/items-catalogue/charts/useItemsCatalogueChartsData";
import { SimpleBarChart } from "./components/ui/charts/SimpleBarChart";
import { SimplePieChart } from "./components/ui/charts/SimplePieChartComponent";
import { SimpleAreaChartGradient } from "./components/ui/charts/SimpleAreaChartGradient";
import type {
  ITableMissingImportantFieldsApiResponse,
  ITableSuspectedDuplicateItemsApiResponse,
} from "./components/reusables/items-catalogue/tables/itemsCatalogueTable.types.ts";
import {
  missingImportantFieldsColumns,
  suspectedDuplicateItemsColumns,
} from "./components/reusables/items-catalogue/tables/itemsCatalogueTableColumns.tsx";
import { GenericDataTable } from "./components/reusables/tables/GenericDataTable";
import {
  buildFiltersQueryParams,
  type IItemsCatalogueApiParams,
} from "./components/reusables/items-catalogue/apiParams.tsx";

function ItemsCatalogueDashboard() {
  const token = useToken();

  const [filters, setFilters] = useState<IItemsCatalogueApiParams>({});

  const [kpiData, setkpiData] = useState<KpiApiResponse>([]);
  const [kpiLoading, setkpiLoading] = useState(true);
  const queryParams = useMemo(
    () => buildFiltersQueryParams(filters),
    [filters],
  );

  const {
    chartsData,
    rawData,
    loading: chartsLoading,
    error: chartsError,
    refetch,
    reset,
  } = useItemsCatalogueChartsData(token, {
    queryParams,
    enableLogging: true,
    autoFetch: false,
    refetchOnTokenChange: false,
  });

  // Generic handler for any filter change
  const handleFilterChange = (
    filterKey: keyof IItemsCatalogueApiParams,
    value: number | undefined,
  ) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: value,
    }));
  };

  // trigger a refetch when filters change
  useEffect(() => {
    if (token && filters) {
      refetch(queryParams);
    }
  }, [token, filters, queryParams]);

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
    api
      .get<KpiApiResponse>("/ItemsCatalogueAnalytics/kpi", {
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
  }, [token, queryParams]);

  if (!token) {
    return <div className="p-4 text-red-500">No token provided.</div>;
  }

  return (
    <div className="dashboard-container">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span className="muted text-sm">Dashboards</span>
        <span className=" text-sm"> &gt; Items Catalogue</span>
      </div>

      {/* Filters */}
      <div className="gap-1 flex flex-col">
        <h4 className="text-md font-medium">Filters</h4>
        <div className="filter-container">
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
            icon={BookOpen}
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

          {/* Item Type */}
          <StaticDataFilter
            // token={token}
            allowClear={true}
            shouldFilter={true}
            data={[
              { value: "", label: "All" },
              { value: "1", label: "Stock" },
              { value: "0", label: "Non-stock" },
              //   { value: "15", label: "Unpaid" },
            ]}
            // endpoint="/sa/branch"
            // dataPointsKey="branches"
            placeholder="Item Type"
            searchPlaceholder="Search Item Type..."
            icon={Info}
            allOptionLabel="All Item Types"
            allOptionDescription="View data for all item types"
            onValueChange={(value) => handleFilterChange("ItemType", value)}
          />

          <StaticDataFilter
            // token={token}
            allowClear={true}
            shouldFilter={true}
            data={[
              { value: "", label: "All" },
              { value: "0", label: "Active" },
              { value: "1", label: "Archived" },
              //   { value: "15", label: "Unpaid" },
            ]}
            // endpoint="/sa/branch"
            // dataPointsKey="branches"
            placeholder="Item Status"
            searchPlaceholder="Search Item Status..."
            icon={Info}
            allOptionLabel="All Item Status"
            allOptionDescription="View data for all item status"
            onValueChange={(value) => handleFilterChange("Status", value)}
          />

          <StaticDataFilter
            // token={token}
            allowClear={true}
            shouldFilter={true}
            data={[
              { value: "", label: "All" },
              { value: "1", label: "On-web" },
              { value: "0", label: "Not on-web" },
              //   { value: "15", label: "Unpaid" },
            ]}
            // endpoint="/sa/branch"
            // dataPointsKey="branches"
            placeholder="Ecommerce Status"
            searchPlaceholder="Search Ecommerce Status..."
            icon={Info}
            allOptionLabel="All Ecommerce Status"
            allOptionDescription="View data for all Ecommerce Status"
            onValueChange={(value) =>
              handleFilterChange("EcommerceStatus", value)
            }
          />

          <StaticDataFilter
            // token={token}
            allowClear={true}
            shouldFilter={true}
            data={[
              { value: "", label: "All" },
              { value: "0", label: "Normal" },
              { value: "1", label: "FMI" },
              { value: "5", label: "Summer" },
              { value: "6", label: "Winter" },
              //   { value: "15", label: "Unpaid" },
            ]}
            // endpoint="/sa/branch"
            // dataPointsKey="branches"
            placeholder="Item Movement Control"
            searchPlaceholder="Search Item Movement..."
            icon={Info}
            allOptionLabel="All Item Movements"
            allOptionDescription="View data for all Item Movements"
            onValueChange={(value) =>
              handleFilterChange("ItemMovementControl", value)
            }
          />

          <GenericApiFilter
            token={token}
            allowClear={true}
            shouldFilter={false}
            debounceDelay={500}
            endpoint="/basicdata/search?SerialNo=401"
            dataPointsKey="dataPoints"
            placeholder="Special Group"
            searchPlaceholder="Search Groups..."
            icon={BookOpen}
            allOptionLabel="All Groups"
            allOptionDescription="View data for all Groups"
            // Custom search parameters for branch API
            // queryParams={{
            //   searchColumn: "branchName",
            // }}
            // Override the default search param name
            searchParam="searchTerm"
            onError={(error, context) => {
              console.error(`Error fetching items (${context}):`, error);
            }}
            onValueChange={(value) => handleFilterChange("SpecialGroup", value)}
          />

          <GenericApiFilter
            token={token}
            allowClear={true}
            shouldFilter={false}
            debounceDelay={500}
            endpoint="/items/manufacturers/search"
            dataPointsKey="dataPoints"
            placeholder="Manufacturers"
            searchPlaceholder="Search Manufacturers..."
            icon={BookOpen}
            allOptionLabel="All Manufacturers"
            allOptionDescription="View data for all Manufacturers"
            // Custom search parameters for branch API
            // queryParams={{
            //   searchColumn: "branchName",
            // }}
            // Override the default search param name
            searchParam="request"
            onError={(error, context) => {
              console.error(`Error fetching items (${context}):`, error);
            }}
            onValueChange={(value) => handleFilterChange("Manufacturer", value)}
          />

          <GenericApiFilter
            token={token}
            allowClear={true}
            shouldFilter={false}
            debounceDelay={500}
            endpoint="/basicdata/search?SerialNo=403"
            dataPointsKey="dataPoints"
            placeholder="Brand"
            searchPlaceholder="Search Brands..."
            icon={BookOpen}
            allOptionLabel="All Brands"
            allOptionDescription="View data for all Brands"
            // Custom search parameters for branch API
            // queryParams={{
            //   searchColumn: "branchName",
            // }}
            // Override the default search param name
            searchParam="searchTerm"
            onError={(error, context) => {
              console.error(`Error fetching items (${context}):`, error);
            }}
            onValueChange={(value) => handleFilterChange("Brand", value)}
          />
        </div>
      </div>

      {/* KPIs */}
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
        {/* </div> */}
      </div>

      {/* Charts and Tables Section */}
      <div className="gap-1 flex flex-col">
        {/* Use a friendly title */}
        <h4 className="text-md font-medium">Insights</h4>
        {/* Charts and Graphs Section */}
        <div className="charts-container">
          {/* Distribution by Item Type Chart */}
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
                "Distribution by Item Type"
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
                  data={chartsData?.distributionByItemType}
                  xKey="label"
                  yKey="value"
                  //   showYAxis={true}
                  strokeColor="#3b82f6"
                  fillColor="#3b82f6"
                  label=" items"
                />
              )}
            </div>
          </div>

          {/* Distribution by Parent Category */}
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
                "Distribution by Parent Category"
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
                  data={chartsData?.distributionByCategory}
                  xKey="label"
                  yKey="value"
                  showYAxisLabels={true}
                  //   showYAxis={true}
                  strokeColor="#3b82f6"
                  fillColor="#3b82f6"
                  label=" items"
                />
              )}
            </div>
          </div>

          {/* Items with Expiry Tracking */}
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
                "Items with Expiry Tracking"
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
                  data={chartsData?.itemsWithExpiryBatch
                    ?.map((item, index) => {
                      return [
                        {
                          label: "Items With Expiry",
                          value: item.itemsWithExpiryBatch,
                        },
                        {
                          label: "Items Without Control",
                          value: item.itemsWithoutControl,
                        },
                      ];
                    })
                    .flat()}
                  //   xKey="label"
                  labelKey="label"
                  valueKey="value"
                  showYAxis={true}
                  strokeColor="#10b981"
                  fillColor="#10b981"
                  //   yKey="value"
                  //   showYAxisLabels={true}
                  //   showYAxis={true}
                  //   strokeColor="#3b82f6"
                  //   fillColor="#3b82f6"
                  //   label=" items"
                />
              )}
            </div>
          </div>

          {/* New Items Over Time */}
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
                "New Items Over Time"
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
                <SimpleAreaChartGradient
                  data={chartsData?.newItemsOverTime}
                  //   xKey="label"

                  xKey="label"
                  yKey="value"
                  showYAxis={true}
                  label=" item(s) added"
                  strokeColor="#10b981"
                  fillColor="#10b981"
                  //   yKey="value"
                  //   showYAxisLabels={true}
                  //   showYAxis={true}
                  //   strokeColor="#3b82f6"
                  //   fillColor="#3b82f6"
                  //   label=" items"
                />
              )}
            </div>
          </div>

          {/* Top Brands by Item Count */}
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
                "Top Brands by Item Count"
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
                  data={chartsData?.topBrandsByItemCount}
                  //   xKey="label"

                  xKey="label"
                  yKey="value"
                  showYAxisLabels={true}
                  //   showYAxis={true}
                  label=" item(s)"
                  strokeColor="#10b981"
                  fillColor="#10b981"
                  //   yKey="value"
                  //   showYAxisLabels={true}
                  //   showYAxis={true}
                  //   strokeColor="#3b82f6"
                  //   fillColor="#3b82f6"
                  //   label=" items"
                />
              )}
            </div>
          </div>

          <div
            className="data-table"
            style={{ gridArea: "4 / 1/ span 1 / span 4" }}
          >
            <div className="data-table-header">
              <div className="data-table-title">Suspected Duplicate Items</div>
              <input
                type="text"
                placeholder="Search By Name"
                className="data-table-search"
                style={{ width: "340px" }}
              />
            </div>
            <div className="flex-1">
              <GenericDataTable<ITableSuspectedDuplicateItemsApiResponse>
                // apiQueryParams={buildFiltersQueryParams(filters)}
                token={token}
                moduleName="ItemsCatalogueAnalytics"
                urlExtension="sus-dup-items"
                columns={suspectedDuplicateItemsColumns}
              />
            </div>
          </div>

          <div
            className="data-table"
            style={{ gridArea: "3 / 3/ span 1 / span 2" }}
          >
            <div className="data-table-header">
              <div className="data-table-title">Missing Important Fields</div>
              <input
                type="text"
                placeholder="Search By Name"
                className="data-table-search"
                style={{ width: "340px" }}
              />
            </div>
            <div className="flex-1">
              <GenericDataTable<ITableMissingImportantFieldsApiResponse>
                // apiQueryParams={buildFiltersQueryParams(filters)}
                token={token}
                moduleName="ItemsCatalogueAnalytics"
                urlExtension="missing-imp-fields"
                columns={missingImportantFieldsColumns}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemsCatalogueDashboard;
