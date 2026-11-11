import { useMemo } from "react";
import type { HourlySalesHeatmap } from "./SalesChart.types";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SalesHeatmapProps {
  data?: HourlySalesHeatmap[];
}

export const SalesHeatmap = ({ data = [] }: SalesHeatmapProps) => {
  console.log("cohort data", data);
  // Process the data to create a structured format for the table
  const processedData = useMemo(() => {
    if (!data || data.length === 0) return { cohorts: [], maxMonths: 0 };
    // to be deleted
    let maxMonths = 0;

    let hoursColumn = [];
    data.forEach((item) => hoursColumn.push(item.hourDisplay));

    // Extract day names from the first data item (excluding non-day properties)
    const dayNames =
      data.length > 0
        ? Object.keys(data[0]).filter(
            (key) => !["chartTitle", "hourDisplay"].includes(key)
          )
        : [];

    // to be deleted
    const cohorts = [];

    // Transform data: create array where each element represents a day's data across all hours
    const tableData = dayNames.map((dayName) => ({
      day: dayName,
      values: data.map((hourData) => hourData[dayName] || 0),
    }));

    console.log("tableData", tableData);

    return { cohorts, maxMonths, hoursColumn, dayNames, tableData };
  }, [data]);

  // Function to format month names
  const formatDay = (day) => {
    const dayNames = {
      sun: "sun",
      mon: "mon",
      tue: "tue",
      wed: "wed",
      thu: "thu",
      fri: "fri",
      sat: "sat",
    };
    return `${dayNames[day.toLowerCase()] || day}`;
  };

  //   // Function to get color class based on retention rate
  //   const getCellColorClass = (value: number | null) => {
  //     if (!value || isNaN(value)) return "bg-[#E4E5E6] text-[#B5B9BD]"; // Gray for no data
  //     if (value >= 70) return "bg-[#00A378] text-[#ffffff]"; // Green
  //     if (value >= 50) return "bg-[#2DE3B3] text-[#161E24]"; // Light green
  //     if (value >= 30) return "bg-[#E8F12E] text-[#161E24]"; // Yellow
  //     // if (rate == 0 || !rate) return "bg-[#E4E5E6] text-[#161E24]"; // Gray for no data
  //     return "bg-[#FFA475] text-[#161E24]"; // Orange
  //   };

  // Function to get color class based on value relative to day's min/max
  const getCellColorClass = (value: number | null, dayValues: number[]) => {
    if (!value || isNaN(value) || value === 0)
      return "bg-gray-100 text-gray-400"; // Light gray for no data/zero

    // Get min and max values for this specific day (excluding zeros)
    const nonZeroValues = dayValues.filter((v) => v && v > 0);
    if (nonZeroValues.length === 0) return "bg-gray-100 text-gray-400";

    const minValue = Math.min(...nonZeroValues);
    const maxValue = Math.max(...nonZeroValues);

    // If all values are the same, use medium blue
    if (minValue === maxValue) return "bg-blue-500 text-white";

    // Calculate relative position (0 to 1)
    const normalizedValue = (value - minValue) / (maxValue - minValue);

    // Apply blue color scale based on relative position
    if (normalizedValue >= 0.8) return "bg-blue-900 text-white"; // Darkest blue
    if (normalizedValue >= 0.6) return "bg-blue-700 text-white"; // Dark blue
    if (normalizedValue >= 0.4) return "bg-blue-500 text-white"; // Medium blue
    if (normalizedValue >= 0.2) return "bg-blue-300 text-blue-900"; // Light blue
    return "bg-blue-100 text-blue-800"; // Lightest blue
  };

  const { cohorts, maxMonths, hoursColumn, dayNames, tableData } =
    processedData;

  return (
    <div
      className="bg-[#ffffff] box-border flex flex-col gap-2 items-start justify-start pt-4 px-6 relative rounded-2xl size-full"
      data-name="Customer Cohort Analysis"
    >
      {/* Table Content */}
      <div className="basis-0 box-border content-stretch flex flex-row gap-2 grow items-start justify-center min-h-px min-w-px p-0 relative shrink-0 w-full">
        <div className="basis-0 box-border content-stretch flex flex-row gap-4 grow items-start justify-start min-h-px min-w-px p-0 relative rounded-lg shrink-0">
          {/* Days Column */}
          <div className="bg-[#ffffff] box-border content-stretch flex flex-col gap-2.5 items-start justify-center overflow-clip p-0 relative shrink-0">
            <div className="box-border content-stretch flex flex-col gap-2.5 items-start justify-start overflow-clip p-[10px] relative rounded-lg shrink-0">
              <div className="capitalize font-['Plus_Jakarta_Sans:SemiBold',_sans-serif] font-semibold leading-[0] relative shrink-0 text-[#384045] text-[14px] text-left text-nowrap">
                <p className="block leading-[1.25] whitespace-pre">Day</p>
              </div>
            </div>
            <div className="box-border content-stretch flex flex-col gap-2.5 items-start justify-center p-0 relative shrink-0">
              {dayNames?.map((dayName, index) => (
                <div
                  key={index}
                  className="box-border content-stretch flex flex-col gap-2.5 items-start justify-start overflow-clip p-[10px] relative rounded-lg shrink-0"
                >
                  <div className="capitalize font-['Plus_Jakarta_Sans:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#384045] text-[14px] text-left text-nowrap">
                    <p className="block leading-[1.5] whitespace-pre">
                      {formatDay(dayName)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hour Columns */}
          {hoursColumn?.map((item, hourIndex) => (
            <div
              key={hourIndex}
              className="bg-[#ffffff] box-border content-stretch flex flex-col gap-4 items-center justify-center overflow-clip p-0 relative shrink-0"
            >
              <div className="box-border content-stretch flex flex-col gap-2.5 items-start justify-start overflow-clip p-[10px] relative rounded-lg shrink-0">
                <div className="capitalize font-['Plus_Jakarta_Sans:SemiBold',_sans-serif] font-semibold leading-[0] relative shrink-0 text-[#384045] text-[14px] text-start text-nowrap">
                  <p className="block leading-[1.25] whitespace-pre">{item}</p>
                </div>
              </div>
              {/* Data Rows - Days */}
              {tableData?.map((dayData, dayIndex) => {
                const value = dayData.values[hourIndex]; // Get the value for this day at this hour
                return (
                  <Tooltip key={hourIndex + dayIndex}>
                    <TooltipTrigger asChild>
                      <div
                        // key={dayIndex}
                        className="box-border content-stretch flex flex-row gap-4 items-center justify-start min-h-px min-w-px p-0 relative rounded-lg shrink-0"
                      >
                        <div className="bg-[#ffffff] box-border content-stretch flex flex-col gap-2.5 items-center justify-center overflow-clip p-0 relative shrink-0 min-w-[40px]">
                          <div
                            className={`box-border content-stretch flex flex-col gap-2.5 items-center justify-center overflow-clip p-[8px] relative rounded-lg shrink-0 w-full ${getCellColorClass(
                              value,
                              dayData.values
                            )}`}
                          >
                            <div className="font-['Plus_Jakarta_Sans:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[12px] text-center text-nowrap">
                              <p className="block leading-[1.5] whitespace-pre">
                                {value !== null &&
                                value !== undefined &&
                                value !== 0
                                  ? value
                                  : "-"}
                              </p>
                            </div>
                          </div>
                        </div>
                        <TooltipContent className="text-center">
                          {value
                            ? `${value} transactions at ${item} on ${formatDay(
                                dayData.day
                              )}`
                            : `No data available`}
                        </TooltipContent>
                      </div>
                    </TooltipTrigger>
                  </Tooltip>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      {/* <div className="box-border content-stretch flex flex-row gap-4 items-start justify-center p-0 relative shrink-0">
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
      </div> */}
    </div>
  );
};
