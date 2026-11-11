import {
  Box,
  Building,
  CircleDot,
  Info,
  Percent,
  Receipt,
  RefreshCcw,
  ShoppingBasket,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import DateFilterDropdown from "./components/reusables/DateFilterDropdownComponent";
import GenericApiFilter from "./components/reusables/sales/GenericApiFilter";
import { useToken } from "./hooks/useToken";
import StaticDataFilter from "./components/reusables/sales/StaticFilterDropdown";
import { description } from "./components/ui/charts/BarChartComponent";
import { formatKpiValue, type KpiApiResponse } from "./lib/response/IKpiResponse";
import { useEffect, useState } from "react";
import { createApiClient } from "./lib/api";
import { percentChangeFormat } from "./lib/PercentChangeFormat";
import { useCorpSalesChartsData } from "./components/reusables/corp-sales/charts/useCorpSalesChartsData";
import { StackedAreaChart } from "./components/ui/charts/SimpleStackedAreaChartGradient";
import { SimpleAreaChartGradient } from "./components/ui/charts/SimpleAreaChartGradient";
import { SimpleBarChart } from "./components/ui/charts/SimpleBarChart";
import { SimplePieChart } from "./components/ui/charts/SimplePieChartComponent";
// import { ITableCorpInvoiceAging } from "./components/reusables/corp-sales/tables/corpSalesTable.types";
import { GenericDataTable } from "./components/reusables/tables/GenericDataTable";
import {
  corpInvoiceAgingColumns,
  corpClaimedInvoiceStatusColumns,
} from "./components/reusables/corp-sales/tables/corpSalesTable.columns";
import type {
  ITableCorpClaimedInvoicesApiResponse,
  ITableCorpInvoiceAging,
  ITableCorpInvoiceAgingApiResponse,
} from "./components/reusables/corp-sales/tables/corpSalesTable.types";
import {
  buildFiltersQueryParams,
  type ICorpSalesApiParams,
} from "./components/reusables/corp-sales/apiParams";
import {
  DEFAULT_DATE_FILTER,
  type EDateFilter,
} from "./components/reusables/DateFilterTypes";

function CorpSalesDashboard() {
  const token = useToken();

  const [filters, setFilters] = useState<ICorpSalesApiParams>({
    DateFilter: DEFAULT_DATE_FILTER,
  });

  const [kpiData, setkpiData] = useState<KpiApiResponse>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedDateFilter, setSelectedDateFilter] = useState<EDateFilter>(
    DEFAULT_DATE_FILTER
  );

  // Generic handler for any filter change
  const handleFilterChange = (
    filterKey: keyof ICorpSalesApiParams,
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
  } = useCorpSalesChartsData(token, {
    queryParams: buildFiltersQueryParams(filters),
    enableLogging: true,
    autoFetch: false,
    refetchOnTokenChange: false,
  });

  // trigger a refetch when filters change
  useEffect(() => {
    if (token && filters) {
      const _queryParams = buildFiltersQueryParams(filters);
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
    const queryParams = buildFiltersQueryParams(filters);

    api
      .get<KpiApiResponse>("/CorpSalesAnalytics/kpi", {
        params: queryParams,
      })
      .then((res) => {
        setkpiData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [
    token,
    filters,
    // filters,
    // selectedDateFilter,
    // selectedBranch,
    // selectedRegion,
    // selectedGender,
    // ageRange,
  ]);

  if (!token) {
    return <div className="p-4 text-red-500">No token provided.</div>;
  }

  return (
    <div className="dashboard-container">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span className="muted text-sm">Dashboards</span>
        <span className=" text-sm"> &gt; Corporate Sales</span>
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

          {/* Branch Filter */}
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

          {/* Payment Status */}
          <StaticDataFilter
            // token={token}
            allowClear={true}
            shouldFilter={true}
            data={[
              { value: "0", label: "All" },
              { value: "90", label: "Paid" },
              { value: "15", label: "Partially Paid" },
              { value: "15", label: "Unpaid" },
            ]}
            // endpoint="/sa/branch"
            // dataPointsKey="branches"
            placeholder="Payment Status"
            searchPlaceholder="Search payment status..."
            icon={Info}
            allOptionLabel="All Payment Status"
            allOptionDescription="View data for all payment status"
            onValueChange={(value) =>
              handleFilterChange("PaymentStatus", value)
            }
          />

          {/* Corporate Customer */}
          <GenericApiFilter
            token={token}
            allowClear={true}
            shouldFilter={false}
            endpoint="stakeholders/corp-customer/search"
            dataPointsKey="dataPoints"
            placeholder="customer"
            searchPlaceholder="Search customers..."
            icon={Building}
            allOptionLabel="All Corporate Customers"
            allOptionDescription="View data for all corporate customers"
            // Custom search parameters for branch API
            // queryParams={{
            //   searchColumn: "branchName",
            // }}
            // // Override the default search param name
            // searchParam="searchValue"
            onError={(error, context) => {
              console.error(`Error fetching branches (${context}):`, error);
            }}
            onValueChange={(value) =>
              handleFilterChange("CorpCustomerCode", value)
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
                  <div className="info-card-label">{kpiData[0].title}</div>
                </div>
                <div className="info-card-value">
                  {formatKpiValue(kpiData[0].value)}
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
          {/* Invoices Issued Over Time Chart */}
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
                "Invoices Issued Over Time"
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
                  data={chartsData?.invoicesIssuedOverTime}
                  xKey="label"
                  yKey="value"
                  showYAxis={true}
                  strokeColor="#3b82f6"
                  fillColor="#3b82f6"
                  label=" invoices"
                />
              )}
            </div>
          </div>
          {/* Top Customers by Sales Volume Chart */}
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
                "Top Customers By Sales Volume"
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
                  data={chartsData?.topCustomersBySalesVolume}
                  xKey="label"
                  yKey="value"
                  showYAxis={true}
                  strokeColor="#10b981"
                  fillColor="#10b981"
                  label=" EGP"
                />
              )}
            </div>
          </div>

          {/* Customers Contribution */}
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
                "Top Customers By Sales Volume"
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
                  data={chartsData?.corporateCustomersContribution}
                  // xKey="label"
                  // yKey="value"
                  labelKey="label"
                  valueKey="value"
                  showYAxis={true}
                  strokeColor="#10b981"
                  fillColor="#10b981"

                  // labelKey="netSalesValue"
                  // label=" EGP"
                />
              )}
            </div>
          </div>

          {/* Customer Average Payment Delay */}
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
                "Customer Average Payment Delay"
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
                  data={chartsData?.averagePaymentDelayByCustomerDays}
                  xKey="label"
                  yKey="value"
                  showYAxis={true}
                  strokeColor="var(--chart-1)"
                  fillColor="var(--chart-1)"
                  label="Days"
                />
              )}
            </div>
          </div>

          {/* Payment Method Breakdown */}
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
                "Payment Method Breakdown"
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
                  data={chartsData?.paymentMethodDistribution}
                  labelKey="label"
                  valueKey="percentage"
                  showYAxis={true}
                  strokeColor="#10b981"
                  fillColor="#10b981"
                  // label="Days"
                />
              )}
            </div>
          </div>

          {/* Invoice Size Distribution */}
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
                "Invoice Size Distribution"
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
                  data={chartsData?.invoiceSizeDistribution}
                  xKey="label"
                  yKey="value"
                  // labelKey="label"
                  // valueKey="value"
                  showYAxisLabels={true}
                  metadata={{
                    show: true,
                    columns: [
                      {
                        key: "percentageOfTotalInvoices",
                        label: "% of Invoices",
                        formatter: (value) => `${Number(value).toFixed(1)}%`,
                      },
                      {
                        key: "minValue",
                        label: "Min Value",
                        formatter: (value) => `EGP${Number(value).toFixed(2)}`,
                      },
                      {
                        key: "maxValue",
                        label: "Max Value",
                        formatter: (value) => `EGP${Number(value).toFixed(2)}`,
                      },
                      {
                        key: "avgValue",
                        label: "Avg Value",
                        formatter: (value) => `EGP${Number(value).toFixed(2)}`,
                      },
                      {
                        key: "totalValue",
                        label: "Total Sales",
                        formatter: (value) =>
                          `EGP${Number(value).toLocaleString()}`,
                      },
                      {
                        key: "percentageOfTotalValue",
                        label: "% of Total Sales",
                        formatter: (value) => `${Number(value).toFixed(1)}%`,
                      },
                    ],
                  }}
                  // showYAxis={true}
                  strokeColor="#10b981"
                  fillColor="#10b981"
                  label=" invoices"
                />
              )}
            </div>
          </div>

          {/* Invoice Payment Status Distribution */}
          <div
            className="chart-card"
            style={{
              gridArea: "4 / 1 / span 1 / span 2",
            }}
          >
            <div className="chart-title">
              {chartsLoading ? (
                <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
              ) : (
                "Invoice Payment Status Breakdown"
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
                  data={chartsData?.paymentStatusSplit}
                  xKey="label"
                  yKey="value"
                  // labelKey="label"
                  // valueKey="value"
                  showYAxisLabels={true}
                  // showYAxis={true}
                  strokeColor="#3b82f6"
                  fillColor="#3b82f6"
                  label=" invoices"
                />
              )}
            </div>
          </div>
          {/* Seasonal Payment Patterns */}
          <div
            className="chart-card"
            style={{
              gridArea: "4 / 3 / span 1 / span 2",
            }}
          >
            <div className="chart-title">
              {chartsLoading ? (
                <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
              ) : (
                "Seasonal Payment Patterns (prev year)"
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
                  data={chartsData?.seasonalPaymentPatterns}
                  xKey="label"
                  yKey="value"
                  metadata={{
                    show: true,
                    columns: [
                      {
                        key: "avgPaymentDays",
                        label: "Average Payment Days",
                        formatter: (value) => `${Number(value).toFixed(1)}`,
                      },
                      {
                        key: "maxPaymentDays",
                        label: "Maximum Payment Days",
                        formatter: (value) => `${Number(value).toFixed(1)}`,
                      },
                      {
                        key: "avgPaymentAmount",
                        label: "Average Payment Value",
                        formatter: (value) => `${Number(value).toFixed(1)}`,
                      },
                    ],
                  }}
                  // labelKey="label"
                  // valueKey="value"
                  showYAxisLabels={true}
                  // showYAxis={true}
                  strokeColor="#10b981"
                  fillColor="#10b981"
                  label=" invoices"
                />
              )}
            </div>
          </div>

          {/* Returned Invoices Over Time */}
          <div
            className="chart-card"
            style={{
              gridArea: "5 / 1 / span 1 / span 2",
            }}
          >
            <div className="chart-title">
              {chartsLoading ? (
                <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
              ) : (
                "Returned Invoices Over Time"
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
                  data={chartsData?.returnInvoicesOverTime}
                  xKey="label"
                  yKey="value"
                  // labelKey="label"
                  // valueKey="value"
                  showYAxisLabels={true}
                  // showYAxis={true}
                  // strokeColor="#10b981"
                  // fillColor="#10b981"
                  label=" invoices"
                />
              )}
            </div>
          </div>

          <div
            className="data-table"
            style={{ gridArea: "6 / 1/ span 1 / span 4" }}
          >
            <div className="data-table-header">
              <div className="data-table-title">Invoice Aging Analysis</div>
              <input
                type="text"
                placeholder="Search By Name"
                className="data-table-search"
                style={{ width: "340px" }}
              />
            </div>
            <div className="flex-1">
              <GenericDataTable<ITableCorpInvoiceAgingApiResponse>
                apiQueryParams={buildFiltersQueryParams(filters)}
                token={token}
                moduleName="CorpSalesAnalytics"
                urlExtension="invoice-aging"
                columns={corpInvoiceAgingColumns}
              />
            </div>
          </div>

          <div
            className="data-table"
            style={{ gridArea: "7 / 1/ span 1 / span 4" }}
          >
            <div className="data-table-header">
              <div className="data-table-title">
                Claimed Invoices Payment Status
              </div>
              <input
                type="text"
                placeholder="Search By Name"
                className="data-table-search"
                style={{ width: "340px" }}
              />
            </div>
            <div className="flex-1">
              <GenericDataTable<ITableCorpClaimedInvoicesApiResponse>
                apiQueryParams={buildFiltersQueryParams(filters)}
                token={token}
                moduleName="CorpSalesAnalytics"
                urlExtension="claimed-invoices-status"
                columns={corpClaimedInvoiceStatusColumns}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CorpSalesDashboard;
