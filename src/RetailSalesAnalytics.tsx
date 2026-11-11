import { useEffect, useState } from "react";
import { useToken } from "./hooks/useToken";
// import { TooltipTrigger, TooltipContent } from "@radix-ui/react-tooltip";
import {
  Activity,
  UserPlus,
  Repeat,
  Sparkles,
  CircleAlert,
  RotateCcwSquareIcon,
  BookOpen,
  Info,
  Building,
  GitBranch,
  PersonStanding,
  User,
  Truck,
  Box,
  TrendingUp,
  ReceiptIcon,
  RefreshCcw,
  Receipt,
  Percent,
  Ticket,
  ShoppingBasket,
  TrendingDown,
  SparklesIcon,
  LucideCreditCard,
  BadgeDollarSign,
  DollarSign,
  Wallet,
  CircleDot,
  Wallet2,
  Trees,
} from "lucide-react";
// import { Tooltip } from "recharts";
import AgeRangeInput from "./components/reusables/AgeRangeInput";
import BranchFilterDropdown from "./components/reusables/BranchFilterDropdown";
import DateFilterDropdown from "./components/reusables/DateFilterDropdownComponent";
import GenderFilterDropdown from "./components/reusables/GenderFilterDropdown";
import RegionFilterDropdown from "./components/reusables/RegionFilterDropdown";
import { ChurnCustomersTable } from "./components/reusables/tables/churn-customers/ChurnCustomersTable";
import { GenericDataTable } from "./components/reusables/tables/GenericDataTable";
import { HighRefundCustomersTable } from "./components/reusables/tables/high-refund-customers/HighRefundCustomersTable";
import {
  type IItemPairApiResponse,
  itemPairsColumns,
} from "./components/reusables/tables/item-pairs/ItemPairsColumns";
import {
  type IPopularItemApiResponse,
  popularItemsColumns,
} from "./components/reusables/tables/popular-items/PopularItemsColumns";
import {
  type ITopCustomerApiResponse,
  topCustomersColumns,
} from "./components/reusables/tables/top-customers/TopCustomersColumns";
import { ChartAreaGradient } from "./components/ui/charts/ChartAreaGradient";
import { CustomerCohortAnalysis } from "./components/ui/charts/CustomerCohortAnalysis";
import { HorizontalBarChartComponent } from "./components/ui/charts/HorizontalBarChartComponent";
import { PieChartComponent } from "./components/ui/charts/PieChartComponent";
// import type { buildFiltersQueryParams } from "./lib/FilterUtilities";
import { percentChangeFormat } from "./lib/PercentChangeFormat";
import BranchFilter from "./components/reusables/sales/BranchFilter";
import ItemGroupFilter from "./components/reusables/sales/ItemGroupFilter";
import AltItemGroupFilter, {
  type ItemGroupOption,
} from "./components/reusables/sales/AltItemGroupFilter";
import GenericApiFilter from "./components/reusables/sales/GenericApiFilter";
import {
  formatKpiValue,
  type KpiApiResponse,
} from "./lib/response/IKpiResponse";
import { createApiClient } from "./lib/api";
// import type { ChartsApiResponse } from "./lib/response/IChartsResponse";
import { useChartsData } from "./components/reusables/sales/charts/useChartsData.hook";
import { SimpleBarChart } from "./components/ui/charts/SimpleBarChart";
import { SimpleAreaChartGradient } from "./components/ui/charts/SimpleAreaChartGradient";
import { StackedAreaChart } from "./components/ui/charts/SimpleStackedAreaChartGradient";
// import { useChartsData } from "./components/reusables/sales/charts/SalesChartResponse";
// import { PromotionLinkedSales, HourlySalesHeatmap, TopReturnedItems } from './components/reusables/sales/charts/SalesChart.types';
import { SimplePieChart } from "./components/ui/charts/SimplePieChartComponent";
import { SalesHeatmap } from "./components/reusables/sales/charts/SalesHeatmap";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "./components/ui/tooltip";
import type {
  IItemsInTodaysPromotionsApiResponse,
  IMarketingCampaignsApiResponse,
  ITableTopSalesmen,
  ITopSalesmenApiResponse,
} from "./components/reusables/sales/tables/salesTable.types";
import {
  itemsInTodaysPromoColumns,
  marketingCampaignsColumns,
  topSalesmenColumns,
} from "./components/reusables/sales/tables/salesTable.columns";
import {
  buildFiltersQueryParams,
  type ISalesApiParams,
} from "./components/reusables/sales/apiParams";
import {
  DEFAULT_DATE_FILTER,
  type EDateFilter,
} from "./components/reusables/DateFilterTypes";

function SalesDashboard() {
  //   useEffect(() => {
  //     if (!token) return;

  //     const api = createApiClient(token);

  //     api
  //       .get<CustomerCohortAnalysisChartApiResponse[]>(
  //         "/CustomerAnalytics/customer-cohort-retention/charts"
  //       )
  //       .then((res) => {
  //         setCohortData(res.data);
  //         setCohortLoading(false);
  //       })
  //       .catch((err) => {
  //         setCohortError(err.message);
  //         setCohortLoading(false);
  //       });
  //   }, [token]);

  const token = useToken();

  const [data, setData] = useState<KpiApiResponse>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedDateFilter, setSelectedDateFilter] = useState<EDateFilter>(
    DEFAULT_DATE_FILTER,
  );

  const [filters, setFilters] = useState<ISalesApiParams>({
    DateFilter: DEFAULT_DATE_FILTER,
  });

  // Generic handler for any filter change
  const handleFilterChange = (
    filterKey: keyof ISalesApiParams,
    value: number | string | undefined,
  ) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: value,
    }));
  };
  // const [chartsData, setChartsData] = useState<ChartsApiResponse>([]);
  // const [chartsLoading, setChartsLoading] = useState(true);
  // const [chartsError, setChartsError] = useState<string | null>(null);

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
    const queryParams = buildFiltersQueryParams(filters);

    api
      .get<KpiApiResponse>("/RetailSalesAnalytics/kpi", {
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
  }, [
    token,
    filters,
    // selectedDateFilter,
    // selectedBranch,
    // selectedRegion,
    // selectedGender,
    // ageRange,
  ]);

  // trigger a refetch when filters change
  useEffect(() => {
    if (token && filters) {
      const _queryParams = buildFiltersQueryParams(filters);
      refetch(_queryParams);
    }
  }, [token, filters]);

  // Use the custom hook with configuration
  const {
    chartsData,
    rawData,
    loading: chartsLoading,
    error: chartsError,
    refetch,
    reset,
  } = useChartsData(token, {
    queryParams: buildFiltersQueryParams(filters),
    enableLogging: true,
    autoFetch: false,
    refetchOnTokenChange: false,
  });

  // useEffect(() => {
  //   if (!token) return;

  //   const api = createApiClient(token);

  //   api
  //     .get<ChartsApiResponse>("/RetailSalesAnalytics/chart", {
  //       // params: queryParams,
  //     })
  //     .then((res) => {
  //       setChartsData(res.data);
  //       setChartsLoading(false);
  //     })
  //     .catch((err) => {
  //       setChartsError(err.message);
  //       setChartsLoading(false);
  //     });
  // }, [token]);

  if (!token) {
    return <div className="p-4 text-red-500">No token provided.</div>;
  }

  // if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="dashboard-container">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span className="muted">Dashboards</span>
        <span> &gt; Point of Sale</span>
      </div>

      {/* Filters Section */}
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

          {/* <BranchFilter token={token} /> */}
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
            onValueChange={(value) => handleFilterChange("Branchcode", value)}
          />
          {/* <ItemGroupFilter token={token} /> */}

          {/* <AltItemGroupFilter token={token}  /> */}

          <GenericApiFilter<ItemGroupOption>
            token={token}
            endpoint="/items/tree?level=1"
            placeholder="Item Group"
            searchPlaceholder="Search item groups..."
            icon={Trees} // Make sure to import Trees
            allOptionLabel="All Item Groups"
            allOptionDescription="View all item groups"
            onError={(error, context) => {
              console.error(`Error fetching Item Groups (${context}):`, error);
            }}
            onValueChange={(value) => handleFilterChange("ItemGroup", value)}
          />

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
            // Custom search parameters for branch API
            // queryParams={{
            //   searchColumn: "branchName",
            // }}
            // Override the default search param name
            // searchParam="searchValue"
            onError={(error, context) => {
              console.error(`Error fetching items (${context}):`, error);
            }}
            onValueChange={(value) => handleFilterChange("Itemcode", value)}
          />

          <GenericApiFilter
            token={token}
            endpoint="/basicdata/sales-channels/search"
            dataPointsKey="dataPoints"
            placeholder="Sales Channel"
            searchPlaceholder="Search Sales Channels..."
            icon={GitBranch}
            allOptionLabel="All Sales Channels"
            allOptionDescription="View data for all sales channels"
            // Custom search parameters for branch API
            // queryParams={{
            //   searchColumn: "branchName",
            // }}
            // Override the default search param name
            // searchParam="searchValue"
            onError={(error, context) => {
              console.error(`Error fetching items (${context}):`, error);
            }}
            onValueChange={(value) =>
              handleFilterChange("SalesChannelCode", value)
            }
          />

          <GenericApiFilter
            token={token}
            allowClear={true}
            shouldFilter={false}
            endpoint="/basicdata/salespersons/search"
            dataPointsKey="dataPoints"
            placeholder="Sales Rep"
            searchPlaceholder="Search Sales Reps..."
            icon={User}
            allOptionLabel="All Sales Reps"
            allOptionDescription="View data for all sales reps"
            // Custom search parameters for branch API
            // queryParams={{
            //   searchColumn: "branchName",
            // }}
            // Override the default search param name
            // searchParam="searchValue"
            onError={(error, context) => {
              console.error(`Error fetching sales reps (${context}):`, error);
            }}
            onValueChange={(value) => handleFilterChange("SalesRepCode", value)}
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
            onValueChange={(value) =>
              handleFilterChange("ItemSupplierCode", value)
            }
          />
        </div>
      </div>

      {/* KPI Cards Section */}
      <div className=" gap-1 flex flex-col">
        <h4 className="text-md font-medium">KPIs</h4>

        {loading ? (
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

            {/* Average Visits Card Skeleton */}
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

            {/* Churn Risk Card Skeleton */}
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

            {/* High Refund Card Skeleton */}
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

            {/* Registered Customers Card Skeleton */}
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
                  <div className="info-card-label">{data[0].title}</div>
                </div>
                <div className="info-card-value">
                  {formatKpiValue(data[0].value)}
                </div>
              </div>
              <div
                className={`info-card-change ${percentChangeFormat(
                  data[0].percentChange,
                )}`}
              >
                {data[0].percentChange}
              </div>
            </div>
            {data.map((item, index) => {
              if (index === 0 || index === 5 || index === 8) return null; // Skip the first item as it's already rendered
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
                        {index === 6 && <Percent className="h-4 w-4" />}
                        {index === 7 && <ShoppingBasket className="h-4 w-4" />}
                        {index === 9 && <TrendingDown className="h-4 w-4" />}
                      </div>
                      <div className="info-card-label">{item.title}</div>
                    </div>
                    <div className="info-card-value">
                      {formatKpiValue(item.value)}
                    </div>
                  </div>
                  <div
                    className={`info-card-change ${percentChangeFormat(
                      item.percentChange,
                    )}`}
                  >
                    {item.percentChange}
                  </div>
                </div>
              );
            })}

            <div className="info-card" style={{ width: "153px" }}>
              <div className="info-card-content">
                <div className="info-card-header">
                  <div className="info-card-icon">
                    <SparklesIcon className="h-4 w-4" />
                  </div>
                  <div className="info-card-label">{data[5].title}</div>
                </div>
                <div className="info-card-value">
                  {formatKpiValue(data[5].value.split(",")[0])}
                </div>
              </div>
              <div
                className={`info-card-change ${percentChangeFormat(
                  data[5]?.value?.split(",")[1],
                )}`}
              >
                {data[5]?.value?.split(",")[1]}
              </div>
            </div>
            <div className="info-card" style={{ width: "153px" }}>
              <div className="info-card-content">
                <div className="info-card-header">
                  <div className="info-card-icon">
                    <Wallet className="h-4 w-4" />
                  </div>
                  <div className="info-card-label">{data[8].title}</div>
                </div>
                <div className="info-card-value">
                  {formatKpiValue(data[8].value.split(",")[0])}
                </div>
              </div>
              <div
                className={`info-card-change ${percentChangeFormat(
                  data[8].value.split(",")[1],
                )}`}
              >
                {data[8].value.split(",")[1]}%
              </div>
            </div>

            {/* <div className="info-card" style={{ width: "153px" }}>
            <div className="info-card-content">
              <div className="info-card-header">
                <div className="info-card-icon">
                  <UserPlus className="h-4 w-4" />
                </div>
                <div className="info-card-label">{data[1].title}</div>
              </div>
              <div className="info-card-value">
                {formatKpiValue(data[1].value)}
              </div>
            </div>
            <div
              className={`info-card-change ${percentChangeFormat(
                data[1].percentChange
              )}`}
            >
              {data[1].percentChange}
            </div>
          </div>

          <div className="info-card" style={{ width: "153px" }}>
            <div className="info-card-content">
              <div className="info-card-header">
                <div className="info-card-icon">
                  <Repeat className="h-4 w-4" />
                </div>
                <div className="info-card-label">{data[2].title}</div>
              </div>
              <div className="info-card-value">
                {formatKpiValue(data[2].value)}
              </div>
            </div>
            <div
              className={`info-card-change ${percentChangeFormat(
                data[2].percentChange
              )}`}
            >
              {data[2].percentChange}
            </div>
          </div>

          <div className="info-card" style={{ width: "153px" }}>
            <div className="info-card-content">
              <div className="info-card-header">
                <div className="info-card-icon">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="info-card-label">{data[3].title}</div>
              </div>
              <div className="info-card-value">
                {formatKpiValue(data[3].value)}
              </div>
            </div>
            <div
              className={`info-card-change ${percentChangeFormat(
                data[3].percentChange
              )}`}
            >
              {data[3].percentChange}
            </div>
          </div>

          <div className="info-card" style={{ width: "153px" }}>
            <div className="info-card-content">
              <div className="info-card-header">
                <div className="info-card-icon">
                  <CircleAlert className="h-4 w-4" />
                </div>
                <div className="info-card-label">{data[4].title}</div>
              </div>
              <div className="info-card-value">
                {formatKpiValue(data[4].value)}
              </div>
            </div>
            <div
              className={`info-card-change ${percentChangeFormat(
                data[4].percentChange
              )}`}
            >
              {data[4].percentChange}
            </div>{" "}
          </div>

          <div className="info-card" style={{ width: "153px" }}>
            <div className="info-card-content">
              <div className="info-card-header">
                <div className="info-card-icon">
                  <RotateCcwSquareIcon className="h-4 w-4" />
                </div>
                <div className="info-card-label">{data[5].title}</div>
              </div>
              <div className="info-card-value">
                {formatKpiValue(data[5].value)}
              </div>
            </div>
            <div
              className={`info-card-change ${percentChangeFormat(
                data[5].percentChange
              )}`}
            >
              {data[5].percentChange}
            </div>
          </div> */}

            {/* <div className="info-card" style={{ width: "153px" }}>
            <div className="info-card-content">
              <div className="info-card-header">
                <div className="info-card-icon">
                  <BookOpen className="h-4 w-4" />
                </div>
                <div className="info-card-label">{data[6].title}</div>
              </div>
              <div className="info-card-value">
                {formatKpiValue(data[6].value)}
              </div>
            </div>
            <div
              className={`info-card-change ${percentChangeFormat(
                data[6].percentChange
              )}`}
            >
              {data[6].percentChange}
            </div>
          </div> */}
          </div>
        )}
      </div>

      <div className="gap-1 flex flex-col">
        {/* Use a friendly title */}
        <h4 className="text-md font-medium">Insights</h4>
        {/* Charts and Graphs Section */}
        <div className="charts-container">
          {/* Customer Visit Frequency Chart */}
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
                "Branch Sales Trend"
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
                // <SimpleBarChart
                //   data={chartsData?.branchSalesTrend}
                //   xKey="branchName"
                //   yKey="totalBranchSales"
                //   fillColor="#10b981"
                //   label="Sales"
                // />

                <StackedAreaChart
                  // data={
                  //   // Your data should look like:

                  // }
                  data={chartsData?.branchSalesTrend}
                  xKey="yearMonth"
                  yKey="totalBranchSales"
                  showYAxis={true}
                  stackKey="branchName"
                  // colors={["#10b981", "#3b82f6", "#f59e0b", "#ef4444"]}
                />
              )}
            </div>
          </div>

          {/* Customer Visit Frequency Chart */}
          <div
            className="chart-card"
            style={{ gridArea: "1 / 3/ span 1 / span 2" }}
          >
            <div className="chart-title">
              {chartsLoading ? (
                <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
              ) : (
                "Sales by Branch"
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
                  layout="vertical"
                  data={chartsData?.salesByBranch}
                  xKey="branchName"
                  yKey="netSales"
                  fillColor="#10b981"
                  label="Sales"
                  showYAxisLabels={true}
                />
              )}
            </div>
          </div>

          {/* Customer Visit Frequency Chart */}
          <div
            className="chart-card"
            style={{ gridArea: "2 / 1/ span 1 / span 2" }}
          >
            <div className="chart-title">
              {chartsLoading ? (
                <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
              ) : (
                "Most-Selling Items by Quantity"
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
                  layout="vertical"
                  data={chartsData?.topSellingItems}
                  xKey="itemName"
                  yKey="totalQuantitySold"
                  fillColor="#10b981"
                  label="Units Sold"
                  showYAxisLabels={true}
                />
              )}
            </div>
          </div>

          <div
            className="chart-card"
            style={{ gridArea: "2 / 3/ span 1 / span 2" }}
          >
            <div className="chart-title">
              {chartsLoading ? (
                <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
              ) : (
                "Refunds over time"
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
                <SimpleAreaChartGradient
                  // layout="vertical"
                  data={chartsData?.totalRefundValueTrend}
                  xKey="yearMonth"
                  yKey="totalRefundValue"
                  // showYAxis={true}
                  fillColor="#10b981"
                  label=" EGP"
                />
              )}
            </div>
          </div>

          <div
            className="chart-card"
            style={{ gridArea: "3 / 1/ span 1 / span 1" }}
          >
            <div className="chart-title">
              {chartsLoading ? (
                <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
              ) : (
                "Sales by Category"
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
                <SimplePieChart
                  // layout="vertical"
                  data={chartsData?.salesByCategory}
                  labelKey="categoryDescription"
                  valueKey="totalSalesValue"
                  showLegend={true}
                  // xKey="yearMonth"
                  // yKey="totalRefundValue"
                  // fillColor="#10b981"
                  // label="Value"
                />
              )}
            </div>
          </div>

          <div
            className="chart-card"
            style={{ gridArea: "3 / 2/ span 1 / span 1" }}
          >
            <div className="chart-title">
              {chartsLoading ? (
                <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
              ) : (
                "Sales by Branch"
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
                <SimplePieChart
                  // layout="vertical"
                  data={chartsData?.salesByBranch}
                  labelKey="branchName"
                  valueKey="netSales"
                  showLegend={true}

                  // xKey="yearMonth"
                  // yKey="totalRefundValue"
                  // fillColor="#10b981"
                  // label="Value"
                />
              )}
            </div>
          </div>

          <div
            className="chart-card"
            style={{ gridArea: "6/ 1 / span 1 / span 2" }}
          >
            <div className="chart-title">
              {chartsLoading ? (
                <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
              ) : (
                "Promotion-linked Sales"
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
                <SimpleAreaChartGradient
                  // layout="vertical"
                  data={chartsData?.promotionLinkedSales}
                  xKey="yearMonth"
                  yKey="netSalesValue"
                  label=" EGP"
                  fillColor="#60f0c9"
                  // fillColor="#10b981"
                  // label="Value"
                />
              )}
            </div>
          </div>

          <div
            className="chart-card"
            style={{ gridArea: "4 / 1/ span 1 / span 2" }}
          >
            <div className="chart-title">
              {chartsLoading ? (
                <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
              ) : (
                "Manual Discounts Over Time"
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
                <SimpleAreaChartGradient
                  // layout="vertical"
                  data={chartsData?.manualDiscountsOvertime}
                  xKey="yearMonth"
                  yKey="totalDiscountValue"
                  label=" EGP"
                  // fillColor="#10b981"
                  // label="Value"
                />
              )}
            </div>
          </div>

          {/* Customer Cohort Analysis */}
          <div
            className="chart-card"
            style={{ gridArea: "5 / 1 / span 1 / span 3" }}
          >
            <div className="chart-title flex flex-row justify-between">
              Hourly Sales Transactions Heatmap
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 ml-2 inline-block" />
                </TooltipTrigger>
                <TooltipContent>
                  <div>
                    <Sparkles className="h-4 w-4" />
                    <p>
                      Helps identify peak sales periods and
                      <br /> optimize staffing and promotions accordingly.
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="flex-1">
              <SalesHeatmap data={chartsData?.hourlySalesHeatmap} />
            </div>
          </div>

          <div
            className="chart-card"
            style={{ gridArea: "3 / 3/ span 1 / span 2" }}
          >
            <div className="chart-title">
              {chartsLoading ? (
                <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
              ) : (
                "Most Refunded Items"
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
                  layout="inverted-vertical"
                  data={chartsData?.topReturnedItems}
                  xKey="itemName"
                  yKey="returnFrequency"
                  label="Times refunded"
                  fillColor="#F06086"
                  showYAxisLabels={true}

                  // fillColor="#10b981"
                  // label="Value"
                />
              )}
            </div>
          </div>

          <div
            className="chart-card"
            style={{ gridArea: "6/ 3 / span 1 / span 2" }}
          >
            <div className="chart-title">
              {chartsLoading ? (
                <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
              ) : (
                "Favourite Brands"
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
                  layout="horizontal"
                  data={chartsData?.topBrands}
                  xKey="brandName"
                  yKey="netQuantitySold"
                  label="Total Quantity Sold"
                  fillColor="#10b981"
                  showYAxisLabels={true}
                  // fillColor="#10b981"
                  // label="Value"
                />
              )}
            </div>
          </div>

          <div
            className="chart-card"
            style={{ gridArea: "7 / 1/ span 1 / span 2" }}
          >
            <div className="chart-title">
              {chartsLoading ? (
                <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
              ) : (
                "Marketing Campaign Sales Volume"
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
                  layout="vertical"
                  data={chartsData?.marketingCampaignSalesVolume}
                  xKey="campaignName"
                  yKey="netSalesValue"
                  label=" EGP"
                  fillColor="#10b981"
                  showYAxisLabels={true}
                  // fillColor="#10b981"
                  // label="Value"
                />
              )}
            </div>
          </div>

          <div
            className="chart-card"
            style={{ gridArea: "8 / 4/ span 1 / span 1" }}
          >
            <div className="chart-title">
              {chartsLoading ? (
                <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
              ) : (
                "Sales by Customer Type"
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
                <SimplePieChart
                  // layout="vertical"
                  showLegend={true}
                  data={chartsData?.salesByCustomerType}
                  labelKey="customerTypeDescription"
                  valueKey="netSalesValue"
                  // valueKey=""
                  label=" EGP"
                  fillColor="#10b981"
                  showYAxisLabels={true}
                  // fillColor="#10b981"
                  // label="Value"
                />
              )}
            </div>
          </div>

          {/* Top Salesmen Table */}
          <div
            className="data-table"
            style={{ gridArea: "4 / 3/ span 1 / span 2" }}
          >
            <div className="data-table-header">
              <div className="data-table-title">Top Sales Persons</div>
              <input
                type="text"
                placeholder="Search By Name"
                className="data-table-search"
                style={{ width: "340px" }}
              />
            </div>
            <div className="flex-1">
              <GenericDataTable<ITopSalesmenApiResponse>
                apiQueryParams={buildFiltersQueryParams(filters)}
                token={token}
                moduleName="RetailSalesAnalytics"
                urlExtension="top-salesmen"
                columns={topSalesmenColumns}
              />
            </div>
          </div>

          {/* Items in Today's Promos */}
          <div
            className="data-table"
            style={{ gridArea: "7/ 3 / span 1 / span 2" }}
          >
            <div className="data-table-header">
              <div className="data-table-title">
                Items in Today's Marketing Campaigns
              </div>
              {/* <input
              type="text"
              placeholder="Search By Name"
              className="data-table-search"
              style={{ width: "340px" }}
            /> */}
            </div>
            <div className="flex-1">
              <GenericDataTable<IItemsInTodaysPromotionsApiResponse>
                token={token}
                moduleName="RetailSalesAnalytics"
                urlExtension="items-in-todays-promotions"
                columns={itemsInTodaysPromoColumns}
              />
            </div>
          </div>

          {/* Marketing Campaigns */}
          <div
            className="data-table"
            style={{ gridArea: "8/ 1 / span 1 / span 3" }}
          >
            <div className="data-table-header">
              <div className="data-table-title">Marketing Campaigns</div>
              {/* <input
              type="text"
              placeholder="Search By Name"
              className="data-table-search"
              style={{ width: "340px" }}
            /> */}
            </div>
            <div className="flex-1">
              <GenericDataTable<IMarketingCampaignsApiResponse>
                token={token}
                moduleName="RetailSalesAnalytics"
                urlExtension="all-marketing-campaigns"
                columns={marketingCampaignsColumns}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SalesDashboard;
