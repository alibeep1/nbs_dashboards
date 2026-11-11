/* eslint-disable @typescript-eslint/no-unused-vars */
// import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
// import CustomerAnalyticsDashboard from "./CustomerAnalyticsDashboard";

// function App() {
//   const [count, setCount] = useState(0);

//   return <CustomerAnalyticsDashboard />;
// }

// export default App;

import { useToken } from "./hooks/useToken";
import { useEffect, useMemo, useState } from "react";
import { createApiClient } from "./lib/api";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import {
  Activity,
  BookOpen,
  Building,
  Calendar,
  ChevronDown,
  CircleAlert,
  Command,
  Home,
  Info,
  PieChart,
  Repeat,
  RotateCcwSquareIcon,
  Sparkles,
  User,
  UserPlus,
} from "lucide-react";
import { CommandEmpty, CommandGroup, CommandInput, CommandItem } from "cmdk";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { EDateFilter } from "./components/reusables/DateFilterTypes";
import DateFilterDropdown from "./components/reusables/DateFilterDropdownComponent";
import type { Branch } from "./components/reusables/BranchFilterTypes";
import BranchFilterDropdown from "./components/reusables/BranchFilterDropdown";
import type { Region } from "./components/reusables/RegionFilterTypes";
import RegionFilterDropdown from "./components/reusables/RegionFilterDropdown";
import type { EGender } from "./components/reusables/GenderFilterTypes";
import GenderFilterDropdown from "./components/reusables/GenderFilterDropdown";
import type { AgeRange } from "./components/reusables/AgeRangeTypes";
import AgeRangeInput from "./components/reusables/AgeRangeInput";
import { buildFiltersQueryParams } from "./lib/FilterUtilities";
import { formatKpiValue, type KpiApiResponse } from "./lib/response/IKpiResponse";
import { percentChangeFormat } from "./lib/PercentChangeFormat";
import AreaChartComponent from "./components/ui/charts/AreaChartComponent";
import type {
  ChartsApiResponse,
  CustomerCohortAnalysisChartApiResponse,
} from "./lib/response/IChartsResponse";
// import { KpiApiResponse } from "./lib/response/IKpiResponse.ts";
// import { KpiApiResponse } from "./lib/response/IKpiResponse.ts";
import type { ChartDataPoint } from "./lib/response/IChartsResponse";
import { ChartAreaGradient } from "./components/ui/charts/ChartAreaGradient";
import { Card, CardContent } from "./components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "./components/ui/chart";
import { Pie } from "recharts";
import { PieChartComponent } from "./components/ui/charts/PieChartComponent";
// import { ChartAreaGradient } from "./components/ui/charts/LineChart";
import { ChartDataUtils } from "./lib/response/IChartsResponse";
import { BarChartComponent } from "./components/ui/charts/BarChartComponent";
import { HorizontalBarChartComponent } from "./components/ui/charts/HorizontalBarChartComponent";
import { CustomerCohortAnalysis } from "./components/ui/charts/CustomerCohortAnalysis";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "./components/ui/tooltip";
import { CustomDataTable } from "./components/reusables/tables/CustomDataTable";
import { _mockChurnCustomersData } from "./components/reusables/tables/churn-customers/ChurnCustomersTypes";
import { churnCustomersColumns } from "./components/reusables/tables/churn-customers/ChurnCustomersTableColumns";
import { ChurnCustomersTable } from "./components/reusables/tables/churn-customers/ChurnCustomersTable";
import { HighRefundCustomersTable } from "./components/reusables/tables/high-refund-customers/HighRefundCustomersTable";
import { GenericDataTable } from "./components/reusables/tables/GenericDataTable";
import {
  topCustomersColumns,
  type ITopCustomerApiResponse,
} from "./components/reusables/tables/top-customers/TopCustomersColumns";
import {
  itemPairsColumns,
  type IItemPairApiResponse,
} from "./components/reusables/tables/item-pairs/ItemPairsColumns";
import {
  popularItemsColumns,
  type IPopularItemApiResponse,
} from "./components/reusables/tables/popular-items/PopularItemsColumns";
import GenericApiFilter from "./components/reusables/sales/GenericApiFilter";
import { SimplePieChart } from "./components/ui/charts/SimplePieChartComponent";
import { SimpleBarChart } from "./components/ui/charts/SimpleBarChart";

type DashboardData = {
  metric: string;
  value: number;
};

function App() {
  const token = useToken();
  const [data, setData] = useState<KpiApiResponse>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [chartsData, setChartsData] = useState<ChartsApiResponse>([]);
  const [chartsLoading, setChartsLoading] = useState(true);
  const [chartsError, setChartsError] = useState<string | null>(null);

  const [cohortData, setCohortData] = useState<
    CustomerCohortAnalysisChartApiResponse[]
  >([]);
  const [cohortLoading, setCohortLoading] = useState(true);
  const [cohortError, setCohortError] = useState<string | null>(null);

  const [selectedDateFilter, setSelectedDateFilter] = useState<EDateFilter>(
    EDateFilter.Ytd
  );
  // Handle date filter changes
  const handleDateFilterChange = (value: EDateFilter) => {
    setSelectedDateFilter(value);

    // Add your logic here to handle the filter change
    // For example, refresh data, update charts, etc.
    console.log("Date filter changed to:", value);

    // You might want to call an API or update other state here
    // fetchDataWithFilter(value);
  };

  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loadingBranches, setLoadingBranches] = useState(true);

  // Mock API call - replace with your actual API call
  useEffect(() => {
    const fetchBranches = async () => {
      setLoadingBranches(true);
      try {
        // Replace with your actual API call
        // const response = await api.getBranches();
        // setBranches(response.data);

        // Mock data for demonstration
        const mockBranches: Branch[] = [
          {
            code: "100",
            name: "HQ",
            description: "Central location",
          },
          {
            code: "110",
            name: "North Branch",
            description: "Northern district",
          },
          {
            code: "120",
            name: "South Branch",
            description: "Southern district",
          },
          {
            code: "130",
            name: "East Branch",
            description: "Eastern district",
          },
          {
            code: "140",
            name: "West Branch",
            description: "Western district",
          },
          // add 10 more branches
          {
            code: "150",
            name: "Janaklis",
            description: "Janaklis area, Alexandria",
          },
          {
            code: "160",
            name: "San Stefano",
            description: "San Stefano district, Alexandria",
          },
          {
            code: "170",
            name: "Sporting",
            description: "Sporting area, Alexandria",
          },
          {
            code: "180",
            name: "Sidi Gaber",
            description: "Sidi Gaber district, Alexandria",
          },
          {
            code: "190",
            name: "Stanley",
            description: "Stanley area, Alexandria",
          },
          {
            code: "200",
            name: "Gleem",
            description: "Gleem district, Alexandria",
          },
          {
            code: "210",
            name: "Smouha",
            description: "Smouha area, Alexandria",
          },
          {
            code: "220",
            name: "Roushdy",
            description: "Roushdy district, Alexandria",
          },
          {
            code: "230",
            name: "Mandara",
            description: "Mandara area, Alexandria",
          },
          {
            code: "240",
            name: "Miami",
            description: "Miami district, Alexandria",
          },
        ];

        // Simulate API delay
        setTimeout(() => {
          setBranches(mockBranches);
          setLoadingBranches(false);
        }, 1000);
      } catch (error) {
        console.error("Failed to fetch branches:", error);
        setLoadingBranches(false);
      }
    };

    fetchBranches();
  }, []);
  const handleBranchChange = (branchCode: string) => {
    setSelectedBranch(branchCode);
    console.log("Selected branch:", branchCode);

    // Add your logic here to handle the branch change
    // For example, refresh data, update charts, etc.
    // fetchDataForBranch(branchCode);
  };

  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [regions, setRegions] = useState<Region[]>([]);
  const [loadingRegions, setLoadingRegions] = useState(true);

  // Mock API call - replace with your actual API call
  // useEffect(() => {
  //   const fetchRegions = async () => {
  //     setLoadingRegions(true);
  //     try {
  //       // Replace with your actual API call
  //       // const response = await api.getRegions();
  //       // setRegions(response.data);

  //       // Mock data for demonstration
  //       const mockRegions: Region[] = [
  //         {
  //           regionCode: "NORTH",
  //           regionName: "Northern Region",
  //           description: "Northern territory",
  //         },
  //         {
  //           regionCode: "SOUTH",
  //           regionName: "Southern Region",
  //           description: "Southern territory",
  //         },
  //         {
  //           regionCode: "EAST",
  //           regionName: "Eastern Region",
  //           description: "Eastern territory",
  //         },
  //         {
  //           regionCode: "WEST",
  //           regionName: "Western Region",
  //           description: "Western territory",
  //         },
  //         {
  //           regionCode: "CENTRAL",
  //           regionName: "Central Region",
  //           description: "Central territory",
  //         },
  //       ];

  //       // Simulate API delay
  //       setTimeout(() => {
  //         setRegions(mockRegions);
  //         setLoadingRegions(false);
  //       }, 1000);
  //     } catch (error) {
  //       console.error("Failed to fetch regions:", error);
  //       setLoadingRegions(false);
  //     }
  //   };

  // fetchRegions();
  // }, []);

  const handleRegionChange = (regionCode: string) => {
    setSelectedRegion(regionCode);
    console.log("Selected region:", regionCode);

    // Add your logic here to handle the region change
    // For example, refresh data, update charts, etc.
    // fetchDataForRegion(regionCode);
  };

  const [selectedGender, setSelectedGender] = useState<EGender | "">("");

  const handleGenderChange = (value: EGender | "") => {
    setSelectedGender(value);
    console.log("Selected gender:", value);

    // Add your logic here to handle the gender change
    // For example, refresh data, update charts, etc.
    // fetchDataForGender(value);
  };

  const [ageRange, setAgeRange] = useState<AgeRange>({});

  const handleAgeRangeChange = (value: AgeRange) => {
    setAgeRange(value);
    console.log("Age range changed:", value);

    // Add your logic here to handle the age range change
    // For example, refresh data, update charts, etc.
    // fetchDataForAgeRange(value);
  };

  const customerAnalyticsQueryParams = useMemo(
    () =>
      buildFiltersQueryParams(
        selectedDateFilter,
        selectedBranch,
        selectedRegion,
        selectedGender,
        ageRange
      ),
    [selectedDateFilter, selectedBranch, selectedRegion, selectedGender, ageRange]
  );

  useEffect(() => {
    if (!token) return;

    const api = createApiClient(token);

    api
      .get<KpiApiResponse>("/CustomerAnalytics/kpi", {
        params: customerAnalyticsQueryParams,
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
    customerAnalyticsQueryParams,
  ]);

  useEffect(() => {
    if (!token) return;

    const api = createApiClient(token);

    api
      .get<ChartsApiResponse>("/CustomerAnalytics/charts", {
        params: customerAnalyticsQueryParams,
      })
      .then((res) => {
        setChartsData(res.data);
        setChartsLoading(false);
      })
      .catch((err) => {
        setChartsError(err.message);
        setChartsLoading(false);
      });
  }, [
    token,
    customerAnalyticsQueryParams,
  ]);

  useEffect(() => {
    if (!token) return;

    const api = createApiClient(token);

    api
      .get<CustomerCohortAnalysisChartApiResponse[]>(
        "/CustomerAnalytics/customer-cohort-retention/charts",
        {
          params: customerAnalyticsQueryParams,
        }
      )
      .then((res) => {
        setCohortData(res.data);
        setCohortLoading(false);
      })
      .catch((err) => {
        setCohortError(err.message);
        setCohortLoading(false);
      });
  }, [token, customerAnalyticsQueryParams]);

  if (!token) {
    return <div className="p-4 text-red-500">No token provided.</div>;
  }

  // if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="dashboard-container">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span className="muted text-sm">Dashboards</span>
        <span className=" text-sm"> &gt; Customer Analytics</span>
      </div>

      {/* Filters  */}
      <div className="gap-1 flex flex-col">
        <h4 className="text-md font-medium">Filters</h4>
        <div className="filter-container">
          {/* Time Period Dropdown */}
          <DateFilterDropdown
            value={selectedDateFilter}
            onValueChange={handleDateFilterChange}
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
            onValueChange={handleBranchChange}

            // onValueChange={(value) => handleFilterChange("BranchCode", value)}
          />

          {/* <BranchFilterDropdown
          value={selectedBranch}
          onValueChange={handleBranchChange}
          branches={branches}
          loading={loadingBranches}
          allowClear={true}
          showAllOption={true}
        /> */}

          {/* Gender Dropdown */}
          {/* Basic usage with "All Genders" option (default) */}
          <GenderFilterDropdown
            value={selectedGender}
            onValueChange={handleGenderChange}
            allowClear={true}
          />

          {/* Age Filter */}
          <AgeRangeInput
            value={ageRange}
            onValueChange={handleAgeRangeChange}
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
                    <Activity className="h-4 w-4" />
                  </div>
                  <div className="info-card-label">{data[0].title}</div>
                </div>
                <div className="info-card-value">{formatKpiValue(data[0].value)}</div>
              </div>
              <div
                className={`info-card-change ${percentChangeFormat(
                  data[0].percentChange
                )}`}
              >
                {data[0].percentChange}
              </div>
            </div>

            <div className="info-card" style={{ width: "153px" }}>
              <div className="info-card-content">
                <div className="info-card-header">
                  <div className="info-card-icon">
                    <UserPlus className="h-4 w-4" />
                  </div>
                  <div className="info-card-label">{data[1].title}</div>
                </div>
                <div className="info-card-value">{formatKpiValue(data[1].value)}</div>
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
                <div className="info-card-value">{formatKpiValue(data[2].value)}</div>
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
                <div className="info-card-value">{formatKpiValue(data[3].value)}</div>
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
                <div className="info-card-value">{formatKpiValue(data[4].value)}</div>
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
                <div className="info-card-value">{formatKpiValue(data[5].value)}</div>
              </div>
              <div
                className={`info-card-change ${percentChangeFormat(
                  data[5].percentChange
                )}`}
              >
                {data[5].percentChange}
              </div>
            </div>

            <div className="info-card" style={{ width: "153px" }}>
              <div className="info-card-content">
                <div className="info-card-header">
                  <div className="info-card-icon">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <div className="info-card-label">{data[6].title}</div>
                </div>
                <div className="info-card-value">{formatKpiValue(data[6].value)}</div>
              </div>
              <div
                className={`info-card-change ${percentChangeFormat(
                  data[6].percentChange
                )}`}
              >
                {data[6].percentChange}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Charts and Tables Section */}
      <div className="gap-1 flex flex-col">
        {/* Use a friendly title */}
        <h4 className="text-md font-medium">Insights</h4>
        {/* Charts and Graphs Section */}
        <div className="charts-container">
          {/* Customer Visit Frequency Chart */}
          <div
            className="chart-card"
            style={{ gridArea: "1 / 1 / span 1 / span 2" }}
          >
            <div className="chart-title">
              {chartsLoading ? (
                <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
              ) : (
                "Customer Visit Frequency Over Time"
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
                <ChartAreaGradient data={chartsData[0].dataPoints} />
              )}
            </div>
          </div>
          {/* </div> */}

          {/* Repeat vs One-Time Buyers Chart */}
          <div
            className="chart-card"
            style={{ gridArea: "1 / 3 / span 1 / span 1" }}
          >
            <div className="chart-title">
              {chartsLoading ? (
                <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
              ) : (
                "Repeat vs One-Time Buyers"
              )}
            </div>
            <div className="flex-center flex-1">
              {chartsLoading ? (
                <div className="w-32 h-32 rounded-full border-8 border-gray-200 animate-pulse" />
              ) : (
                // <PieChartComponent data={chartsData[3].dataPoints} />
                <SimplePieChart
                  data={chartsData[3].dataPoints}
                  labelKey="label"
                  valueKey="value"
                />
              )}
            </div>
          </div>

          {/* Male vs Female Distribution Chart */}
          <div
            className="chart-card"
            style={{ gridArea: "1 / 4 / span 1 / span 1" }}
          >
            <div className="chart-title">
              {chartsLoading ? (
                <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
              ) : (
                "Male vs Female Distribution"
              )}
            </div>
            <div className="flex-center flex-1">
              {chartsLoading ? (
                <div className="w-32 h-32 rounded-full border-8 border-gray-200 animate-pulse" />
              ) : (
                <SimplePieChart
                  data={chartsData[2].dataPoints}
                  labelKey="label"
                  valueKey="value"
                />
                // <PieChartComponent data={chartsData[2].dataPoints} />
              )}
            </div>
          </div>

          {/* Spend Distribution Chart */}
          <div
            className="chart-card"
            style={{ gridArea: "2 / 1 / span 1 / span 1" }}
          >
            <div className="chart-title">
              {chartsLoading ? (
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
              ) : (
                "Spend Distribution"
              )}
            </div>
            <div className="flex-1">
              {chartsLoading ? (
                <div className="space-y-3 p-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-3">
                      <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                      <div
                        className="h-4 bg-gray-200 rounded animate-pulse"
                        style={{ width: `${Math.random() * 60 + 20}%` }}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                // <HorizontalBarChartComponent data={chartsData[4].dataPoints} />
                <SimpleBarChart
                  data={chartsData[4].dataPoints}
                  xKey="label"
                  yKey="value"
                  layout="horizontal"
                  showYAxisLabels={true}
                  label=" EGP"
                />
              )}
            </div>
          </div>

          {/* Sales by Payment Channel Chart */}
          <div
            className="chart-card"
            style={{ gridArea: "2 / 2 / span 1 / span 1" }}
          >
            <div className="chart-title">
              {chartsLoading ? (
                <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
              ) : (
                "Sales by Payment Channel"
              )}
            </div>
            <div className="flex-1">
              {chartsLoading ? (
                <div className="space-y-3 p-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-3">
                      <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                      <div
                        className="h-4 bg-gray-200 rounded animate-pulse"
                        style={{ width: `${Math.random() * 60 + 30}%` }}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                // <HorizontalBarChartComponent data={chartsData[5].dataPoints} />
                <SimpleBarChart
                  data={chartsData[5].dataPoints}
                  xKey="label"
                  yKey="value"
                  layout="horizontal"
                  showYAxisLabels={true}
                  label=" Sales Transactions"
                />
              )}
            </div>
          </div>
          {/* Churn Risk Customers Table */}
          <div
            className="data-table"
            style={{ gridArea: "2 / 3 / span 1 / span 2" }}
          >
            <div className="data-table-header">
              <div className="data-table-title">
                {chartsLoading ? (
                  <div className="h-6 w-36 bg-gray-200 rounded animate-pulse" />
                ) : (
                  "Churn Risk Customers"
                )}
              </div>
              <input
                type="text"
                placeholder="Search By Customer Name"
                className="data-table-search"
                style={{ width: "200px" }}
                disabled={chartsLoading}
              />
            </div>
            <div className="flex-1">
              {chartsLoading ? (
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
              ) : (
                <ChurnCustomersTable
                  token={token}
                  apiQueryParams={customerAnalyticsQueryParams}
                />
              )}
            </div>
          </div>

          {/* High Refund Customers Table */}
          <div
            className="data-table"
            style={{ gridArea: "3 / 1 / span 1 / span 2" }}
          >
            <div className="data-table-header">
              <div className="data-table-title">
                {chartsLoading ? (
                  <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
                ) : (
                  "High Refund Customers"
                )}
              </div>
              <input
                type="text"
                placeholder="Search By Customer Name"
                className="data-table-search"
                style={{ width: "200px" }}
                disabled={chartsLoading}
              />
            </div>
            <div className="flex-1">
              {chartsLoading ? (
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
              ) : (
                <HighRefundCustomersTable
                  token={token}
                  apiQueryParams={customerAnalyticsQueryParams}
                />
              )}
            </div>
          </div>

          {/* Customer Cohort Analysis */}
          <div
            className="chart-card"
            style={{ gridArea: "3 / 3 / span 1 / span 2" }}
          >
            <div className="chart-title flex flex-row justify-between">
              Customer Cohort Analysis - Retention Rate (%)
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 ml-2 inline-block" />
                </TooltipTrigger>
                <TooltipContent>
                  <div>
                    <p>
                      Customers are grouped by their cohort month and
                      year,&nbsp; showing retention rates over subsequent
                      months.
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="flex-1">
              <CustomerCohortAnalysis data={cohortData} />
            </div>
          </div>

          {/* Top Customers Table */}
          <div
            className="data-table"
            style={{ gridArea: "4/ 1 / span 1 / span 3" }}
          >
            <div className="data-table-header">
              <div className="data-table-title">
                Top Customers by Total Spent
              </div>
              <input
                type="text"
                placeholder="Search By Name"
                className="data-table-search"
                style={{ width: "340px" }}
              />
            </div>
            <div className="flex-1">
              <GenericDataTable<ITopCustomerApiResponse>
                token={token}
                apiQueryParams={customerAnalyticsQueryParams}
                urlExtension="top-customers"
                columns={topCustomersColumns}
              />
            </div>
            {/* <div className="table-footer">
            <div className="pagination-info">0 of 5 row(s) selected.</div>
            <div className="pagination-buttons">
              <button className="pagination-button" disabled>
                Previous
              </button>
              <button className="pagination-button">Next</button>
            </div>
          </div> */}
          </div>

          {/* Popular Item Pairs Table */}
          <div
            className="data-table"
            style={{ gridArea: "4 / 4 / span 1 / span 1" }}
          >
            <div className="data-table-header">
              <div className="data-table-title">Popular Item Pairs</div>
              <input
                type="text"
                placeholder="Search By Item Name"
                className="data-table-search"
                style={{ width: "167px" }}
              />
            </div>
            <div className="flex-1">
              <GenericDataTable<IItemPairApiResponse>
                token={token}
                apiQueryParams={customerAnalyticsQueryParams}
                urlExtension="popular-item-pairs"
                columns={itemPairsColumns}
              />
            </div>
            {/* <div className="table-footer">
            <div className="pagination-info">0 of 5 row(s) selected.</div>
            <div className="pagination-buttons">
              <button className="pagination-button" disabled>
                Previous
              </button>
              <button className="pagination-button">Next</button>
            </div>
          </div> */}
          </div>

          {/* Popular Categories by Sales Chart */}
          <div
            className="chart-card"
            style={{ gridArea: "5 / 1 / span 1 / span 1" }}
          >
            <div className="chart-title">Popular Categories by Sales</div>
            <div className="flex-1">
              {/* <HorizontalBarChartComponent data={chartsData[6]?.dataPoints} /> */}
              <SimpleBarChart
                data={chartsData[6]?.dataPoints}
                xKey="label"
                yKey="value"
                layout="horizontal"
                showYAxisLabels={true}
                label=" Sales Trans."
              />
              {/* <BarChartComponent data={chartsData[6].dataPoints} /> */}
              {/* Bar chart component */}
            </div>
          </div>

          {/* Popular Brands by Sales Count Chart */}
          <div
            className="chart-card"
            style={{ gridArea: "5 / 2 / span 1 / span 1" }}
          >
            <div className="chart-title">Popular Brands by Sales Count</div>
            <div className="flex-1">
              {/* <HorizontalBarChartComponent data={chartsData[7]?.dataPoints} /> */}
              <SimpleBarChart
                data={chartsData[7]?.dataPoints}
                xKey="label"
                yKey="value"
                layout="horizontal"
                showYAxisLabels={true}
                label=" Sales Trans."
              />
            </div>
          </div>
          {/* Popular Items Table */}
          <div
            className="data-table"
            style={{ gridArea: "5 / 3 / span 1 / span 2" }}
          >
            <div className="data-table-header">
              <div className="data-table-title">Popular Items</div>
              <input
                type="text"
                placeholder="Search By Item Name"
                className="data-table-search"
                style={{ width: "167px" }}
              />
            </div>
            <div className="flex-1">
              <GenericDataTable<IPopularItemApiResponse>
                token={token}
                apiQueryParams={customerAnalyticsQueryParams}
                urlExtension="popular-items"
                columns={popularItemsColumns}
              />
            </div>
            {/* <div className="table-footer">
            <div className="pagination-info">Showing popular items</div>
            <div className="pagination-buttons">
              <button className="pagination-button" disabled>
                Previous
              </button>
              <button className="pagination-button">Next</button>
            </div>
          </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

function CRMDashboard() {
  return (
    <div className="dashboard-container">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span className="muted">Dashboards</span>
        <span> &gt; Customer Analytics</span>
      </div>

      {/* Filters Section */}
      <div className="filter-container">
        {/* Time Period Dropdown */}
        <DateFilterDropdown
          value={selectedDateFilter}
          onValueChange={handleDateFilterChange}
        />
        {/* <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="w-[236px] justify-between bg-white rounded-2xl h-11 px-4 py-3 gap-2.5 border-0"
            >
              <Calendar className="h-6 w-6 text-neutral-700" />
              <span className="flex-1 text-left font-jakarta text-base font-medium text-neutral-800 capitalize">
                Month-To-Date
              </span>
              <ChevronDown className="h-6 w-6 text-neutral-700" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[236px] p-0">
            <Command>
              <CommandInput placeholder="Search time period..." />
              <CommandEmpty>No time period found.</CommandEmpty>
              <CommandGroup>
                <CommandItem value="month-to-date">Month-To-Date</CommandItem>
                <CommandItem value="week-to-date">Week-To-Date</CommandItem>
                <CommandItem value="year-to-date">Year-To-Date</CommandItem>
                <CommandItem value="last-30-days">Last 30 Days</CommandItem>
                <CommandItem value="last-90-days">Last 90 Days</CommandItem>
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover> */}

        {/* Branches Dropdown */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="w-[211px] justify-between bg-white rounded-2xl h-11 px-4 py-3 gap-2.5 border-0"
            >
              <Home className="h-6 w-6 text-neutral-700" />
              <span className="flex-1 text-left font-jakarta text-base font-medium text-neutral-800 capitalize">
                All Branches
              </span>
              <ChevronDown className="h-6 w-6 text-neutral-700" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[211px] p-0">
            <Command>
              <CommandInput placeholder="Search branches..." />
              <CommandEmpty>No branch found.</CommandEmpty>
              <CommandGroup>
                <CommandItem value="all-branches">All Branches</CommandItem>
                <CommandItem value="main-branch">Main Branch</CommandItem>
                <CommandItem value="north-branch">North Branch</CommandItem>
                <CommandItem value="south-branch">South Branch</CommandItem>
                <CommandItem value="east-branch">East Branch</CommandItem>
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Region Dropdown */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="w-[161px] justify-between bg-white rounded-2xl h-11 px-4 py-3 gap-2.5 border-0"
            >
              <Info className="h-6 w-6 text-neutral-700" />
              <span className="flex-1 text-left font-jakarta text-base font-medium text-neutral-800 capitalize">
                Region
              </span>
              <ChevronDown className="h-6 w-6 text-neutral-700" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[161px] p-0">
            <Command>
              <CommandInput placeholder="Search region..." />
              <CommandEmpty>No region found.</CommandEmpty>
              <CommandGroup>
                <CommandItem value="all-regions">All Regions</CommandItem>
                <CommandItem value="cairo">Cairo</CommandItem>
                <CommandItem value="alexandria">Alexandria</CommandItem>
                <CommandItem value="giza">Giza</CommandItem>
                <CommandItem value="luxor">Luxor</CommandItem>
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Gender Dropdown */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="w-[161px] justify-between bg-white rounded-2xl h-11 px-4 py-3 gap-2.5 border-0"
            >
              <User className="h-6 w-6 text-neutral-700" />
              <span className="flex-1 text-left font-jakarta text-base font-medium text-neutral-800 capitalize">
                Gender
              </span>
              <ChevronDown className="h-6 w-6 text-neutral-700" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[161px] p-0">
            <Command>
              <CommandInput placeholder="Search gender..." />
              <CommandEmpty>No gender found.</CommandEmpty>
              <CommandGroup>
                <CommandItem value="all">All Genders</CommandItem>
                <CommandItem value="male">Male</CommandItem>
                <CommandItem value="female">Female</CommandItem>
                <CommandItem value="other">Other</CommandItem>
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Age Filter */}
        <div className="flex items-center gap-2.5 p-2.5">
          <span className="body-16 text-black">From</span>
          <Input
            type="number"
            placeholder="Age"
            className="w-[73px] h-11 rounded-2xl bg-white border-0 px-4 py-3 font-jakarta text-sm font-medium text-neutral-300"
          />
          <span className="body-16 text-black">To</span>
          <Input
            type="number"
            placeholder="Age"
            className="w-[69px] h-11 rounded-2xl bg-white border-0 px-4 py-3 font-jakarta text-sm font-medium text-neutral-300"
          />
        </div>
      </div>

      {/* KPI Cards Section */}
      <div className="cards-grid">
        {/* Active Customers Card */}
        <div className="info-card" style={{ width: "338px" }}>
          <div className="info-card-content">
            <div className="info-card-header">
              <div className="info-card-icon">{/* User icon */}</div>
              <div className="info-card-label">Active Customers</div>
            </div>
            <div className="info-card-value">30,000</div>
          </div>
          <div className="info-card-change positive">+3%</div>
        </div>

        {/* New Customers Card */}
        <div className="info-card" style={{ width: "153px" }}>
          <div className="info-card-content">
            <div className="info-card-header">
              <div className="info-card-icon">{/* User Plus icon */}</div>
              <div className="info-card-label">New Customers</div>
            </div>
            <div className="info-card-value">2,200</div>
          </div>
          <div className="info-card-change positive">+10%</div>
        </div>

        {/* Repeat Customers Card */}
        <div className="info-card" style={{ width: "153px" }}>
          <div className="info-card-content">
            <div className="info-card-header">
              <div className="info-card-icon">{/* Refresh icon */}</div>
              <div className="info-card-label">Repeat Customers</div>
            </div>
            <div className="info-card-value">68.2%</div>
          </div>
          <div className="info-card-change positive">+4%</div>
        </div>

        {/* Average Visits Card */}
        <div className="info-card" style={{ width: "153px" }}>
          <div className="info-card-content">
            <div className="info-card-header">
              <div className="info-card-icon">{/* Activity icon */}</div>
              <div className="info-card-label">Average Visits per Customer</div>
            </div>
            <div className="info-card-value">3.2</div>
          </div>
          <div className="info-card-change negative">-5%</div>
        </div>

        {/* Churn Risk Card */}
        <div className="info-card" style={{ width: "153px" }}>
          <div className="info-card-content">
            <div className="info-card-header">
              <div className="info-card-icon">{/* Error icon */}</div>
              <div className="info-card-label">Churn Risk Customers</div>
            </div>
            <div className="info-card-value">300</div>
          </div>
          <div className="info-card-change negative">+7%</div>
        </div>

        {/* High Refund Card */}
        <div className="info-card" style={{ width: "153px" }}>
          <div className="info-card-content">
            <div className="info-card-header">
              <div className="info-card-icon">{/* Delete icon */}</div>
              <div className="info-card-label">High Refund Customers</div>
            </div>
            <div className="info-card-value">500</div>
          </div>
          <div className="info-card-change positive">-5%</div>
        </div>

        {/* Registered Customers Card */}
        <div className="info-card" style={{ width: "153px" }}>
          <div className="info-card-content">
            <div className="info-card-header">
              <div className="info-card-icon">{/* Book icon */}</div>
              <div className="info-card-label">Registered Customers</div>
            </div>
            <div className="info-card-value">1000</div>
          </div>
          <div className="info-card-change positive">+30%</div>
        </div>
      </div>

      {/* Charts and Graphs Section */}
      <div className="charts-container">
        {/* Customer Visit Frequency Chart */}
        <div
          className="chart-card"
          style={{ gridArea: "1 / 1 / span 3 / span 2" }}
        >
          <div className="chart-title">Customer Visit Frequency Over Time</div>
          <div className="flex-1">{/* Line chart component */}</div>
        </div>

        {/* Repeat vs One-Time Buyers Chart */}
        <div
          className="chart-card"
          style={{ gridArea: "1 / 3 / span 2 / span 1" }}
        >
          <div className="chart-title">Repeat vs One-Time Buyers</div>
          <div className="flex-center flex-1">
            {/* Donut chart component */}
          </div>
        </div>

        {/* Male vs Female Distribution Chart */}
        <div
          className="chart-card"
          style={{ gridArea: "1 / 4 / span 2 / span 1" }}
        >
          <div className="chart-title">Male vs Female Distribution</div>
          <div className="flex-center flex-1">
            {/* Donut chart component */}
          </div>
        </div>

        {/* Spend Distribution Chart */}
        <div
          className="chart-card"
          style={{ gridArea: "4 / 1 / span 3 / span 1" }}
        >
          <div className="chart-title">Spend Distribution</div>
          <div className="flex-1">{/* Bar chart component */}</div>
        </div>

        {/* Sales by Payment Channel Chart */}
        <div
          className="chart-card"
          style={{ gridArea: "4 / 2 / span 3 / span 1" }}
        >
          <div className="chart-title">Sales by Payment Channel</div>
          <div className="flex-1">{/* Bar chart component */}</div>
        </div>

        {/* Churn Risk Customers Table */}
        <div
          className="data-table"
          style={{ gridArea: "3 / 3 / span 4 / span 2" }}
        >
          <div className="data-table-header">
            <div className="data-table-title">Churn Risk Customers</div>
            <input
              type="text"
              placeholder="Search By Customer Name"
              className="data-table-search"
              style={{ width: "200px" }}
            />
          </div>
          <div className="data-table-main">
            {/* Table content for churn risk customers */}
          </div>
          <div className="table-footer">
            <div className="pagination-info">Showing churn risk customers</div>
            <div className="pagination-buttons">
              <button className="pagination-button" disabled>
                Previous
              </button>
              <button className="pagination-button">Next</button>
            </div>
          </div>
        </div>

        {/* High Refund Customers Table */}
        <div
          className="data-table"
          style={{ gridArea: "7 / 1 / span 4 / span 2" }}
        >
          <div className="data-table-header">
            <div className="data-table-title">High Refund Customers</div>
            <input
              type="text"
              placeholder="Search By Customer Name"
              className="data-table-search"
              style={{ width: "200px" }}
            />
          </div>
          <div className="data-table-main">
            {/* Table content for high refund customers */}
          </div>
          <div className="table-footer">
            <div className="pagination-info">Showing high refund customers</div>
            <div className="pagination-buttons">
              <button className="pagination-button" disabled>
                Previous
              </button>
              <button className="pagination-button">Next</button>
            </div>
          </div>
        </div>

        {/* Customer Cohort Analysis */}
        <div
          className="chart-card"
          style={{ gridArea: "7 / 3 / span 4 / span 2" }}
        >
          <div className="chart-title">
            Customer Cohort Analysis - Retention Rate (%)
          </div>
          <div className="flex-1">{/* Cohort heatmap component */}</div>
        </div>

        {/* Top Customers Table */}
        <div
          className="data-table"
          style={{ gridArea: "11 / 1 / span 3 / span 3" }}
        >
          <div className="data-table-header">
            <div className="data-table-title">Top Customers by Total Spent</div>
            <input
              type="text"
              placeholder="Search By Name"
              className="data-table-search"
              style={{ width: "340px" }}
            />
          </div>
          <div className="data-table-main">{/* Table content */}</div>
          <div className="table-footer">
            <div className="pagination-info">0 of 5 row(s) selected.</div>
            <div className="pagination-buttons">
              <button className="pagination-button" disabled>
                Previous
              </button>
              <button className="pagination-button">Next</button>
            </div>
          </div>
        </div>

        {/* Popular Item Pairs Table */}
        <div
          className="data-table"
          style={{ gridArea: "11 / 4 / span 3 / span 1" }}
        >
          <div className="data-table-header">
            <div className="data-table-title">Popular Item Pairs</div>
            <input
              type="text"
              placeholder="Search By Item Name"
              className="data-table-search"
              style={{ width: "167px" }}
            />
          </div>
          <div className="data-table-main">{/* Table content */}</div>
          <div className="table-footer">
            <div className="pagination-info">0 of 5 row(s) selected.</div>
            <div className="pagination-buttons">
              <button className="pagination-button" disabled>
                Previous
              </button>
              <button className="pagination-button">Next</button>
            </div>
          </div>
        </div>

        {/* Popular Categories by Sales Chart */}
        <div
          className="chart-card"
          style={{ gridArea: "14 / 1 / span 2 / span 1" }}
        >
          <div className="chart-title">
            Popular Categories by Sales (1000's)
          </div>
          <div className="flex-1">{/* Horizontal bar chart component */}</div>
        </div>

        {/* Popular Brands by Sales Count Chart */}
        <div
          className="chart-card"
          style={{ gridArea: "14 / 2 / span 2 / span 1" }}
        >
          <div className="chart-title">Popular Brands by Sales Count</div>
          <div className="flex-1">{/* Bar chart component */}</div>
        </div>
        {/* Popular Items Table */}
        <div
          className="data-table"
          style={{ gridArea: "14 / 3 / span 2 / span 2" }}
        >
          <div className="data-table-header">
            <div className="data-table-title">Popular Items</div>
            <input
              type="text"
              placeholder="Search By Item Name"
              className="data-table-search"
              style={{ width: "167px" }}
            />
          </div>
          <div className="data-table-main">{/* Table content */}</div>
          <div className="table-footer">
            <div className="pagination-info">Showing popular items</div>
            <div className="pagination-buttons">
              <button className="pagination-button" disabled>
                Previous
              </button>
              <button className="pagination-button">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
