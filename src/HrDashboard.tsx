import { useEffect, useMemo, useState } from "react";
import { useToken } from "./hooks/useToken";
import { formatKpiValue, type KpiApiResponse } from "./lib/response/IKpiResponse";
import { createApiClient } from "./lib/api";
import {
  Box,
  Building,
  CircleDot,
  Receipt,
  RefreshCcw,
  TrendingUp,
} from "lucide-react";
import { percentChangeFormat } from "./lib/PercentChangeFormat";
import { useHrDashboardChartsData } from "./components/reusables/hr/Usehrdashboardchartsdata.hook";
import { SimpleBarChart } from "./components/ui/charts/SimpleBarChart";
import { StackedBarChart } from "./components/ui/charts/StackedBarChart";
import { StackedAreaChart } from "./components/ui/charts/SimpleStackedAreaChartGradient";
import { SimpleAreaChartGradient } from "./components/ui/charts/SimpleAreaChartGradient";
import { SimplePieChart } from "./components/ui/charts/SimplePieChartComponent";
import { GenericDataTable } from "./components/reusables/tables/GenericDataTable";
import { contractsEndingSoonColumns } from "./components/reusables/hr/tables/Hrdashboardtable.columns";
import type {
  ITableContractsEndingSoonApiResponse,
  ITableEmployeesWithHighAbsenteeismApiResponse,
  ITablePendingLeaveRequests,
  ITablePendingLeaveRequestsApiResponse,
} from "./components/reusables/hr/tables/Hrdashboardtables.types";
import {
  employeesWithHighAbsenteeismColumns,
  pendingLeaveRequestsColumns,
} from "./components/reusables/hr/tables/Hrdashboardtable.columns";
import {
  buildHrDashboardFiltersQueryParams,
  type IHrDashboardApiParams,
} from "./components/reusables/hr/apiParams";
import {
  DEFAULT_DATE_FILTER,
  type EDateFilter,
} from "./components/reusables/DateFilterTypes";
import DateFilterDropdown from "./components/reusables/DateFilterDropdownComponent";
import GenericApiFilter from "./components/reusables/sales/GenericApiFilter";
import {
  groupAverageTenureByDepartment,
  groupHeadcountByBranchDepartment,
} from "./components/reusables/hr/Hrdashboardchartprocessor";

function HrDashboard() {
  const token = useToken();

  const [kpiData, setkpiData] = useState<KpiApiResponse>([]);
  const [kpiLoading, setkpiLoading] = useState(true);

  const [filters, setFilters] = useState<IHrDashboardApiParams>({
    DateFilter: DEFAULT_DATE_FILTER,
  });
  const [selectedDateFilter, setSelectedDateFilter] =
    useState<EDateFilter>(DEFAULT_DATE_FILTER);

  // Generic handler for any filter change
  const handleFilterChange = (
    filterKey: keyof IHrDashboardApiParams,
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
  } = useHrDashboardChartsData(token, {
    enableLogging: true,
    autoFetch: true,
    refetchOnTokenChange: true,
  });

  const headcountByBranchDepartment = useMemo(
    () =>
      groupHeadcountByBranchDepartment(
        chartsData?.HeadcountByBranchDepartment || []
      ),
    [chartsData?.HeadcountByBranchDepartment]
  );

  const averageTenureByDepartment = useMemo(
    () =>
      groupAverageTenureByDepartment(
        chartsData?.AverageTenureByDepartment || []
      ),
    [chartsData?.AverageTenureByDepartment]
  );

  // trigger a refetch when filters change
  useEffect(() => {
    if (filters) {
      const _queryParams = buildHrDashboardFiltersQueryParams(filters);
      refetch(_queryParams);
    }
  }, [filters]);

  useEffect(() => {
    if (!token) return;

    const api = createApiClient(token);

    const queryParams = buildHrDashboardFiltersQueryParams(filters);

    api
      .get<KpiApiResponse>("/hr/hranalytics/kpi", {
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

  if (!token) {
    return <div className="p-4 text-red-500">No token provided.</div>;
  }

  //   return <div>HR Dashboard Coming Soon!</div>;

  return (
    <div className="dashboard-container">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span className="muted text-sm">Dashboards</span>
        <span className=" text-sm"> &gt; HR</span>
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

          {/* Status */}
          <GenericApiFilter
            token={token}
            allowClear={true}
            shouldFilter={false}
            debounceDelay={500}
            endpoint="/basicdata/search?SerialNo=1254"
            dataPointsKey="dataPoints"
            placeholder="status"
            searchPlaceholder="Search status..."
            icon={Building}
            allOptionLabel="All Status"
            allOptionDescription="View data for all status"
            // Custom search parameters for branch API
            // queryParams={{
            //   searchColumn: "branchName",
            // }}
            // Override the default search param name
            searchParam="searchTerm"
            onError={(error, context) => {
              console.error(`Error fetching status (${context}):`, error);
            }}
            onValueChange={(value) =>
              handleFilterChange("EmployeeStatus", value)
            }
          />

          {/* Status */}
          <GenericApiFilter
            token={token}
            allowClear={true}
            shouldFilter={false}
            debounceDelay={500}
            endpoint="/basicdata/search?SerialNo=1250"
            dataPointsKey="dataPoints"
            placeholder="Employee Type"
            searchPlaceholder="Search Employee Type..."
            icon={Building}
            allOptionLabel="All Types"
            allOptionDescription="View data for all employee types"
            // Custom search parameters for branch API
            // queryParams={{
            //   searchColumn: "branchName",
            // }}
            // Override the default search param name
            searchParam="searchTerm"
            onError={(error, context) => {
              console.error(`Error fetching status (${context}):`, error);
            }}
            onValueChange={(value) => handleFilterChange("EmployeeType", value)}
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
          {/* Headcount by Branch and Department */}
          <div
            className="chart-card"
            style={{ gridArea: "1 / 1/ span 1 / span 2" }}
          >
            <div className="chart-title">
              {chartsLoading ? (
                <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
              ) : (
                "Headcount by Branch and Department"
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
                <StackedBarChart
                  data={headcountByBranchDepartment.data}
                  xKey="branch_Name"
                  series={headcountByBranchDepartment.series}
                  showYAxisLabels={true}
                />
              )}
            </div>
          </div>

          {/* Hiring & Attrition Trend */}
          <div
            className="chart-card"
            style={{ gridArea: "1 / 3/ span 1 / span 2" }}
          >
            <div className="chart-title">
              {chartsLoading ? (
                <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
              ) : (
                "Hiring & Attrition Trend"
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
                  data={chartsData?.HiringAttritionTrend}
                  xKey="month_period"
                  yKey="new_hires"
                  showYAxis={true}

                  // yKey="count"
                />

                // <SimpleBarChart
                //   data={chartsData?.HeadcountByBranchDepartment}
                //   xKey="Branch_Name"
                //   yKey="Headcount"
                //   showYAxis={true}
                //   showYAxisLabels={true}
                //   strokeColor="#3b82f6"
                //   fillColor="#3b82f6"
                //   //   label=" "
                // />
              )}
            </div>
          </div>

          {/* Top Leaves Taken */}
          <div
            className="chart-card"
            style={{ gridArea: "2 / 1/ span 1 / span 1" }}
          >
            <div className="chart-title">
              {chartsLoading ? (
                <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
              ) : (
                "Top Leaves Taken"
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
                  data={chartsData?.TopLeaveTypes}
                  labelKey="leave_Type"
                  valueKey="days_Count"
                />

                // <SimpleBarChart
                //   data={chartsData?.HeadcountByBranchDepartment}
                //   xKey="Branch_Name"
                //   yKey="Headcount"
                //   showYAxis={true}
                //   showYAxisLabels={true}
                //   strokeColor="#3b82f6"
                //   fillColor="#3b82f6"
                //   //   label=" "
                // />
              )}
            </div>
          </div>

          {/* Overtime by Branch */}
          <div
            className="chart-card"
            style={{ gridArea: "2 / 2/ span 1 / span 2" }}
          >
            <div className="chart-title">
              {chartsLoading ? (
                <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
              ) : (
                "Overtime by Branch"
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
                  data={chartsData?.OvertimeByBranch}
                  xKey="branch"
                  yKey="overtime_Hours"
                  showYAxis={true}
                  showYAxisLabels={true}
                  strokeColor="#3b82f6"
                  fillColor="#3b82f6"
                  //   label=" "
                />
              )}
            </div>
          </div>

          {/* Average Tenure By Department */}
          <div
            className="chart-card"
            style={{ gridArea: "3 / 1/ span 1 / span 2" }}
          >
            <div className="chart-title">
              {chartsLoading ? (
                <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
              ) : (
                "Average Tenure By Department"
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
                  data={averageTenureByDepartment}
                  xKey="departmentName"
                  yKey="averageTenureYears"
                  showYAxisLabels={true}
                  strokeColor="#3b82f6"
                  fillColor="#3b82f6"
                  metadata={{
                    show: true,
                    columns: [
                      {
                        key: "employeeCount",
                        label: "Employees",
                        formatter: (value) => Number(value).toLocaleString(),
                      },
                      {
                        key: "averageTenureMonths",
                        label: "Months",
                        formatter: (value) => Number(value).toFixed(1),
                      },
                    ],
                  }}
                  //   label=" "
                />
              )}
            </div>
          </div>

          {/* Average Tenure By Branch */}
          <div
            className="chart-card"
            style={{ gridArea: "3 / 3/ span 1 / span 2" }}
          >
            <div className="chart-title">
              {chartsLoading ? (
                <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
              ) : (
                "Average Tenure By Branch"
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
                  data={chartsData?.AverageTenureByBranch}
                  xKey="branch"
                  yKey="averageTenureYears"
                  showYAxis={true}
                  showYAxisLabels={true}
                  strokeColor="#3b82f6"
                  fillColor="#3b82f6"
                  //   label=" "
                />
              )}
            </div>
          </div>

          {/* Headcount Trend */}
          <div
            className="chart-card"
            style={{ gridArea: "4 / 1/ span 1 / span 2" }}
          >
            <div className="chart-title">
              {chartsLoading ? (
                <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
              ) : (
                "Headcount Trend"
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
                  data={chartsData?.HeadcountTrend}
                  xKey="yearMonth"
                  yKey="cumulativeHeadcount"
                  showYAxis={true}

                  // yKey="count"
                />

                // <SimpleBarChart
                //   data={chartsData?.HeadcountByBranchDepartment}
                //   xKey="Branch_Name"
                //   yKey="Headcount"
                //   showYAxis={true}
                //   showYAxisLabels={true}
                //   strokeColor="#3b82f6"
                //   fillColor="#3b82f6"
                //   //   label=" "
                // />
              )}
            </div>
          </div>

          {/* Payroll cost by branch */}
          <div
            className="chart-card"
            style={{ gridArea: "4 / 3/ span 1 / span 2" }}
          >
            <div className="chart-title">
              {chartsLoading ? (
                <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
              ) : (
                "Payroll Cost by Branch"
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
                  data={chartsData?.PayrollCostByBranchDepartment}
                  xKey="branchName"
                  yKey="totalPayrollCost"
                  showYAxis={true}
                  showYAxisLabels={true}
                  strokeColor="#3b82f6"
                  fillColor="#3b82f6"
                  //   label=" "
                />
              )}
            </div>
          </div>

          {/* Salary Distribution */}
          <div
            className="chart-card"
            style={{ gridArea: "5 / 1/ span 1 / span 2" }}
          >
            <div className="chart-title">
              {chartsLoading ? (
                <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
              ) : (
                "Salary Distribution"
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
                  data={chartsData?.SalaryDistribution}
                  xKey="salaryRange"
                  yKey="employeeCount"
                  showYAxis={true}
                  showYAxisLabels={true}
                  strokeColor="#3b82f6"
                  fillColor="#3b82f6"
                  //   label=" "
                />
              )}
            </div>
          </div>

          {/* Sick Leave Patterns */}
          <div
            className="chart-card"
            style={{ gridArea: "5 / 3/ span 1 / span 2" }}
          >
            <div className="chart-title">
              {chartsLoading ? (
                <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
              ) : (
                "Sick Leave Patterns"
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
                  data={chartsData?.SickLeavePatterns}
                  xKey="month"
                  yKey="sick_Days"
                  showYAxis={true}
                  showYAxisLabels={true}
                  strokeColor="#3b82f6"
                  fillColor="#3b82f6"
                  metadata={{
                    show: true,
                    columns: [
                      {
                        key: "Employees_Affected",
                        label: "Employees Affected",
                        formatter: (value) => `${Number(value).toFixed(1)}`,
                      },
                    ],
                  }}
                  //   label=" "
                />

                // <SimpleBarChart
                //   data={chartsData?.HeadcountByBranchDepartment}
                //   xKey="Branch_Name"
                //   yKey="Headcount"
                //   showYAxis={true}
                //   showYAxisLabels={true}
                //   strokeColor="#3b82f6"
                //   fillColor="#3b82f6"
                //   //   label=" "
                // />
              )}
            </div>
          </div>

          {/* Age Distribution */}
          <div
            className="chart-card"
            style={{ gridArea: "6 / 1/ span 1 / span 2" }}
          >
            <div className="chart-title">
              {chartsLoading ? (
                <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
              ) : (
                "Age Distribution"
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
                  data={chartsData?.EmployeeAgeDistribution}
                  xKey="age_Group"
                  yKey="count"
                  showYAxis={true}
                  showYAxisLabels={true}
                  strokeColor="#3b82f6"
                  fillColor="#3b82f6"
                  metadata={{
                    show: true,
                    columns: [
                      {
                        key: "percentage",
                        label: "Percentage",
                        formatter: (value) => `${Number(value).toFixed(2)}`,
                      },
                    ],
                  }}
                  //   label=" "
                />

                // <SimpleBarChart
                //   data={chartsData?.HeadcountByBranchDepartment}
                //   xKey="Branch_Name"
                //   yKey="Headcount"
                //   showYAxis={true}
                //   showYAxisLabels={true}
                //   strokeColor="#3b82f6"
                //   fillColor="#3b82f6"
                //   //   label=" "
                // />
              )}
            </div>
          </div>

          <div
            className="data-table"
            style={{ gridArea: "6 / 3/ span 1 / span 2" }}
          >
            <div className="data-table-header">
              <div className="data-table-title">
                Employees with High Absenteeism
              </div>
              <input
                type="text"
                placeholder="Search By Name"
                className="data-table-search"
                style={{ width: "340px" }}
              />
            </div>
            <div className="flex-1">
              <GenericDataTable<ITableEmployeesWithHighAbsenteeismApiResponse>
                // apiQueryParams={buildScmOrderManagementFiltersQueryParams(
                //   filters
                // )}
                token={token}
                moduleName="hr/hranalytics"
                urlExtension="employees-with-high-absenteeism"
                columns={employeesWithHighAbsenteeismColumns}
              />
            </div>
          </div>

          <div
            className="data-table"
            style={{ gridArea: "7 / 1/ span 1 / span 3  " }}
          >
            <div className="data-table-header">
              <div className="data-table-title">Pending Leave Requests</div>
              <input
                type="text"
                placeholder="Search By Name"
                className="data-table-search"
                style={{ width: "340px" }}
              />
            </div>
            <div className="flex-1">
              <GenericDataTable<ITablePendingLeaveRequestsApiResponse>
                // apiQueryParams={buildScmOrderManagementFiltersQueryParams(
                //   filters
                // )}
                token={token}
                moduleName="hr/hranalytics"
                urlExtension="pending-leave-requests"
                columns={pendingLeaveRequestsColumns}
              />
            </div>
          </div>

          <div
            className="data-table"
            style={{ gridArea: "8 / 1/ span 1 / span 2" }}
          >
            <div className="data-table-header">
              <div className="data-table-title">Contracts Ending Soon</div>
              <input
                type="text"
                placeholder="Search By Name"
                className="data-table-search"
                style={{ width: "340px" }}
              />
            </div>
            <div className="flex-1">
              <GenericDataTable<ITableContractsEndingSoonApiResponse>
                // apiQueryParams={buildScmOrderManagementFiltersQueryParams(
                //   filters
                // )}
                token={token}
                moduleName="hr/hranalytics"
                urlExtension="contracts-ending-soon"
                columns={contractsEndingSoonColumns}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HrDashboard;
