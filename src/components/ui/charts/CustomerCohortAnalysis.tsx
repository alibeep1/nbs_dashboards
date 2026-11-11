import type { CustomerCohortAnalysisChartApiResponse } from "@/lib/response/IChartsResponse";
import React, { useMemo } from "react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { CardFooter } from "../card";
import { TrendingUp } from "lucide-react";
// import { TooltipContent } from "@radix-ui/react-tooltip";

interface CustomerCohortAnalysisProps {
  data?: CustomerCohortAnalysisChartApiResponse[];
}

export const CustomerCohortAnalysis = ({
  data = [],
}: CustomerCohortAnalysisProps) => {
  console.log("cohort data", data);
  // Process the data to create a structured format for the table
  const processedData = useMemo(() => {
    if (!data || data.length === 0) return { cohorts: [], maxMonths: 0 };

    // Group data by cohort
    const cohortMap = {};
    let maxMonths = 0;

    data.forEach((item) => {
      const cohortKey = `${item.cohortMonth} ${item.cohortYear}`;

      if (!cohortMap[cohortKey]) {
        cohortMap[cohortKey] = {
          month: item.cohortMonth,
          year: item.cohortYear,
          data: {},
        };
      }

      cohortMap[cohortKey].data[item.monthsSinceStart] = {
        retentionRate: item.retentionRate,
        retainedCustomers: item.retainedCustomers,
        cohortSize: item.cohortSize,
      };

      maxMonths = Math.max(maxMonths, item.monthsSinceStart);
    });

    // Convert to array and sort by date
    const cohorts = Object.values(cohortMap).sort((a, b) => {
      const dateA = new Date(`${a.month} 1, ${a.year}`);
      const dateB = new Date(`${b.month} 1, ${b.year}`);
      return dateA - dateB;
    });

    return { cohorts, maxMonths };
  }, [data]);

  // Function to format month names
  const formatMonth = (month, year) => {
    const monthNames = {
      jan: "Jan",
      feb: "Feb",
      mar: "Mar",
      apr: "Apr",
      may: "May",
      jun: "Jun",
      jul: "Jul",
      aug: "Aug",
      sep: "Sep",
      oct: "Oct",
      nov: "Nov",
      dec: "Dec",
    };
    return `${monthNames[month.toLowerCase()] || month} ${year}`;
  };

  // Function to get color class based on retention rate
  const getRetentionColorClass = (rate: number | null) => {
    if (!rate || isNaN(rate)) return "bg-[#E4E5E6] text-[#B5B9BD]"; // Gray for no data
    if (rate >= 70) return "bg-[#00A378] text-[#ffffff]"; // Green
    if (rate >= 50) return "bg-[#2DE3B3] text-[#161E24]"; // Light green
    if (rate >= 30) return "bg-[#E8F12E] text-[#161E24]"; // Yellow
    // if (rate == 0 || !rate) return "bg-[#E4E5E6] text-[#161E24]"; // Gray for no data
    return "bg-[#FFA475] text-[#161E24]"; // Orange
  };

  const { cohorts, maxMonths } = processedData;

  // If no data, show empty state
  if (cohorts.length === 0) {
    return (
      <div className="bg-[#ffffff] box-border flex flex-col gap-2 items-center justify-center p-6 rounded-2xl size-full min-h-[400px]">
        <p className="text-[#62748e] text-[14px]">No cohort data available</p>
      </div>
    );
  }

  return (
    <div
      className="bg-[#ffffff] box-border flex flex-col gap-2 items-start justify-start  pt-4 px-6 relative rounded-2xl size-full"
      data-name="Customer Cohort Analysis"
    >
      {/* Table Content */}
      <div className="basis-0 box-border content-stretch flex flex-row gap-2 grow items-start justify-center min-h-px min-w-px p-0 relative shrink-0 w-full">
        <div className="basis-0 box-border content-stretch flex flex-row gap-4 grow items-center justify-start min-h-px min-w-px p-0 relative rounded-lg shrink-0">
          {/* Cohort Column */}
          <div className="bg-[#ffffff] box-border content-stretch flex flex-col gap-2.5 items-start justify-center overflow-clip p-0 relative shrink-0">
            <div className="box-border content-stretch flex flex-col gap-2.5 items-start justify-start overflow-clip p-[10px] relative rounded-lg shrink-0">
              <div className="capitalize font-['Plus_Jakarta_Sans:SemiBold',_sans-serif] font-semibold leading-[0] relative shrink-0 text-[#384045] text-[14px] text-left text-nowrap">
                <p className="block leading-[1.25] whitespace-pre">Cohort</p>
              </div>
            </div>
            <div className="box-border content-stretch flex flex-col gap-2.5 items-start justify-center p-0 relative shrink-0">
              {cohorts.map((cohort, index) => (
                <div
                  key={index}
                  className="box-border content-stretch flex flex-col gap-2.5 items-start justify-start overflow-clip p-[10px] relative rounded-lg shrink-0"
                >
                  <div className="capitalize font-['Plus_Jakarta_Sans:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#384045] text-[14px] text-left text-nowrap">
                    <p className="block leading-[1.5] whitespace-pre">
                      {formatMonth(cohort.month, cohort.year)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Month Columns */}
          {[...Array(maxMonths + 1)].map((_, monthIndex) => (
            <div
              key={monthIndex}
              className="bg-[#ffffff] box-border content-stretch flex flex-col gap-2.5 items-center justify-center overflow-clip p-0 relative shrink-0"
            >
              <div className="box-border content-stretch flex flex-col gap-2.5 items-start justify-start overflow-clip p-[10px] relative rounded-lg shrink-0">
                <div className="capitalize font-['Plus_Jakarta_Sans:SemiBold',_sans-serif] font-semibold leading-[0] relative shrink-0 text-[#384045] text-[14px] text-left text-nowrap">
                  <p className="block leading-[1.25] whitespace-pre">
                    Month {monthIndex}
                  </p>
                </div>
              </div>
              {cohorts.map((cohort, cohortIndex) => {
                const cellData = cohort.data[monthIndex];
                const hasData =
                  cellData && cellData.retentionRate !== undefined;

                return (
                  <Tooltip key={cohortIndex}>
                    <TooltipTrigger asChild>
                      <div
                        className={`box-border content-stretch flex flex-col gap-2.5 items-center justify-center overflow-clip p-[10px] relative rounded-lg shrink-0 w-full ${
                          hasData
                            ? getRetentionColorClass(cellData.retentionRate)
                            : "bg-[#E4E5E6]"
                        }`}
                      >
                        <div>
                          <p className="block leading-[1.5] whitespace-pre">
                            {hasData && cellData.retentionRate !== null
                              ? `${Math.round(cellData.retentionRate)}%`
                              : "-"}
                          </p>
                        </div>
                        {/* Display retainedCustomers, and cohort size */}
                        <TooltipContent>
                          {hasData && cellData.retentionRate !== null ? (
                            <div>
                              <p>
                                Analysis: You retained {cellData.retentionRate}%
                                of new customers who joined in {cohort?.month}
                              </p>
                              <p>
                                Retained Customers:{" "}
                                {cellData.retainedCustomers || 0}
                              </p>
                              <p>Cohort Size: {cellData.cohortSize || 0}</p>
                            </div>
                          ) : (
                            <div className="text-sm text-gray-500">
                              No data available
                            </div>
                          )}
                        </TooltipContent>
                      </div>
                    </TooltipTrigger>
                    {/* // END OF DIV */}
                  </Tooltip>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      {/* Legend */}
      <div className="box-border content-stretch flex flex-row gap-4 items-start justify-center p-0 relative shrink-0">
        <div className="capitalize font-['Plus_Jakarta_Sans:Regular',_sans-serif] font-normal leading-[0] overflow-ellipsis overflow-hidden relative shrink-0 text-[#62748e] text-[14px] text-left text-nowrap">
          <p className="[text-overflow:inherit] block leading-[1.5] overflow-inherit whitespace-pre">
            Legend:
          </p>
        </div>

        <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center overflow-clip px-2 py-0 relative shrink-0">
          <div className="bg-[#00A378] rounded shrink-0 size-3.5" />
          <div className="capitalize font-['Plus_Jakarta_Sans:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#515558] text-[14px] text-left text-nowrap">
            <p className="block leading-[1.5] whitespace-pre">70%+</p>
          </div>
        </div>

        <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center overflow-clip px-2 py-0 relative shrink-0">
          <div className="bg-[#2DE3B3] rounded shrink-0 size-3.5" />
          <div className="capitalize font-['Plus_Jakarta_Sans:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#515558] text-[14px] text-left text-nowrap">
            <p className="block leading-[1.5] whitespace-pre">50-69%</p>
          </div>
        </div>

        <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center overflow-clip px-2 py-0 relative shrink-0">
          <div className="bg-[#E8F12E] rounded shrink-0 size-3.5" />
          <div className="capitalize font-['Plus_Jakarta_Sans:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#515558] text-[14px] text-left text-nowrap">
            <p className="block leading-[1.5] whitespace-pre">30-49%</p>
          </div>
        </div>

        <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center overflow-clip px-2 py-0 relative shrink-0">
          <div className="bg-[#FFA475] rounded shrink-0 size-3.5" />
          <div className="capitalize font-['Plus_Jakarta_Sans:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#515558] text-[14px] text-left text-nowrap">
            <p className="block leading-[1.5] whitespace-pre">&lt;30%</p>
          </div>
        </div>
      </div>
    </div>
  );
};
